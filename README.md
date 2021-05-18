# SprzezenieZwrotne2.0

### Zaprojektowanie i implementacja sprzężenia  zwrotnego w strukturze informatycznej regulującego jakość transferu  wiedzy pomiędzy wykładowcami a studentami na WFAiIS
---

##### Do działania projektu potrzebne jest zainstalowanie: bazy danych MongoDB, menedżera pakietów npm oraz środowiska uruchomieniowego Node.js. W przypadku niektórych systemów operacyjnych warto skorzystać z menadżerów zależności, aby zainstalowane zostały wszystkie potrzebne paczki.

---
#### Instalacja
1. W terminalu przejść należy do katalogu sprzezenie-zwrotne-backend.
2. Wywołać komendę:
  ```
  npm install
  ```
  - Pobierze ona i zainstaluje odpowiednie wersje potrzebnych do działania aplikacji serwerowej pakietów
3. W terminalu przejść do katalogu sprzezenie-zwrotne-frontend.
4. Wywołać komendę:
  ```
  npm install
  ```
#### Konfiguracja
1. Konfiguracja pliku .env w katalogu sprzezenie-zwrotne-backend:
  - Klucze aplikacji wygenerowane na stronie (lub innej, odpowiadającej uczelni na której planowana jest instalacja systemu)
  ```
  https://usosapps.umk.pl/developers/
  ```
  - Dane bazy MongoDB: URL oraz nazwa 
  - Port: (domyślnie 5000)
  - Session name oraz session secret (domyślnie "sid" oraz "secretsession123")
  - Frontend link - adres URL działającej aplikacji frontend
2. Konfiguracja "proxy" w pliku package.json w katalogu sprzezenie-zwrotne-frontend: adres URL do działającej aplikacji backend

#### Test aplikacji backend
Aby przetestować podstawowe funkcje aplikacji backend, w terminalu (w katalogu sprzezenie-zwrotne-backend) wywołać komendę:
```
npm test
```

#### Uruchamianie
1. Aplikacja backend:
  - W terminalu (w katalogu sprzezenie-zwrotne-backend) wywołać komendę:
  ```
  node app.js
  ```
2. Aplikacja frontend:
  - W terminalu(w katalogu sprzezenie-zwrotne-frontend) wywołać komendę:
  ```
  npm start
  ```
  


#### Koniec
Po przejściu w przeglądarce internetowej do strony zgodnej z adresem URL aplikacji klienckiej, użytkownik powinien zobaczyć interfejs logowania.

