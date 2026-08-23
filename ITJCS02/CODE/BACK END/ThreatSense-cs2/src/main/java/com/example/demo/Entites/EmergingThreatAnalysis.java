package com.example.demo.Entites;



import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "emerging_threat_analysis")
public class EmergingThreatAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "analysis_date", nullable = false)
    private LocalDateTime analysisDate;

    @Column(name = "result", columnDefinition = "TEXT", nullable = false)
    private String result;

    // Constructors
    public EmergingThreatAnalysis() {}

    public EmergingThreatAnalysis(LocalDateTime analysisDate, String result) {
        this.analysisDate = analysisDate;
        this.result = result;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getAnalysisDate() {
        return analysisDate;
    }

    public void setAnalysisDate(LocalDateTime analysisDate) {
        this.analysisDate = analysisDate;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }
}

