const path = require('path');
const fs = require('fs');
const express = require('express');
const homePage = require('./data/home');
const newsContent = require('./data/news');

const app = express();
const PORT = process.env.PORT || 3000;

const site = {
  name: 'SV 1976 Hambuch e.V.',
  shortName: 'SV Hambuch',
  founded: 1976,
  jubileeYear: 2026,
  anniversary: 50,
  chair: 'Mark Löhr',
  phone: '02653 6626',
  phoneHref: '+4926536626',
  postalAddress: ['SV 1976 Hambuch e.V.', 'c/o Mark Löhr', 'Mohlpesch 3', '56761 Hambuch'],
  venueAddress: ['Sportplatz Hambuch', 'Schulstraße 11', '56761 Hambuch'],
  meetingPlace: ['Probstei Hambuch', 'Hauptstraße 35', '56761 Hambuch']
};

const navItems = [
  { key: 'home', label: 'Startseite', url: '/' },
  { key: 'club', label: 'Verein', url: '/verein' },
  { key: 'teams', label: 'Mannschaften', url: '/mannschaften' },
  { key: 'schedule', label: 'Sportstätten', url: '/trainingszeiten' },
  { key: 'news', label: 'News', url: '/#news' },
  { key: 'contact', label: 'Kontakt', url: '/kontakt' }
];

const slugify = (value) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const formatGermanDate = (value) =>
  new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(new Date(value));

const newsEntries = newsContent.map((entry) => ({
  ...entry,
  body: entry.body || [entry.summary],
  images: (entry.images || []).map((image) => {
    if (typeof image === 'string') {
      return {
        src: image.replace(/^public/, ''),
        alt: entry.title
      };
    }

    return {
      ...image,
      src: image.src ? image.src.replace(/^public/, '') : '',
      alt: image.alt || entry.title
    };
  }),
  slug: slugify(entry.title),
  formattedDate: formatGermanDate(entry.date)
})).sort((entryA, entryB) => entryB.date.localeCompare(entryA.date));

const anniversaryImageDir = path.join(__dirname, 'public', 'images', 'anniversary');

const homePageWithResolvedAssets = {
  ...homePage,
  anniversary: {
    ...homePage.anniversary,
    slides: homePage.anniversary.slides.map((slide) => {
      const pngPath = path.join(anniversaryImageDir, `${slide.imageBase}.png`);
      const extension = fs.existsSync(pngPath) ? 'png' : 'svg';

      return {
        ...slide,
        image: `/images/anniversary/${slide.imageBase}.${extension}`
      };
    })
  }
};

const club = {
  mission:
    'Der SV 1976 Hambuch e.V. verbindet Fußball, Ehrenamt und Dorfgemeinschaft im Herzen der Eifel.',
  stats: [
    { value: '1976', label: 'offizielles Gründungsjahr des heutigen Vereins' },
    { value: '50', label: 'Jahre SV Hambuch im Jubiläumsjahr 2026' },
    { value: '1996', label: 'Einweihung des heutigen Rasenplatzes an der Schulstraße' },
    { value: '2023', label: 'LED-Umrüstung mit mehr als 60 % Stromersparnis' }
  ],
  intro: [
    'Der Verein tritt offiziell als SV 1976 Hambuch e.V. auf und geht 2026 in sein 50. Jahr. Damit ist das Jubiläum nicht nur ein Anlass zum Feiern, sondern auch ein sichtbarer Punkt in der laufenden Vereinsentwicklung.',
    'Zum heutigen Profil gehören Seniorenfußball in der regionalen Spielgemeinschaft, Nachwuchsarbeit in Kooperationen, inklusive Sportangebote und feste Dorfveranstaltungen. Der SV ist damit deutlich mehr als ein Spieltagsverein.'
  ],
  values: ['Dorfverbundenheit', 'Ehrenamt', 'Nachwuchsförderung', 'Offenheit & Inklusion'],
  timeline: [
    {
      year: '1976',
      title: 'SV 1976 Hambuch e.V.',
      text: 'Der heutige Verein firmiert offiziell mit dem Gründungsjahr 1976 und feiert deshalb im Jahr 2026 sein 50-jähriges Jubiläum.'
    },
    {
      year: '1996',
      title: 'Neuer Rasenplatz an der Schulstraße',
      text: 'Mit der Einweihung des modernen Rasenplatzes zog der Verein von älteren Platzverhältnissen auf die heutige Sportanlage um.'
    },
    {
      year: '2022',
      title: 'Inklusion wird fester Vereinsbaustein',
      text: 'Aus einem großen Inklusionsspiel im Herbst 2022 entstand ein monatliches Inklusionstraining auf dem Hambucher Sportplatz.'
    },
    {
      year: '2023',
      title: 'LED-Flutlicht am Sportplatz',
      text: 'Seit Juni 2023 sorgt eine neue LED-Anlage für bessere Ausleuchtung und laut Ortsgemeinde für eine Stromersparnis von mehr als 60 Prozent.'
    },
    {
      year: '2026',
      title: 'Jubiläumsjahr',
      text: 'Der Verein feiert 50 Jahre SV Hambuch. Öffentliche Hinweise aus 2025 zeigen, dass die Vorbereitungen dafür bereits früh angelaufen sind.'
    }
  ],
  highlights: [
    'Die Jahreshauptversammlung 2026 wurde für Freitag, den 20. März 2026, 20:00 Uhr in der Probstei angekündigt.',
    'Der Sportplatz Hambuch ist laut Ortsseite ein moderner Rasenplatz mit Lauf- und Sprunganlage sowie Sportlerheim.',
    'Die Sport-/Mehrzweckhalle wird im Dorf nicht nur für Fußball genutzt, sondern auch für weitere Hallensport- und Gemeinschaftsangebote.'
  ]
};

