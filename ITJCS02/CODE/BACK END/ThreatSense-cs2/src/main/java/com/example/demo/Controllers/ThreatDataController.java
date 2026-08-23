package com.example.demo.Controllers;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.Entites.ThreatData;
import com.example.demo.Entites.ThreatIntelligenceOperator;
import com.example.demo.Repositories.ThreatDataRepository;
import com.example.demo.Repositories.ThreatIntelligenceOperatorRepository;


@CrossOrigin("*")
@RestController
@RequestMapping("/api/data")
public class ThreatDataController {

    @Autowired
    private ThreatDataRepository repository;

    @Autowired
    private ThreatIntelligenceOperatorRepository tioRepository;

    private static final String USER_AGENT =
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

    /* ======================================================
     *  1️⃣  SCRAPE CSO ONLINE INDIA - UPDATED
     * ====================================================== */
    @GetMapping("/scrape/cso/{tioEmail}")
    public ResponseEntity<String> scrapeCSOOnline(@PathVariable String tioEmail) throws IOException {
        ThreatIntelligenceOperator tio = getTioByEmail(tioEmail);
        if (tio == null) return ResponseEntity.badRequest().body("No TIO found with email: " + tioEmail);

        String CSO_URL = "https://www.csoonline.com/in/";
        Document doc = Jsoup.connect(CSO_URL).userAgent(USER_AGENT).timeout(15000).get();

        LocalDateTime currentHour = LocalDateTime.now().truncatedTo(ChronoUnit.HOURS);
        Set<String> saved = new HashSet<>();
        int successCount = 0;

        // Primary method: Look for article containers
        Elements articleElements = doc.select("article, div.river-item, div.article-item, li.article, div.story-item");
        System.out.println("🔍 CSO: Found " + articleElements.size() + " article containers");

        for (Element article : articleElements) {
            try {
                // Find the main headline link
                Element headlineLink = article.selectFirst("h2 a, h3 a, a.article-link, a[href*='/article/'], a[href*='/news/']");
                
                if (headlineLink != null) {
                    String url = headlineLink.absUrl("href");
                    
                    // Skip invalid URLs
                    if (url.isEmpty() || !url.contains("csoonline.com")) continue;
                    
                    // Get clean headline
                    Element headlineElement = article.selectFirst("h2, h3");
                    String headline = headlineElement != null ? headlineElement.text().trim() : headlineLink.text().trim();
                    
                    // Clean up headline
                    headline = cleanCSOHeadline(headline);
                    
                    // Skip if empty or already saved
                    if (headline.isEmpty() || saved.contains(headline) || headline.length() < 10) continue;
                    
                    // Validate it's a proper article
                    if (isValidCSOArticle(headline, url)) {
                        saveThreat(headline, url, "CSO Online", currentHour, tio);
                        saved.add(headline);
                        successCount++;
                        System.out.println("✅ Saved: " + headline);
                    }
                }
            } catch (Exception e) {
                System.err.println("⚠️ Error processing article: " + e.getMessage());
            }
        }

        // Fallback: If we didn't find enough articles, try alternative selectors
        if (successCount < 5) {
            Elements linkElements = doc.select("a[href*='/article/'], a[href*='/news/']");
            System.out.println("🔄 CSO Fallback: Trying " + linkElements.size() + " links");
            
            for (Element link : linkElements) {
                if (successCount >= 25) break; // Limit to prevent too many
                
                String headline = link.text().trim();
                String url = link.absUrl("href");
                
                headline = cleanCSOHeadline(headline);
                
                if (!headline.isEmpty() && !saved.contains(headline) && 
                    url.contains("csoonline.com") && isValidCSOArticle(headline, url) &&
                    headline.length() > 10) {
                    
                    saveThreat(headline, url, "CSO Online", currentHour, tio);
                    saved.add(headline);
                    successCount++;
                    System.out.println("✅ Saved (fallback): " + headline);
                }
            }
        }

        return ResponseEntity.ok("✅ CSO Online scraping completed: " + successCount + " articles saved for " + tioEmail);
    }

