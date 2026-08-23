package com.example.demo.Services;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.Controllers.SimpleTfidfVectorizer;
import com.example.demo.Controllers.TfidfVectorizerInfo;
import com.example.demo.Controllers.ThreatKeywordExtractor;
import com.example.demo.Controllers.ThreatPredictionResult;
import com.example.demo.Entites.ThreatData;
import com.example.demo.Repositories.ThreatDataRepository;

import ai.onnxruntime.OnnxTensor;
import ai.onnxruntime.OrtEnvironment;
import ai.onnxruntime.OrtException;
import ai.onnxruntime.OrtSession;

@Service
public class ThreatPredictionService {

    @Autowired
    private ThreatDataRepository repository;

    private OrtEnvironment env;
    private OrtSession session;
    private SimpleTfidfVectorizer vectorizer;

    public ThreatPredictionService() throws Exception {
        env = OrtEnvironment.getEnvironment();

        // Load ONNX model
        session = env.createSession("D:\\ITJCS02\\CODE\\BACK END\\ThreatSense-cs2\\src\\main\\resources\\svm_model_compatible.onnx", new OrtSession.SessionOptions());

        // Load JSON vectorizer info and reconstruct
        TfidfVectorizerInfo vecInfo = TfidfVectorizerInfo.loadFromJson("D:\\ITJCS02\\CODE\\BACK END\\ThreatSense-cs2\\src\\main\\resources\\tfidf_vectorizer.json");
        vectorizer = new SimpleTfidfVectorizer(vecInfo.vocabulary, vecInfo.idf);
    }

    public List<ThreatPredictionResult> analyzeFirst10() throws OrtException {
        List<ThreatData> first10 = repository.findFirst10ByOrderByIdAsc();
        List<ThreatPredictionResult> results = new ArrayList<>();

        for (ThreatData data : first10) {
            String text = data.getHeadline();

            float[] inputVector = vectorizer.transform(text);
            float[][] inputBatch = new float[1][inputVector.length];
            inputBatch[0] = inputVector;

            OnnxTensor inputTensor = OnnxTensor.createTensor(env, inputBatch);

            OrtSession.Result result = session.run(Collections.singletonMap(session.getInputNames().iterator().next(), inputTensor));

            long[] predArray = (long[]) result.get(0).getValue();
            int binaryPred = (int) predArray[0];
            String binaryLabel = binaryPred == 1 ? "Malicious" : "Benign";

            Set<String> keywords = ThreatKeywordExtractor.extractKeywords(text);
            String multiclassLabel = ThreatKeywordExtractor.getMulticlassLabel(keywords, binaryPred);

            if (binaryPred == 0 && !keywords.isEmpty()) {
                binaryLabel = "Malicious";
            }

            ThreatPredictionResult res = new ThreatPredictionResult(text, binaryLabel, multiclassLabel, keywords);
            results.add(res);
        }

        return results;
    }
    
    public List<ThreatData> analyzeByAnalystAndSource(String analystEmail, String source) throws OrtException {
        List<ThreatData> threats = repository.findBySecurityAnalystEmailAndSource(analystEmail, source);

        if (threats == null || threats.isEmpty()) {
            return Collections.emptyList();
        }

        List<ThreatData> analyzedThreats = new ArrayList<>();

        for (ThreatData data : threats) {

            // ✅ Skip if already verified
            if ("Verification Completed".equalsIgnoreCase(data.getStatus())) {
                System.out.println("Skipping already verified: ID=" + data.getId());
                analyzedThreats.add(data);
                continue;
            }

            String text = data.getHeadline();
            if (text == null || text.isBlank()) {
                continue;
            }

            // Convert headline to TF-IDF vector
            float[] inputVector = vectorizer.transform(text);
            float[][] inputBatch = new float[1][inputVector.length];
            inputBatch[0] = inputVector;

            try (OnnxTensor inputTensor = OnnxTensor.createTensor(env, inputBatch)) {
                // Run model prediction
                OrtSession.Result result = session.run(
                        Collections.singletonMap(session.getInputNames().iterator().next(), inputTensor)
                );

                long[] predArray = (long[]) result.get(0).getValue();
                int binaryPred = (int) predArray[0];
                String binaryLabel = binaryPred == 1 ? "Malicious" : "Benign";

                // Extract keywords and classify threat type
                Set<String> keywords = ThreatKeywordExtractor.extractKeywords(text);
                String threatType = ThreatKeywordExtractor.getMulticlassLabel(keywords, binaryPred);

                // Adjust nature if needed
                if (binaryPred == 0 && !keywords.isEmpty()) {
                    binaryLabel = "Malicious";
                }

                // Assign predictions to ThreatData entity
                data.setThreatNature(binaryLabel);
                data.setThreatType(threatType);
                data.setSeverityLevel(determineSeverity(threatType, keywords));
                data.setStatus("Verification Completed");

                analyzedThreats.add(data);
            }
        }

        // Save only newly analyzed or updated records
        repository.saveAll(analyzedThreats);
        return analyzedThreats;
    }


    /**
     * Simple heuristic to assign severity level based on threat type
     */
    private String determineSeverity(String threatType, Set<String> keywords) {
        threatType = threatType == null ? "" : threatType.toLowerCase();

        if (threatType.contains("ransom") || threatType.contains("malware")) {
            return "High";
        } else if (threatType.contains("phishing") || threatType.contains("Attack/Exploit")) {
            return "Medium";
        } else if (threatType.contains("ddos") || threatType.contains("breach") || threatType.contains("Information")) {
            return "Critical";
        } else if (!keywords.isEmpty()) {
            return "Low";
        }
        return "SAFE";
    }
}