const teams = [
  {
    name: 'Senioren-SG',
    label: 'Erwachsenenfußball',
    description:
      'Der SV Hambuch trägt den Seniorenbereich gemeinsam mit Nachbarvereinen. Offizielle Spielankündigungen und Ligaportale führen die SG in der Region unter verschiedenen SG-Bezeichnungen rund um Hambuch, Kaifenheim und Brohl.',
    items: [
      'regionaler Spielbetrieb mit Partnervereinen aus der Umgebung',
      'Heimspiele an Standorten in Hambuch und Kaifenheim',
      'enge Verzahnung von Verein, SG und Dorfgemeinschaft'
    ]
  },
  {
    name: 'Reserve & Unterbau',
    label: 'Zweite Mannschaft',
    description:
      'Neben dem ersten Erwachsenenteam gehört auch eine Reserve zur SG-Struktur. Damit bleibt der Unterbau für Spieler aus Hambuch und den Nachbarorten erhalten.',
    items: [
      'zweites Team im regionalen Spielbetrieb',
      'Anschluss für Spieler aus dem direkten Umfeld',
      'wichtiger Baustein für langfristige Kaderentwicklung'
    ]
  },
  {
    name: 'Jugend in Kooperation',
    label: 'Nachwuchs',
    description:
      'Auf dem Hambucher Sportplatz war Jugendfußball immer ein zentraler Teil des Vereinslebens. Heute läuft die Nachwuchsarbeit in Kooperationen mit Vereinen der Region und im Umfeld des JFV Schieferland.',
    items: [
      'Jugendarbeit gemeinsam mit Partnervereinen',
      'Sportplatz Hambuch und Hallen in der Region als Trainingsorte',
      'enge Verbindung zwischen Dorf und Nachwuchsfußball'
    ]
  },
  {
    name: 'Inklusionstraining',
    label: 'Monatliches Angebot',
    description:
      'Seit 2022 organisiert der Verein ein monatliches Inklusionstraining. Menschen mit Behinderung trainieren dabei gemeinsam mit Jugend- und Seniorenspielern des SV Hambuch.',
    items: [
      'einmal pro Monat auf dem Hambucher Sportplatz',
      'gemeinsame Übungen mit Vereinsaktiven',
      'fester Bestandteil des Sportangebotes'
    ]
  },
  {
    name: 'Dorfmeisterschaft',
    label: 'Für das ganze Dorf',
    description:
      'Bei der Dorfmeisterschaft treten Mannschaften aus verschiedenen Straßenbereichen gegeneinander an. Das Format macht deutlich, wie nah der Verein am Ort und an seinen Familien bleibt.',
    items: [
      'Straßenteams wie Hollekickers oder FC Mohlpesch',
      'Mitmachformat ab 15 Jahren',
      'eigene Spiele für Kinder und Jugendliche'
    ]
  },
  {
    name: 'Sport in der Halle',
    label: 'Breitensport',
    description:
      'Neben dem Fußball gab es beim SV Hambuch immer wieder ergänzende Hallenangebote. Öffentlich dokumentiert ist zum Beispiel Bodyforming in der Sporthalle Hambuch.',
    items: [
      'Sport-/Mehrzweckhalle als zweiter wichtiger Vereinsort',
      'beispielhaft dokumentiert: Bodyforming-Kurs in der Halle',
      'Hallensport als Ergänzung zum Platzbetrieb'
    ]
  }
];

