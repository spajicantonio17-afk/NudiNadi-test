# Zivotinje, Poslovi i Usluge - Category Attributes

## Table of Contents
1. [Zivotinje (Animals & Pets)](#zivotinje)
2. [Poslovi (Jobs)](#poslovi)
3. [Usluge (Services)](#usluge)
4. [Obrazovanje i kursevi (Education)](#obrazovanje)

---

## Zivotinje

### Ljubimci (Pets)
```
Vrsta zivotinje (vrstaZivotinje) | select | required | filterable
  Pas, Macka, Ptica, Zec, Zamorac/Hrccak, Gmaz/Reptil,
  Riba i akvaristika, Glodavac (ostali), Konji, Ostalo

Tip oglasa (tipPetOglasa) | select | required | filterable
  Poklanjam, Prodajem, Trazim (potraznja), Nestao ljubimac

Rasa (rasa) | text | required | filterable
  [autocomplete per species: Labrador, Golden Retriever, Njemacki ovcar,
   Francuski buldog, Chihuahua, ... za pse]
  [Perzijska, Britanska kratkodlaka, Maine Coon, Ragdoll... za macke]

Spol (spolZivotinje) | select | filterable: Muzjak, Zenska, Nepoznato

Uzrast (uzrastZivotinje) | select | filterable
  Mladunac (0-6 mj), Mlado (6-12 mj), Odraslo (1-7 g), Staro (7+ g)

Boja (bojaZivotinje) | text
Tezina (tezinaZiv) | number | unit: kg

Vakcinisano (vakcinisano) | boolean | required | filterable
Cipovano (cipovano) | boolean | required | filterable
Kastrirano/Sterilisano (sterilisano) | boolean | filterable
Pasoš za ljubimce (pasos) | boolean | filterable
Sa papirima/Rodovnik (rodovnik) | boolean | filterable
Trenirano (trenirano) | boolean

Posebne napomene (napomene) | text
  (alergije, dijeta, karakter, posebne potrebe)
```

### Stoka i farma (Livestock)
```
Vrsta (vrstaStoke) | select | required | filterable
  Govece (krave, bikovi), Svinje, Ovce i koze, Perad (kokoske, patke, guske),
  Konji i poniji, Koze (mlijeko), Peli (pcele), Ostalo

Pasmina (pasmina) | text
Uzrast (uzrast) | select: Mlade, Odraslo, Staro
Spol (spol) | select: Muzjak, Zenska
Broj grla (brojGrla) | number
Tezina (tezina) | number | unit: kg
Vakcinisano (vakcinisano) | boolean | filterable
```

### Akvaristika i teraristika
```
Tip (tipAkva) | select | required | filterable
  Slatkovodne ribe, Morske ribe, Korale i invertebrate,
  Aquarium oprema (filter, pumpa, osvjetljenje), Gmazovi,
  Tarantule i paunci, Amfibije, Ostalo

Vrsta/Naziv (vrsta) | text | required
Velicina akvarija (velicinaAkv) | number | unit: L (litri)
Starost (starost) | text (e.g. "6 mj", "2 g")
```

---

## Poslovi

```
Tip oglasa (tipPosao) | select | required | filterable
  Nudim posao (poslodavac), Trazim posao (kandidat)

Kategorija posla (kategorijaP) | select | required | filterable
  IT i racunarstvo, Inzenjering i tehnika, Gradevinarstvo,
  Medicina i zdravstvo, Obrazovanje i odgoj, Prodaja i marketing,
  Administracija i ured, Ugostitelstvo i turizam, Transport i logistika,
  Finansije i racunovodstvo, Pravo i pravne usluge, Mediji i novinarstvo,
  Zanati i obrta, Fizicki radnici, Kucna pomoc i njega, Sigurnost/Zaštita,
  Studentski poslovi i honorarni, Ostalo

Pozicija/Naziv (pozicija) | text | required
Firma (firma) | text (za poslodavce)
Grad/Lokacija (grad) | text | required | filterable

Tip ugovora (ugovor) | select | required | filterable
  Na neodredeno, Na odredeno, Probni rad, Honorarni/Freelance,
  Studentski rad, Sezonski, Volontiranje, Praksa/Staz

Broj radnih sati (radniSati) | select | filterable
  Puno radno vrijeme (40h), Pola radnog vremena, Fleksibilno, Po dogovoru

Placa (placaOd) | number | unit: KM/mj | filterable
Placa do (placaDo) | number | unit: KM/mj
  [display as range: "1500 - 2500 KM/mj"]

Iskustvo (iskustvo) | select | filterable
  Bez iskustva (student/poc), Juniorni (1-2 g), Srednje (3-5 g),
  Senior (5+ g), Rukovodece (10+ g)

Obrazovanje (obrazovanje) | select | filterable
  Nije bitno, SSS, VSS, Bacelor, Magistar, Doktorat

Remote/Hibrid (remote) | select | filterable
  Ured (on-site), Hibrid, Remote/Rad od kuce

Benefiti (benefiti) | multiselect
  Privatno zdravstveno osiguranje, Topli obrok, Prijevoz,
  Godisnji bonus, Trening i edukacija, Mobilni telefon i laptop,
  Parkiranje, Fleksibilno radno vrijeme, Ostalo
```

---

## Usluge

```
Kategorija usluge (kategorijaU) | select | required | filterable
  Kucanstvo i ciscenje, Gradnja i renoviranje, Vodarstvo i instalacije,
  Elektricne instalacije, Klimatizacija i grijanje, Krovovi i fasade,
  Namjestaj i stolarija, Prijevoz i selidba, Auto servisi,
  IT podrska i racunari, Web i dizajn, Fotografija i video,
  Frizerstvo i kozmetika, Masaze i wellness, Njega djece (dadilja),
  Njega starijih i bolesnih, Satovi i popravke, Krojenje i sivanje,
  Catering i hrana, Pravne usluge, Računovodstvo i porezi,
  Prevod i tutoring, Vrtlarstvo i basta, Ostalo

Naziv usluge (naziv) | text | required
Grad/Podrucje rada (grad) | text | required | filterable
Dolazi na adresu (dolazi) | boolean | filterable

Tip naplate (tipNaplate) | select | filterable
  Po satu, Po projektu (fiksna cijena), Dnevna naknada, Besplatno (volontiranje)

Cijena od (cijenaOd) | number | unit: KM (sat ili projekt)
Dostupnost (dostupnost) | select
  Odmah dostupan, Za 1-2 tjedna, Za 1 mj, Po dogovoru

Iskustvo (iskustvoU) | select
  Pocetak karijere, 1-3 g iskustva, 3-10 g iskustva, 10+ g iskustva

Certifikati/Licenci (certifikati) | boolean
  (ima odgovarajucu licencu/certifikat za ovu uslugu)
```

---

## Obrazovanje i kursevi

```
Tip (tipObrazovanja) | select | required | filterable
  Privatni cas (uzivo), Online cas, Grupni kurs (uzivo), Online kurs,
  Radionice (workshop), Tutoring (ispiti/skolski predmeti),
  Strucni treninzi, Jezicki tecajevi, Muzicke lekcije,
  Kompjuterski kursevi, Sportski treninzi, Ostalo

Predmet/Tema (predmet) | text | required | filterable
  [Mathematics, Physics, English, German, Programming, Guitar, Piano, ...]

Nivo (nivo) | select | filterable
  Pocetnici, Srednji nivo, Napredni, Priprema za ispite

Uzrast polaznika (uzrastP) | select | filterable
  Djeca (do 12g), Tinejdzeri (13-18g), Odrasli, Svi uzrasti

Lokacija casa (lokacijaC) | select | filterable
  Kod profesora, Kod polaznika (dolazak na adresu), Online (Zoom/Teams),
  U skoli/centru

Trajanje casa (trajanje) | select: 30 min, 45 min, 60 min, 90 min, 2h, Vikend intenziv
Cijena po casu (cijenaCas) | number | unit: KM
Grupni cas (grupni) | boolean | filterable (individualno vs. grupno)
```
