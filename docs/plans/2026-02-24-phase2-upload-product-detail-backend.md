# Phase 2: Upload + Produktdetail — Backend-Anbindung

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Ziel:** Die Upload- und Produktdetailseiten mit dem Supabase-Backend verbinden, damit Inserate End-to-End erstellt, angezeigt, bearbeitet und verwaltet werden können.

**Architektur:** Die Frontend-Seiten existieren bereits mit vollständiger UI. Das Supabase-Schema (8 Tabellen + RLS + Trigger) ist in Migrations definiert. Die Service-Schicht (`src/services/`) kapselt Supabase-Aufrufe. Dieser Plan schließt die Lücken zwischen UI und Backend: fehlende DB-Spalten, kaputte ID-Zuordnungen, fehlende RPC-Funktionen, Verkäufer-Verwaltungsfunktionen und den ImageUpload Light-Theme-Fix.

**Tech Stack:** Next.js 16 (App Router), Supabase (PostgreSQL + Storage + Auth), TypeScript, Tailwind CSS

---

## Audit-Zusammenfassung — Was bereits verdrahtet ist vs. was fehlt

### Bereits funktionsfähig
- Upload-Seite → `uploadProductImages()` → Supabase Storage
- Upload-Seite → `createProduct()` → Supabase `products`-Tabelle
- Upload-Seite → AI-Endpunkte (Gemini) für Beschreibung, Kategorisierung, Bildanalyse, OCR, Moderation
- Upload-Seite → Auth-Guard (leitet nicht-authentifizierte Nutzer auf `/login` um)
- Produktdetail → `getProductById()` → Supabase `products`-Tabelle (mit Verkäufer- + Kategorie-Join)
- Produktdetail → `getOrCreateConversation()` für "Verkäufer kontaktieren"
- Startseite → `getProducts()` → Supabase mit Filtern + Pagination
- Favoriten → Supabase DB wenn eingeloggt, localStorage-Fallback für Gäste
- Auth → Vollständige Supabase Auth (E-Mail/Passwort, OAuth, Session-Management)
- DB-Trigger → XP-System, Durchschnittsbewertungen, Favoriten-Zähler, Kategorie-Produktanzahl, Konversations-Zeitstempel

### Kritische Lücken (dieser Plan behebt sie)
1. **Fehlende `attributes` JSONB-Spalte** in der `products`-Tabelle — Upload schreibt sie, aber die Spalte existiert nicht
2. **Fehlende `increment_views` RPC** — productService ruft sie auf, aber Funktion ist nicht in Migrations definiert
3. **Kategorie-ID-Zuordnung kaputt** — Upload sendet Kategorie-Namens-Strings, DB erwartet UUID `category_id`
4. **Aufrufzähler wird nie inkrementiert** — Produktdetailseite ruft `incrementViews()` beim Laden nicht auf
5. **Öffentliche Q&A ist nur Client-seitig** — hardcodierte Mock-Daten, keine DB-Tabelle
6. **ImageUpload-Komponente verwendet Dark-Farben** — beim Light-Theme-Umstieg übersehen
7. **Keine Verkäufer-Verwaltung** — kann nicht bearbeiten, löschen oder als verkauft markieren
8. **VIN-Lookup ist gemockt** — `setTimeout` mit hardcodierten Daten
9. **Keine Weiterleitung zum erstellten Produkt** — Publish geht auf `/` statt `/product/{id}`
10. **Keine XP-Vergabe beim Upload** — sollte `user_activities` für Gamification loggen
11. **Startseite zeigt Kategorie immer als `'Ostalo'`** — `dbToDisplayProduct()` ignoriert echte Kategorie
12. **Verkäufer-Profillink geht auf `/profile`** — sollte `/profile/{seller_id}` sein (oder öffentliches Profil)

---

## Aufgabe 1: Fehlende `attributes`-Spalte + `increment_views` RPC hinzufügen

Der `products`-Tabelle fehlt die `attributes` JSONB-Spalte, die das Frontend bereits beschreibt. Die `increment_views` RPC-Funktion wird aufgerufen, aber ist nie definiert.

**Dateien:**
- Erstellen: `supabase/migrations/008_add_attributes_and_views_rpc.sql`

**Schritt 1: Migration-SQL schreiben**

