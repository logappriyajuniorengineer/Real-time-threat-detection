package com.example.demo.Entites;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "collected_data")
public class ThreatData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String source;

    @Column(length = 5000)
    private String headline;

    @Column(length = 3000)
    private String url;

    private LocalDateTime collectedAt;

    private LocalDateTime scrapedHour; 
    
    @Column(nullable = false)
    private String threatNature; // e.g., "Malicious" or "Benign"

    // Type/category of the threat
    @Column(nullable = false)
    private String threatType; // e.g., "DDoS", "Phishing", "Malware", "Ransomware"

    // Severity level (optional but useful for analytics)
    private String severityLevel; // e.g., "Low", "Medium", "High", "Critical"

    // Relationship: Which TIO collected this threat data
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tio_id", nullable = false)
    private ThreatIntelligenceOperator collectedBy;
    
    private String securityAnalystEmail;
    
    private String tioSenderEmail;
    
    private String status;

    public ThreatData() {}
    
    

	public ThreatData(Long id, String source, String headline, String url, LocalDateTime collectedAt,
			LocalDateTime scrapedHour, String threatNature, String threatType, String severityLevel,
			ThreatIntelligenceOperator collectedBy, String securityAnalystEmail, String tioSenderEmail, String status) {
		super();
		this.id = id;
		this.source = source;
		this.headline = headline;
		this.url = url;
		this.collectedAt = collectedAt;
		this.scrapedHour = scrapedHour;
		this.threatNature = threatNature;
		this.threatType = threatType;
		this.severityLevel = severityLevel;
		this.collectedBy = collectedBy;
		this.securityAnalystEmail = securityAnalystEmail;
		this.tioSenderEmail = tioSenderEmail;
		this.status = status;
	}



	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getSource() {
		return source;
	}

	public void setSource(String source) {
		this.source = source;
	}

	public String getHeadline() {
		return headline;
	}

	public void setHeadline(String headline) {
		this.headline = headline;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public LocalDateTime getCollectedAt() {
		return collectedAt;
	}

	public void setCollectedAt(LocalDateTime collectedAt) {
		this.collectedAt = collectedAt;
	}

	public LocalDateTime getScrapedHour() {
		return scrapedHour;
	}

	public void setScrapedHour(LocalDateTime scrapedHour) {
		this.scrapedHour = scrapedHour;
	}

	public String getThreatNature() {
		return threatNature;
	}

	public void setThreatNature(String threatNature) {
		this.threatNature = threatNature;
	}

	public String getThreatType() {
		return threatType;
	}

	public void setThreatType(String threatType) {
		this.threatType = threatType;
	}

	public String getSeverityLevel() {
		return severityLevel;
	}

	public void setSeverityLevel(String severityLevel) {
		this.severityLevel = severityLevel;
	}

	public ThreatIntelligenceOperator getCollectedBy() {
		return collectedBy;
	}

	public void setCollectedBy(ThreatIntelligenceOperator collectedBy) {
		this.collectedBy = collectedBy;
	}

	public String getSecurityAnalystEmail() {
		return securityAnalystEmail;
	}

	public void setSecurityAnalystEmail(String securityAnalystEmail) {
		this.securityAnalystEmail = securityAnalystEmail;
	}

	public String getTioSenderEmail() {
		return tioSenderEmail;
	}

	public void setTioSenderEmail(String tioSenderEmail) {
		this.tioSenderEmail = tioSenderEmail;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	
	
   
}

