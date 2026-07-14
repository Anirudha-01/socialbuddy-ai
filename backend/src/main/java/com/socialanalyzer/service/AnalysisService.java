package com.socialanalyzer.service;

import com.socialanalyzer.dto.AnalysisResponse;
import org.springframework.web.multipart.MultipartFile;

public interface AnalysisService {
    AnalysisResponse analyzeContent(MultipartFile file, String campaignGoal, String targetAudience, String tonePreference);
}
