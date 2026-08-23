package com.example.demo.Controllers;

import java.io.File;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.ObjectMapper;

public class TfidfVectorizerInfo {
	@JsonProperty("vocabulary_")
	public Map<String, Integer> vocabulary;
	@JsonProperty("idf_")
	public double[] idf;

	public static TfidfVectorizerInfo loadFromJson(String path) throws Exception {
		ObjectMapper mapper = new ObjectMapper();
		return mapper.readValue(new File(path), TfidfVectorizerInfo.class);
	}
}
