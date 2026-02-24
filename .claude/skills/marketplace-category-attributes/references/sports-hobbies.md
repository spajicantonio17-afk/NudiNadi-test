# Sport i hobi (Sports & Hobbies) - Category Attributes

## Table of Contents
1. [Bicikli (Bicycles)](#bicikli)
2. [Sportska oprema (Sports Equipment)](#sport)
3. [Muzicki instrumenti (Music)](#muzika)
4. [Knjige, casopisi, stripovi](#knjige)
5. [Igracke i igre (Toys & Games)](#igracke)
6. [Kolekcionarstvo (Collectibles)](#kolekcije)
7. [Bebe i djeca - oprema](#bebe)

---

## Bicikli

```
Tip bicikla (tipBicikla) | select | required | filterable
  Planinski (MTB), Cestovni (Road), Gradski (City/Trekking),
  Elektricni (E-bike), Sosa/Fixie, BMX, Djeciji, Folding (sklopivi),
  Fat bike, Cargo bike, Gravel, Ostalo

Marka (marka) | text | required | filterable
  [Trek, Specialized, Giant, Cannondale, Scott, Cube, Merida,
   Ghost, Canyon, Focus, KTM, Haibike, Bulls, ...]

Model (model) | text
Velicina okvira (velicinaOkvira) | select | required | filterable
  XS (13-14"), S (15-16"), M (17-18"), L (19-20"), XL (21-22"), XXL (23"+)
  [also: 26", 27.5", 29" za MTB - velicina tocka]

Velicina tocka (velicina) | select | filterable
  16", 20", 24", 26", 27.5" (650b), 28" / 700c, 29"

Broj brzina (brzine) | select | filterable
  1 (fixie/singlespeed), 3, 6, 7, 8, 9, 10, 11, 12, 13+

Tip mjenjaca (mjenjac) | select
  Bez (singlespeed), Shimano Altus/Acera/Alivio/Deore/SLX/XT/XTR,
  SRAM NX/GX/X01/XX1, Campagnolo

Materijal okvira (materijal) | select | filterable
  Cvor/Celicni, Aluminij, Karbonska vlakna (Carbon), Titan

Tip kocnica (kocnice) | select | filterable
  V-brake (zicane), Disc (mehanicke), Disc (hidraulicke), Cantilever

Tip viljuske (viljuska) | select
  Kruta (rigid), Suspenzija (am./ulje), Suspenzija (koracnasta)

Hod suspenzije (hod) | number | unit: mm (za MTB s amortizerom)

Elektricni - Motor (motor) | select (samo za E-bike)
  Sredisnji (Bosch, Shimano Steps, Bafang), Hub motor (prednji/zadnji)

Elektricni - Baterija (baterija) | number | unit: Wh (za E-bike)
  250Wh, 400Wh, 500Wh, 625Wh, 750Wh, 900Wh+

Elektricni - Domet (domet) | number | unit: km (za E-bike)

Stanje (stanje) | select | required | filterable
  Novo (neraspakovano), Kao novo, Dobro, Prihvatljivo, Za servise/dijelove

Godiste (godina) | year | filterable
```

---

## Sportska oprema

```
Sport/Kategorija (sport) | select | required | filterable
  Fitnes i teretana, Trcanje i atletika, Plivanje i vodni sportovi,
  Fudbal, Kosarka, Odbojka, Tenis i badminton, Stoni tenis,
  Planinarenje i trekking, Ski i zimski sportovi, Snowboard,
  Borilacke vjestine i boks, Golf, Biciklizam (oprema i odjeca),
  Ribolov, Lov i ribolov, Roleri i skejtbord, Ples i aerobik,
  Jahanje i konjicki sport, Ostalo

Velicina (velicina) | text | filterable (e.g. "L", "42", "26 inch")
Marka (marka) | text | filterable
Stanje (stanje) | select | required | filterable
  Novo, Kao novo, Dobro, Prihvatljivo

--- Specificno za skije ---
Duzina skija (duzina) | number | unit: cm
Tip skija (tipSkija) | select: Carving, All-mountain, Freeride, Touring/Backcountry, Slalom/GS
Stezaljke ukljucene (stezaljke) | boolean
Velicina cizama (velicinaSkiCizme) | number | unit: Mondopoint

--- Specificno za tenis ---
Grip velicina (grip) | select: L0, L1, L2, L3, L4, L5
Tezina reketa (tezina) | number | unit: g
Baterija (napeta) | boolean

--- Specificno za fitnes ---
Maksimalna tezina korisnika (maxTezina) | number | unit: kg
Tezina tegova (tezinaTegova) | number | unit: kg (za utege/dumbbelle)
```

---

## Muzicki instrumenti

```
Tip instrumenta (tipInstrumenta) | select | required | filterable
  Gitara (akusticna), Gitara (elektricna), Bas gitara, Klasicna gitara,
  Električna gitara (poluakusticna), Klavir i klavijature (akustick),
  Digitalni klavir i sintesajzer, Bubnjevi (akusticki), Elektronski bubnjevi,
  Ukulele, Violina, Viola, Cello, Kontrabas, Flauta i truba,
  Harmonika, Djembe i rucni bubnjevi, DJ oprema i mixeri,
  Studio i snimanje oprema, Pojacalo (gitara), Pojacalo (bas), Ostalo

Marka (marka) | text | filterable
  [Fender, Gibson, Yamaha, Roland, Korg, Ibanez, Taylor, Martin,
   Squier, Epiphone, PRS, ESP, Jackson, ...]

Model (model) | text
Broj zica (zice) | select: 4, 6, 7, 8, 12 (za gitare/bas)
Velicina (velicinaInstr) | select (za gitare): 1/4, 1/2, 3/4, 4/4 (full)
Broj kljeva/oktava (oktave) | number (za klavire i sintesajzere)

Stanje (stanje) | select | required | filterable
  Novo, Kao novo, Dobro, Prihvatljivo, Za popravak

Hardcase/torba ukljucena (case) | boolean
Serijska oznaka (serijski) | text
```

---

## Knjige, casopisi, stripovi

```
Tip (tipKnjige) | select | required | filterable
  Beletristika/Roman, Strucna literatura, Udzbenik/Skolska knjiga,
  Djecija knjiga, Strip/Manga, Casopis, Enciklopedija/Rjecnik,
  Kuharica, Biografija, Putopis, Religijska literatura, Ostalo

Naslov (naslov) | text | required
Autor (autor) | text | required
Izdavac (izdavac) | text
Godina izdanja (godinaIzdanja) | year
Jezik (jezik) | select | filterable
  Bosanski/Hrvatski/Srpski, Engleski, Njemacki, Turski, Ostali

ISBN (isbn) | text
Povez (povez) | select: Tvrdi, Meki, Spiralni
Stanje (stanje) | select | required | filterable
  Novo, Kao novo (bez podvlacenja), Dobro, Prihvatljivo

Kolicina u setu (kolicina) | number (za setove knjiga/casopisa)
```

---

## Igracke i igre

```
Tip (tipIgracke) | select | required | filterable
  Igracke za bebe (0-2g), Edukativne igracke, Akcijske figure,
  Lutke i dodaci, LEGO i konstruktori, Automobili i vozila (igracke),
  Plisane igracke, Igre na tabli (drustvene igre), Kartane igre,
  Puzzles, Igracke na daljinsko upravljanje, Sportske igracke (djeca),
  Kreativne igracke (boje, glina), Video igre (vidi Gaming), Ostalo

Uzrast (uzrast) | select | filterable
  0-12 mj, 1-3 g, 3-5 g, 5-8 g, 8-12 g, 12+ g, Za odrasle

Marka (marka) | text | filterable
  [LEGO, Barbie, Hot Wheels, Playmobil, Fisher-Price, Chicco, ...]

Stanje (stanje) | select | required | filterable
  Novo (neraspakovano), Kao novo (kompletno), Dobro, Prihvatljivo, Nekompletno

Kompletno (kompletno) | boolean (svi dijelovi/karte)
Baterije potrebne (baterije) | boolean
```

---

## Kolekcionarstvo

```
Tip (tipKolekcije) | select | required | filterable
  Novac i novcici, Postanske marke, Stare razglednice i fotografije,
  Vinilne ploce, Kasete (audio/video), Stare knjige i casopisi,
  Antikviteti i antika, Vojne predmete i medalje, Sportske karte,
  Filmske i muzicke uspomene, Akcijske figure (kolekcionarske),
  Satovi (antikvni), Oslikan porculan, Ostalo

Period/Era (period) | text | filterable (e.g. "1800s", "SFRJ", "WW2", "1970s")
Zemlja porijekla (zemlja) | text
Stanje (stanje) | select | required | filterable
  Mint (nekoristen), Excellent (odlican), Very Good (sehr gut), Good (dobro), Fair (prihvatljivo)

Autentičnost (autenticnost) | select
  Originalno (s certifikatom), Originalno (bez certifikata), Replika

Certifikat/Ocjena (certifikat) | text (e.g. "NGC MS64", "PSA 9")
Kolicina (kolicina) | number (ako se prodaje vise primjeraka/set)
```

---

## Bebe i djeca - oprema

```
Tip (tipBebeOprema) | select | required | filterable
  Kolica i bugaboo, Auto sjediste, Nosiljka/Baby carrier,
  Djeciji krevet i krevetac, Djecija stolica za hranjenje,
  Sjediste za bicikl (djecije), Igraliste i sobni tobogan,
  Kade za bebe, Njega i higijena, Boca i dude, Monitor za bebe, Ostalo

Uzrast/Tezinska kategorija (uzrastBeba) | select | filterable
  0-6 mj, 0-13 kg, 9-18 kg, 15-36 kg, Universalni (od rodjenja do 36kg)

Marka (marka) | text | filterable
  [Bugaboo, Cybex, Maxi-Cosi, Joie, Graco, Chicco, Hauck, Thule, Nuna, ...]

Stanje (stanje) | select | required | filterable
  Kao novo, Dobro, Prihvatljivo

Servis/Datum isteka (datum) | text (za auto sjedista - istice poslije nesrece/datuma)
```