```sql
-- =============================================
-- NudiNađi - Migration 008: Attributes-Spalte + increment_views RPC
-- =============================================

-- JSONB-Attributes-Spalte zu products hinzufügen (für kategorie-spezifische Felder)
ALTER TABLE products
ADD COLUMN IF NOT EXISTS attributes JSONB DEFAULT NULL;

-- increment_views RPC-Funktion erstellen
CREATE OR REPLACE FUNCTION increment_views(p_product_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE products
  SET views_count = views_count + 1
  WHERE id = p_product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Schritt 2: Migration im Supabase SQL Editor ausführen**

Supabase Dashboard → SQL Editor → Migration einfügen und ausführen.

Erwartet: "Success. No rows returned" (DDL-Anweisungen).

**Schritt 3: Überprüfen**

Im SQL Editor ausführen:
```sql
SELECT column_name, data_type FROM information_schema.columns
WHERE table_name = 'products' AND column_name = 'attributes';
```
Erwartet: 1 Zeile mit `attributes | jsonb`.

**Schritt 4: Commit**

```bash
git add supabase/migrations/008_add_attributes_and_views_rpc.sql
git commit -m "feat: add attributes JSONB column and increment_views RPC"
```

---

## Aufgabe 2: Kategorie-ID-Zuordnung beim Upload fixen

Das Upload-Formular speichert die Kategorie als String-Name (z.B. `"Vozila"`, `"Nekretnine - Stanovi i Apartmani"`). Der `createProduct()`-Aufruf setzt `category_id` nie — es wird komplett ausgelassen. Wir brauchen eine Lookup-Funktion, die einen Kategorie-Namens-String in die Supabase `categories.id` UUID auflöst.

**Dateien:**
- Ändern: `src/services/categoryService.ts` (erst lesen — evtl. muss sie erstellt werden)
- Ändern: `src/app/upload/page.tsx:467-478` (der `createProduct`-Aufruf in `handlePublish`)

**Schritt 1: categoryService mit Name-zu-ID-Resolver erstellen/aktualisieren**

Prüfen ob `src/services/categoryService.ts` existiert. Falls ja, ergänzen. Falls nein, erstellen.

```typescript
// src/services/categoryService.ts
import { getSupabase } from '@/lib/supabase'
import type { Category } from '@/lib/database.types'

const supabase = getSupabase()

// Cache um wiederholte Lookups zu vermeiden
let categoryCache: Category[] | null = null

export async function getAllCategories(): Promise<Category[]> {
  if (categoryCache) return categoryCache

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  if (error) throw error
  categoryCache = data ?? []
  return categoryCache
}

/**
 * Löst einen Anzeige-Kategorienamen in eine Supabase-Kategorie-UUID auf.
 * Verarbeitet zusammengesetzte Namen wie "Nekretnine - Stanovi i Apartmani"
 * indem zuerst nach der Unterkategorie gesucht wird, dann Fallback auf Elternkategorie.
 */
export async function resolveCategoryId(displayName: string): Promise<string | null> {
  if (!displayName) return null

  const categories = await getAllCategories()

  // 1. Exakte Übereinstimmung mit Name versuchen
  const exact = categories.find(c => c.name === displayName)
  if (exact) return exact.id

  // 2. Zusammengesetzte Namen wie "Nekretnine - Stanovi i Apartmani" verarbeiten
  if (displayName.includes(' - ')) {
    const parts = displayName.split(' - ')
    const subName = parts.slice(1).join(' - ').trim()
    const sub = categories.find(c => c.name === subName)
    if (sub) return sub.id

    // Fallback: Elternkategorie matchen
    const parentName = parts[0].trim()
    const parent = categories.find(c => c.name === parentName)
    if (parent) return parent.id
  }

  // 3. Fuzzy: Groß-/Kleinschreibung ignorierend
  const lower = displayName.toLowerCase()
  const fuzzy = categories.find(c => c.name.toLowerCase().includes(lower) || lower.includes(c.name.toLowerCase()))
  if (fuzzy) return fuzzy.id

  return null
}
```

**Schritt 2: In handlePublish der Upload-Seite einbinden**

In `src/app/upload/page.tsx` Import hinzufügen und Kategorie vor `createProduct` auflösen:

```typescript
// Import oben hinzufügen
import { resolveCategoryId } from '@/services/categoryService';
```

Dann in `handlePublish`, zwischen Bild-Upload und `createProduct`-Aufruf:

```typescript
      // 1.5 Kategoriename → UUID auflösen
      const categoryId = await resolveCategoryId(formData.category);

      // 2. Produkt in Datenbank erstellen
      await createProduct({
        seller_id: user.id,
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        price: Number(formData.price),
        category_id: categoryId,                          // <-- NEU
        condition: mapCondition(formData.condition),
        images: imageUrls,
        status: 'active',
        location: formData.location.trim() || null,
        attributes: Object.keys(attributes).length > 0 ? attributes : undefined,
      });
