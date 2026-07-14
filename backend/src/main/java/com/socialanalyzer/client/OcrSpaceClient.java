package com.socialanalyzer.client;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.socialanalyzer.exception.ApiException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Component
public class OcrSpaceClient {

    private final RestClient restClient;
    
    @Value("${ocr.space.api.key}")
    private String apiKey;

    public OcrSpaceClient() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(15000);
        factory.setReadTimeout(15000);

        this.restClient = RestClient.builder()
                .baseUrl("https://api.ocr.space/parse/image")
                .requestFactory(factory)
                .build();
    }

    public String extractText(MultipartFile file) {
        try {
            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("apikey", apiKey);
            body.add("language", "eng");
            
            // Wrap multipart file bytes in a ByteArrayResource with the original filename extension
            ByteArrayResource fileResource = new ByteArrayResource(file.getBytes()) {
                @Override
                public String getFilename() {
                    return file.getOriginalFilename();
                }
            };
            body.add("file", fileResource);

            OcrResponse response = restClient.post()
                    .contentType(MediaType.MULTIPART_FORM_DATA)
                    .body(body)
                    .retrieve()
                    .body(OcrResponse.class);

            if (response == null || response.isErroredOnProcessing()) {
                String errorMsg = (response != null && response.errorMessage() != null) 
                        ? String.join(", ", response.errorMessage()) 
                        : "Unknown processing error.";
                throw new ApiException("OCR.Space processing failed: " + errorMsg, 502);
            }

            List<ParsedResult> results = response.parsedResults();
            if (results == null || results.isEmpty()) {
                throw new ApiException("OCR.Space returned no text results.", 502);
            }

            String text = results.get(0).parsedText();
            if (text == null || text.trim().isEmpty()) {
                throw new ApiException("No text could be extracted from the image.", 400);
            }

            return text.trim();

        } catch (IOException e) {
            throw new ApiException("Failed to read upload file bytes: " + e.getMessage(), e, 500);
        } catch (Exception e) {
            throw new ApiException("OCR.Space communication error: " + e.getMessage(), e, 502);
        }
    }

    // Helper records mapped to OCR.Space response JSON keys
    private record OcrResponse(
        @JsonProperty("ParsedResults") List<ParsedResult> parsedResults,
        @JsonProperty("IsErroredOnProcessing") boolean isErroredOnProcessing,
        @JsonProperty("ErrorMessage") List<String> errorMessage
    ) {}

    private record ParsedResult(
        @JsonProperty("ParsedText") String parsedText,
        @JsonProperty("FileParseExitCode") int fileParseExitCode,
        @JsonProperty("ErrorMessage") String errorMessage
    ) {}
}
