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
  { key: 'anniversary', label: '50 Jahre', url: '/#50-jahre' },
  { key: 'news', label: 'News', url: '/#wichtige-meldungen' },
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
    { value: '1976', label: 'Gründungsjahr des SV Hambuch' },
    { value: '50', label: 'Jahre SV Hambuch im Jubiläumsjahr 2026' },
    { value: '1996', label: 'Einweihung des heutigen Rasenplatzes an der Schulstraße' },
    { value: '2023', label: 'LED-Umrüstung mit mehr als 60 % Stromersparnis' }
  ],
  intro: [
    'Seit 1976 steht der SV Hambuch für Fußball, Ehrenamt und Zusammenhalt im Dorf. 2026 feiern wir 50 Jahre Vereinsgeschichte.',
    'Heute gehören Seniorenfußball, Nachwuchsarbeit, inklusive Sportangebote und feste Dorfveranstaltungen zum Vereinsleben. Der SV Hambuch ist Treffpunkt, Sportverein und Gemeinschaft zugleich.'
  ],
  values: ['Dorfverbundenheit', 'Ehrenamt', 'Nachwuchsförderung', 'Offenheit & Inklusion'],
  timeline: [
    {
      year: '1976',
      title: 'SV 1976 Hambuch e.V.',
      text: 'Der SV Hambuch wird gegründet und legt den Grundstein für fünf Jahrzehnte Vereinsleben.'
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
      text: 'Seit Juni 2023 sorgt eine neue LED-Anlage für bessere Ausleuchtung und deutlich geringeren Stromverbrauch.'
    },
    {
      year: '2026',
      title: 'Jubiläumsjahr',
      text: 'Wir feiern 50 Jahre SV Hambuch und blicken gemeinsam auf viele Erinnerungen, Spiele und Begegnungen zurück.'
    }
  ],
  highlights: [
    'Die Jahreshauptversammlung 2026 findet am Freitag, den 20. März 2026, um 20:00 Uhr in der Probstei statt.',
    'Der Sportplatz Hambuch ist unsere sportliche Heimat mit Rasenplatz, Lauf- und Sprunganlage sowie Sportlerheim.',
    'Die Sport-/Mehrzweckhalle wird im Dorf nicht nur für Fußball genutzt, sondern auch für weitere Hallensport- und Gemeinschaftsangebote.'
  ]
};

const teams = [
  {
    name: 'Senioren-SG',
    label: 'Erwachsenenfußball',
    description:
      'Im Seniorenbereich arbeitet der SV Hambuch eng mit Nachbarvereinen zusammen. So bleibt der Fußball in der Region stark aufgestellt.',
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
      'Neben dem Fußball gehören auch ergänzende Angebote in der Halle zum Vereinsleben.',
    items: [
      'Sport-/Mehrzweckhalle als zweiter wichtiger Vereinsort',
      'Bewegungsangebote in der Halle',
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
        'Der Rasenplatz an der Schulstraße ist seit 1996 die sportliche Heimat des SV Hambuch. Seit Juni 2023 verfügt die Anlage über moderne LED-Flutlichttechnik.',
      details: ['moderner Rasenplatz', 'Lauf- und Sprunganlage', 'Sportlerheim am Platz']
    },
    {
      name: 'Sport-/Mehrzweckhalle Hambuch',
      address: 'Schulstraße, 56761 Hambuch',
      description:
        'Die Sport- und Mehrzweckhalle wird für Schulsport, Hallentraining und verschiedene Vereinsangebote genutzt.',
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
        'Das Bachstadion Kaifenheim ist ein weiterer Spielort im Umfeld der regionalen Spielgemeinschaft.',
      details: ['zusätzlicher SG-Spielort', 'Heimspielstätte im Partnerumfeld', 'enger Bezug zur Partnerstruktur']
    }
  ],
  recurringEvents: [
    {
      title: 'Jahreshauptversammlung 2026',
      meta: 'Freitag, 20. März 2026 · 20:00 Uhr',
      text: 'Wir laden alle Mitglieder zur Jahreshauptversammlung 2026 in die Probstei Hambuch ein.'
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
      meta: 'Sportplatz Hambuch',
      text: 'Die Dorfmeisterschaft bringt Straßenteams, Jugendliche und Zuschauer an einem Vereinstag zusammen.'
    }
  ],
  notice:
    'Trainings- und Anstoßzeiten ändern sich je nach Saison. Meldet euch gerne direkt beim Verein, wenn ihr mitspielen, zuschauen oder mehr erfahren möchtet.'
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
    'Wir helfen bei allen Fragen gerne weiter.'
};

const legal = {
  email: 'familie.loehr@myquix.de',
  registerCourt: 'Amtsgericht Koblenz',
  registerNumber: 'VR 2726',
  fontsProvider: {
    name: 'Bunny Fonts',
    url: 'https://fonts.bunny.net',
    privacyUrl: 'https://bunny.net/privacy/'
  }
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

app.get('/impressum', (req, res) => {
  res.render('layout', {
    title: 'Impressum',
    currentPage: 'legal',
    template: 'pages/impressum',
    legal
  });
});

app.get('/datenschutz', (req, res) => {
  res.render('layout', {
    title: 'Datenschutz',
    currentPage: 'legal',
    template: 'pages/datenschutz',
    legal
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`SV Hambuch Website läuft auf http://localhost:${PORT}`);
  });
}

module.exports = app;