```

**Schritt 3: Manuell testen**

1. Einloggen → Upload → Kategorie wählen → Formular ausfüllen → Veröffentlichen
2. Supabase Table Editor prüfen: Die neue Produktzeile sollte eine nicht-null `category_id` haben

**Schritt 4: Commit**

```bash
git add src/services/categoryService.ts src/app/upload/page.tsx
git commit -m "feat: resolve category name to UUID on product upload"
```

---

## Aufgabe 3: Aufrufzähler beim Laden der Produktdetailseite inkrementieren

Die Funktion `incrementViews` existiert in `productService.ts`, wird aber nie aufgerufen. Sie muss in den useEffect der Produktdetailseite eingefügt werden.

**Dateien:**
- Ändern: `src/app/product/[id]/page.tsx:61-68` (der Datenlade-useEffect)

**Schritt 1: Aufrufzähler-Inkrement hinzufügen**

`incrementViews` importieren und nach dem Produktladen aufrufen:

```typescript
// Import hinzufügen
import { getProductById, incrementViews } from '@/services/productService';
```

useEffect aktualisieren:

```typescript
  useEffect(() => {
    if (!params.id) return;
    setIsLoading(true);
    getProductById(params.id)
      .then(data => {
        setProduct(data);
        // Aufrufzähler inkrementieren (fire-and-forget, UI nicht blockieren)
        incrementViews(params.id).catch(() => {});
      })
      .catch(() => setNotFound(true))
      .finally(() => setIsLoading(false));
  }, [params.id]);