    /**
     * Clean CSO headline by removing unwanted text patterns
     */
    private String cleanCSOHeadline(String headline) {
        if (headline == null) return "";
        
        // Remove category prefixes
        headline = headline.replaceAll("(?i)^(News|Feature|Opinion|Latest|Podcast|Brandpost|Interview|Analysis|Sponsored|Read the Article)\\s*", "");
        
        // Remove "Read the Article" and similar suffixes
        headline = headline.replaceAll("(?i)\\s*(Read the Article|Read More|Continue Reading|Learn More)$", "");
        
        // Remove author info pattern "By [Name] [Date]"
        headline = headline.replaceAll("(?i)\\s*By\\s+[A-Za-z\\s\\.]+\\d{1,2}\\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\\s+\\d{4}.*$", "");
        
        // Remove time duration pattern "X mins" or "X hours"
        headline = headline.replaceAll("(?i)\\s*\\d+\\s*(mins?|minutes?|hours?|hrs?).*$", "");
        
        // Remove date patterns like "25 Oct 2025"
        headline = headline.replaceAll("(?i)\\s*\\d{1,2}\\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\\s+\\d{4}.*$", "");
        
        // Remove tags/categories at the end
        headline = headline.replaceAll("(?i)\\s*(Security|Cybersecurity|Malware|Phishing|Ransomware|Vulnerability|Breach)$", "");
        
        // Remove multiple spaces
        headline = headline.replaceAll("\\s+", " ");
        
        return headline.trim();
    }

    /**
     * Validate if this is a real CSO article
     */
    private boolean isValidCSOArticle(String headline, String url) {
        if (headline == null || url == null) return false;
        
        // Minimum length check
        if (headline.length() < 10) return false;
        
        // URL should contain article or news path
        if (!url.contains("/article/") && !url.contains("/news/")) return false;
        
        // Exclude common navigation items
        String lowerHeadline = headline.toLowerCase();
        String[] excludePatterns = {
            "home", "about us", "contact", "privacy policy", "terms of service",
            "subscribe", "newsletter", "login", "sign in", "register", "sitemap",
            "more from", "related articles", "sponsored content", "advertisement",
            "follow us", "social media", "careers", "press release"
        };
        
        for (String pattern : excludePatterns) {
            if (lowerHeadline.equals(pattern) || lowerHeadline.startsWith(pattern + " ")) {
                return false;
            }
        }
        
        // Should not be just a single word
        if (!headline.contains(" ")) return false;
        
        return true;
    }

    /* ======================================================
     *  2️⃣  SCRAPE BLEEPING COMPUTER
     * ====================================================== */
    @GetMapping("/scrape/bleeping/{tioEmail}")
    public ResponseEntity<String> scrapeBleepingComputer(@PathVariable String tioEmail) throws IOException {
        ThreatIntelligenceOperator tio = getTioByEmail(tioEmail);
        if (tio == null) return ResponseEntity.badRequest().body("No TIO found with email: " + tioEmail);

        String BC_URL = "https://www.bleepingcomputer.com/";
        Document doc = Jsoup.connect(BC_URL).userAgent(USER_AGENT).timeout(15000).get();

        List<Element> articles = doc.select("div.bc_latest_news_text").stream().limit(10).toList();
        System.out.println("💻 BleepingComputer: Found " + articles.size() + " articles");

        LocalDateTime currentHour = LocalDateTime.now().truncatedTo(ChronoUnit.HOURS);
        Set<String> saved = new HashSet<>();

        for (Element article : articles) {
            String title = article.select("h4 a").text();
            String link = article.select("h4 a").attr("abs:href");

            if (!title.isEmpty() && isRelevantThreat(title) && !saved.contains(title)) {
                saveThreat(title, link, "BleepingComputer", currentHour, tio);
                saved.add(title);
            }
        }

        return ResponseEntity.ok("✅ BleepingComputer scraping completed for: " + tioEmail);
    }

