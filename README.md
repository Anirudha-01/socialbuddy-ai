# Social Media Content Analyzer

## SocialBuddy AI

SocialBuddy AI is a production-grade, AI-powered social media strategist platform designed to analyze draft posts, images, and marketing PDFs. By combining robust OCR/PDF text extraction with advanced vision intelligence, the system automatically evaluates design layout, copy quality, and audience resonance to deliver optimized rewrites, posting schedules, and content calendars.

---

## Assignment Requirements Mapping

To satisfy the requirements of the technical assessment, the following features have been fully implemented:

| Requirement | Status | Implementation Details |
| :--- | :---: | :--- |
| **PDF Upload** | ✅ | Fully integrated with validation for large or layout-heavy documents |
| **Image Upload** | ✅ | Accepts PNG, JPG, and JPEG formats (up to 10 MB limit) |
| **Drag & Drop** | ✅ | Intuitive HTML5 drag-and-drop dropzone on the landing page |
| **PDF Parsing** | ✅ | Robust text stream extraction powered by Apache PDFBox |
| **OCR Text Extraction** | ✅ | High-accuracy scanning of text in post graphics via OCR.Space API |
| **AI-Based Analysis** | ✅ | 9-dimension quality assessment powered by Google Gemini Vision |
| **Engagement Suggestions** | ✅ | Offers concrete improvements, hashtag strategy, and caption rewrites |
| **Production-Quality Code** | ✅ | Adheres to Spring Boot REST controller patterns and modular React/TS |
| **Loading States** | ✅ | Interactive step-wise loading overlays indicating backend progress |
| **Error Handling** | ✅ | Structured Spring `@RestControllerAdvice` and clear UI error notifications |
| **Documentation** | ✅ | Full API schema, architecture charts, and environment setups |

---

## Key Highlights

- **AI-powered social media content analysis**: Grade and optimize copies automatically for target niches.
- **PDF parsing using Apache PDFBox**: High-fidelity text stream extraction from PDF files.
- **OCR support for scanned images**: Robust text recognition from post graphics.
- **Google Gemini integration**: Utilizing `gemini-3.1-flash-lite` for speed and accuracy.
- **Professional downloadable report**: Exports to multi-page PDF, Word, and PNG dashboard capture formats.
- **Responsive React frontend**: Built with Vite, TypeScript, and elegant glassmorphic components.
- **Layered Spring Boot backend**: Adheres to clean SOLID principles with separation of concerns.

---

## 📸 Screenshots

### 🏠 Landing Page

<p align="center">
  <img src="ss/landing%20page.png" width="900">
</p>

<p align="center">
  <img src="ss/landing%20page%202.png" width="900">
</p>

---

### 📤 Upload & Analysis

<p align="center">
  <img src="ss/upload%201.png" width="900">
</p>

<p align="center">
  <img src="ss/upload%202.png" width="900">
</p>

<p align="center">
  <img src="ss/upload%203.png" width="900">
</p>

<p align="center">
  <img src="ss/upload%204.png" width="900">
</p>

---

### 📊 Dashboard

<p align="center">
  <img src="ss/dashboard%201.png" width="900">
</p>

<p align="center">
  <img src="ss/dashboard%202.png" width="900">
</p>

<p align="center">
  <img src="ss/dashboard%203.png" width="900">
</p>

---

### 📈 Demo Dashboard

<p align="center">
  <img src="ss/demo%20dashboard.png" width="900">
</p>

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Frontend (React + Vite)              │
│  Landing → Upload → Loading → Dashboard (Tabs)          │
│  Analyzer Tab | Planner Tab | PDF Download              │
└───────────────────────┬─────────────────────────────────┘
                        │ POST /api/analyze (multipart)
                        ▼
┌─────────────────────────────────────────────────────────┐
│              Backend (Spring Boot 3 / Java 21)           │
│                                                         │
│  AnalysisController                                     │
│       └─ AnalysisServiceImpl                            │
│            ├─ PDF → PdfTextExtractor (PDFBox)           │
│            │         └─ GeminiClient.analyzeContent()   │
│            └─ Image → OcrSpaceClient (OCR.Space)        │
│                        └─ GeminiClient.analyzeImage()   │
│                             (Vision: image + OCR text)  │
└─────────────────────────────────────────────────────────┘
```

---

## Folder Structure

```
Unthinkable/
├── backend/                       # Spring Boot Maven project
│   └── src/main/java/com/socialanalyzer/
│       ├── controller/            # REST endpoints
│       ├── service/               # Business logic
│       ├── client/                # Gemini + OCR.Space API clients
│       ├── dto/                   # Java Records (AnalysisResult, AnalysisResponse, etc.)
│       ├── exception/             # Custom exceptions + GlobalExceptionHandler
│       └── util/                  # PdfTextExtractor (PDFBox)
│
└── frontend/                      # Vite + React + TypeScript
    └── src/
        ├── components/            # UI components
        │   ├── Navbar, Footer
        │   ├── UploadCard         # Drag & drop zone
        │   ├── LoadingOverlay     # Step-wise progress
        │   ├── ScoreCircle        # Dynamic score ring
        │   ├── ContentSummaryCard # Platform, type, reach, virality
        │   ├── ResultCard         # Tone, sentiment, readability…
        │   ├── SuggestionCard     # AI improvement tips
        │   ├── ImprovedPost       # Optimized rewrite
        │   ├── CaptionCard        # Caption + hashtags + CTA
        │   ├── ReelScriptCard     # Structured reel script
        │   └── PlannerTab         # Schedule grid + content ideas
        ├── services/              # Axios API calls
        ├── types/                 # TypeScript interfaces
        └── App.tsx                # App shell + PDF report generator
