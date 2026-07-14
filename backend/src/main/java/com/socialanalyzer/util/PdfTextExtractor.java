package com.socialanalyzer.util;

import com.socialanalyzer.exception.InvalidFileException;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Component
public class PdfTextExtractor {

    public String extractText(MultipartFile file) {
        try (PDDocument document = Loader.loadPDF(file.getBytes())) {
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document);
            if (text == null || text.trim().isEmpty()) {
                throw new InvalidFileException("Could not extract any text from the PDF file. Ensure the PDF contains selectable text.");
            }
            return text.trim();
        } catch (IOException e) {
            throw new InvalidFileException("Failed to read the PDF file: " + e.getMessage());
        }
    }
}
