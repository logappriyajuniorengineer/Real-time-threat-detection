package com.example.demo.Controllers;

import java.util.HashMap;
import java.util.Map;

public class SimpleTfidfVectorizer {
    private Map<String, Integer> vocabulary;
    private double[] idf;

    public SimpleTfidfVectorizer(Map<String, Integer> vocabulary, double[] idf) {
        this.vocabulary = vocabulary;
        this.idf = idf;
    }

    public float[] transform(String text) {
        // Tokenize by simple whitespace + lowercase (you can extend this)
        String[] tokens = text.toLowerCase().split("\\s+");
        Map<Integer, Integer> termCounts = new HashMap<>();

        // Count tokens present in vocabulary
        for (String token : tokens) {
            Integer idx = vocabulary.get(token);
            if (idx != null) {
                termCounts.put(idx, termCounts.getOrDefault(idx, 0) + 1);
            }
        }

        float[] tfidfVector = new float[vocabulary.size()];
        int totalTerms = tokens.length;

        // Calculate tf-idf
        for (Map.Entry<Integer, Integer> entry : termCounts.entrySet()) {
            int idx = entry.getKey();
            int count = entry.getValue();
            double tf = (double) count / totalTerms;
            tfidfVector[idx] = (float)(tf * idf[idx]);
        }

        return tfidfVector;
    }
}

