# SprzezenieZwrotne2.0

Zaprojektowanie i implementacja sprzężenia  zwrotnego w
strukturze informatycznej regulującego jakość transferu  wiedzy pomiędzy
wykładowcami a studentami na WFAiIS



Do działania projektu potrzebne jest zainstalowanie: bazy danych MongoDB, menedżera pakietów npm oraz środowiska uruchomieniowego Node.js. W przypadku niektórych systemów operacyjnych warto skorzystać z menadżerów zależności, aby zainstalowane zostały wszystkie potrzebne paczki.

Jako pierwszą należy uruchomić aplikację serwerową. W terminalu przejść należy do katalogu sprzezenie-zwrotne-backend i wywoałć tam komendę npm install, która pobierze i zainstaluje odpowiednie wersje potrzebnych do działania aplikacji serwerowej pakietów. Po przejściu opisanego procesu instalacji należy skonfigurować ustawienia projektu. W tym celu należy w pliku .env ustawić port, dane uruchomionej bazy danych MongoDB, klucze aplikacji wygenerowane na stronie https://usosapps.umk.pl/developers/ oraz dane sesji. W kolejnym kroku należy ustawić URL działającej aplikacji klienckiej w kodzie metody obsługującej ścieżkę /callback w pliku app.js aplikacji serwerowej w linii: res.redirect("http://localhost:3000");

Polecenie npm install należy również wykonać w katalogu sprzezenie-zwrotne-frontend. Po zakończeniu instalacji należy uruchomić aplikację kliencką wywołując polecenie node app.js. Po przejściu w przeglądarce internetowej do strony zgodnej z adresem URL aplikacji klienckiej, użytkownik powinien zobaczyć interfejs logowania.

W przypadku uruchamiania aplikacji klienckiej z innymi parametrami konfiguracyjnymi niż domyślne trzeba ustawić URL ścieżki logowania aplikacji serwerowej we właściwości href przycisku w pliku App.js.
<Button color="inherit" href="http://localhost:5000/login" target="_self" onClick={(event) => event.preventDefault}>
Na końcu należy ustawić adres URL działającej aplikacji serwerowej w zmiennej proxy w pliku package.json znajdującym się w katalogu sprzezenie-zwrotne-frontend.:
"proxy": "http://localhost:5000"
