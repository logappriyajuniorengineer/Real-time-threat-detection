package com.example.demo.Controllers;

import java.util.Set;

public class ThreatPredictionResult {
    private String text;
    private String binaryLabel;
    private String multiclassLabel;
    private Set<String> keywords;

    public ThreatPredictionResult(String text, String binaryLabel, String multiclassLabel, Set<String> keywords) {
        this.text = text;
        this.binaryLabel = binaryLabel;
        this.multiclassLabel = multiclassLabel;
        this.keywords = keywords;
    }

    public ThreatPredictionResult() {
		// TODO Auto-generated constructor stub
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public String getBinaryLabel() {
		return binaryLabel;
	}

	public void setBinaryLabel(String binaryLabel) {
		this.binaryLabel = binaryLabel;
	}

	public String getMulticlassLabel() {
		return multiclassLabel;
	}

	public void setMulticlassLabel(String multiclassLabel) {
		this.multiclassLabel = multiclassLabel;
	}

	public Set<String> getKeywords() {
		return keywords;
	}

	public void setKeywords(Set<String> keywords) {
		this.keywords = keywords;
	}
    
    
}

