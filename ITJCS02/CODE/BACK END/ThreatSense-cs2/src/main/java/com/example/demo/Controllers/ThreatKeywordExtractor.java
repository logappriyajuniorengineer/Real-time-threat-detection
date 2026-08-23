package com.example.demo.Controllers;

import java.util.*;

public class ThreatKeywordExtractor {
    public static final Map<String, List<String>> THREAT_KEYWORDS = Map.of(
        "Malware", List.of("malware", "trojan", "virus", "ransomware", "worm", "spyware",
                "ctb-locker", "mine", "steal", "rootkit", "fileless", "payload",
                "backdoor", "crypto-miner", "keylogger", "botnet", "trojanized", "malicious extension","hijacking"),
        "Phishing", List.of("phishing", "spear phishing", "social engineering", "credential theft", "fake login"),
        "Spam", List.of("spam", "unsolicited email", "junk email", "scam mail"),
        "DDoS", List.of("ddos", "botnet", "denial of service", "amplification attack"),
        "Attack/Exploit", List.of("vulnerability", "exploit", "zero-day", "breach", "attack vector",
                "remote code execution", "privilege escalation", "sql injection", "xss", "buffer overflow"),
        "Information", List.of("data leak", "stolen credentials", "exposed information", "data breach", "sensitive info", "intel")
    );

    public static Set<String> extractKeywords(String text) {
        String textLower = text.toLowerCase();
        Set<String> found = new HashSet<>();
        for (List<String> keywords : THREAT_KEYWORDS.values()) {
            for (String kw : keywords) {
                if (textLower.contains(kw)) {
                    found.add(kw);
                }
            }
        }
        return found;
    }

    public static String getMulticlassLabel(Set<String> keywords, int binaryPred) {
        if (keywords.isEmpty()) return "Benign";

        Map<String, Integer> classCounts = new HashMap<>();
        for (String cls : THREAT_KEYWORDS.keySet()) {
            classCounts.put(cls, 0);
        }

        for (Map.Entry<String, List<String>> entry : THREAT_KEYWORDS.entrySet()) {
            String cls = entry.getKey();
            for (String kw : entry.getValue()) {
                if (keywords.contains(kw)) {
                    classCounts.put(cls, classCounts.get(cls) + 1);
                }
            }
        }

        return Collections.max(classCounts.entrySet(), Map.Entry.comparingByValue()).getKey();
    }
}

