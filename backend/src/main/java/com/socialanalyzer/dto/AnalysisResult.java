package com.socialanalyzer.dto;

import java.util.List;

public record AnalysisResult(

    // ── Content Identity ──────────────────────────────────────
    String contentType,          // e.g. "Instagram Caption", "Reel Idea", "LinkedIn Post"
    String detectedPlatform,     // e.g. "Instagram", "LinkedIn", "Twitter"

    // ── Scoring ───────────────────────────────────────────────
    int    engagementScore,      // 0–100
    String estimatedReach,       // e.g. "Medium (5K–20K)"
    String viralityPotential,    // "Low" | "Medium" | "High"

    // ── Content Quality ───────────────────────────────────────
    String tone,
    String sentiment,
    String readability,
    String hookStrength,         // "Strong" | "Average" | "Weak"
    String cta,                  // detected CTA text or "Missing"
    String grammar,              // "Excellent" | "Good" | "Needs Work"
    String professionalism,      // "High" | "Medium" | "Low"

    // ── Usage Stats ───────────────────────────────────────────
    int    hashtags,
    String emojiUsage,
    int    wordCount,
    String estimatedReadingTime, // e.g. "45 seconds"
    String keywordDensity,       // e.g. "Low" | "Optimal" | "High"

    // ── AI Recommendations ────────────────────────────────────
    List<String> suggestions,

    // ── Generated Content ─────────────────────────────────────
    String improvedPost,
    String caption,              // generated professional caption
    String callToAction,         // generated strong CTA
    List<String> recommendedHashtags,
    String reelScript,           // populated only when contentType is Reel

    // ── Planner ───────────────────────────────────────────────
    List<String> postingSchedule,
    List<String> contentIdeas

) {}
