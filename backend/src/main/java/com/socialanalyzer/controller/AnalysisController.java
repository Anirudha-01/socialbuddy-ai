package com.socialanalyzer.controller;

import com.socialanalyzer.dto.AnalysisResponse;
import com.socialanalyzer.service.AnalysisService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class AnalysisController {

    private final AnalysisService analysisService;

    public AnalysisController(AnalysisService analysisService) {
        this.analysisService = analysisService;
    }

    @PostMapping(value = "/analyze", consumes = "multipart/form-data")
    public ResponseEntity<AnalysisResponse> analyzeContent(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "campaignGoal", required = false) String campaignGoal,
            @RequestParam(value = "targetAudience", required = false) String targetAudience,
            @RequestParam(value = "tonePreference", required = false) String tonePreference) {
        AnalysisResponse response = analysisService.analyzeContent(file, campaignGoal, targetAudience, tonePreference);
        return ResponseEntity.ok(response);
    }
}
