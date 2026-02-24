# Moda (Fashion) - Category Attributes

## Table of Contents
1. [Odjeca (Clothing)](#odjeca)
2. [Obuca (Footwear)](#obuca)
3. [Torbe i ruksaci (Bags)](#torbe)
4. [Nakit i satovi (Jewelry & Watches)](#nakit)
5. [Bebe i djeca - odjeca](#djeca)

---

## Odjeca

```
Tip odjece (tipOdjece) | select | required | filterable
  Majice i polo, Kosulje i bluze, Duksevi i hoodie, Jakne i kaputi,
  Zimske jakne i puferi, Pantalone i farmerke, Suknje, Haljine i kombinezon,
  Odijela i saka, Sportska odjeca, Donje rublje i pizame,
  Kupaci kostimi, Tradicinalna odjeca (nosnja), Ostalo

Velicina (velicina) | select | required | filterable
  --- Standardne ---
  XS (34-36), S (36-38), M (38-40), L (40-42), XL (42-44),
  XXL (44-46), XXXL (46-48), 4XL+
  --- Numericke (za hlace) ---
  26, 27, 28, 29, 30, 31, 32, 33, 34, 36, 38, 40, 42, 44

Spol/Ciljana skupina (spol) | select | required | filterable
  Zensko, Musko, Unisex

Marka (marka) | text | filterable
  [free text + autocomplete: Zara, H&M, Nike, Adidas, Puma, Levi's,
   Tommy Hilfiger, Calvin Klein, Boss, Guess, Armani, Versace,
   Pull&Bear, Mango, Reserved, Only, Vero Moda, ...]

Boja (boja) | multiselect | filterable
  Bijela, Crna, Siva, Plava, Tamnoplava, Crvena, Zelena, Zuta,
  Narandzasta, Roze, Ljubicasta, Smeda, Bordo, Kaki, Bez, Sarena/Print

Materijal (materijal) | multiselect | filterable
  Pamuk, Poliester, Viskoza, Svila, Vuna, Lan, Denim, Kozna,
  Sinteticka kozna, Spandex/Elastan, Modal, Bamboo, Mikrofibra

Sezona (sezona) | select | filterable
  Proljece/Ljeto, Jesen/Zima, Sve sezone

Stanje (stanje) | select | required | filterable
  Novo s etiketom, Novo bez etikete, Kao novo, Dobro, Prihvatljivo

Vrsta zatvaraca (zatvarac) | select
  Bez zatvaraca, Zip, Dugmad, Vezice, Kopce

Bez (bez) | boolean (da li je bez rukava)
```

---

## Obuca

```
Tip obuce (tipObuce) | select | required | filterable
  Patike/Tenisice, Cipele (formalne), Cizme, Gležnjace, Sandale,
  Japanke/Natikace, Mocasine/Slip-on, Papuce (zatvorene), Papuce (otvorene),
  Radna obuca, Zimske cizme, Sportske cizme, Djecija obuca

Velicina (velicina) | select | required | filterable
  --- EU ---
  35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48+
  --- UK/US (napomenuti sistem) ---

Spol (spol) | select | required | filterable
  Zensko, Musko, Unisex, Djecije

Marka (marka) | text | filterable
  [Nike, Adidas, Puma, New Balance, Converse, Vans, Timberland,
   Dr. Martens, Birkenstock, Skechers, Geox, Ecco, Clarks, ...]

Boja (boja) | multiselect | filterable
Materijal (materijal) | select: Koža, Sinteticka koza, Tekstil, Guma, Kombinovano
Visina pete (visina) | select: Bez pete (ravna), Niska (<3cm), Srednja (3-7cm), Visoka (>7cm), Platforma

Stanje (stanje) | select | required | filterable
  Novo s kutijom, Novo bez kutije, Kao novo, Dobro, Prihvatljivo
```

---

## Torbe i ruksaci

```
Tip torbe (tipTorbe) | select | required | filterable
  Ruksak (Backpack), Torba (Handbag/Tote), Clutch/Pismo torba,
  Crossbody/Messenger, Kofer/Putna torba, Sportska torba,
  Laptop torba, Torbica za kaiš (Fanny pack), Skolska torba, Ostalo

Marka (marka) | text | filterable
  [Louis Vuitton, Gucci, Prada, Michael Kors, Coach, Longchamp,
   Furla, Calvin Klein, Tommy Hilfiger, Nike, Adidas, Eastpak,
   Samsonite, Rimowa, ...]

Materijal (materijal) | select | filterable
  Koza (prirodna), Sinteticka koza (PU), Tekstil/Canvas, Najlon,
  Platno, Ratan/Pletivo, Ostalo

Boja (boja) | multiselect | filterable
Dimenzije (dimenzije) | text (e.g. "30 x 40 x 15 cm")
Volumen (volumen) | number | unit: L (za ruksake)
Laptop pretinac (laptopPretinac) | boolean (za ruksake i laptop torbe)

Stanje (stanje) | select | required | filterable
  Novo s etiketom, Kao novo, Dobro, Prihvatljivo, Vidljivi tragovi

Autentičnost (autenticnost) | select
  Original (s dokumentacijom), Original (bez dokumentacije), Replika/Kopija
```

---

## Nakit i satovi

### Nakit
```
Tip nakita (tipNakita) | select | required | filterable
  Ogrlica, Narukvica, Prsten, Mindjuse/Nausnice,
  Broš, Privjesak, Komplet nakita, Piercing, Ostalo

Materijal (materijal) | select | required | filterable
  Zlato (14K), Zlato (18K), Zlato (24K), Bijelo zlato,
  Roze zlato, Srebro (925), Titanium, Nehrdjajuci celik,
  Pozlata, Platina, Kunstoff/Pleksiglas, Ostalo

Kamen/Gem (kamen) | select
  Bez kamena, Dijamant, Cirkon, Rubin, Safir, Smaragd, Biser,
  Topaz, Akvamarin, Ostalo

Velicina prstena (velicinaP) | select (za prstenje)
  46, 48, 50, 52, 54, 56, 58, 60, 62 (mm opseg)

Stanje (stanje) | select | required
  Novo, Kao novo, Dobro, Prihvatljivo
Tezina (tezina) | number | unit: g
```

### Satovi
```
Tip sata (tipSata) | select | required | filterable
  Muski sat, Zenski sat, Unisex, Smartwatch/Pametni sat, Dzepni sat

Marka (marka) | text | required | filterable
  [Rolex, Omega, Tag Heuer, Seiko, Casio, Citizen, Tissot,
   Hamilton, Longines, Fossil, Swatch, Apple, Samsung, Garmin,
   Fitbit, Xiaomi Mi Band, ...]

Model (model) | text
Mehanizam (mehanizam) | select | filterable
  Kvarc (baterija), Automatski, Manuelno navijanje, Solar, Smartwatch

Materijal kucista (kuciste) | select
  Nehrdjajuci celik, Titan, Keramika, Plastic, Zlato, Pozlata

Materijal narukvice (narukvica) | select
  Koza, Nehrdjajuci celik, Guma/Silikon, Platno, Titan

Velicina kucista (velicinaKucista) | number | unit: mm
Vodootpornost (vodootporan) | number | unit: ATM / bar
Stanje (stanje) | select | required | filterable
  Novo s dokumentima, Kao novo, Dobro, Prihvatljivo
Originalna kutija i dokumenti (original) | boolean
```

---

## Bebe i djeca - odjeca

```
Tip (tipDjecije) | select | required | filterable
  Odjeca za bebe, Odjeca za djecu, Obuca za djecu, Zimska odjeca,
  Sportska odjeca za djecu, Skolska uniforma, Plivacki/Kupaci

Velicina/Uzrast (velicina) | select | required | filterable
  Novorodjenče (50-56), 0-3 mj (62), 3-6 mj (68), 6-9 mj (74),
  9-12 mj (80), 12-18 mj (86), 18-24 mj (92), 2-3 g (98),
  3-4 g (104), 4-5 g (110), 5-6 g (116), 6-7 g (122),
  7-8 g (128), 8-9 g (134), 9-10 g (140), 10-11 g (146),
  11-12 g (152), 12-14 g (158), 14-16 g (164)

Spol (spol) | select | filterable: Djecacki, Djevojacki, Unisex
Marka (marka) | text | filterable
  [Zara Kids, H&M Kids, Next, Mango Kids, Nike Kids, Adidas, Lupilu, ...]

Stanje (stanje) | select | required | filterable
  Novo s etiketom, Kao novo, Dobro, Prihvatljivo
```
