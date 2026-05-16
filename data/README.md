# Inhalte pflegen

Die Startseite und die News sind bewusst von `server.js` getrennt.

- Neue Jubiläumsbilder: in `home.js` unter `anniversary.slides` einen weiteren Eintrag ergänzen und das Bild in `public/images/anniversary/` ablegen. Wenn für denselben Basisnamen sowohl `.png` als auch `.svg` existieren, wird automatisch das `.png` verwendet.
- Neue wichtige Meldung: in `home.js` unter `importantNotices` einen weiteren Eintrag ergänzen.
- Neue News: in `news.js` einen weiteren Artikel ergänzen. `body` enthält die Textabsätze des Artikels. `images` kann leer bleiben, einfache Strings wie `'/images/news/beispiel.png'` enthalten oder mehrere Objekte mit `src`, `alt` und optional `caption`. Die Startseite zeigt alle Artikel nach Datum; jeder Artikel bekommt automatisch eine eigene Detailseite.

Für echte Jubiläumsbilder oder Flyer genügt später in den Datensätzen jeweils der Austausch des `image`-Pfads beziehungsweise des `href`.
