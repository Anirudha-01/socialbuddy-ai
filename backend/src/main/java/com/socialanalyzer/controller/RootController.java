package com.socialanalyzer.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class RootController {

    @GetMapping("/")
    public ResponseEntity<Map<String, String>> welcome() {
        return ResponseEntity.ok(Map.of(
            "status", "Running",
            "message", "AI Social Media Content Analyzer API is active.",
            "frontendUrl", "http://localhost:5173"
        ));
    }
}
