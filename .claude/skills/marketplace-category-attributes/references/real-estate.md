# Nekretnine (Real Estate) - Category Attributes

## Table of Contents
1. [Stanovi (Apartments)](#stanovi)
2. [Kuce (Houses)](#kuce)
3. [Zemljiste (Land)](#zemljiste)
4. [Poslovni prostori (Commercial)](#poslovni)
5. [Garaze i parking (Garages)](#garaze)
6. [Shared fields note](#shared)

---

## Stanovi

```
Tip oglasa (tipOglasa) | select | required | filterable
  Prodaja, Iznajmljivanje, Trazim (potraznja)

Broj soba (sobe) | select | required | filterable
  Garsonjera, 1 soba, 1.5 soba, 2 sobe, 2.5 sobe, 3 sobe,
  3.5 sobe, 4 sobe, 4.5 sobe, 5+ soba

Kvadratura (kvadratura) | number | required | filterable | unit: m2
  range: 15 - 500

Sprat (sprat) | select | filterable
  Suteren, Prizemlje, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11-15, 16+, Potkrovlje

Ukupno spratova (ukupnoSpratova) | number

Godiste zgarde (godiste) | year | filterable
  range: 1900 - current year

Grijanje (grijanje) | select | required | filterable
  Centralno (gradsko), Plin, El. struja, Toplotna pumpa, Klima A/C,
  Pec na drva/ugalj, Podno grijanje, Bez grijanja

Stanje nekretnine (stanje) | select | required | filterable
  Novogradnja, Nakon renoviranja, Dobro stanje, Za renoviranje

Namjestaj (namjestaj) | select | filterable
  Nenamesteeno, Polunamjesteno, Namjesteno

Parking (parking) | select | filterable
  Bez parkinga, Ulicni parking, Parkiraliste, Garazno mjesto,
  Privatna garaza, Podzemna garaza

Lift (lift) | boolean | filterable
Balkon/Loda (balkon) | boolean | filterable
Terasa (terasa) | boolean | filterable
Podrum (podrum) | boolean
Ostava (ostava) | boolean
Internet (internet) | boolean
Kabelska TV (kabelska) | boolean
Videonadzor (kamera) | boolean
Interfon (interfon) | boolean
Klima uredaj (klima) | boolean | filterable
Certificat o energetskoj efikasnosti (energetskiCertifikat) | select
  A+, A, B, C, D, E, F, G, Nije dostupno

Grad (grad) | text | required | filterable
Opstina/Naselje (opstina) | text | filterable
Adresa (adresa) | text
```

---

## Kuce

```
Tip oglasa (tipOglasa) | select | required | filterable
  Prodaja, Iznajmljivanje, Trazim

Tip kuce (tipKuce) | select | required | filterable
  Samostalna kuca, Poludetached, Kuca u nizu, Vila, Vikendica/Ljetnikovac,
  Seoska kuca, Stambeno-poslovni objekat

Kvadratura kuce (kvadratura) | number | required | filterable | unit: m2
Kvadratura placa/okucnice (plac) | number | filterable | unit: m2

Broj soba (sobe) | select | filterable
  1-2 sobe, 3-4 sobe, 5-6 soba, 7+ soba

Broj spratova (spratovi) | select
  Prizemlje (P), P+1, P+2, P+3+

Godiste (godiste) | year | filterable
Grijanje (grijanje) | select (isti kao stanovi) | filterable
Stanje (stanje) | select (isti kao stanovi) | filterable
Namjestaj (namjestaj) | select | filterable

Garaza (garaza) | select: Bez garaze, Carport, Garaza za 1 auto, Garaza za 2+ auta
Parking (parking) | boolean | filterable
Bazen (bazen) | boolean | filterable
Vrt/Basta (vrt) | boolean | filterable
Sistem za navodnjavanje (navodnjavanje) | boolean
Solarni paneli (solarni) | boolean
Prikljucci (prikljucci) | multiselect: Voda, Struja, Plin, Kanalizacija, Telefon, Internet

Grad + Opstina (isti kao stanovi)
```

---

## Zemljiste

```
Tip oglasa (tipOglasa) | select | required | filterable
  Prodaja, Iznajmljivanje/Zakup

Tip zemljista (tipZemljista) | select | required | filterable
  Gradjevinsko, Poljoprivredno, Sume i sumsko, Industrijsko/Poslovno,
  Vikend parcela, Ostalo

Povrsina (povrsina) | number | required | filterable | unit: m2
  (also show: ha for large plots)

Namjena (namjena) | select | filterable
  Stambena gradnja, Poslovna gradnja, Industrija, Turizam/Ugostiteljtvo,
  Poljoprivreda, Mjesovita namjena

Infrastruktura (infrastruktura) | multiselect
  Voda, Struja, Plin, Kanalizacija, Pristupni put, Internet

Nagib (nagib) | select: Ravno, Blago nagnut, Strm teren
Pogled (pogled) | select: Bez posebnog pogleda, More, Rijeka, Planina, Grad

Dozvoljena spratnost (spratnost) | text (e.g. "P+2")
Procenat izgradnje (procenatIzgradnje) | number | unit: %
Regulacioni plan (regulacioniPlan) | boolean

Grad + Opstina (isti kao stanovi)
```

---

## Poslovni prostori

```
Tip oglasa (tipOglasa) | select | required | filterable
  Prodaja, Iznajmljivanje

Tip prostora (tipProstora) | select | required | filterable
  Kancelarija, Lokal/Prodavnica, Restoran/Kafic, Skladiste/Magacin,
  Salon/Ordinacija, Industrijska hala, Hotel/Pansion, Benzinska stanica, Ostalo

Kvadratura (kvadratura) | number | required | filterable | unit: m2
Sprat (sprat) | select (isti kao stanovi) | filterable

Namjestaj/Opremljenost (namjestaj) | select
  Prazno, Djelimicno opremljeno, Potpuno opremljeno

Parking (parking) | select: Bez, Ulicni, Vlastiti, Podzemni
Klima (klima) | boolean
Lift (lift) | boolean
Ramp za dostavu (rampa) | boolean (za skladista)
Visina prostora (visina) | number | unit: m (za skladista/hale)

Grad + Opstina (isti kao stanovi)
```

---

## Garaze i parking

```
Tip (tipGaraze) | select | required
  Zatvorena garaza, Carport (natkriveno), Parking mjesto (otvoreno),
  Podzemno parkiraliste

Povrsina (povrsina) | number | unit: m2
Visina (visina) | number | unit: m
Broj mjesta (mjesta) | number
Videonadzor (kamera) | boolean
Automatska kapija (kapija) | boolean
Grad + Opstina (isti kao stanovi)
```

---

## Shared Notes

- **Cijena za nekretnine**: uvijek navesti je li cijena fiksna ili je moguce pregovaranje
- **Iznajmljivanje**: dodati polje za period (dnevno/mjescno/godisnje) i polozeni depozit
- **Komunalije**: boolean - da li su ukljucene u cijenu najma
- **Geokoordinatate**: za mapski prikaz - latitude/longitude (optional, added via map picker in UI)
