package com.socialanalyzer.client;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.socialanalyzer.dto.AnalysisResult;
import com.socialanalyzer.exception.ApiException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.Base64;
import java.util.List;

@Component
public class GeminiClient {

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    public GeminiClient(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper.copy()
                .configure(com.fasterxml.jackson.databind.DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(30000);
        factory.setReadTimeout(60000);
        this.restClient = RestClient.builder().requestFactory(factory).build();
    }

    /** Called for PDFs — text-only analysis */
    public AnalysisResult analyzeContent(String extractedText, String campaignGoal, String targetAudience, String tonePreference) {
        String prompt = buildPrompt(extractedText) + buildOptimizationInstructions(campaignGoal, targetAudience, tonePreference);
        GeminiRequest request = new GeminiRequest(
            List.of(new Content(List.of(new Part(prompt, null)))),
            new GenerationConfig("application/json", 8192, 0.2)
        );
        return callGemini(request);
    }

    /** Called for images — vision analysis (image bytes + OCR text context) */
    public AnalysisResult analyzeImage(byte[] imageBytes, String mimeType, String ocrText, String campaignGoal, String targetAudience, String tonePreference) {
        String base64 = Base64.getEncoder().encodeToString(imageBytes);
        String prompt = buildImagePrompt(ocrText) + buildOptimizationInstructions(campaignGoal, targetAudience, tonePreference);

        // Send both the image inline and the prompt text as parts of the same content
        List<Part> parts = List.of(
            new Part(null, new InlineData(mimeType, base64)),  // vision: raw image
            new Part(prompt, null)                             // text: OCR + instructions
        );

        GeminiRequest request = new GeminiRequest(
            List.of(new Content(parts)),
            new GenerationConfig("application/json", 8192, 0.2)
        );
        return callGemini(request);
    }

    private String buildOptimizationInstructions(String campaignGoal, String targetAudience, String tonePreference) {
        StringBuilder sb = new StringBuilder("\n=== STRATEGY OPTIMIZER CUSTOMIZATION ===\n");
        if (campaignGoal != null && !campaignGoal.isBlank()) {
            sb.append("Primary Campaign Goal: ").append(campaignGoal).append("\n");
        }
        if (targetAudience != null && !targetAudience.isBlank()) {
            sb.append("Target Audience Profile: ").append(targetAudience).append("\n");
        }
        if (tonePreference != null && !tonePreference.isBlank()) {
            sb.append("Preferred Tone of Voice: ").append(tonePreference).append("\n");
        }
        sb.append("Please heavily prioritize and align the recommendations, rewrite versions, captions, and scheduling options to these inputs.\n");
        return sb.toString();
    }

    private AnalysisResult callGemini(GeminiRequest request) {
        try {
            GeminiResponse response = restClient.post()
                    .uri(apiUrl + "?key=" + apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .body(GeminiResponse.class);

            if (response == null || response.candidates() == null || response.candidates().isEmpty()) {
                throw new ApiException("Gemini returned no candidates.", 502);
            }

            String rawText = response.candidates().get(0).content().parts().get(0).text();
            if (rawText == null || rawText.isBlank()) {
                throw new ApiException("Gemini returned empty content.", 502);
            }

            return objectMapper.readValue(sanitize(rawText), AnalysisResult.class);

        } catch (ApiException e) {
            throw e;
        } catch (Exception e) {
            throw new ApiException("Gemini failure: " + e.getMessage(), e, 502);
        }
    }

    private String sanitize(String raw) {
        String t = raw.strip();
        if (t.startsWith("```json")) t = t.substring(7);
        else if (t.startsWith("```"))  t = t.substring(3);
        if (t.endsWith("```")) t = t.substring(0, t.length() - 3);
        return t.strip();
    }

    // ── Prompts ─────────────────────────────────────────────────────────────

    private String buildPrompt(String content) {
        return SCHEMA_PREAMBLE + """

            Content to analyze (extracted from PDF or text):
            """ + content;
    }

    private String buildImagePrompt(String ocrText) {
        if (ocrText == null || ocrText.trim().isEmpty()) {
            return SCHEMA_PREAMBLE + """

                You have been given an IMAGE to analyze visually.
                NOTE: No text could be extracted from this image via OCR.
                Please focus your analysis on:
                - Visual content
                - Context
                - Branding
                - Subject
                - Possible intent

                Analyze these visual elements and generate appropriate captions, optimization suggestions, CTAs, and strategy options without relying on OCR text.
                """;
        }
        return SCHEMA_PREAMBLE + """

            You have been given an IMAGE to analyze visually.
            Additionally, the following text was extracted from that image via OCR:
            """ + ocrText + """

            Use BOTH the visual content of the image AND the extracted OCR text together to produce your analysis.
            """;
    }

    private static final String SCHEMA_PREAMBLE = """
        You are an expert social media strategist and content analyst.

        STEP 1 — DETECT PLATFORM
        Intelligently determine the platform: "Instagram", "LinkedIn", "Twitter/X", "Facebook", or "General Marketing".

        STEP 2 — DETECT CONTENT TYPE
        Intelligently determine the content type: "Caption", "Advertisement", "Promotional Post", "Educational Post", "Product Post", "Carousel", "Reel", "Story", or "Event Announcement".

        STEP 3 — GENERATE TAILORED SECTIONS BASED ON INPUT TYPE:
        - If the input represents a SOCIAL MEDIA POST (e.g. Caption, Advertisement, Promotional, Carousel, Event, etc.):
          Provide "caption" (Professional Caption with Emoji Suggestions), "callToAction" (CTA), "recommendedHashtags" (Trending Hashtags), and "improvedPost" (Improved Caption rewrite).
        - If the input represents a REEL IDEA or STORY:
          Provide a complete "reelScript" matching this exact structure:
          "HOOK: [Engaging hook text]\\nSCENE 1: [Visual setup]\\nSCENE 2: [Body scene]\\nSCENE 3: [Climax/Resolution]\\nENDING: [Outro]\\nCALL TO ACTION: [Direct CTA]\\nSUGGESTED CAPTION: [Post copy]\\nHASHTAGS: [#tags]\\nESTIMATED DURATION: [seconds/minutes]\\nBACKGROUND MUSIC MOOD: [BGM mood description]"
        - If the input represents PRODUCT CONTENT (e.g. Product Post):
          Provide "improvedPost" containing a complete Product Description + Instagram Caption + Marketing Copy + Call To Action + Hashtags.

        STEP 4 — PDF-SPECIFIC ANALYSIS:
        If analyzing text extracted from a PDF, evaluate tone, readability, grammar, engagement, CTA, hashtags, emoji usage, hook strength, and generate an "improvedPost" version optimizing all these aspects.

        Return ONLY this JSON — no markdown, no explanation:
        {
          "contentType": "<detected type>",
          "detectedPlatform": "<detected platform>",
          "engagementScore": <0-100>,
          "estimatedReach": "<e.g. Medium (5K–20K)>",
          "viralityPotential": "<Low|Medium|High>",
          "tone": "<e.g. Professional|Casual|Inspirational|Humorous>",
          "sentiment": "<Positive|Neutral|Negative>",
          "readability": "<Easy|Medium|Hard>",
          "hookStrength": "<Strong|Average|Weak>",
          "cta": "<detected CTA phrase or 'Missing'>",
          "grammar": "<Excellent|Good|Needs Work>",
          "professionalism": "<High|Medium|Low>",
          "hashtags": <count>,
          "emojiUsage": "<Low|Medium|High>",
          "wordCount": <word count>,
          "estimatedReadingTime": "<e.g. 30 seconds>",
          "keywordDensity": "<Low|Optimal|High>",
          "suggestions": ["<tip 1>","<tip 2>","<tip 3>","<tip 4>","<tip 5>"],
          "improvedPost": "<Optimized rewrite / product marketing details>",
          "caption": "<Professional caption>",
          "callToAction": "<CTA phrase>",
          "recommendedHashtags": ["#tag1","#tag2","#tag3","#tag4","#tag5"],
          "reelScript": "<Full reel script structure or empty string>",
          "postingSchedule": [
            "<Day Time - Reason>",
            "<Day Time - Reason>",
            "<Day Time - Reason>",
            "<Day Time - Reason>",
            "<Day Time - Reason>",
            "<Day Time - Reason>",
            "<Day Time - Reason>"
          ],
          "contentIdeas": ["<idea 1>","<idea 2>","<idea 3>","<idea 4>","<idea 5>"]
        }
        """;

    // ── Gemini request/response records ─────────────────────────────────────

    private record GeminiRequest(List<Content> contents, GenerationConfig generationConfig) {}
    private record Content(List<Part> parts) {}
    private record Part(String text, @JsonProperty("inline_data") InlineData inlineData) {}
    private record InlineData(@JsonProperty("mime_type") String mimeType, String data) {}
    private record GenerationConfig(
        @JsonProperty("responseMimeType") String responseMimeType,
        @JsonProperty("maxOutputTokens") Integer maxOutputTokens,
        @JsonProperty("temperature") Double temperature
    ) {}
    private record GeminiResponse(List<Candidate> candidates) {}
    private record Candidate(CandidateContent content) {}
    private record CandidateContent(List<Part> parts) {}
}