const schedulePage = {
  venues: [
    {
      name: 'Sportplatz Hambuch',
      address: 'Schulstraße 11, 56761 Hambuch',
      description:
        'Der heutige Rasenplatz wurde laut Ortsseite 1996 eingeweiht. Seit Juni 2023 verfügt die Anlage über moderne LED-Flutlichttechnik.',
      details: ['moderner Rasenplatz', 'Lauf- und Sprunganlage', 'Sportlerheim am Platz']
    },
    {
      name: 'Sport-/Mehrzweckhalle Hambuch',
      address: 'Schulstraße, 56761 Hambuch',
      description:
        'Die 1984 erbaute Halle wird für Schulsport und verschiedene Vereinsangebote genutzt. Öffentlich genannt werden dort unter anderem Fußball, Tischtennis, Aerobic und Seniorensport.',
      details: ['wichtiger Winter- und Hallenstandort', 'Mehrfachnutzung für Vereins- und Dorfleben', 'auch für größere Veranstaltungen geeignet']
    },
    {
      name: 'Probstei Hambuch',
      address: 'Hauptstraße 35, 56761 Hambuch',
      description:
        'Die Probstei ist der zentrale Versammlungsort für Mitgliederversammlungen, SG-Sitzungen und weitere Vereinstermine.',
      details: ['Ort der Jahreshauptversammlungen', 'Treffpunkt für Organisation und Vereinsleben', 'zentral im Dorf gelegen']
    },
    {
      name: 'Bachstadion Kaifenheim',
      address: 'Lindenstraße, 56753 Kaifenheim',
      description:
        'Für Heimspiele der regionalen Spielgemeinschaft taucht auch das Bachstadion Kaifenheim regelmäßig als Spielort auf.',
      details: ['zusätzlicher SG-Spielort', 'Heimspielstätte in offiziellen Terminankündigungen', 'enger Bezug zur Partnerstruktur']
    }
  ],
  recurringEvents: [
    {
      title: 'Jahreshauptversammlung 2026',
      meta: 'Freitag, 20. März 2026 · 20:00 Uhr',
      text: 'Die Einladung zur Jahreshauptversammlung 2026 nennt die Probstei Hambuch als Versammlungsort.'
    },
    {
      title: 'Monatliches Inklusionstraining',
      meta: 'seit 2022 · Sportplatz Hambuch',
      text: 'Menschen mit Behinderung trainieren regelmäßig gemeinsam mit Aktiven des Vereins.'
    },
    {
      title: 'Borfest',
      meta: 'Sommertermin · 2024 am 3./4. August',
      text: 'Das Borfest gehört zu den wiederkehrenden Dorfveranstaltungen, die mit dem SV Hambuch verbunden sind.'
    },
    {
      title: 'Dorfmeisterschaft',
      meta: 'Sportplatz Hambuch · zuletzt öffentlich belegt am 8. Juli 2023',
      text: 'Die Dorfmeisterschaft bringt Straßenteams, Jugendliche und Zuschauer an einem Vereinstag zusammen.'
    }
  ],
  notice:
    'Aktuelle Trainings- und Anstoßzeiten im Senioren- und Jugendbereich ändern sich saisonal. Für den jeweils neuesten Stand ist der direkte Kontakt zum Verein oder zur Spielgemeinschaft der verlässlichste Weg.'
};

const contact = {
  postalAddress: site.postalAddress,
  venueAddress: site.venueAddress,
  meetingPlace: site.meetingPlace,
  phone: site.phone,
  phoneHref: site.phoneHref,
  contactPerson: {
    role: '1. Vorsitzender',
    name: site.chair
  },
  note:
    'Für Fragen zu Mitgliedschaft, Veranstaltungen oder aktuellen Trainingszeiten ist der direkte Vereinskontakt der beste Einstieg.'
};

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.locals.navItems = navItems;
  res.locals.site = site;
  next();
});

app.get('/', (req, res) => {
  res.render('layout', {
    title: 'Startseite',
    currentPage: 'home',
    template: 'pages/home',
    home: homePageWithResolvedAssets,
    news: newsEntries
  });
});

app.get('/verein', (req, res) => {
  res.render('layout', {
    title: 'Verein',
    currentPage: 'club',
    template: 'pages/club',
    club
  });
});

app.get('/mannschaften', (req, res) => {
  res.render('layout', {
    title: 'Mannschaften',
    currentPage: 'teams',
    template: 'pages/teams',
    teams
  });
});

app.get('/trainingszeiten', (req, res) => {
  res.render('layout', {
    title: 'Sportstätten & Termine',
    currentPage: 'schedule',
    template: 'pages/schedule',
    schedule: schedulePage
  });
});

app.get('/news', (req, res) => {
  res.redirect('/#news');
});

app.get('/news/:slug', (req, res) => {
  const article = newsEntries.find((entry) => entry.slug === req.params.slug);

  if (!article) {
    res.status(404).send('Newsartikel nicht gefunden');
    return;
  }

  res.render('layout', {
    title: article.title,
    currentPage: 'news',
    template: 'pages/news-detail',
    article
  });
});

app.get('/kontakt', (req, res) => {
  res.render('layout', {
    title: 'Kontakt',
    currentPage: 'contact',
    template: 'pages/contact',
    contact
  });
});

app.listen(PORT, () => {
  console.log(`SV Hambuch Website läuft auf http://localhost:${PORT}`);
});
