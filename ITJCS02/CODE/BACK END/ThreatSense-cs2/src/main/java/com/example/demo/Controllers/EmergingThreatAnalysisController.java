package com.example.demo.Controllers;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Random;
import java.util.Set;
import java.util.stream.Collectors;

import org.ejml.simple.SimpleMatrix;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Entites.EmergingThreatAnalysis;
import com.example.demo.Entites.ThreatData;
import com.example.demo.Repositories.EmergingThreatAnalysisRepository;
import com.example.demo.Repositories.ThreatDataRepository;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/emergta")
public class EmergingThreatAnalysisController {

    @Autowired
    private ThreatDataRepository threatDataRepository;

    @Autowired
    private EmergingThreatAnalysisRepository emergingThreatAnalysisRepository;

    private static final Set<String> NOISE_WORDS = Set.of(
        "latest","feature","opinion","news","event","promotion",
        "and","are","the","a","to","on","by","for","of",
        "mins","oct","nov","dec","jan","feb","mar","apr","may",
        "jun","jul","aug","sep"
    );

    @PostMapping("/predict")
    public EmergingThreatAnalysis predictEmergingThreats(
            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        // 1. Fetch and filter verified threats
        List<ThreatData> verifiedThreats = threatDataRepository.findBycollectedAtBetween(
                startDate.atStartOfDay(), endDate.atTime(23, 59, 59))
                .stream()
                .filter(td -> "Verification Completed".equalsIgnoreCase(td.getStatus()))
                .collect(Collectors.toList());

        if (verifiedThreats.isEmpty())
            throw new RuntimeException("No verified threats found in the given date range");

        // 2. Preprocess headlines
        List<List<String>> tokenizedDocs = verifiedThreats.stream()
            .map(td -> td.getHeadline())
            .map(h -> Arrays.stream(h.split("\\s+"))
                .map(String::toLowerCase)
                .filter(w -> !NOISE_WORDS.contains(w))
                .filter(w -> w.matches("[a-z]{3,}"))
                .distinct()
                .collect(Collectors.toList()))
            .collect(Collectors.toList());

        List<String> vocab = tokenizedDocs.stream()
            .flatMap(List::stream)
            .distinct()
            .collect(Collectors.toList());

        int numDocs = tokenizedDocs.size();
        int vocabSize = vocab.size();
        double[][] matrixData = new double[numDocs][vocabSize];

        // 3. Build document-term matrix
        for (int i = 0; i < numDocs; i++) {
            List<String> words = tokenizedDocs.get(i);
            for (int j = 0; j < vocabSize; j++) {
                matrixData[i][j] = words.contains(vocab.get(j)) ? 1 : 0;
            }
        }

        SimpleMatrix V = new SimpleMatrix(matrixData);

        // 4. NMF
        int rank = Math.min(5, vocabSize);
        SimpleMatrix W = SimpleMatrix.random_DDRM(numDocs, rank, 0, 1, new Random());
        SimpleMatrix H = SimpleMatrix.random_DDRM(rank, vocabSize, 0, 1, new Random());
        int maxIter = 200;

        for (int iter = 0; iter < maxIter; iter++) {
            H = H.elementMult(W.transpose().mult(V).elementDiv(W.transpose().mult(W).mult(H).plus(1e-9)));
            W = W.elementMult(V.mult(H.transpose()).elementDiv(W.mult(H.mult(H.transpose())).plus(1e-9)));
        }

        // 5. Extract topics + mark emerging ones
        StringBuilder resultBuilder = new StringBuilder();
        for (int topic = 0; topic < rank; topic++) {
            resultBuilder.append("Topic ").append(topic + 1).append(": ");
            double[] topicVector = H.extractVector(true, topic).getDDRM().data;
            Integer[] indices = new Integer[vocabSize];
            for (int i = 0; i < vocabSize; i++) indices[i] = i;
            Arrays.sort(indices, (a, b) -> Double.compare(topicVector[b], topicVector[a]));

            int meaningfulWords = 0;
            boolean emerging = false;
            for (int i = 0; i < vocabSize && meaningfulWords < 4; i++) {
                if (topicVector[indices[i]] > 0.01) {
                    String word = vocab.get(indices[i]);
                    resultBuilder.append(word).append(" ");
                    // Check if word comes from malicious headlines
                    for (int d = 0; d < numDocs; d++) {
                        if (tokenizedDocs.get(d).contains(word) &&
                            "Malicious".equalsIgnoreCase(verifiedThreats.get(d).getThreatNature())) {
                            emerging = true;
                            break;
                        }
                    }
                    meaningfulWords++;
                }
            }
            resultBuilder.append(emerging ? "(Emerging Threat)" : "").append("\n");
        }

        EmergingThreatAnalysis analysis = new EmergingThreatAnalysis();
        analysis.setAnalysisDate(LocalDateTime.now());
        analysis.setResult(resultBuilder.toString());
        emergingThreatAnalysisRepository.save(analysis);

        return analysis;
    }
    
    @GetMapping("/getall")
    public ResponseEntity<List<EmergingThreatAnalysis>> getAllEmerging(){
    	
    	return ResponseEntity.ok(emergingThreatAnalysisRepository.findAll());
    }
}
