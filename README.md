Sunnetna Trpeza

Sunnetna Trpeza je web aplikacija posvećena zdravim receptima koji se spominju u Kur’anu i sunnetu Poslanika Muhammeda a.s., kao i drugim provjerenim zdravim receptima.
Cilj aplikacije je objediniti tradicionalna znanja i savremene web tehnologije u jedinstveno, funkcionalno rješenje.
Projekat je razvijen u okviru predmeta Web programiranje, uz primjenu MVC (Model–View–Controller) arhitekture i timskog rada.

Organizacija projekta

Aplikacija je podijeljena na backend i frontend dio, uz jasno razdvojene odgovornosti.
Backend dio je razvijen korištenjem Node.js i Express.js, uz MySQL bazu podataka i Sequelize ORM.
Frontend dio aplikacije razvija se korištenjem React biblioteke.
Struktura projekta omogućava jednostavno održavanje, proširenje funkcionalnosti i jasnu komunikaciju između klijentske i serverske strane.

Backend funkcionalnosti

Backend dio aplikacije implementira:
-konekciju sa MySQL bazom podataka,
-definiciju modela i relacija,
-autentifikaciju korisnika,
-REST API rute,
-kompletne CRUD operacije nad podacima.
-Za autentifikaciju je korišten JWT (JSON Web Token), dok su osjetljivi podaci zaštićeni korištenjem bcrypt hashiranja.

Baza podataka

Korištena je relacijska baza podataka MySQL, sa automatskim kreiranjem tabela pomoću Sequelize ORM-a.
Glavni entiteti u bazi su:
korisnici,
kategorije,
recepti.
Jedna kategorija može sadržavati više recepata, čime je ostvarena logična i jednostavna struktura podataka.

Pokretanje aplikacije (backend)

Za pokretanje backend dijela aplikacije potrebno je:
Instalirati Node.js i XAMPP,
Pokrenuti MySQL servis,
Kreirati bazu podataka sunnetna_trpeza,
Konfigurisati .env fajl,
Pokrenuti server komandom npm run dev.
Backend servis je dostupan na http://localhost:5000.

Razvoj i verzionisanje

Projekat je verzionisan korištenjem Git alata, uz logične i fazne commit-e.
Izvorni kod se nalazi na GitHub repozitoriju, čiji je link naveden u pratećoj PDF dokumentaciji projekta.

Timski rad

Razvoj aplikacije je realizovan u timu od tri člana, uz jasno definisanu podjelu zadataka između backend, frontend i dokumentacijskog dijela projekta.
Detaljan opis doprinosa svakog člana nalazi se u PDF dokumentaciji.
