package com.example.demo.Controllers;



import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Entites.SecurityAnalyst;
import com.example.demo.Entites.ThreatData;
import com.example.demo.Entites.ThreatIntelligenceOperator;
import com.example.demo.Entites.User.Role;
import com.example.demo.Repositories.SecurityAnalystRepository;
import com.example.demo.Repositories.ThreatDataRepository;
import com.example.demo.Repositories.ThreatIntelligenceOperatorRepository;


@RestController
@RequestMapping("/api/admin")
@CrossOrigin("*")
public class AdminCisoController {

    @Autowired
    private SecurityAnalystRepository securityAnalystRepository;

    @Autowired
    private ThreatIntelligenceOperatorRepository threatIntelligenceOperatorRepository;

    @PostMapping("/register/analyst")
    public ResponseEntity<?> registerAnalyst(@RequestBody SecurityAnalyst analyst) {
        Optional<SecurityAnalyst> existingAnalyst = securityAnalystRepository.findByEmail(analyst.getEmail());
        if (existingAnalyst.isPresent()) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of("status", "error", "message", "Security Analyst already registered with this email"));
        }
        analyst.setRole(Role.SECURITY_ANALYST);
        securityAnalystRepository.save(analyst);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(Map.of("status", "success", "message", "Security Analyst registered successfully"));
    }

    @PostMapping("/register/operator")
    public ResponseEntity<?> registerOperator(@RequestBody ThreatIntelligenceOperator operator) {
        Optional<ThreatIntelligenceOperator> existingOperator = threatIntelligenceOperatorRepository.findByEmail(operator.getEmail());
        if (existingOperator.isPresent()) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of("status", "error", "message", "Threat Intelligence Operator already registered with this email"));
        }
        operator.setRole(Role.THREAT_INTELLIGENCE_OPERATOR);
        threatIntelligenceOperatorRepository.save(operator);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(Map.of("status", "success", "message", "Threat Intelligence Operator registered successfully"));
    }


    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestParam String email, @RequestParam String password) {
        // Try Security Analyst first
        Optional<SecurityAnalyst> analyst = securityAnalystRepository.findByEmail(email);
        if (analyst.isPresent()) {
            if (analyst.get().getPassword().equals(password)) {
                return ResponseEntity.ok(Map.of(
                        "status", "success",
                        "role", "SECURITY_ANALYST",
                        "message", "Login successful"
                ));
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("status", "error", "message", "Invalid password"));
        }

        Optional<ThreatIntelligenceOperator> operator = threatIntelligenceOperatorRepository.findByEmail(email);
        if (operator.isPresent()) {
            if (operator.get().getPassword().equals(password)) {
                return ResponseEntity.ok(Map.of(
                        "status", "success",
                        "role", "THREAT_INTELLIGENCE_OPERATOR",
                        "message", "Login successful"
                ));
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("status", "error", "message", "Invalid password"));
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("status", "error", "message", "User not found"));
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        List<SecurityAnalyst> analysts = securityAnalystRepository.findAll();
        List<ThreatIntelligenceOperator> operators = threatIntelligenceOperatorRepository.findAll();

        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("securityAnalysts", analysts);
        response.put("threatOperators", operators);

        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/analysts")
    public ResponseEntity<?> getAllAnalysts() {
        List<SecurityAnalyst> analysts = securityAnalystRepository.findAll();
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("securityAnalysts", analysts);
        return ResponseEntity.ok(response);
    }
    
    @Autowired
    private ThreatDataRepository threatDataRepository;
    
    @PostMapping("/sendDataToAnalyst/{selectedAnalyst}/{tioEmail}/{category}")
    public ResponseEntity<String> sendDataToSecAnalyst(
            @PathVariable String selectedAnalyst,
            @PathVariable String tioEmail,
            @PathVariable String category
    ) {
       
        List<ThreatData> threats = threatDataRepository.findByCollectedBy_EmailAndSource(tioEmail, category);

        if (threats == null || threats.isEmpty()) {
            return ResponseEntity.badRequest().body("No threat data found for given TIO and category.");
        }

        for (ThreatData threat : threats) {
            if ("pending".equalsIgnoreCase(threat.getStatus())) {
                return ResponseEntity
                        .status(409)
                        .body("Your data is currently under analysis by another security analyst.");
            }
        }

        for (ThreatData threat : threats) {
            threat.setSecurityAnalystEmail(selectedAnalyst);
            threat.setTioSenderEmail(tioEmail);
            threat.setStatus("pending");
        }

        threatDataRepository.saveAll(threats);

        return ResponseEntity.ok("Data Shared for Analysis");
    }

    @GetMapping("/getDataForAnalyst/{analystEmail}")
    public ResponseEntity<?> getDataForAnalyst(@PathVariable String analystEmail) {
       
        List<ThreatData> threats = threatDataRepository.findBySecurityAnalystEmail(analystEmail);

        if (threats == null || threats.isEmpty()) {
            return ResponseEntity.status(404).body("No data found for this analyst.");
        }

        return ResponseEntity.ok(threats);
    }

    
}

