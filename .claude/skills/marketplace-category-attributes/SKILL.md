---
name: marketplace-category-attributes
description: "Complete category-specific attribute system for local/second-hand marketplaces (NudiNadi, OLX-style). Use when building or extending dynamic listing forms, category filters, search facets, or attribute schemas. Covers all major categories with their unique specs: vehicles (car type, HP, fuel, km), electronics (GB, RAM, screen), real estate (sqm, rooms, floor), bikes (frame, gears), fashion (size, brand), furniture (dimensions, material), pets, jobs, services. Triggers on: Kategorie-Attribute, Merkmale pro Kategorie, dynamisches Formular, Filterstruktur, Attribute fuer Autos/Handys/Wohnungen/Fahrrad, category schema, listing attributes, Beschreibungsmerkmale, Spezifikationen."
---

# Marketplace Category Attributes

## What This Skill Covers

Every marketplace category has unique attributes used in listing forms, search filters, and detail pages. This skill provides the complete attribute schema for each category group.

## Attribute Structure

Each attribute has these fields:
```typescript
{
  key: string           // DB field name, camelCase
  label: string         // UI label (Bosnian/Croatian)
  type: 'text' | 'number' | 'select' | 'multiselect' | 'boolean' | 'range' | 'year'
  options?: string[]    // for select/multiselect
  unit?: string         // km, kW, m2, GB, etc.
  required?: boolean    // show in main form
  filterable?: boolean  // available as search filter
}
```

## Reference Files by Category Group

Load only the file relevant to the category being worked on:

| Category Group | File | Covers |
|---|---|---|
| Vozila (Vehicles) | [references/vehicles.md](references/vehicles.md) | Autos, Motori, Kamioni, Dijelovi, Plovila |
| Elektronika | [references/electronics.md](references/electronics.md) | Mobiteli, Laptopi, TV, Gaming, Audio, Bijela tehnika |
| Nekretnine | [references/real-estate.md](references/real-estate.md) | Stanovi, Kuce, Zemljiste, Poslovni prostori |
| Moda | [references/fashion.md](references/fashion.md) | Odjeca, Obuca, Torbe, Nakit, Satovi |
| Dom i vrt | [references/home-garden.md](references/home-garden.md) | Namjestaj, Kucanski aparati, Alati, Basta |
| Sport i hobi | [references/sports-hobbies.md](references/sports-hobbies.md) | Bicikli, Sport, Muzika, Knjige, Igracke, Kolekcionarstvo |
| Zivotinje, Poslovi, Usluge | [references/animals-services.md](references/animals-services.md) | Ljubimci, Stoka, Poslovi, Usluge, Obrazovanje |

For TypeScript types, Supabase schema, and dynamic form implementation:
- [references/implementation.md](references/implementation.md)

## Workflow

### Adding attributes to a new category
1. Read the relevant reference file for the category group
2. Pick the attributes that apply
3. Implement using the dynamic form pattern in `references/implementation.md`

### Building search filters for a category
1. Read the reference file - `filterable: true` attributes become filter facets
2. Follow the filter component pattern in `references/implementation.md`

### AI auto-fill of attributes
Gemini can auto-fill attributes from image or title. See `references/implementation.md` for the prompt pattern.

## NudiNadi-Specific Notes

- App uses `src/lib/constants.ts` for CATEGORIES - attributes extend this
- Upload page (`src/app/upload/page.tsx`) renders dynamic fields based on category
- Attributes stored as JSONB in Supabase `listings.attributes` column
- Labels in Bosnian/Croatian (not German/English)
- Currency: KM (Konvertibilna marka) as primary, EUR secondary
