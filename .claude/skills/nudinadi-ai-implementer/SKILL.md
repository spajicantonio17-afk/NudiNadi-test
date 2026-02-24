---
name: nudinadi-ai-implementer
description: "Specialized skill for the NudiNadi marketplace app (Next.js, Gemini AI). Use when implementing or fixing AI features, wiring AI endpoints to UI, replacing mocked/placeholder AI with real Gemini calls, adding AI to upload/search/profile/moderation flows, debugging Gemini API calls or prompts, or analyzing which AI systems are missing/broken. Triggers on: mach AI funktional, AI implementieren, fix AI, Gemini, fehlende AI Features, Smart Search einbauen, VIN Lookup, Trust Score, AI verdrahten, implement AI, KI Features."
---

# NudiNadi AI Implementer

## App Overview

NudiNadi is a Bosnian/Croatian second-hand marketplace (Next.js 16, App Router, TypeScript, Tailwind, shadcn/ui).
AI provider: **Google Gemini** (`gemini-2.0-flash`) via `@google/generative-ai`.

Working directory: `c:\Users\spaji\Desktop\NudiNadi\nudinadi`

## Step 1: Analyze Before Implementing

Always start with targeted reads before writing code:
- Read the relevant page/component file
- Check if the API route exists in `src/app/api/ai/`
- Search for `TODO`, `mock`, `setTimeout` as placeholder indicators
- Grep for the function name to find all usages

## Step 2: Architecture Reference

Read [references/app-architecture.md](references/app-architecture.md) for:
- All 5 AI API routes and their actions
- Core library (`src/lib/gemini.ts`) function signatures
- Data flow patterns and key file locations

## Step 3: Implementation Patterns

Read [references/ai-patterns.md](references/ai-patterns.md) for:
- Gemini text and vision call patterns with real code
- Standard API route structure (copy-paste ready)
- Client-side fetch pattern with loading/error states
- JSON response parsing conventions

## Step 4: Pending Features

Read [references/pending-features.md](references/pending-features.md) for:
- Complete list of AI features with current status (real/mocked/missing)
- What needs to be implemented and where
- Priority order and implementation hints

## Implementation Workflow

### A. Fix a mocked feature (e.g., VIN Lookup)
1. Read the mock code and note the expected output shape
2. Design a Gemini prompt that returns the same shape
3. Add/update the API route action
4. Replace the mock in the client with a real fetch call
5. Test with real input

### B. Wire an existing route to UI (e.g., Smart Search)
1. Confirm the API route works (`src/app/api/ai/search/route.ts`)
2. Find the search input component
3. Add debounced fetch on input change
4. Display structured results (filters, suggestions, corrected query)
5. Update URL params or filter state

### C. Add a new AI feature
1. Add a new action to the most relevant existing route (or create a new route)
2. Follow the standard route pattern from `references/ai-patterns.md`
3. Create/update the UI component
4. Connect with client fetch
5. Handle loading/error states

## Key Conventions

- All Gemini prompts instruct it to respond in **Bosnian/Croatian**
- Always return `{ success: true/false, data: {...}, error?: string }` from routes
- Parse JSON defensively using `parseJsonResponse()` from `src/lib/gemini.ts`
- Client pages use `'use client'` directive
- Images use base64 encoding for Gemini Vision calls
- Gemini model: always `gemini-2.0-flash`
- Never expose `GEMINI_API_KEY` client-side (server routes only)

## Common Pitfalls

- Gemini returns JSON in markdown code fences - always use `parseJsonResponse()`
- Large HTML for import: strip scripts/styles, max 8000 chars
- Image size limit: 2MB per image for Vision API
- Always handle `response.ok` and JSON parse errors in client fetches
- Images must be converted to base64 before sending to Vision API
