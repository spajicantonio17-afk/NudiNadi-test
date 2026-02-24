# NudiNadi App Architecture

## Table of Contents
1. [Key File Locations](#key-file-locations)
2. [AI API Routes](#ai-api-routes)
3. [Core AI Library](#core-ai-library)
4. [Data Flow](#data-flow)

---

## Key File Locations

```
src/
  app/
    api/ai/
      analyze/route.ts     # Image vision analysis
      enhance/route.ts     # Text improvement (5 actions)
      import/route.ts      # URL scraping + extraction
      moderate/route.ts    # Content moderation + trust score
      search/route.ts      # Smart semantic search
    upload/page.tsx        # Main listing creation page (1000+ lines)
    link-import/page.tsx   # URL import page (408 lines)
    search/page.tsx        # Search results page
    profile/page.tsx       # User profile page
  lib/
    gemini.ts              # Core Gemini helper functions
    types.ts               # Product, Category, User types
    constants.ts           # CATEGORIES, MOCK_PRODUCTS
  components/
    layout/MainLayout.tsx  # Shared header + bottom nav
```

---

## AI API Routes

### /api/ai/analyze (route.ts)
Image-based product analysis via Gemini Vision.

**action: 'full'**
- Input: `{ action: 'full', imageData: string (base64), mimeType: string }`
- Output: `{ category, subcategory, brand, model, title, description, tags[], priceEstimate: { min, max, currency }, condition, confidence }`

**action: 'ocr'**
- Input: `{ action: 'ocr', imageData: string (base64), mimeType: string }`
- Output: `{ partNumber, partName, manufacturer, compatibleVehicles[], description, confidence }`

---

### /api/ai/enhance (route.ts)
Text optimization with 5 actions.

**action: 'title'**
- Input: `{ action: 'title', title: string, category?: string }`
- Output: `{ improvedTitle: string, explanation: string }`
- Rules: max 60 chars, natural Bosnian/Croatian

**action: 'description'**
- Input: `{ action: 'description', title: string, category?: string, description?: string, price?: number }`
- Output: `{ description: string (80-150 words), bulletPoints: string[] }`

**action: 'quality'**
- Input: `{ action: 'quality', title: string, description?: string, category?: string, imageCount?: number, price?: number }`
- Output: `{ score: number (0-100), level: string, warnings: string[], suggestions: string[], priceEstimate: { min, max, currency }, missingInfo: string[] }`

**action: 'tags'**
- Input: `{ action: 'tags', title: string, description?: string, category?: string }`
- Output: `{ tags: string[] (8-12 tags) }`

**action: 'categorize'**
- Input: `{ action: 'categorize', title?: string, description?: string }`
- Output: `{ category: string, subcategory: string, confidence: number (0-100), alternativeCategories: Array<{category, subcategory, confidence}> }`

---

### /api/ai/import (route.ts)
Scrape and extract product data from marketplace URLs.

- Supported domains: `olx.ba`, `njuskalo.hr`, `oglasi.hr`, `index.hr`, `mojauto.ba`
- Input: `{ url: string }`
- Output: `{ title, description, price, currency, category, condition, location, images: string[], seller, phone, attributes: Record<string, string> }`
- Process: fetch HTML → strip scripts/styles → max 8000 chars → Gemini text extraction

---

### /api/ai/search (route.ts)
Semantic search with natural language understanding.

- Input: `{ query: string }`
- Output: `{ cleanQuery: string, intent: 'kupnja'|'prodaja'|'najam'|'usluga'|'info', filters: { category?, priceMin?, priceMax?, condition?, location? }, suggestions: string[], keywords: string[] }`
- Handles: typos, synonyms, regional slang (e.g., "komad" = handy/mobitel)
- **Status: API implemented, NOT wired to search UI**

---

### /api/ai/moderate (route.ts)
Content moderation and trust scoring.

**action: 'duplicate'**
- Input: `{ action: 'duplicate', title: string, category?: string, description?: string }`
- Output: `{ isDuplicate: boolean, confidence: number, reason: string, recommendation: string }`

**action: 'moderate'**
- Input: `{ action: 'moderate', title: string, description?: string, price?: number, category?: string, imageCount?: number }`
- Checks: scams, banned products, personal data (IBAN, card numbers), spam, unrealistic prices
- Output: `{ score: number (0-100), isBlocked: boolean, level: 'Bezbedan'|'Upozorenje'|'Opasan', warnings: string[], blockedReasons: string[], recommendation: string }`

**action: 'trust'**
- Input: `{ action: 'trust', totalListings, successfulSales, rating, reviewCount, accountAgeDays, hasAvatar, hasPhone, hasEmail, userId }`
- Output: `{ score: number (0-100), level: string, badge: string, breakdown: { activity, reputation, verification, history }, strengths: string[], improvements: string[] }`
- Levels: Novi korisnik / Pocetnik / Pouzdan / Provjereni prodavac / Elitni prodavac

---

## Core AI Library

File: `src/lib/gemini.ts`

```typescript
// Text-only Gemini call
export async function textWithGemini(prompt: string): Promise<string>

// Vision (image + text) Gemini call
export async function analyzeImageWithGemini(
  base64Image: string,
  mimeType: string,
  prompt: string
): Promise<string>

// Parse JSON from Gemini response (handles markdown code fences)
export function parseJsonResponse(text: string): unknown
```

Model used: `gemini-2.0-flash`
Config: `GEMINI_API_KEY` in `.env.local` (server-side only)

---

## Data Flow

```
Upload Page
  1. AI Link Import:   URL → /api/ai/import → Gemini text → fill form fields
  2. AI Image Analyze: photo → base64 → /api/ai/analyze → Gemini Vision → fill all fields
  3. AI Description:   title → /api/ai/enhance?action=description → professional text
  4. AI Title:         title → /api/ai/enhance?action=title → SEO-optimized
  5. AI Price:         title → /api/ai/enhance?action=quality → price range
  6. AI Categorize:    title → /api/ai/enhance?action=categorize → category
  7. AI Moderation:    form data → /api/ai/moderate?action=moderate → block if flagged

Search Page (planned)
  query → /api/ai/search → { cleanQuery, filters, suggestions } → filter products

Profile Page (planned)
  user data → /api/ai/moderate?action=trust → trust score + badge display
```
