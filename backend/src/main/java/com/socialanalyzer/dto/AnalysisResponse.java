package com.socialanalyzer.dto;

public record AnalysisResponse(
    AnalysisResult analysis,
    boolean ocrFailed
) {}