```

---

## Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Frontend    | React 19, TypeScript, Vite, Tailwind CSS v4 |
| UI          | Lucide Icons, jsPDF, Framer Motion  |
| Backend     | Java 21, Spring Boot 3.3, Maven     |
| PDF Extract | Apache PDFBox                       |
| OCR         | OCR.Space REST API                  |
| AI          | Google Gemini (Vision + Text)       |

---

## Features

- ✅ Drag & drop upload for PDF, PNG, JPG, JPEG (max 10 MB)
- ✅ Gemini Vision: analyzes **both** the visual image and OCR text simultaneously
- ✅ Automatic content type and platform detection — no user input needed
- ✅ Full reel script generation (hook → scenes → ending → CTA → music mood)
- ✅ AI-generated caption, hashtags, and call-to-action
- ✅ 7-day posting schedule with niche-specific reasoning
- ✅ 5 content ideas for the detected niche
- ✅ Downloadable professional PDF report (multi-page, auto-paginated)
- ✅ Dark mode glassmorphism dashboard
- ✅ Tabbed UI: Analyzer + Planner
- ✅ Friendly error messages for all failure scenarios

---

## Setup Instructions

### Prerequisites
- Java 21+
- Maven 3.9+
- Node.js 20+

### Backend

```bash
cd backend
# Add your API keys to src/main/resources/application.properties
mvn spring-boot:run
# Runs on http://localhost:8080
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

---

## Environment Variables

**`backend/src/main/resources/application.properties`**

```properties
server.port=8080
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB

ocr.space.api.key=YOUR_OCR_SPACE_KEY
gemini.api.key=YOUR_GEMINI_API_KEY
gemini.api.url=https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent
```

> **Get your keys:**
> - Gemini API: https://aistudio.google.com/app/apikey
> - OCR.Space API: https://ocr.space/OCRAPI (free tier available)

---

## API Documentation

### `POST /api/analyze`

Analyzes uploaded social media content.

**Request:** `multipart/form-data`

| Field | Type   | Description                     |
|-------|--------|---------------------------------|
| file  | File   | PDF, PNG, JPG, or JPEG (≤ 10 MB) |

**Response:** `application/json`

```json
{
  "analysis": {
    "contentType": "Instagram Caption",
    "detectedPlatform": "Instagram",
    "engagementScore": 82,
    "estimatedReach": "High (20K–100K)",
    "viralityPotential": "High",
    "tone": "Inspirational",
    "sentiment": "Positive",
    "readability": "Easy",
    "hookStrength": "Strong",
    "cta": "Save this post",
    "grammar": "Excellent",
    "professionalism": "High",
    "hashtags": 8,
    "emojiUsage": "Medium",
    "wordCount": 64,
    "estimatedReadingTime": "25 seconds",
    "keywordDensity": "Optimal",
    "suggestions": ["..."],
    "improvedPost": "...",
    "caption": "...",
    "callToAction": "...",
    "recommendedHashtags": ["#tag1", "..."],
    "reelScript": "",
    "postingSchedule": ["Monday 9:00 AM - ..."],
    "contentIdeas": ["..."]
  }
}
```

**Error Responses:**

| Status | Scenario                    |
|--------|-----------------------------|
| 400    | Invalid/empty/wrong file type |
| 413    | File exceeds 10 MB          |
| 502    | OCR.Space or Gemini failure |
| 500    | Unexpected server error     |

---

## Deployment Guide

### Backend → Render

1. Push to GitHub
2. New Web Service → Connect repo
3. Build command: `mvn clean package -DskipTests`
4. Start command: `java -jar target/*.jar`
5. Add environment variables in Render dashboard
6. Set `GEMINI_API_KEY` and `OCR_SPACE_API_KEY`

### Frontend → Vercel

1. Push to GitHub
2. New Project → Import repo → select `frontend/` as root
3. Framework: Vite
4. Add env var: `VITE_API_BASE_URL=https://your-render-url.onrender.com`
5. Update `frontend/src/services/api.ts` to use `import.meta.env.VITE_API_BASE_URL`

---

## Future Improvements

- [ ] Competitor post comparison
- [ ] Batch upload (multiple posts at once)
- [ ] Platform-specific optimization profiles
- [ ] Historical analysis tracking (add local storage or DB)
- [ ] Webhook integration for scheduling posts directly
- [ ] Export to CSV / Google Sheets

---

*Generated by AI Social Media Content Analyzer · Powered by Google Gemini Vision*
