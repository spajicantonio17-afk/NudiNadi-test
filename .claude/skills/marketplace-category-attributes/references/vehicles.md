# Vozila (Vehicles) - Category Attributes

## Table of Contents
1. [Automobili (Cars)](#automobili)
2. [Motocikli (Motorcycles)](#motocikli)
3. [Kamioni i kombiji (Trucks & Vans)](#kamioni)
4. [Prikolice i kamperi (Trailers & Campers)](#prikolice)
5. [Plovila (Boats & Watercraft)](#plovila)
6. [Auto dijelovi i oprema (Parts & Accessories)](#dijelovi)

---

## Automobili

```
Tip vozila (vrstaVozila) | select | required | filterable
  Limuzina, Karavan/Karavan, SUV/Terenac, Hatchback, Coupe, Kabriolet,
  Pickup, Minivan/MPV, Kamp vozilo, Ostalo

Marka (marka) | text | required | filterable
  [free text + autocomplete: VW, BMW, Mercedes, Audi, Toyota, Ford, Opel,
   Renault, Peugeot, Fiat, Skoda, Honda, Mazda, Hyundai, Kia, Seat,
   Citroen, Nissan, Suzuki, Dacia, Volvo, Jeep, Land Rover, Porsche, ...]

Model (model) | text | required | filterable
  [free text, depends on brand]

Godiste (godina) | year | required | filterable
  range: 1980 - current year

Kilometraza (km) | number | required | filterable | unit: km
  range: 0 - 999999

Motor - zapremina (zapremina) | number | filterable | unit: cm3
  range: 600 - 8000

Motor - snaga (snagaKw) | number | filterable | unit: kW
  [also show hp: kW x 1.36]

Gorivo (gorivo) | select | required | filterable
  Benzin, Diesel, Plin (LPG), Hibrid (Benzin/Elektro), Hibrid (Diesel/Elektro),
  Plug-in Hibrid, Elektricno, CNG (Metan), Vodikov pogon

Mjenjac (mjenjac) | select | filterable
  Manuelni, Automatski, Poluautomatski (DSG/CVT)

Pogon (pogon) | select | filterable
  Prednji (FWD), Zadnji (RWD), 4x4 stalni, 4x4 na zahtjev

Broj vrata (brojVrata) | select | filterable
  2, 3, 4, 5

Boja (boja) | select | filterable
  Bijela, Crna, Siva, Srebrna, Crvena, Plava, Zelena, Zuta,
  Narandzasta, Smeda, Zlatna, Ljubicasta, Bordo, Bez, Ostala

Stanje (stanje) | select | required | filterable
  Novo, Kao novo, Dobro, Prihvatljivo, Za dijelove/Neispravno

Oprema (oprema) | multiselect | filterable
  Klima (manualna), Klima (automatska), Navigacija, Kamera za voznju unazad,
  Parking senzori (prednji), Parking senzori (zadnji), Bluetooth,
  USB/AUX, Apple CarPlay/Android Auto, Panoramski krov, Sunroof,
  Koyana/alcantara sjedista, Grijana sjedista, Grijani volan, Servis knjiga,
  Airbag (prednji), Airbag (bocni), ABS, ESP, Cruise control,
  Adaptivni tempomat, Lane assist, Xenon/LED farovi, Alufelge,
  Zimske gume, Komplet alata, Vucna kuka, Panorama kamera 360°

Broj vlasnika (brojVlasnika) | select | filterable
  1, 2, 3, 4+

Uvozeno (uvozeno) | boolean | filterable
Servisna knjiga (servisnaKnjiga) | boolean | filterable
Registrovano do (registrovano) | text (month/year)
Garancija (garancija) | boolean | filterable
Zamjena moguca (zamjena) | boolean
```

---

## Motocikli

```
Tip (tipMoto) | select | required | filterable
  Sportski, Naked/Streetfighter, Touring/Adventure, Cruiser/Chopper,
  Enduro/Cross, Scooter, Moped, Quad/ATV, Ostalo

Marka (marka) | text | required | filterable
  [Honda, Yamaha, Kawasaki, Suzuki, BMW, KTM, Ducati, Harley-Davidson,
   Triumph, Husqvarna, Royal Enfield, Aprilia, ...]

Model (model) | text | required
Godiste (godina) | year | required | filterable
Kilometraza (km) | number | required | filterable | unit: km
Zapremina (zapremina) | number | filterable | unit: cm3
Snaga (snagaKw) | number | filterable | unit: kW
Gorivo (gorivo) | select: Benzin, Elektricno
Boja (boja) | text | filterable
Vozacka kategorija (kategorija) | select: A, A1, A2, B (za quad)
Registrovano (registrovano) | boolean | filterable
Stanje (stanje) | select: Novo, Kao novo, Dobro, Prihvatljivo, Za dijelove
```

---

## Kamioni i kombiji

```
Tip (tipKamion) | select | required | filterable
  Kombi putnicki, Kombi teretni, Mali kamion (<3.5t), Srednji kamion,
  Teski kamion, Tegljac, Hladnjaca, Cisterna, Kiper, Ostalo

Marka + Model | text | required
Godiste (godina) | year | required | filterable
Kilometraza (km) | number | required | filterable | unit: km
Nosivost (nosivost) | number | filterable | unit: kg
Zapremina prostora (zapremina) | number | unit: m3
Gorivo (gorivo) | select: Diesel, Benzin, Plin, Elektricno
Mjenjac (mjenjac) | select: Manuelni, Automatski
Broj osovina (osovine) | select: 2, 3, 4+
Euro norma (euroNorma) | select: Euro 3, Euro 4, Euro 5, Euro 6
Registrovano (registrovano) | boolean | filterable
```

---

## Prikolice i kamperi

```
Tip (tipPrikolica) | select | required
  Prikolica za auto, Karavan (Camper trailer), Kamper (Motor home),
  Poluprikolica (Semi), Prikolica za konje, Brodska prikolica, Ostalo

Marka + Model | text
Godiste (godina) | year | filterable
Duzina (duzina) | number | unit: m
Tezina (tezina) | number | unit: kg
Nosivost (nosivost) | number | unit: kg
Mjesta za spavanje (mjestaSpa) | number (kamperi)
Stanje (stanje) | select: Novo, Dobro, Prihvatljivo
```

---

## Plovila

```
Tip (tipPlova) | select | required | filterable
  Gliser/Motorni camac, Jedrilica, Gumeni camac (RIB), Kajak/Kanu,
  Jahta, Camac na vesla, Jet ski / Skuter, Catamaran, Ostalo

Marka + Model | text
Godiste (godina) | year | filterable
Duzina (duzina) | number | required | filterable | unit: m
Motor - snaga (snagaKs) | number | unit: KS (HP)
Gorivo (gorivo) | select: Benzin, Diesel, Elektricno, Bez motora
Materijal trupa (materijal) | select: Fibreglass (GRP), Aluminij, Drvo, Guma (PVC), Polietilen
Broj mjesta (mjesta) | number
Registrovano (registrovano) | boolean | filterable
```

---

## Auto dijelovi i oprema

```
Tip dijela (tipDijela) | select | required | filterable
  Motor i dijelovi motora, Mjenjac i transmisija, Kocioni sistem,
  Ovjes i upravljanje, Karoserija i stakla, Elektrika i elektronika,
  Klima uredaj, Ispusni sistem, Gume i felge, Enterijer,
  Svjetla i signalizacija, Vucne kuke i nosaci, Stikeri i tuning,
  Ostalo

Kompatibilne marke (kompatibilneMarke) | multiselect | filterable
  [lista marki vozila - ista kao gore]

Kompatibilni modeli (kompatibilniModeli) | text
Godiste vozila (godisteVozila) | text (range, e.g. "2010-2018")
Broj dijela (brojDijela) | text [OEM part number]
Stanje (stanje) | select: Novo, Originalno polovni, Naknadno, Obnovljeno
```
