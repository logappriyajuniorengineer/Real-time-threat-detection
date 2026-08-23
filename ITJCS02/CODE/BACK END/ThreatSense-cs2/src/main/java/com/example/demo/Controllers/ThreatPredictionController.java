package com.example.demo.Controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Services.ThreatPredictionService;

@RestController
@RequestMapping("/api/threats")
@CrossOrigin("*")
public class ThreatPredictionController {

    @Autowired
    private ThreatPredictionService threatPredictionService;

    @GetMapping("/predict")
    public List<ThreatPredictionResult> predictThreats() throws Exception {
        return threatPredictionService.analyzeFirst10();
    }
}