    /* ======================================================
     *  3️⃣  SCRAPE THE HACKER NEWS
     * ====================================================== */
    @GetMapping("/scrape/hackernews/{tioEmail}")
    public ResponseEntity<String> scrapeHackerNews(@PathVariable String tioEmail) throws IOException {
        ThreatIntelligenceOperator tio = getTioByEmail(tioEmail);
        if (tio == null) return ResponseEntity.badRequest().body("No TIO found with email: " + tioEmail);

        String HN_URL = "https://thehackernews.com/";
        Document doc = Jsoup.connect(HN_URL).userAgent(USER_AGENT).timeout(15000).get();

        List<Element> articles = doc.select("div.body-post").stream().limit(10).toList();
        System.out.println("🔐 HackerNews: Found " + articles.size() + " articles");

        LocalDateTime currentHour = LocalDateTime.now().truncatedTo(ChronoUnit.HOURS);
        Set<String> saved = new HashSet<>();

        for (Element article : articles) {
            String title = article.select("h2.home-title").text();
            String link = article.select("a.story-link").attr("abs:href");

            if (!title.isEmpty() && !saved.contains(title)) {
                saveThreat(title, link, "The Hacker News", currentHour, tio);
                saved.add(title);
            }
        }

        return ResponseEntity.ok("✅ HackerNews scraping completed for: " + tioEmail);
    }

    /* ======================================================
     *  COMMON UTILITIES
     * ====================================================== */

    private ThreatIntelligenceOperator getTioByEmail(String email) {
        return tioRepository.findByEmail(email).orElse(null);
    }

    private boolean isRelevantThreat(String text) {
        String lower = text.toLowerCase();
        String[] keywords = {
                "attack", "breach", "ransomware", "malware", "vulnerability",
                "exploit", "hack", "threat", "cyber", "phishing", "zero-day",
                "apt", "trojan", "backdoor", "leak", "incident", "botnet", "ddos"
        };
        for (String keyword : keywords) {
            if (lower.contains(keyword)) return true;
        }
        return false;
    }

	private void saveThreat(String headline, String url, String source, LocalDateTime currentHour,
			ThreatIntelligenceOperator tio) {
		try {
			boolean duplicate = repository.findAll().stream().anyMatch(t -> t.getHeadline().equalsIgnoreCase(headline));

			if (!duplicate) {
				ThreatData data = new ThreatData();
				data.setSource(source);
				data.setHeadline(headline);
				data.setUrl(url);
				data.setCollectedAt(LocalDateTime.now());
				data.setScrapedHour(currentHour);
				data.setCollectedBy(tio);
				data.setThreatNature("Unknown"); // Malicious or Benign
				data.setThreatType("Uncategorized"); // e.g., DDoS, Phishing, Malware
				data.setSeverityLevel("Pending"); // Low, Medium, High, Critical

				repository.save(data);
				System.out.println("✅ Saved: [" + source + "] " + headline);
			}
		} catch (Exception e) {
			System.err.println("❌ Save error: " + e.getMessage());
		}
	}


    /* ======================================================
     *  EXTRA: FETCH ALL OR BY TIO
     * ====================================================== */

    @GetMapping("/all")
    public ResponseEntity<List<ThreatData>> getAllData() {
        return ResponseEntity.ok(repository.findAll());
    }

    @GetMapping("/by-tio/{tioEmail}")
    public ResponseEntity<?> getDataByTio(@PathVariable String tioEmail) {
        Optional<ThreatIntelligenceOperator> tio = tioRepository.findByEmail(tioEmail);
        if (tio.isEmpty()) return ResponseEntity.badRequest().body("No TIO found with email: " + tioEmail);

        List<ThreatData> data = repository.findAll().stream()
                .filter(d -> d.getCollectedBy() != null && d.getCollectedBy().getEmail().equals(tioEmail))
                .toList();

        return ResponseEntity.ok(data);
    }
}