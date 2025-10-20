const path = require('path');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

const navItems = [
  { key: 'home', label: 'Startseite', url: '/' },
  { key: 'club', label: 'Verein', url: '/verein' },
  { key: 'teams', label: 'Mannschaften', url: '/mannschaften' },
  { key: 'schedule', label: 'Trainingszeiten', url: '/trainingszeiten' },
  { key: 'news', label: 'News', url: '/news' },
  { key: 'contact', label: 'Kontakt', url: '/kontakt' }
];

const slugify = (value) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const newsEntries = [
  {
    date: '2024-09-15',
    title: 'Ligastart der Senioren',
    summary:
      'Unsere 1. Mannschaft startet mit einem Heimspiel in die neue Saison. Anstoß ist um 15:30 Uhr auf dem Sportplatz Hambuch.'
  },
  {
    date: '2024-08-28',
    title: 'Feriencamp für Kinder',
    summary:
      'Ein Wochenende voller Spiel und Spaß für Kids von 7 bis 12 Jahren. Meldet euch bis 10. August über das Formular an.'
  },
  {
    date: '2024-08-05',
    title: 'Neue Trainingsausrüstung',
    summary:
      'Dank unserer Sponsoren trainieren alle Teams ab sofort mit neuer Ausstattung. Ein herzliches Dankeschön!'
  }
].map((entry) => ({
  ...entry,
  slug: slugify(entry.title),
  formattedDate: new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(new Date(entry.date))
}));

const trainingSchedule = {
  football: [
    { team: 'E-Jugend', days: 'Dienstag & Donnerstag', time: '17:00 – 18:30 Uhr' },
    { team: 'B-Jugend', days: 'Montag & Mittwoch', time: '18:00 – 19:30 Uhr' },
    { team: 'Senioren', days: 'Dienstag & Freitag', time: '19:30 – 21:00 Uhr' }
  ],
  fitness: [
    { course: 'Fitness-Mix', day: 'Montag', time: '19:00 – 20:00 Uhr' },
    { course: 'Yoga', day: 'Mittwoch', time: '18:30 – 19:30 Uhr' },
    { course: 'Seniorensport', day: 'Donnerstag', time: '10:00 – 11:00 Uhr' }
  ]
};

const teams = [
  {
    name: 'Herren',
    league: 'Bezirksliga Mitte',
    description: 'Erfahrenes Team mit starkem Nachwuchs und klarer Spielidee.',
    training: ['Dienstag · 19:30 – 21:00 Uhr', 'Freitag · 19:30 – 21:00 Uhr']
  },
  {
    name: 'Damen',
    league: 'Bezirksliga Rhein/Ahr',
    description: 'Technisch versiertes Team mit großem Zusammenhalt auf und neben dem Platz.',
    training: ['Mittwoch · 19:00 – 20:30 Uhr', 'Samstag · 10:30 – 12:00 Uhr']
  },
  {
    name: 'U17-Junioren',
    league: 'Leistungsklasse Rhein/Eifel',
    description: 'Ambitionierter Nachwuchs mit intensiver Förderung durch lizenzierte Trainer.',
    training: ['Montag · 18:00 – 19:30 Uhr', 'Mittwoch · 18:00 – 19:30 Uhr']
  },
  {
    name: 'Breitensport',
    league: '',
    description: 'Fitness- und Gesundheitsangebote für alle Altersklassen inklusive Präventionsprogrammen.',
    training: ['Fitness-Mix Montag · 19:00 – 20:00 Uhr', 'Seniorensport Donnerstag · 10:00 – 11:00 Uhr']
  }
];

const clubFacts = {
  founded: 1965,
  members: 320,
  volunteers: 45,
  mission:
    'Wir fördern Sport für alle Altersklassen, stärken den Teamgeist im Dorf und schaffen Begegnungen, die über den Platz hinaus wirken.',
  values: ['Leidenschaft', 'Fairplay', 'Gemeinschaft', 'Nachwuchsförderung'],
  highlights: [
    'Modernisierung des Sportplatzes inklusive LED-Flutlichtanlage 2022',
    'Jährliches Sommerfest mit Jugendturnier und Familienprogramm',
    'Kooperation mit Grundschulen für Bewegungs- und Talentförderung'
  ]
};

const contact = {
  address: ['SV Hambuch e.V.', 'Sportplatzstraße 8', '56761 Hambuch'],
  phone: '02653 123456',
  email: 'info@sv-hambuch.de',
  board: [
    { role: '1. Vorsitzender', name: 'Peter Schneider', email: 'p.schneider@sv-hambuch.de' },
    { role: '2. Vorsitzende', name: 'Laura Becker', email: 'l.becker@sv-hambuch.de' },
    { role: 'Jugendleitung', name: 'Tim Wagner', email: 't.wagner@sv-hambuch.de' }
  ],
  officeHours: [
    { day: 'Dienstag', time: '18:00 – 19:30 Uhr' },
    { day: 'Freitag', time: '17:00 – 18:30 Uhr' }
  ]
};

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.locals.navItems = navItems;
  next();
});

app.get('/', (req, res) => {
  res.render('layout', {
    title: 'Startseite',
    currentPage: 'home',
    template: 'pages/home',
    hero: {
      heading: 'Willkommen beim SV Hambuch',
      subheading: 'Tradition. Teamgeist. Nachwuchsförderung seit 1965.',
      primaryCta: { label: 'Mitglied werden', href: '/kontakt#formular' },
      secondaryCta: { label: 'Trainingszeiten ansehen', href: '/trainingszeiten' }
    },
    highlights: [
      {
        title: 'Vielfältiger Sport',
        description: 'Fußball, Fitness und Jugendförderung – wir bieten Programme für alle Generationen.'
      },
      {
        title: 'Leidenschaftliche Teams',
        description: 'Ob Kreisliga-Derby oder Jugendturnier: Unsere Teams geben immer 110 %.'
      },
      {
        title: 'Starke Gemeinschaft',
        description: 'Engagement, Ehrenamt und Dorfleben – beim SV Hambuch halten alle zusammen.'
      }
    ],
    news: newsEntries
  });
});

app.get('/verein', (req, res) => {
  res.render('layout', {
    title: 'Unser Verein',
    currentPage: 'club',
    template: 'pages/club',
    club: clubFacts
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
    title: 'Trainingszeiten',
    currentPage: 'schedule',
    template: 'pages/schedule',
    schedule: trainingSchedule
  });
});

app.get('/news', (req, res) => {
  res.render('layout', {
    title: 'News',
    currentPage: 'news',
    template: 'pages/news',
    news: newsEntries
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
