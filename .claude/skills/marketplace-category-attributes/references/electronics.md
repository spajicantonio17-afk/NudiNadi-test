# Elektronika (Electronics) - Category Attributes

## Table of Contents
1. [Mobiteli i pametni telefoni](#mobiteli)
2. [Tableti](#tableti)
3. [Laptopi i racunari](#laptopi)
4. [Televizori i projektori](#televizori)
5. [Gaming i konzole](#gaming)
6. [Audio i Hi-Fi](#audio)
7. [Foto i video oprema](#foto)
8. [Bijela tehnika (Kucanski aparati)](#bijela-tehnika)
9. [Mreza i internet oprema](#mreza)
10. [Komponente i dijelovi](#komponente)

---

## Mobiteli i pametni telefoni

```
Marka (marka) | select | required | filterable
  Apple, Samsung, Xiaomi, Huawei, OnePlus, Google, Sony, Nokia, Motorola,
  Oppo, Vivo, Realme, Honor, Nothing, Poco, Redmi, Ostalo

Model (model) | text | required
  [autocomplete per brand: iPhone 15 Pro, Galaxy S24, ...]

Memorija/Storage (memorija) | select | required | filterable
  16 GB, 32 GB, 64 GB, 128 GB, 256 GB, 512 GB, 1 TB

RAM (ram) | select | filterable
  2 GB, 3 GB, 4 GB, 6 GB, 8 GB, 12 GB, 16 GB

Boja (boja) | select | filterable
  Crna, Bijela, Plava, Crvena, Zelena, Zlatna, Srebrna, Ljubicasta,
  Roze/Rose Gold, Narandzasta, Titanium, Ostala

Mrezna generacija (mreza) | select | filterable
  2G, 3G, 4G/LTE, 5G

Velicina ekrana (ekran) | number | filterable | unit: inch
  range: 4.0 - 7.0

Operativni sistem (os) | select | filterable
  iOS, Android

Stanje (stanje) | select | required | filterable
  Novo (zapakovan), Kao novo (bez tragova koristenja),
  Dobro (sitni tragovi), Prihvatljivo (vidljivi tragovi), Za dijelove

Kljucanje (zakljucano) | select | filterable
  Otkljucan, Zakljucan za mrezu (navesti operatera)

Baterija (baterija) | select
  Odlicna (>90%), Dobra (80-90%), Prihvatljiva (<80%)

Originalni punjac i kutija (original) | boolean
Garancija (garancija) | boolean | filterable
Racun (racun) | boolean
```

---

## Tableti

```
Marka (marka) | select | required | filterable
  Apple (iPad), Samsung, Lenovo, Huawei, Microsoft (Surface),
  Amazon (Fire), Xiaomi, Ostalo

Model (model) | text | required
Memorija (memorija) | select: 16, 32, 64, 128, 256, 512 GB | filterable
RAM (ram) | select: 2, 3, 4, 6, 8, 12, 16 GB | filterable
Velicina ekrana (ekran) | number | unit: inch | filterable
Mobilna mreza (simKartica) | boolean | filterable (WiFi only vs WiFi+SIM)
Operativni sistem (os) | select: iPadOS, Android, Windows
Stanje (stanje) | select | required | filterable
Boja (boja) | select
Originalna kutija (original) | boolean
```

---

## Laptopi i racunari

### Laptopi
```
Marka (marka) | select | required | filterable
  Apple, Dell, HP, Lenovo, Asus, Acer, MSI, Microsoft, Toshiba,
  Huawei, Samsung, Ostalo

Model (model) | text | required
Procesor (procesor) | text | filterable
  [Intel Core i3/i5/i7/i9, AMD Ryzen 3/5/7/9, Apple M1/M2/M3/M4]

Generacija procesora (genCpu) | text
  [12th Gen, 13th Gen, Ryzen 5000, ...]

RAM (ram) | select | required | filterable
  4 GB, 8 GB, 16 GB, 32 GB, 64 GB, 128 GB

Pohrana (pohrana) | select | required | filterable
  128 GB SSD, 256 GB SSD, 512 GB SSD, 1 TB SSD, 2 TB SSD,
  500 GB HDD, 1 TB HDD, Kombinirano

Graficka kartica (gpu) | text | filterable
  Integrisana, Nvidia GTX/RTX (navesti model), AMD Radeon (navesti model)

Velicina ekrana (ekran) | number | unit: inch | filterable
  range: 11 - 18

Rezolucija ekrana (rezolucija) | select
  HD (1366x768), Full HD (1920x1080), QHD (2560x1440), 4K (3840x2160),
  Retina/HiDPI

Operativni sistem (os) | select | filterable
  Windows 11, Windows 10, macOS, Linux, ChromeOS, Bez OS

Stanje (stanje) | select | required | filterable
Boja kucista (boja) | select
Garancija (garancija) | boolean | filterable
Original kuter i punjac (original) | boolean
```

### Desktop PC i komponente
```
Tip (tipPC) | select: Kompletan racunar, Kuciste sa komponentama, Mini PC, All-in-One
Procesor, RAM, Pohrana, GPU | (isti kao laptopi)
Napajanje (napajanje) | number | unit: W
```

---

## Televizori i projektori

```
Tip (tipTV) | select | required
  LED/LCD TV, OLED TV, QLED TV, AMOLED TV, Projektor, Monitor

Marka (marka) | select | required | filterable
  Samsung, LG, Sony, Philips, Hisense, TCL, Panasonic, Grundig, Ostalo

Dijagonala (dijagonala) | number | required | filterable | unit: inch
  range: 19 - 100

Rezolucija (rezolucija) | select | filterable
  HD Ready (1366x768), Full HD (1080p), 4K Ultra HD, 8K

Smart TV (smart) | boolean | filterable
Operativni sistem TV-a (osSmart) | select: Android TV, Tizen, webOS, Google TV, Roku
HDR (hdr) | select: Nije, HDR10, HDR10+, Dolby Vision, HLG
Refresh rate (hz) | select: 50Hz, 60Hz, 100Hz, 120Hz, 144Hz
HDMI portovi (hdmi) | number
USB portovi (usb) | number
Bluetooth (bluetooth) | boolean
WiFi (wifi) | boolean
Stanje (stanje) | select | required | filterable
```

---

## Gaming i konzole

```
Tip (tipGaming) | select | required | filterable
  Konzola, Kontroler/Gamepad, Igra (disc), Igra (kod/digital),
  Gaming periferal (mis, tastatura, slusalice), VR headset, Ostalo

Platforma (platforma) | select | required | filterable
  PlayStation 5, PlayStation 4, PlayStation 3,
  Xbox Series X/S, Xbox One, Xbox 360,
  Nintendo Switch, Nintendo 3DS,
  PC Gaming, Retro (navesti), Ostalo

Model (model) | text
Memorija konzole (memorija) | select: 256 GB, 512 GB, 1 TB, 2 TB (za konzole)
Stanje (stanje) | select | required | filterable
Broj kontrolera (kontroleri) | number
Igre ukljucene (igreUkljucene) | boolean
```

---

## Audio i Hi-Fi

```
Tip (tipAudio) | select | required | filterable
  Bluetooth zvucnik, Soundbar, Kucni kino sistem, Hi-Fi sistem,
  Slusalice (over-ear), Slusalice (in-ear/buds), Mikrofon,
  Gramofon, Pojacalo, CD/DVD player, Radio, MP3 player, Ostalo

Marka (marka) | text | required | filterable
Model (model) | text
Snaga (snaga) | number | unit: W
Bluetooth (bluetooth) | boolean | filterable
WiFi / Multiroom (wifi) | boolean
Aktivni/Pasivni (aktivni) | boolean (za zvucnike)
Impedancija (impedancija) | number | unit: Ohm (za slusalice)
Frekvencijski odgovor (frekvencija) | text (e.g. "20Hz - 20kHz")
Stanje (stanje) | select | required | filterable
```

---

## Foto i video oprema

```
Tip (tipFoto) | select | required | filterable
  DSLR fotoaparat, Mirrorless fotoaparat, Kompaktni fotoaparat,
  Akcijska kamera (GoPro i sl.), Dron, Filmska kamera, Web kamera,
  Objektiv, Stativ i nosaci, Bljeskalica i rasvjeta, Ostalo

Marka (marka) | text | required | filterable
  Canon, Nikon, Sony, Fujifilm, Olympus, Panasonic, DJI, GoPro, Ostalo

Model (model) | text
Megapikseli (megapikseli) | number | unit: MP (za kamere)
Tip senzora (sensor) | select: Full Frame, APS-C, Micro 4/3, 1 inch, Compact
Bajоnet / mount (bajоnet) | select: Canon EF/RF, Nikon F/Z, Sony E/A, MFT, Fuji X, Ostalo
Stabilizacija (ibis) | boolean
Stanje (stanje) | select | required | filterable
Originalna kutija (original) | boolean
Broj okidanja (okidanja) | number (za DSLR/Mirrorless)
```

---

## Bijela tehnika (Kucanski aparati)

```
Tip (tipAparat) | select | required | filterable
  Frizider, Zamrzivac, Frizider-zamrzivac kombinovani,
  Masina za pranje rublja, Masina za susenje rublja, Masina za pranje sudova,
  Stednjak/Rerna, Mikrovalna, Usisivac, Klima uredaj,
  Perilica (Washer-Dryer kombi), Ostalo

Marka (marka) | select | required | filterable
  Gorenje, Bosch, Siemens, AEG, Electrolux, Whirlpool, Candy, Beko,
  Samsung, LG, Indesit, Hisense, Ostalo

Model (model) | text
Kapacitet (kapacitet) | number | unit: L ili kg (ovisno o tipu)
  Frizider: litri | Masina za rublje: kg
Energetska klasa (energetskaKlasa) | select | filterable
  A+++, A++, A+, A, B, C, D
Boja (boja) | select: Bijela, Crna, Inox/Srebrna, Ostala
Stanje (stanje) | select | required | filterable
Dimenzije (dimenzije) | text (e.g. "60x60x85 cm")
Godiste (godina) | year | filterable
```

---

## Mreza i internet oprema

```
Tip (tipMreza) | select | required
  Router, Mesh sustav, Switch, Access Point, Modem, NAS, Server,
  Kablovi i konektori, UPS napajanje, Ostalo

Marka (marka) | text | filterable
  TP-Link, Asus, Netgear, Ubiquiti, MikroTik, D-Link, Synology, Ostalo

WiFi standard (wifiStandard) | select: WiFi 4 (n), WiFi 5 (ac), WiFi 6 (ax), WiFi 6E, WiFi 7
Brzina (brzina) | text (e.g. "AX6000", "1Gbps")
Portovi (portovi) | text (e.g. "4x GbE LAN, 1x WAN, 2x USB")
Stanje (stanje) | select | required | filterable
```

---

## Komponente i dijelovi

```
Tip (tipKomponente) | select | required | filterable
  Procesor (CPU), Graficka kartica (GPU), Maticna ploca, RAM memorija,
  SSD/NVMe, HDD, Napajanje, Kuciste, Hladnjak (CPU cooler),
  Ventilator, Monitor, Tastatura, Mis, Ostalo

Kompatibilnost (kompatibilnost) | text
  (e.g. "Intel LGA1700", "AMD AM5", "DDR5", "PCIe 5.0")

Marka (marka) | text | filterable
Model (model) | text
Stanje (stanje) | select | required | filterable
Garancija (garancija) | boolean
```
