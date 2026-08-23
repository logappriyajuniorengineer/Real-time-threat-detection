package com.example.demo.Services;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashSet;
import java.util.Set;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Service;

import com.example.demo.Entites.ThreatData;
import com.example.demo.Repositories.ThreatDataRepository;

@Service
public class ThreatScraperService {

    private final ThreatDataRepository repository;
    private static final String CSO_INDIA_URL = "https://www.csoonline.com/in/";
    private static final String USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
            + "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

    public ThreatScraperService(ThreatDataRepository repository) {
        this.repository = repository;
    }

    public void scrapeAndSaveTodaysThreatPosts() throws IOException {
        try {
            System.out.println("========================================");
            System.out.println("Starting CSO Online India Scraping...");
            System.out.println("========================================");

            Document doc = Jsoup.connect(CSO_INDIA_URL)
                    .userAgent(USER_AGENT)
                    .timeout(15000)
                    .get();

            // Get current hour truncated to start of hour
            LocalDateTime currentHour = LocalDateTime.now().truncatedTo(ChronoUnit.HOURS);
            Set<String> savedHeadlines = new HashSet<>();

            // 1. SCRAPE BANNER/FEATURED NEWS (Usually in hero section)
            System.out.println("\n--- Scraping Featured/Banner News ---");
            scrapeBannerNews(doc, currentHour, savedHeadlines);

            // 2. SCRAPE MAIN ARTICLE SECTIONS
            System.out.println("\n--- Scraping Main Articles ---");
            scrapeMainArticles(doc, currentHour, savedHeadlines);

            // 3. SCRAPE NEWS SECTIONS (News, Feature, Opinion, etc.)
            System.out.println("\n--- Scraping News Sections ---");
            scrapeNewsSections(doc, currentHour, savedHeadlines);

            // 4. SCRAPE ADDITIONAL CONTENT SECTIONS
            System.out.println("\n--- Scraping Additional Content ---");
            scrapeAdditionalSections(doc, currentHour, savedHeadlines);

            System.out.println("\n========================================");
            System.out.println("Total headlines scraped: " + savedHeadlines.size());
            System.out.println("Scraping completed at: " + LocalDateTime.now());
            System.out.println("========================================\n");

        } catch (IOException e) {
            System.err.println("Error connecting to website: " + e.getMessage());
            throw e;
        }
    }

    /**
     * Scrape Banner/Featured News from hero section
     */
    private void scrapeBannerNews(Document doc, LocalDateTime currentHour, Set<String> savedHeadlines) {
        try {
            // Banner usually in hero or featured section
            Elements bannerElements = doc.select("[class*='hero'] a, [class*='banner'] a, [class*='featured'] a, "
                    + "[class*='spotlight'] a, .c-card__title a");

            for (Element element : bannerElements) {
                String headline = element.text().trim();
                String url = element.absUrl("href");

                if (!headline.isEmpty() && !url.isEmpty() && url.contains("csoonline.com") 
                        && !savedHeadlines.contains(headline) && headline.length() > 5) {
                    saveHeadline(headline, url, "CSO Online - Featured", currentHour);
                    savedHeadlines.add(headline);
                }
            }

            // Try meta descriptions and og:title for featured content
            Element ogTitle = doc.selectFirst("meta[property='og:title']");
            if (ogTitle != null) {
                String headline = ogTitle.attr("content").trim();
                Element ogUrl = doc.selectFirst("meta[property='og:url']");
                String url = ogUrl != null ? ogUrl.attr("content") : CSO_INDIA_URL;
                
                if (!headline.isEmpty() && !savedHeadlines.contains(headline)) {
                    saveHeadline(headline, url, "CSO Online - Main Featured", currentHour);
                    savedHeadlines.add(headline);
                }
            }

        } catch (Exception e) {
            System.err.println("Error scraping banner news: " + e.getMessage());
        }
    }

