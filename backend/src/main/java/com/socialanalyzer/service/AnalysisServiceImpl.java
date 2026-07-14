package com.socialanalyzer.service;

import com.socialanalyzer.dto.AnalysisResponse;
import com.socialanalyzer.dto.AnalysisResult;
import com.socialanalyzer.exception.ApiException;
import com.socialanalyzer.exception.InvalidFileException;
import com.socialanalyzer.util.PdfTextExtractor;
import com.socialanalyzer.client.OcrSpaceClient;
import com.socialanalyzer.client.GeminiClient;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Set;

@Service
public class AnalysisServiceImpl implements AnalysisService {

    private static final Set<String> IMAGE_TYPES = Set.of("image/png", "image/jpeg");

    private final PdfTextExtractor pdfTextExtractor;
    private final OcrSpaceClient   ocrSpaceClient;
    private final GeminiClient     geminiClient;

    public AnalysisServiceImpl(PdfTextExtractor pdfTextExtractor,
                               OcrSpaceClient ocrSpaceClient,
                               GeminiClient geminiClient) {
        this.pdfTextExtractor = pdfTextExtractor;
        this.ocrSpaceClient   = ocrSpaceClient;
        this.geminiClient     = geminiClient;
    }

    @Override
    public AnalysisResponse analyzeContent(MultipartFile file, String campaignGoal, String targetAudience, String tonePreference) {
        validateFile(file);

        String contentType = file.getContentType();
        AnalysisResult result;
        boolean ocrFailed = false;

        if ("application/pdf".equals(contentType)) {
            // PDF: extract text → Gemini text analysis
            String text = pdfTextExtractor.extractText(file);
            result = geminiClient.analyzeContent(text, campaignGoal, targetAudience, tonePreference);
        } else {
            // Image: OCR extract text + pass raw bytes to Gemini Vision
            String ocrText = "";
            try {
                ocrText = ocrSpaceClient.extractText(file);
            } catch (Exception e) {
                System.err.println("OCR Extraction failed, falling back directly to Gemini Vision: " + e.getMessage());
                ocrFailed = true;
            }
            try {
                result = geminiClient.analyzeImage(file.getBytes(), contentType, ocrText, campaignGoal, targetAudience, tonePreference);
            } catch (IOException e) {
                throw new ApiException("Failed to read image bytes: " + e.getMessage(), e, 500);
            }
        }

        return new AnalysisResponse(result, ocrFailed);
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new InvalidFileException("File must not be empty.");
        }

        String ct  = file.getContentType();
        String fn  = file.getOriginalFilename();
        if (ct == null || fn == null) {
            throw new InvalidFileException("Invalid file format.");
        }

        String lower = fn.toLowerCase();
        boolean validExt = lower.endsWith(".pdf") || lower.endsWith(".png")
                        || lower.endsWith(".jpg") || lower.endsWith(".jpeg");
        boolean validType = "application/pdf".equals(ct) || IMAGE_TYPES.contains(ct);

        if (!validExt || !validType) {
            throw new InvalidFileException("Unsupported file type. Only PDF, PNG, JPG, JPEG allowed.");
        }
    }
}
