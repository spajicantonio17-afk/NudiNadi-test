# AI Implementation Patterns

## Table of Contents
1. [API Route Template](#api-route-template)
2. [Gemini Text Call](#gemini-text-call)
3. [Gemini Vision Call](#gemini-vision-call)
4. [Client-Side Fetch Pattern](#client-side-fetch-pattern)
5. [Image to Base64 (Client)](#image-to-base64-client)
6. [JSON Parsing](#json-parsing)
7. [Prompt Engineering Guidelines](#prompt-engineering-guidelines)

---

## API Route Template

```typescript
// src/app/api/ai/[feature]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { textWithGemini, analyzeImageWithGemini, parseJsonResponse } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'myAction') {
      const { title, description } = body;

      if (!title) {
        return NextResponse.json({ success: false, error: 'Naslov je obavezan' }, { status: 400 });
      }

      const prompt = `...`; // see Prompt Engineering below
      const response = await textWithGemini(prompt);
      const parsed = parseJsonResponse(response) as { result: string };

      return NextResponse.json({ success: true, data: parsed });
    }

    return NextResponse.json({ success: false, error: 'Nepoznata akcija' }, { status: 400 });

  } catch (error) {
    console.error('AI route error:', error);
    return NextResponse.json(
      { success: false, error: 'Greška pri obradi zahtjeva' },
      { status: 500 }
    );
  }
}
```

---

## Gemini Text Call

```typescript
import { textWithGemini, parseJsonResponse } from '@/lib/gemini';

const prompt = `Analiziraj ovaj oglas i vrati JSON:
Naslov: ${title}
Kategorija: ${category}

Vrati SAMO JSON bez objasnjenja:
{
  "result": "...",
  "confidence": 85
}`;

const response = await textWithGemini(prompt);
const data = parseJsonResponse(response) as { result: string; confidence: number };
```

---

## Gemini Vision Call

```typescript
import { analyzeImageWithGemini, parseJsonResponse } from '@/lib/gemini';

// base64Image: string without "data:image/jpeg;base64," prefix
// mimeType: 'image/jpeg' | 'image/png' | 'image/webp'

const prompt = `Analiziraj ovu sliku proizvoda i vrati JSON:
{
  "category": "...",
  "brand": "...",
  "model": "...",
  "condition": "Novo|Kao novo|Dobro|Prihvatljivo|Za dijelove",
  "title": "...",
  "description": "..."
}`;

const response = await analyzeImageWithGemini(base64Image, mimeType, prompt);
const data = parseJsonResponse(response);
```

---

## Client-Side Fetch Pattern

```typescript
// In a 'use client' page/component
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

async function callAI() {
  setLoading(true);
  setError(null);
  try {
    const res = await fetch('/api/ai/enhance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'title', title, category }),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();

    if (!json.success) throw new Error(json.error || 'Greska');

    // Use json.data here
    setTitle(json.data.improvedTitle);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Greska pri pozivu AI');
  } finally {
    setLoading(false);
  }
}
```

---

## Image to Base64 (Client)

```typescript
// From File object (input[type=file])
function fileToBase64(file: File): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const base64 = dataUrl.split(',')[1]; // strip "data:image/jpeg;base64,"
      resolve({ base64, mimeType: file.type });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Usage:
const { base64, mimeType } = await fileToBase64(imageFiles[0]);
const res = await fetch('/api/ai/analyze', {
  method: 'POST',
  body: JSON.stringify({ action: 'full', imageData: base64, mimeType }),
});
```

---

## JSON Parsing

```typescript
// parseJsonResponse handles:
// 1. Clean JSON: { ... }
// 2. Markdown fenced: ```json\n{ ... }\n```
// 3. Mixed text with JSON: extracts first { } block

import { parseJsonResponse } from '@/lib/gemini';

const raw = await textWithGemini(prompt);
const data = parseJsonResponse(raw) as MyExpectedType;
// Always cast - parseJsonResponse returns unknown

// Safe access pattern:
const result = data as { title?: string; confidence?: number };
const title = result.title ?? 'Nije prepoznato';
```

---

## Prompt Engineering Guidelines

### Language
Always add to every prompt:
```
Odgovori ISKLJUCIVO na bosanskom/hrvatskom jeziku.
```

### JSON enforcement
Always end prompts with:
```
Vrati SAMO validan JSON bez ikakvih objasnjenja, komentara ili markdown formatiranja.
```

### Structured output template
Always provide the exact JSON shape you expect:
```
Vrati JSON u ovom formatu:
{
  "field1": "vrijednost",
  "field2": 85,
  "field3": ["item1", "item2"]
}
```

### Price ranges
For price fields, always specify currency:
```
Procijeni cijenu u KM (konvertibilna marka) ili EUR.
Vrati { "min": number, "max": number, "currency": "KM" }
```

### Condition values
Standard condition enum for this app:
```
"Novo" | "Kao novo" | "Dobro" | "Prihvatljivo" | "Za dijelove"
```

### Defensive prompting for Vision
For image analysis, add:
```
Ako ne mozes prepoznati proizvod sa sigurnoscu, vrati confidence manji od 50.
Ako slika nije jasna, vrati sto je moguce vise informacija koje JESI siguran.
```
