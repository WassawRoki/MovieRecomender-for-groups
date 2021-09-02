# P2-projekt

## Kort om applikationen
Denne webapplikation er lavet som hjælpeværktøj til en gruppe, der kan have svært ved at vælge en film at se i streamingtjenesternes store udvalg.
Applikationen anbefaler film til en gruppe, baseret på op til 5 individuelle valgte film per bruger. For at få mest muligt ud af applikationen skal brugerne hver især vælge film som de enten gerne vil se med gruppen, eller lignende film, som de har set og godt kunne lide. Baseret på gruppemedlemmernes valg af film, samt nogle valgfrie fravalg der kan opsættes, vil applikationen anbefale op til 10 film.
Yderligere oplysning om brugen af applikationen kan findes i "hjælp"-siden i applikationens startmenu.


## Opsætning til start af programmet

### Installationskrav
1. Node.js
2. MySQL
3. XAMPP eller lignende værktøj


### Kør applikationen
1. "clone" dette "repository"
```sh
git clone https://github.com/lass5588/P2-project.git
```
2. Upload database-filen (p2_db.sql) til MySQL

3. Hent node-modulerne med npm
```sh
npm i
```
4. Kør applikation fra terminalen.
```sh
node app.js
```

## Udviklere
Dette projekt er udviklet af gruppe SW2B2-5 fra softwarestudiet på Aalborg Universitet

## Notes
- Denne applikation kører på nuværende tidspunkt lokalt. For at bruge det for en gruppe, skal applikationen enten køre online, eller på den samme maskine med flere websider.
- Denne applikation er blevet udviklet for browserne Google Chrome, Mozilla Firefox, og Microsoft Edge, og den er deraf ikke testet på andre webbrowsere.
- Denne applikation er blevet udviklet for operativ systemerne Windows og macOS og er ikke testet på andre operativ systemer.
- Denne applikation kører lokalt på port 3000.