    /**
     * Scrape Main Article Links
     */
    private void scrapeMainArticles(Document doc, LocalDateTime currentHour, Set<String> savedHeadlines) {
        try {
            // Target all article containers
            Elements articles = doc.select("article, [class*='article'], [class*='story'], "
                    + "[class*='card'], .c-card, [role='article']");

            System.out.println("Found " + articles.size() + " article containers");

            for (Element article : articles) {
                try {
                    // Try multiple headline selectors
                    Element headlineEl = article.selectFirst("h2 a, h3 a, h1 a, "
                            + ".c-card__title a, [class*='headline'] a, [class*='title'] a, "
                            + "a[href*='/article/'], a[href*='/news/']");

                    if (headlineEl == null) continue;

                    String headline = headlineEl.text().trim();
                    String url = headlineEl.absUrl("href");

                    // Try to get subtitle/description as well
                    String description = "";
                    Element descEl = article.selectFirst("p, [class*='excerpt'], [class*='summary']");
                    if (descEl != null) {
                        description = descEl.text().trim();
                    }

                    if (!headline.isEmpty() && !url.isEmpty() && url.contains("csoonline.com") 
                            && !savedHeadlines.contains(headline) && headline.length() > 5) {
                        
                        String fullHeadline = !description.isEmpty() 
                            ? headline + " | " + description 
                            : headline;
                        
                        saveHeadline(fullHeadline, url, "CSO Online", currentHour);
                        savedHeadlines.add(headline);
                    }

                } catch (Exception e) {
                    System.err.println("Error parsing article: " + e.getMessage());
                    continue;
                }
            }

        } catch (Exception e) {
            System.err.println("Error scraping main articles: " + e.getMessage());
        }
    }

    /**
     * Scrape News Sections (News, Features, Opinions, etc.)
     */
    private void scrapeNewsSections(Document doc, LocalDateTime currentHour, Set<String> savedHeadlines) {
        try {
            // Target specific news sections
            Elements newsLinks = doc.select("section a[href*='/article/'], section a[href*='/news/'], "
                    + "[class*='news'] a, [class*='feature'] a, [class*='opinion'] a, "
                    + "[class*='latest'] a, [class*='trending'] a");

            System.out.println("Found " + newsLinks.size() + " news section links");

            for (Element link : newsLinks) {
                try {
                    String headline = link.text().trim();
                    String url = link.absUrl("href");

                    if (!headline.isEmpty() && !url.isEmpty() && url.contains("csoonline.com") 
                            && !savedHeadlines.contains(headline) && headline.length() > 5 
                            && !headline.matches(".*[0-9]{1,2}\\s(mins|hours|days).*")) {
                        
                        saveHeadline(headline, url, "CSO Online", currentHour);
                        savedHeadlines.add(headline);
                    }

                } catch (Exception e) {
                    continue;
                }
            }

        } catch (Exception e) {
            System.err.println("Error scraping news sections: " + e.getMessage());
        }
    }

    /**
     * Scrape Additional Sections (Podcasts, Videos, etc.)
     */
    private void scrapeAdditionalSections(Document doc, LocalDateTime currentHour, Set<String> savedHeadlines) {
        try {
            // Podcasts, Videos, and other content
            Elements additionalContent = doc.select("[class*='podcast'] a, [class*='video'] a, "
                    + "[class*='webinar'] a, [class*='resource'] a, [class*='guide'] a, "
                    + "[class*='spotlight'] a, [class*='event'] a");

            System.out.println("Found " + additionalContent.size() + " additional content links");

            for (Element link : additionalContent) {
                try {
                    String headline = link.text().trim();
                    String url = link.absUrl("href");

                    if (!headline.isEmpty() && !url.isEmpty() && url.contains("csoonline.com") 
                            && !savedHeadlines.contains(headline) && headline.length() > 5) {
                        
                        saveHeadline(headline, url, "CSO Online", currentHour);
                        savedHeadlines.add(headline);
                    }

                } catch (Exception e) {
                    continue;
                }
            }

        } catch (Exception e) {
            System.err.println("Error scraping additional sections: " + e.getMessage());
        }
    }

    /**
     * Save headline to database with duplicate check
     */
    private void saveHeadline(String headline, String url, String source, LocalDateTime currentHour) {
        try {
            // Check if already exists (case-insensitive)
            boolean duplicate = repository.findAll().stream()
                    .anyMatch(t -> t.getHeadline().equalsIgnoreCase(headline));

            if (!duplicate) {
                ThreatData threatData = new ThreatData();
                threatData.setSource(source);
                threatData.setHeadline(headline);
                threatData.setUrl(url);
                threatData.setCollectedAt(LocalDateTime.now());
                threatData.setScrapedHour(currentHour);

                repository.save(threatData);
                System.out.println("[✓] Saved: " + headline.substring(0, Math.min(80, headline.length())));
            }

        } catch (Exception e) {
            System.err.println("[✗] Error saving headline: " + e.getMessage());
        }
    }
}