# Implementation Guide - Dynamic Category Attributes

## Table of Contents
1. [TypeScript Types](#typescript-types)
2. [Category-Attribute Map](#category-attribute-map)
3. [Dynamic Form Component Pattern](#dynamic-form)
4. [Supabase Schema](#supabase-schema)
5. [Search Filter Facets Pattern](#search-filters)
6. [AI Auto-fill of Attributes](#ai-autofill)

---

## TypeScript Types

```typescript
// src/lib/attribute-types.ts

export type AttributeFieldType =
  | 'text'
  | 'number'
  | 'select'
  | 'multiselect'
  | 'boolean'
  | 'year'
  | 'range';

export interface AttributeField {
  key: string;
  label: string;                  // Bosnian/Croatian label
  type: AttributeFieldType;
  options?: string[];             // for select/multiselect
  unit?: string;                  // 'km', 'kW', 'm2', 'GB', etc.
  required?: boolean;
  filterable?: boolean;           // appears in search sidebar
  placeholder?: string;
  min?: number;                   // for number/range/year
  max?: number;
}

export interface CategoryAttributeSchema {
  categoryKey: string;            // matches CATEGORIES constant key
  subcategoryKey?: string;        // optional: different fields per subcategory
  fields: AttributeField[];
}

// Listing attributes stored as flexible key-value map
export type ListingAttributes = Record<string, string | number | boolean | string[]>;
```

---

## Category-Attribute Map

```typescript
// src/lib/category-attributes.ts
// Maps category/subcategory to its AttributeField[]
// Load only the relevant section when working on a specific category

import { AttributeField } from './attribute-types';

// Example - Automobili
export const autoAttributes: AttributeField[] = [
  { key: 'vrstaVozila', label: 'Tip vozila', type: 'select', required: true, filterable: true,
    options: ['Limuzina', 'Karavan', 'SUV/Terenac', 'Hatchback', 'Coupe',
              'Kabriolet', 'Pickup', 'Minivan/MPV', 'Ostalo'] },
  { key: 'marka',  label: 'Marka', type: 'text', required: true, filterable: true },
  { key: 'model',  label: 'Model', type: 'text', required: true },
  { key: 'godina', label: 'Godiste', type: 'year', required: true, filterable: true,
    min: 1980, max: new Date().getFullYear() },
  { key: 'km',     label: 'Kilometraza', type: 'number', required: true, filterable: true, unit: 'km' },
  { key: 'zapremina', label: 'Zapremina motora', type: 'number', unit: 'cm3', filterable: true },
  { key: 'snagaKw',   label: 'Snaga motora', type: 'number', unit: 'kW', filterable: true },
  { key: 'gorivo',    label: 'Gorivo', type: 'select', required: true, filterable: true,
    options: ['Benzin', 'Diesel', 'Plin (LPG)', 'Hibrid (Benzin/Elektro)',
              'Hibrid (Diesel/Elektro)', 'Plug-in Hibrid', 'Elektricno'] },
  { key: 'mjenjac',   label: 'Mjenjac', type: 'select', filterable: true,
    options: ['Manuelni', 'Automatski', 'Poluautomatski (DSG/CVT)'] },
  { key: 'pogon',     label: 'Pogon', type: 'select', filterable: true,
    options: ['Prednji (FWD)', 'Zadnji (RWD)', '4x4 stalni', '4x4 na zahtjev'] },
  { key: 'boja',      label: 'Boja', type: 'select', filterable: true,
    options: ['Bijela', 'Crna', 'Siva', 'Srebrna', 'Crvena', 'Plava', 'Zelena',
              'Zuta', 'Narandzasta', 'Smeda', 'Zlatna', 'Bordo', 'Ostala'] },
  { key: 'oprema',    label: 'Oprema', type: 'multiselect', filterable: true,
    options: ['Klima (auto)', 'Navigacija', 'Kamera unazad', 'Parking senzori',
              'Bluetooth', 'Apple CarPlay/Android Auto', 'Panoramski krov',
              'Grijana sjedista', 'ABS', 'ESP', 'Cruise control', 'Alufelge',
              'Vucna kuka', 'Servis knjiga'] },
  { key: 'registrovano', label: 'Registrovano do', type: 'text' },
  { key: 'brojVlasnika', label: 'Broj vlasnika', type: 'select', filterable: true,
    options: ['1', '2', '3', '4+'] },
  { key: 'garancija',    label: 'Garancija', type: 'boolean', filterable: true },
  { key: 'zamjena',      label: 'Zamjena moguca', type: 'boolean' },
];

// The full map: category slug -> attribute fields[]
export const CATEGORY_ATTRIBUTES: Record<string, AttributeField[]> = {
  'automobili': autoAttributes,
  'motocikli': motoAttributes,       // define similarly
  'nekretnine-stanovi': stanAttributes,
  'nekretnine-kuce': kuceAttributes,
  'mobiteli': mobitelAttributes,
  'laptopi': laptopAttributes,
  // ... all categories
};
```

---

## Dynamic Form Component Pattern

```tsx
// src/components/upload/CategoryAttributeForm.tsx
'use client';
import { AttributeField, ListingAttributes } from '@/lib/attribute-types';
import { CATEGORY_ATTRIBUTES } from '@/lib/category-attributes';

interface Props {
  category: string;
  subcategory?: string;
  values: ListingAttributes;
  onChange: (key: string, value: string | number | boolean | string[]) => void;
}

export function CategoryAttributeForm({ category, subcategory, values, onChange }: Props) {
  // Find fields for this category (try subcategory first, then category)
  const key = subcategory ? `${category}-${subcategory}` : category;
  const fields = CATEGORY_ATTRIBUTES[key] ?? CATEGORY_ATTRIBUTES[category] ?? [];

  if (fields.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900">Detalji oglasa</h3>
      <div className="grid grid-cols-2 gap-4">
        {fields.map(field => (
          <AttributeFieldInput
            key={field.key}
            field={field}
            value={values[field.key]}
            onChange={(v) => onChange(field.key, v)}
          />
        ))}
      </div>
    </div>
  );
}

function AttributeFieldInput({ field, value, onChange }: {
  field: AttributeField;
  value: string | number | boolean | string[] | undefined;
  onChange: (v: string | number | boolean | string[]) => void;
}) {
  const baseClass = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  switch (field.type) {
    case 'select':
      return (
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </label>
          <select className={baseClass} value={value as string ?? ''} onChange={e => onChange(e.target.value)}>
            <option value="">Odaberi...</option>
            {field.options?.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      );

    case 'multiselect':
      const selected = (value as string[]) ?? [];
      return (
        <div className="col-span-2">
          <label className="block text-xs font-medium text-gray-700 mb-2">{field.label}</label>
          <div className="flex flex-wrap gap-2">
            {field.options?.map(o => (
              <button key={o} type="button"
                className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                  selected.includes(o)
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => onChange(selected.includes(o)
                  ? selected.filter(s => s !== o)
                  : [...selected, o]
                )}>{o}</button>
            ))}
          </div>
        </div>
      );

    case 'boolean':
      return (
        <div className="flex items-center gap-2">
          <input type="checkbox" id={field.key} checked={!!value}
            onChange={e => onChange(e.target.checked)}
            className="w-4 h-4 accent-blue-500" />
          <label htmlFor={field.key} className="text-sm text-gray-700">{field.label}</label>
        </div>
      );

    case 'number':
      return (
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            {field.label} {field.unit && <span className="text-gray-400">({field.unit})</span>}
          </label>
          <input type="number" className={baseClass}
            value={value as number ?? ''} min={field.min} max={field.max}
            placeholder={field.placeholder}
            onChange={e => onChange(parseFloat(e.target.value))} />
        </div>
      );

    case 'year':
      return (
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">{field.label}</label>
          <input type="number" className={baseClass}
            value={value as number ?? ''} min={field.min ?? 1900} max={field.max ?? new Date().getFullYear()}
            placeholder="npr. 2019"
            onChange={e => onChange(parseInt(e.target.value))} />
        </div>
      );

    default: // text
      return (
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">{field.label}</label>
          <input type="text" className={baseClass}
            value={value as string ?? ''} placeholder={field.placeholder}
            onChange={e => onChange(e.target.value)} />
        </div>
      );
  }
}
```

---

## Supabase Schema

```sql
-- Attributes stored as JSONB in the listings table
-- No schema migration needed for new attributes - just add to CATEGORY_ATTRIBUTES map

ALTER TABLE listings ADD COLUMN IF NOT EXISTS attributes JSONB DEFAULT '{}';

-- Example stored value:
-- { "vrstaVozila": "SUV/Terenac", "marka": "BMW", "model": "X5",
--   "godina": 2021, "km": 45000, "gorivo": "Diesel",
--   "oprema": ["Klima (auto)", "Navigacija", "ABS"] }

-- Index for common filterable attributes (per category)
CREATE INDEX IF NOT EXISTS idx_listings_attrs_gorivo
  ON listings ((attributes->>'gorivo'))
  WHERE category = 'automobili';

-- Generic GIN index for any JSONB key query
CREATE INDEX IF NOT EXISTS idx_listings_attrs_gin
  ON listings USING GIN (attributes);

-- Query example: find diesel SUVs under 100k km
SELECT * FROM listings
WHERE category = 'automobili'
  AND attributes->>'gorivo' = 'Diesel'
  AND attributes->>'vrstaVozila' = 'SUV/Terenac'
  AND (attributes->>'km')::int < 100000;
```

---

## Search Filter Facets Pattern

```tsx
// Build filter sidebar dynamically from filterable fields
import { CATEGORY_ATTRIBUTES } from '@/lib/category-attributes';

function CategoryFilterSidebar({ category, activeFilters, onFilterChange }) {
  const fields = CATEGORY_ATTRIBUTES[category]?.filter(f => f.filterable) ?? [];

  return (
    <div className="space-y-6">
      {fields.map(field => (
        <FilterFacet key={field.key} field={field}
          value={activeFilters[field.key]}
          onChange={v => onFilterChange(field.key, v)} />
      ))}
    </div>
  );
}

// In Supabase query - apply active attribute filters:
function buildAttributeFilters(filters: Record<string, unknown>) {
  return Object.entries(filters).reduce((query, [key, value]) => {
    if (Array.isArray(value)) {
      // multiselect: attribute must contain at least one selected value
      return query.contains('attributes', { [key]: value[0] }); // simplification
    }
    return query.eq(`attributes->>${key}`, value);
  }, supabase.from('listings').select('*'));
}
```

---

## AI Auto-fill of Attributes

Use Gemini to auto-fill category attributes from image or title. Add to `/api/ai/analyze`:

```typescript
// action: 'attributes' - new action in /api/ai/analyze/route.ts
if (action === 'attributes') {
  const { imageData, mimeType, category } = body;

  // Build the expected JSON shape from the category's attribute fields
  const fields = CATEGORY_ATTRIBUTES[category] ?? [];
  const shape = Object.fromEntries(
    fields.map(f => [f.key, f.type === 'boolean' ? false : f.type === 'number' ? 0 : ''])
  );

  const prompt = `Analiziraj ovu sliku i popuni atribute za kategoriju "${category}".
Vrati SAMO JSON u ovom tacnom formatu (preskoce ona polja koja ne mozes prepoznati):
${JSON.stringify(shape, null, 2)}

Odgovori ISKLJUCIVO na bosanskom/hrvatskom jeziku za tekstualna polja.
Vrati SAMO validan JSON.`;

  const response = await analyzeImageWithGemini(imageData, mimeType, prompt);
  const data = parseJsonResponse(response);
  return NextResponse.json({ success: true, data });
}
```

Client-side usage in upload page:
```typescript
// After image upload and AI image analysis:
const attrRes = await fetch('/api/ai/analyze', {
  method: 'POST',
  body: JSON.stringify({ action: 'attributes', imageData: base64, mimeType, category }),
});
const attrJson = await attrRes.json();
if (attrJson.success) {
  // Merge AI-suggested attributes into form state
  setAttributes(prev => ({ ...prev, ...attrJson.data }));
}
```