```

**Schritt 2: `incrementViews`-Funktion in productService fixen**

Die aktuelle Implementierung hat einen kaputten Fallback. Ersetzen mit:

```typescript
export async function incrementViews(id: string): Promise<void> {
  const { error } = await supabase.rpc('increment_views', { p_product_id: id })
  if (error) {
    console.warn('increment_views RPC fehlgeschlagen:', error.message)
  }
}
```

Hinweis: Der RPC-Parametername muss zu Migration 008 passen (`p_product_id`).

**Schritt 3: Überprüfen**

1. Produktdetailseite öffnen
2. Seite neu laden
3. Supabase Table Editor prüfen: `views_count` sollte inkrementiert sein

**Schritt 4: Commit**

```bash
git add src/app/product/[id]/page.tsx src/services/productService.ts
git commit -m "feat: increment view count on product detail page load"
```

---

## Aufgabe 4: Kategorieanzeige auf der Startseite fixen

`dbToDisplayProduct()` in `src/app/page.tsx:56` hardcodiert `category: 'Ostalo'`. Es sollte die echte Kategorie aus dem Produkt-Join verwenden.

**Dateien:**
- Ändern: `src/app/page.tsx:42-59` (die `dbToDisplayProduct`-Funktion)
- Ändern: `src/services/productService.ts:28-57` (die `getProducts`-Query — muss Kategorien joinen)

**Schritt 1: `getProducts` aktualisieren um Kategorien zu joinen**

In `productService.ts` den Select aktualisieren:

```typescript
export async function getProducts(filters: ProductFilters = {}): Promise<{ data: ProductWithSeller[]; count: number }> {
  let query = supabase
    .from('products')
    .select('*, seller:profiles!seller_id(*), category:categories!category_id(*)', { count: 'exact' })
```

Hinweis: Dies ändert den Rückgabetyp. `ProductWithSeller` aktualisieren oder `ProductFull` verwenden, das bereits Kategorie enthält.

**Schritt 2: `dbToDisplayProduct` auf der Startseite aktualisieren**

```typescript
function dbToDisplayProduct(p: ProductFull): Product {
  const condMap: Record<string, Product['condition']> = {
    new: 'New', like_new: 'Like New', used: 'Used',
  };
  return {
    id: p.id,
    name: p.title,
    price: Number(p.price),
    secondaryPriceLabel: `${(Number(p.price) * BAM_RATE).toFixed(0)} KM`,
    location: p.location || 'Nepoznato',
    timeLabel: formatTimeLabel(p.created_at),
    description: p.description || '',
    imageUrl: p.images?.[0] || `https://picsum.photos/seed/${p.id}/400/300`,
    category: p.category?.name || 'Ostalo',             // <-- FIX
    seller: p.seller?.username || 'korisnik',
    condition: condMap[p.condition] ?? 'Used',
    views: p.views_count,
  };
}
```

Import auch auf `ProductFull` statt `ProductWithSeller` aktualisieren wo nötig.

**Schritt 3: Commit**

```bash
git add src/app/page.tsx src/services/productService.ts
git commit -m "feat: show actual category name on home page product cards"
```

---

## Aufgabe 5: Nach Upload zum erstellten Produkt weiterleiten

Nach der Veröffentlichung wird der Nutzer auf `/` geschickt. Stattdessen zur Detailseite des neuen Produkts weiterleiten.

**Dateien:**
- Ändern: `src/app/upload/page.tsx:467-481` (der Erfolgspfad von `handlePublish`)

**Schritt 1: Erstellte Produkt-ID erfassen und weiterleiten**

```typescript
      // 2. Produkt in Datenbank erstellen
      const newProduct = await createProduct({
        seller_id: user.id,
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        price: Number(formData.price),
        category_id: categoryId,
        condition: mapCondition(formData.condition),
        images: imageUrls,
        status: 'active',
        location: formData.location.trim() || null,
        attributes: Object.keys(attributes).length > 0 ? attributes : undefined,
      });

      showToast('Oglas uspješno objavljen!');
      router.push(`/product/${newProduct.id}`);    // <-- Weiterleitung zum neuen Produkt
```

**Schritt 2: Commit**

```bash
git add src/app/upload/page.tsx
git commit -m "feat: redirect to product detail after successful upload"
```

---

## Aufgabe 6: XP bei erfolgreichem Upload vergeben

Einen `user_activities`-Eintrag loggen wenn ein Produkt veröffentlicht wird, mit 10 XP Belohnung (der `upload` Activity-Typ). Der bestehende DB-Trigger (`trigger_activity_xp`) addiert die XP automatisch zum Nutzerprofil.

**Dateien:**
- Ändern: `src/app/upload/page.tsx` (XP-Logging nach `createProduct` hinzufügen)
- Verwenden: bestehende `src/lib/supabase.ts` (direktes Insert — kein Service für einen Aufruf nötig)

**Schritt 1: XP-Vergabe nach Produkterstellung hinzufügen**

In `handlePublish`, nach erfolgreichem `createProduct`:

```typescript
// Oben in der Datei hinzufügen:
import { getSupabase } from '@/lib/supabase';

// In handlePublish, nach createProduct:
      // 3. XP für Upload vergeben
      getSupabase().from('user_activities').insert({
        user_id: user.id,
        activity_type: 'upload' as const,
        xp_earned: 10,
      }).catch(() => {});
```

**Schritt 2: Commit**

```bash
git add src/app/upload/page.tsx
git commit -m "feat: award 10 XP on successful product upload"
```

---

## Aufgabe 7: ImageUpload-Komponente — Light Theme fixen

Die `ImageUpload.tsx`-Komponente verwendet noch Dark-Theme-Farben (`#0A1016`, `#121C26`, `white/10`). Anders als PhonePreview und AiAssistantWindow, die absichtlich dunkel sind, ist ImageUpload Teil des Formulars und sollte zum Light Theme passen.

**Dateien:**
- Ändern: `src/components/ImageUpload.tsx`

**Schritt 1: Dark-Farben durch CSS-Variable/Light-Äquivalente ersetzen**

| Alt (Dark)                | Neu (Light)                              |
|---------------------------|------------------------------------------|
| `bg-[#0A1016]`           | `bg-[var(--c-card-alt)]`                |
| `border-white/10`        | `border-[var(--c-border)]`              |
| `bg-white/5`             | `bg-[var(--c-hover)]`                   |
| `text-white`             | `text-[var(--c-text)]`                  |
| `text-gray-500`          | `text-[var(--c-text3)]`                 |
| `text-gray-600`          | `text-[var(--c-text2)]`                 |
| `bg-[#121C26]`           | `bg-[var(--c-card)]`                    |
| `border-white/5`         | `border-[var(--c-border)]`              |
| `bg-black/70`            | `bg-black/50`                           |
| `border-white/30`        | `border-[var(--c-text3)]`               |

Diese Ersetzungen auf die gesamte Datei anwenden.

**Schritt 2: Visuell überprüfen**

Upload-Seite öffnen → der Bild-Upload-Bereich sollte zum Light Theme passen.

**Schritt 3: Commit**

```bash
git add src/components/ImageUpload.tsx
git commit -m "fix: convert ImageUpload component to light theme"
```

---

## Aufgabe 8: Verkäufer-Verwaltungssteuerungen zur Produktdetailseite hinzufügen

Verkäufer brauchen Buttons zum **Bearbeiten**, **Als verkauft markieren** und **Löschen** ihrer eigenen Inserate auf der Produktdetailseite.

**Dateien:**
- Ändern: `src/app/product/[id]/page.tsx`

**Schritt 1: Verkäufer-exklusive Aktionsleiste hinzufügen**

Nach dem bestehenden Aktionsbereich (ca. Zeile 272), Verkäufer-Steuerungen hinzufügen die nur rendern wenn `product.seller_id === user?.id`:

```tsx
                {/* VERKÄUFER-VERWALTUNG (nur für Inserat-Eigentümer sichtbar) */}
                {user && product.seller_id === user.id && (
                  <div className="mb-8 border border-amber-500/20 bg-amber-50 rounded-sm p-4">
                    <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-3">
                      <i className="fa-solid fa-crown mr-1"></i> Tvoj Oglas
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => router.push(`/upload?edit=${product.id}`)}
                        className="flex-1 h-10 bg-[var(--c-card)] border border-[var(--c-border2)] text-[var(--c-text)] text-xs font-bold uppercase tracking-widest hover:bg-[var(--c-hover)] transition-colors rounded-sm flex items-center justify-center gap-2"
                      >
                        <i className="fa-solid fa-pen"></i> Uredi
                      </button>
                      <button
                        onClick={handleMarkAsSold}
                        disabled={product.status === 'sold'}
                        className="flex-1 h-10 bg-emerald-600 text-white text-xs font-bold uppercase tracking-widest hover:bg-emerald-500 transition-colors rounded-sm flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <i className="fa-solid fa-check"></i>
                        {product.status === 'sold' ? 'Prodano' : 'Označi Prodano'}
                      </button>
                      <button
                        onClick={handleDeleteProduct}
                        className="w-10 h-10 border border-red-200 text-red-500 hover:bg-red-50 transition-colors rounded-sm flex items-center justify-center"
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </div>
                )}
```

**Schritt 2: Handler-Funktionen hinzufügen**

```typescript
  // Imports oben hinzufügen
  import { getProductById, incrementViews, markProductAsSold, deleteProduct } from '@/services/productService';

  const handleMarkAsSold = async () => {
    if (!product || !user) return;
    try {
      await markProductAsSold(product.id);
      setProduct({ ...product, status: 'sold' });
      showToast('Oglas označen kao prodan!');
    } catch {
      showToast('Greška pri označavanju', 'error');
    }
  };

  const handleDeleteProduct = async () => {
    if (!product || !user) return;
    if (!window.confirm('Jeste li sigurni da želite obrisati ovaj oglas?')) return;
    try {
      await deleteProduct(product.id);
      showToast('Oglas obrisan');
      router.push('/');
    } catch {
      showToast('Greška pri brisanju', 'error');
    }
  };
```

**Schritt 3: Commit**

```bash
git add src/app/product/[id]/page.tsx
git commit -m "feat: add seller management controls (edit, mark sold, delete)"
```

---

## Aufgabe 9: Öffentliche Q&A — Datenbanktabelle + Backend-Anbindung

Die hardcodierte Q&A durch eine echte `product_questions`-Tabelle ersetzen.

**Dateien:**
- Erstellen: `supabase/migrations/009_product_questions.sql`
- Erstellen: `src/services/questionService.ts`
- Ändern: `src/app/product/[id]/page.tsx` (Mock-Q&A durch echte Daten ersetzen)

**Schritt 1: Migration schreiben**

```sql
-- =============================================
-- NudiNađi - Migration 009: Product Questions (Öffentliche Q&A)
-- =============================================

CREATE TABLE product_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT,
  answered_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  answered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_questions_product ON product_questions(product_id);
CREATE INDEX idx_questions_user ON product_questions(user_id);

-- RLS
ALTER TABLE product_questions ENABLE ROW LEVEL SECURITY;

-- Jeder kann Fragen lesen
CREATE POLICY "questions_select_public"
  ON product_questions FOR SELECT
  USING (true);

-- Authentifizierte Nutzer können Fragen stellen
CREATE POLICY "questions_insert_auth"
  ON product_questions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Produkt-Verkäufer kann antworten (Antwort-Feld aktualisieren)
CREATE POLICY "questions_update_seller"
  ON product_questions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM products p
      WHERE p.id = product_questions.product_id
      AND p.seller_id = auth.uid()
    )
  );

-- Frage-Autor kann eigene Frage löschen
CREATE POLICY "questions_delete_own"
  ON product_questions FOR DELETE
  USING (auth.uid() = user_id);
```

**Schritt 2: Migration im Supabase SQL Editor ausführen**

**Schritt 3: questionService.ts erstellen**

```typescript
// src/services/questionService.ts
import { getSupabase } from '@/lib/supabase'

const supabase = getSupabase()

export interface QuestionWithUser {
  id: string
  product_id: string
  user_id: string
  question: string
  answer: string | null
  answered_at: string | null
  created_at: string
  user: { username: string; avatar_url: string | null }
}

export async function getProductQuestions(productId: string): Promise<QuestionWithUser[]> {
  const { data, error } = await supabase
    .from('product_questions')
    .select('*, user:profiles!user_id(username, avatar_url)')
    .eq('product_id', productId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as unknown as QuestionWithUser[]
}

export async function askQuestion(productId: string, userId: string, question: string) {
  const { data, error } = await supabase
    .from('product_questions')
    .insert({ product_id: productId, user_id: userId, question })
    .select('*, user:profiles!user_id(username, avatar_url)')
    .single()

  if (error) throw error
  return data as unknown as QuestionWithUser
}

export async function answerQuestion(questionId: string, answer: string, answeredBy: string) {
  const { error } = await supabase
    .from('product_questions')
    .update({ answer, answered_by: answeredBy, answered_at: new Date().toISOString() })
    .eq('id', questionId)

  if (error) throw error
}
```

**Schritt 4: Produktdetailseite aktualisieren um echte Q&A zu nutzen**

Den hardcodierten `questions`-State und `handleSubmitQuestion` ersetzen mit:

```typescript
import { getProductQuestions, askQuestion, answerQuestion, type QuestionWithUser } from '@/services/questionService';

// Mock-Fragen-State ersetzen:
const [questions, setQuestions] = useState<QuestionWithUser[]>([]);

// Fragen im selben useEffect wie Produkt laden:
useEffect(() => {
  if (!params.id) return;
  setIsLoading(true);
  getProductById(params.id)
    .then(data => {
      setProduct(data);
      incrementViews(params.id).catch(() => {});
      getProductQuestions(params.id).then(setQuestions).catch(() => {});
    })
    .catch(() => setNotFound(true))
    .finally(() => setIsLoading(false));
}, [params.id]);

// handleSubmitQuestion ersetzen:
const handleSubmitQuestion = async () => {
  if (!questionText.trim()) return;
  if (!user) { router.push(`/login?redirect=/product/${params.id}`); return; }
  try {
    const newQ = await askQuestion(params.id, user.id, questionText.trim());
    setQuestions(prev => [newQ, ...prev]);
    setQuestionText('');
  } catch {
    showToast('Greška pri slanju pitanja', 'error');
  }
};
```

Q&A-Rendering aktualisieren um `QuestionWithUser`-Felder zu verwenden (`q.user.username`, `q.question`, `q.answer`, `formatTimeLabel(q.created_at)`).

Verkäufer-Antwortfunktion hinzufügen: Wenn `user?.id === product?.seller_id`, "Odgovori"-Button neben unbeantworteten Fragen anzeigen.

**Schritt 5: Commit**

```bash
git add supabase/migrations/009_product_questions.sql src/services/questionService.ts src/app/product/[id]/page.tsx
git commit -m "feat: wire public Q&A to Supabase with real-time questions and seller answers"
```

---

## Aufgabe 10: VIN-Lookup fixen — An Gemini AI anbinden

Den gemockten `handleVinLookup` durch einen echten AI-Aufruf ersetzen, der Fahrzeuginfos aus einer VIN extrahiert.

**Dateien:**
- Ändern: `src/app/upload/page.tsx:322-337` (die `handleVinLookup`-Funktion)
- Ändern: `src/app/api/ai/enhance/route.ts` (`vin`-Aktion hinzufügen)

**Schritt 1: VIN-Aktion zum AI Enhance-Endpunkt hinzufügen**

In der Enhance-API-Route einen neuen Action-Handler für `vin` hinzufügen:

```typescript
// Im switch/if-Block der Aktionen verarbeitet:
if (action === 'vin') {
  const prompt = `Du bist ein Fahrzeugidentifikations-Experte. Gegeben ist diese VIN (Fahrzeug-Identifikationsnummer): "${title}", dekodiere sie und gib JSON zurück mit:
  - make (Hersteller, z.B. "Volkswagen")
  - model (z.B. "Golf 8")
  - year (z.B. "2022")
  - engine (z.B. "2.0 TDI")
  - bodyType (z.B. "Hatchback")
  - description (2-3 Sätze Beschreibung auf Bosnisch)
  Wenn die VIN ungültig oder nicht erkennbar ist, gib {"error": "Invalid VIN"} zurück.
  Gib NUR gültiges JSON zurück, kein Markdown.`;

  // ... Gemini mit diesem Prompt aufrufen und geparsten JSON zurückgeben
}
```

**Schritt 2: handleVinLookup in der Upload-Seite aktualisieren**

```typescript
const handleVinLookup = async () => {
  if (!formData.vin || formData.vin.length < 11) {
    showToast('VIN mora imati najmanje 11 znakova', 'error');
    return;
  }
  setIsAiLoading(true);
  try {
    const res = await fetch('/api/ai/enhance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'vin', title: formData.vin }),
    });
    const json = await res.json();
    if (json.success && json.data && !json.data.error) {
      const d = json.data;
      setFormData(prev => ({
        ...prev,
        title: `${d.make} ${d.model}${d.engine ? ' ' + d.engine : ''}`,
        brand: d.make || prev.brand,
        model: d.model || prev.model,
        year: d.year || prev.year,
        description: d.description || prev.description,
      }));
      showToast('Vozilo prepoznato preko VIN broja!');
      setStep('form');
    } else {
      showToast('VIN nije prepoznat. Pokušajte ručno.', 'error');
    }
  } catch {
    showToast('Greška pri VIN pretrazi', 'error');
  }
  setIsAiLoading(false);
};
```

**Schritt 3: Commit**

```bash
git add src/app/upload/page.tsx src/app/api/ai/enhance/route.ts
git commit -m "feat: wire VIN lookup to Gemini AI for real vehicle identification"
```

---

## Aufgabe 11: "Meine Inserate"-Sektion hinzufügen

Nutzer müssen ihre eigenen Inserate sehen und verwalten können. Eine "Moji Oglasi" (Meine Inserate) Sektion hinzufügen.

**Dateien:**
- Erstellen: `src/app/my-listings/page.tsx`

**Schritt 1: Meine-Inserate-Seite erstellen**

```typescript
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/lib/auth';
import { getUserProducts } from '@/services/productService';
import type { ProductWithSeller } from '@/lib/database.types';

const STATUS_LABELS: Record<string, string> = {
  active: 'Aktivan', sold: 'Prodano', draft: 'Skica',
};
const STATUS_COLORS: Record<string, string> = {
  active: 'bg-emerald-500', sold: 'bg-gray-400', draft: 'bg-amber-500',
};

export default function MyListingsPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [products, setProducts] = useState<ProductWithSeller[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.replace('/login');
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!user) return;
    getUserProducts(user.id)
      .then(setProducts)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [user]);

  return (
    <MainLayout title="Moji Oglasi" showSigurnost={false}>
      <div className="max-w-4xl mx-auto pt-4 pb-24">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-black text-[var(--c-text)]">Moji Oglasi</h1>
          <button
            onClick={() => router.push('/upload')}
            className="blue-gradient text-white px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-widest"
          >
            <i className="fa-solid fa-plus mr-2"></i>Novi Oglas
          </button>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => (
              <div key={i} className="bg-[var(--c-card)] rounded-sm h-24 animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <i className="fa-solid fa-box-open text-4xl text-[var(--c-text3)] mb-4 block"></i>
            <p className="text-sm text-[var(--c-text2)]">Nemate nijedan oglas.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {products.map(p => (
              <button
                key={p.id}
                onClick={() => router.push(`/product/${p.id}`)}
                className="w-full bg-[var(--c-card)] border border-[var(--c-border)] rounded-sm p-4 flex items-center gap-4 hover:bg-[var(--c-hover)] transition-colors text-left"
              >
                <div className="w-16 h-16 bg-[var(--c-card-alt)] rounded-sm overflow-hidden shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.images?.[0] || `https://picsum.photos/seed/${p.id}/100/100`} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[var(--c-text)] truncate">{p.title}</p>
                  <p className="text-xs text-[var(--c-text2)]">{Number(p.price).toLocaleString()} EUR</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`w-2 h-2 rounded-full ${STATUS_COLORS[p.status]}`}></span>
                  <span className="text-[10px] font-bold text-[var(--c-text3)] uppercase">{STATUS_LABELS[p.status]}</span>
                </div>
                <i className="fa-solid fa-chevron-right text-[var(--c-text3)] text-xs"></i>
              </button>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
