# Pending AI Features - NudiNadi

## Status Legend
- REAL: Fully implemented, API + UI connected
- PARTIAL: API exists but UI not wired up
- MOCKED: Placeholder with fake data / setTimeout
- MISSING: Not implemented at all

---

## Upload Page (`src/app/upload/page.tsx`)

| Feature | Status | Notes |
|---------|--------|-------|
| AI Image Analysis (Vision) | REAL | Button in AiAssistantWindow, calls /api/ai/analyze |
| AI Generate Description | REAL | /api/ai/enhance?action=description |
| AI Improve Title | REAL | /api/ai/enhance?action=title |
| AI Price Suggestion | REAL | /api/ai/enhance?action=quality |
| AI Auto-Categorize | REAL | Magic search input + /api/ai/enhance?action=categorize |
| AI Moderation on publish | REAL | /api/ai/moderate?action=moderate before save |
| AI Link Import | REAL | Paste Link button, sessionStorage handoff from /link-import |
| **VIN Lookup** | **MOCKED** | `handleVinLookup()` returns fake VW Golf after 1500ms delay. Needs real Gemini call or NHTSA API. |

### VIN Lookup Fix
Find `handleVinLookup` in `upload/page.tsx`. Replace mock with:
```typescript
const res = await fetch('/api/ai/analyze', {
  method: 'POST',
  body: JSON.stringify({ action: 'vin', vin: vinNumber }),
});
```
Add `action: 'vin'` to `/api/ai/analyze/route.ts`:
- Input: `{ action: 'vin', vin: string }`
- Gemini prompt: decode VIN manually (first 3 chars = WMI, next 6 = VDS, last 8 = VIS)
- OR call NHTSA free API: `https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/{vin}?format=json`
- Output: `{ make, model, year, engine, transmission, country }`

---

## Search Page (`src/app/search/page.tsx`)

| Feature | Status | Notes |
|---------|--------|-------|
| **AI Smart Search** | **PARTIAL** | `/api/ai/search` fully implemented, NOT wired to search UI |

### Smart Search Wire-up
1. Read `src/app/search/page.tsx` to find the search input and filter state
2. Add debounced AI call on query change:
```typescript
const debouncedSearch = useMemo(
  () => debounce(async (q: string) => {
    if (q.length < 3) return;
    const res = await fetch('/api/ai/search', {
      method: 'POST',
      body: JSON.stringify({ query: q }),
    });
    const json = await res.json();
    if (json.success) {
      setCleanQuery(json.data.cleanQuery);
      setAiFilters(json.data.filters); // apply to filter state
      setSearchSuggestions(json.data.suggestions);
    }
  }, 500),
  []
);
```
3. Show corrected query ("Prikazujemo rezultate za: {cleanQuery}") if it differs from input
4. Show AI-extracted filters as pre-selected filter chips

---

## Profile Page (`src/app/profile/page.tsx`)

| Feature | Status | Notes |
|---------|--------|-------|
| **Trust Score Display** | **PARTIAL** | `/api/ai/moderate?action=trust` implemented, NOT wired to profile UI |
| **XP / Level System** | **MISSING** | Calculation exists in API but no DB tracking, no UI |

### Trust Score Wire-up
1. Read `src/app/profile/page.tsx`
2. On page load, call trust endpoint with user stats:
```typescript
const res = await fetch('/api/ai/moderate', {
  method: 'POST',
  body: JSON.stringify({
    action: 'trust',
    totalListings: user.listingCount,
    successfulSales: user.salesCount,
    rating: user.rating,
    reviewCount: user.reviewCount,
    accountAgeDays: daysSince(user.createdAt),
    hasAvatar: !!user.avatar,
    hasPhone: !!user.phone,
    hasEmail: !!user.email,
    userId: user.id,
  }),
});
const json = await res.json();
// Display: json.data.score, json.data.level, json.data.badge
// Show strengths[] and improvements[] as tips
```
3. Show badge next to username (Novi korisnik / Pouzdan / Provjereni prodavac / etc.)
4. Show progress bar from current level to next

---

## Moderation / Admin

| Feature | Status | Notes |
|---------|--------|-------|
| **Duplicate Detection UI** | **PARTIAL** | `/api/ai/moderate?action=duplicate` exists, not surfaced in UI |
| Content moderation on publish | REAL | Already blocks listing before save |

### Duplicate Detection
Add to upload page before publish (after moderation check):
```typescript
const dupRes = await fetch('/api/ai/moderate', {
  method: 'POST',
  body: JSON.stringify({
    action: 'duplicate',
    title: formData.title,
    category: formData.category,
    description: formData.description,
  }),
});
const dupJson = await dupRes.json();
if (dupJson.success && dupJson.data.isDuplicate && dupJson.data.confidence > 80) {
  // Show warning dialog, let user confirm or cancel
  setDuplicateWarning(dupJson.data.reason);
}
```

---

## Features Not Yet Started

| Feature | Notes |
|---------|-------|
| Filter Suggestions AI | Show AI-suggested filters based on search context |
| Platform Clone (PROJ-14) | Auto-clone listings from other platforms at scale |
| Multi-Currency (PROJ-19) | Show prices in KM/EUR/USD based on user preference |
| PWA Setup (PROJ-20) | Service worker, offline mode, install prompt |
| Onboarding Flow (PROJ-21) | Step-by-step new user onboarding with AI tips |
| AI Auto-Categorization debounce | Live category suggestion while typing title (debounced) |

---

## Priority Order (Recommended)

1. **VIN Lookup** - small fix, high user value for auto category
2. **Smart Search wire-up** - API already done, just needs UI wiring
3. **Trust Score on Profile** - API done, increases user trust signals
4. **Duplicate Detection warning** - API done, improves listing quality
5. **Filter Suggestions** - new feature, moderate complexity
6. **XP / Level System** - needs Supabase schema work first
