package com.example.demo.Controllers;



import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.Entites.ThreatData;
import com.example.demo.Services.ThreatPredictionService;

@RestController
@RequestMapping("/api/analyst")
@CrossOrigin(origins = "*")
public class ThreatAnalysisController {

    @Autowired
    private ThreatPredictionService predictionService;

    @PostMapping("/analyzeData/{analystEmail}/{source}")
    public ResponseEntity<?> analyzeThreatsForAnalyst(
            @PathVariable String analystEmail,
            @PathVariable String source) {
        try {
            List<ThreatData> analyzedThreats = predictionService.analyzeByAnalystAndSource(analystEmail, source);
            if (analyzedThreats.isEmpty()) {
                return ResponseEntity.badRequest().body("No threats found for this analyst and source.");
            }
            return ResponseEntity.ok(analyzedThreats);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body("Error analyzing threats: " + e.getMessage());
        }
    }
}