```

**Schritt 2: Link zu Meine Inserate von Profil-/Menü-Seiten**

Optional — die `/my-listings`-Route funktioniert eigenständig. Ein Link kann in Phase 3 von der Menü-Seite hinzugefügt werden.

**Schritt 3: Commit**

```bash
git add src/app/my-listings/page.tsx
git commit -m "feat: add My Listings page for managing own products"
```

---

## Aufgabe 12: Verkäufer-Profillink auf Produktdetailseite fixen

Der Verkäufer-Profillink geht auf `/profile` (eigenes Profil). Er sollte zum öffentlichen Profil des Verkäufers führen.

**Dateien:**
- Ändern: `src/app/product/[id]/page.tsx:292`

**Schritt 1: Link aktualisieren**

Ändern von:
```tsx
<button onClick={() => router.push('/profile')} ...>
```
Zu:
```tsx
<button onClick={() => router.push(`/profile?user=${product.seller_id}`)} ...>
```

(Da eine dedizierte `/profile/[id]`-Seite noch nicht existiert, ist ein Query-Parameter vorerst ausreichend. Phase 3 erstellt richtige öffentliche Profile.)

**Schritt 2: Commit**

```bash
git add src/app/product/[id]/page.tsx
git commit -m "fix: seller profile link includes seller ID"
```

---

## Aufgabenübersicht

| Nr. | Aufgabe | Priorität | Geänderte Dateien |
|-----|---------|-----------|-------------------|
| 1 | `attributes`-Spalte + `increment_views` RPC hinzufügen | Kritisch | 1 Migration |
| 2 | Kategorie-ID-Zuordnung beim Upload fixen | Kritisch | 2 Dateien |
| 3 | Aufrufzähler bei Produktdetail inkrementieren | Hoch | 2 Dateien |
| 4 | Startseite Kategorieanzeige fixen | Hoch | 2 Dateien |
| 5 | Nach Upload zum Produkt weiterleiten | Mittel | 1 Datei |
| 6 | XP beim Upload vergeben | Mittel | 1 Datei |
| 7 | ImageUpload Light Theme fixen | Mittel | 1 Datei |
| 8 | Verkäufer-Verwaltung (Bearbeiten/Verkauft/Löschen) | Hoch | 1 Datei |
| 9 | Öffentliche Q&A → Supabase | Hoch | 3 Dateien + 1 Migration |
| 10 | VIN-Lookup an Gemini AI anbinden | Mittel | 2 Dateien |
| 11 | Meine-Inserate-Seite | Mittel | 1 neue Datei |
| 12 | Verkäufer-Profillink fixen | Niedrig | 1 Datei |

**Gesamt: 12 Aufgaben, ~15 Dateien betroffen, 2 neue Migrations**

---

## Voraussetzungen vor dem Start

1. **Supabase-Projekt muss laufen** mit bereits angewandten Migrations 001-007
2. **Umgebungsvariablen** müssen in `.env.local` gesetzt sein (Supabase URL, Anon Key, Service Role Key, Gemini API Key)
3. **Kategorien müssen geseedet sein** in der `categories`-Tabelle (Migration 007)
4. **Dev-Server** muss laufen: `npm run dev` in `nudinadi/`