# Dom i vrt (Home & Garden) - Category Attributes

## Table of Contents
1. [Namjestaj (Furniture)](#namjestaj)
2. [Kucanski aparati (Appliances)](#kucanski)
3. [Alati i masine (Tools)](#alati)
4. [Basta i dvoriste (Garden)](#basta)
5. [Dekoracija i uredenje (Decor)](#dekoracija)
6. [Gradevinski materijal (Construction)](#gradnja)
7. [Sanitarije i kupatilo (Bathroom)](#sanitarije)

---

## Namjestaj

```
Tip namjestaja (tipNamjestaja) | select | required | filterable
  Kauci i sofe, Fotelje, Kreveti, Ormar i garderoberi, Komode i vitrine,
  Trpezarijski stolovi, Trpezarijske stolice, Radni stolovi, Kuhinjski elementi,
  Police i regali, TV komoda, Stocici za kafu, Madraci, Djeciji namjestaj,
  Kuhinja (komplet), Dnevna soba (komplet), Spavaca soba (komplet), Ostalo

Dimenzije (dimenzije) | text | required
  Format: "SxVxD" ili "Duzina x Visina x Dubina" u cm
  Primjer: "220 x 85 x 95 cm"

Materijal (materijal) | select | filterable
  Masivno drvo (hrast, bor, orah, bukva), Iverica (MDF/chipboard),
  Furnir, Metal, Staklo, Plastika, Ratanska pletina, Kombinovano

Boja/Finish (boja) | select | filterable
  Bijela, Crna, Siva, Smeda/Orah, Beige/Krem, Bor/Prirodna,
  Tamno siva (antracit), Hrast sonoma, Ostala

Stil (stil) | select
  Moderni, Skandinavski, Klasicni/Tradicinalni, Industrijalni,
  Rusticni, Minimalisticki, Provensal, Ostalo

Stanje (stanje) | select | required | filterable
  Novo (neraspakovano), Kao novo, Dobro, Prihvatljivo, Za renoviranje

Broj komada u kompletu (komadi) | number (ako je komplet)
Sklopivo (sklopivo) | boolean (za stolove i stolice)
```

### Kreveti specificno
```
Velicina (velicinaKreveta) | select | required | filterable
  Jednokrvetni (90x200), Polubracni (120x200), Bracni (140x200),
  Bracni (160x200), King size (180x200), Super King (200x200)

Mehanizam (mehanizamKreveta) | select
  Standardni (bez sanduka), S ladicom za posteljinu, Tapacirani, Box spring, Rasklopivi

Madrac ukljucen (madracUkljucen) | boolean
```

### Madraci specificno
```
Velicina (velicinaM) | select (ista kao kreveti) | filterable
Tip (tipMadraca) | select | filterable
  Spiralni, Pjena (memory foam), Latex, Hibridni, Viskozna pjena
Tvrdoca (tvrdoca) | select: Mekani, Srednje tvrdi, Tvrdi
Visina (visinaMadraca) | number | unit: cm
```

---

## Kucanski aparati

```
Tip aparata (tipAparat) | select | required | filterable
  Veš masina, Masina za sudove, Susilica, Frizider, Zamrzivac,
  Stednjak (kombinirani), Rerna (ugradna), Ploča za kuhanje (indukcija/plin/el.),
  Mikrovalka, Aspirator (kuhinja), Perilica/Sušilica (kombi),
  Klima uredaj (split), Grijaci (radijatori, pec, toplovazdušna), Ostalo

Marka (marka) | select | filterable
  Gorenje, Bosch, Siemens, AEG, Electrolux, Whirlpool, Candy, Beko,
  Samsung, LG, Indesit, Ariston, Hisense, Zanussi, Ostalo

Model (model) | text
Energetska klasa (energetska) | select | filterable: A+++, A++, A+, A, B, C, D
Boja (boja) | select: Bijela, Crna, Inox, Siva, Ostala

Kapacitet (kapacitet) | number | unit: kg ili L
  Za ves masine: kg | Za frizidere: L

Godiste (godina) | year | filterable
Stanje (stanje) | select | required | filterable
  Novo (neraspakovano), Kao novo, Dobro (ispravno), Prihvatljivo, Neispravno (za dijelove)

Racun i garancija (garancija) | boolean | filterable
Dimenzije (dimenzije) | text (W x H x D cm)

--- Specificno za klime ---
Snaga (snagaKlime) | select: 9000 BTU, 12000 BTU, 18000 BTU, 24000 BTU, 36000 BTU
Inverter (inverter) | boolean | filterable
WiFi kontrola (wifiKlima) | boolean
```

---

## Alati i masine

```
Tip alata (tipAlata) | select | required | filterable
  Elektricni alati (akumulatorski), Elektricni alati (mrežni),
  Rucni alati (cekici, kljucevi, odvijaci), Mjerni instrumenti,
  Vrtni alati i masine, Kompresori i pumpe, Varenje i lemljenje,
  Elektricni generatori, Motorne pile i kosilice, Skele i ljestve,
  Gradevinski alati, Ostalo

Marka (marka) | text | filterable
  [Bosch, Makita, DeWalt, Milwaukee, Festool, Metabo, Ryobi, Black+Decker, ...]

Model (model) | text
Napon (napon) | select: 12V, 18V, 20V, 36V, 230V, 400V (za elektricne)
Snaga (snagaW) | number | unit: W
Stanje (stanje) | select | required | filterable
  Novo (neraspakovano), Kao novo, Dobro (ispravno), Prihvatljivo, Neispravno

Set/Komplet (komplet) | boolean
Baterija ukljucena (baterija) | boolean (za akumulatorske)
```

---

## Basta i dvoriste

```
Tip (tipBasta) | select | required | filterable
  Kosilica za travu (rucna), Kosilica za travu (motorna), Robot kosilica,
  Trimer/Strimmer, Puhac lisca, Motorna pila, Vrtna pumpa,
  Basta namjestaj (komplet), Basta stolice/stolovi, Vrtni sun sator/Tenda,
  Roštilj (ugalj), Roštilj (plin), Vrtna dekoracija, Cvijece i sadnice,
  Lonci i saksije, Folija i vrtne mreze, Ostalo

Marka (marka) | text
Snaga (snaga) | select: Rucni/Bez motora, Elektricni (kabel), Akumulatorski, Benzin, Diesel
Sirina kosnje (sirinaKosnje) | number | unit: cm (za kosilice)
Zapremina motora (zapreminaMotora) | number | unit: cm3 (za benzin)
Materijal namjestaja | select: Ratanska pletina, Aluminij, Celicni okvir, Polirottan, Drvo, Ostalo
Stanje (stanje) | select | required | filterable
Sezona (sezona) | select: Proljece/Ljeto, Jesen/Zima, Cjelogodisnji
```

---

## Dekoracija i uredenje

```
Tip (tipDeko) | select | required | filterable
  Slike i fotografije, Zrcala i oglindala, Vaze i posude, Svijecnjaci i svjece,
  Sat za zid, Tepisi i prostirke, Zavjese i rolete, Jastuci i dekorativni tekstil,
  Rasvjeta (lusteri, lampe, trakaste), Okvirovi za slike, Figurice i skulpture,
  Biljke i cvijece (ukrasno), Ostalo

Dimenzije (dimenzije) | text
Stil (stil) | select: Moderni, Klasicni, Skandinavski, Boho, Industrijalni, Ostalo
Boja (boja) | multiselect
Materijal (materijal) | text
Stanje (stanje) | select | required | filterable
```

---

## Gradevinski materijal

```
Tip (tipGrad) | select | required | filterable
  Cigla i blokovi, Beton i malter, Keramika i plocice, Parket i laminat,
  Gips i knauf, Izolacioni materijali, Stolarija (prozori i vrata),
  Krovni materijali, Fasadni materijali, Boja i lak, Ljepila i silikoni,
  Sanitarije (vidi dolje), Instalacijski materijal (vodoinstalacije, struja), Ostalo

Kolicina (kolicina) | number | required
Jedinica mjere (jedinica) | select: m2, m3, kom, kg, paket, kutija, paleta
Marka/Proizvod (marka) | text
Dimenzije (dimenzije) | text (e.g. "60x60cm", "10x25x12 cm")
Boja (boja) | text
Stanje (stanje) | select: Novo, Kao novo, Poluupotrebljeno, Ostatak od gradnje
```

---

## Sanitarije i kupatilo

```
Tip (tipSan) | select | required | filterable
  Kade, Tus kabine, Umivaonici, Wc solje i bide, Slavine i tusevi,
  Ogledala za kupatilo, Kupatilski namjestaj, Bojleri (el./plin),
  Radijatori i cijevni grijaci, Ostalo

Marka (marka) | text | filterable
  [Grohe, Hansgrohe, Villeroy&Boch, Geberit, Ideal Standard, ...]

Dimenzije (dimenzije) | text
Boja (boja) | select: Bijela, Krem, Antracit, Crna, Inox, Ostala
Stanje (stanje) | select | required | filterable
  Novo (neraspakovano), Kao novo, Dobro (ispravno), Prihvatljivo
```
