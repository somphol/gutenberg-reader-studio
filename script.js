/* ==========================================================================
   Gutenberg Reader Studio & Vocabulary Lab
   Vanilla ES6 · static-hosting friendly · local-first
   ========================================================================== */
'use strict';

/* --------------------------------------------------------------------------
   1. Constants
   -------------------------------------------------------------------------- */
const APP = {
  name: 'Gutenberg Reader Studio & Vocabulary Lab',
  version: 1,
  storageKey: 'gutenbergStudio.v1',
  dictKey: 'gutenbergStudio.dict.v1',
  stateFileName: 'gutenberg_studio_state.json',
  repository: 'https://github.com/somphol/gutenberg-reader-studio',
  pages: 'https://somphol.github.io/gutenberg-reader-studio/',
};

const DAY = 86400000;
const SRS_INTERVALS = [1, 3, 7, 14, 30, 60];
const SRS_LABELS = ['New', 'Practicing', 'Mastered'];
const CURATED = [
  {
    id: 1342, title: 'Pride and Prejudice', author: 'Jane Austen', year: 1813,
    subjects: ['Courtship', 'Sisters', 'England'], topics: ['romance', 'fiction'],
    blurb: 'Wit, manners, and the slow education of two proud hearts.',
    repo: 'Pride-and-Prejudice_1342', textFile: '1342.txt',
  },
  {
    id: 84, title: 'Frankenstein; or, The Modern Prometheus', author: 'Mary Shelley', year: 1818,
    subjects: ['Scientists', 'Monsters', 'Gothic fiction'], topics: ['fiction', 'science fiction'],
    blurb: 'A creator, a creature, and the cost of unchecked ambition.',
    repo: 'Frankenstein_84', textFile: '84.txt',
  },
  {
    id: 11, title: "Alice's Adventures in Wonderland", author: 'Lewis Carroll', year: 1865,
    subjects: ['Fantasy', 'Nonsense', 'Children'], topics: ['fiction', 'adventure'],
    blurb: 'A rabbit hole, a queen, and language turned inside out.',
    repo: 'Alice-s-Adventures-in-Wonderland_11', textFile: '11.txt',
  },
  {
    id: 1661, title: 'The Adventures of Sherlock Holmes', author: 'Arthur Conan Doyle', year: 1892,
    subjects: ['Detectives', 'Mystery', 'Short stories'], topics: ['mystery', 'fiction'],
    blurb: 'Twelve cases for the world’s most observant detective.',
    repo: 'The-Adventures-of-Sherlock-Holmes_1661', textFile: '1661.txt',
  },
  {
    id: 345, title: 'Dracula', author: 'Bram Stoker', year: 1897,
    subjects: ['Vampires', 'Gothic fiction', 'Horror'], topics: ['fiction', 'mystery'],
    blurb: 'Letters, journals, and a shadow moving toward England.',
    repo: 'Dracula_345', textFile: '345.txt',
  },
  {
    id: 2701, title: 'Moby Dick; or, The Whale', author: 'Herman Melville', year: 1851,
    subjects: ['Whaling', 'Sea stories', 'Obsession'], topics: ['adventure', 'fiction'],
    blurb: 'One captain, one whale, and an ocean of obsession.',
    repo: 'Moby-Dick--Or-The-Whale_2701', textFile: '2701.txt',
  },
  {
    id: 64317, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', year: 1925,
    subjects: ['Jazz age', 'Long Island', 'American dream'], topics: ['fiction', 'romance'],
    blurb: 'A green light, a gold hat, and a dream already behind.',
    repo: 'The-Great-Gatsby_64317', textFile: '64317-0.txt',
  },
  {
    id: 174, title: 'The Picture of Dorian Gray', author: 'Oscar Wilde', year: 1890,
    subjects: ['Portraits', 'Aesthetics', 'Gothic fiction'], topics: ['fiction', 'philosophy'],
    blurb: 'A portrait ages so its subject need not.',
    repo: 'The-Picture-of-Dorian-Gray_174', textFile: '174.txt',
  },
  {
    id: 5200, title: 'Metamorphosis', author: 'Franz Kafka', year: 1915,
    subjects: ['Alienation', 'Family', 'Modern fiction'], topics: ['fiction', 'philosophy'],
    blurb: 'A man wakes up changed, and the world carries on.',
    repo: 'Metamorphosis_5200', textFile: '5200.txt',
  },
  {
    id: 514, title: 'Little Women', author: 'Louisa May Alcott', year: 1868,
    subjects: ['Sisters', 'Family', 'New England'], topics: ['fiction', 'romance'],
    blurb: 'Four sisters growing up with ink, music, and each other.',
    repo: 'Little-Women_514', textFile: '514.txt',
  },
  {
    id: 2600, title: 'War and Peace', author: 'Leo Tolstoy', year: 1869,
    subjects: ['Napoleonic Wars', 'Russia', 'Society'], topics: ['fiction', 'philosophy'],
    blurb: 'History on a grand scale, lived one family at a time.',
    repo: 'War-and-Peace_2600', textFile: '2600.txt',
  },
  {
    id: 2554, title: 'Crime and Punishment', author: 'Fyodor Dostoyevsky', year: 1866,
    subjects: ['Murder', 'Guilt', 'Saint Petersburg'], topics: ['fiction', 'philosophy'],
    blurb: 'A theory, an axe, and the long echo of conscience.',
    repo: 'Crime-and-Punishment_2554', textFile: '2554.txt',
  },
  {
    id: 98, title: 'A Tale of Two Cities', author: 'Charles Dickens', year: 1859,
    subjects: ['French Revolution', 'London', 'Paris'], topics: ['fiction', 'adventure'],
    blurb: 'Two cities, one revolution, and a far, far better thing.',
    repo: 'A-Tale-of-Two-Cities_98', textFile: '98.txt',
  },
  {
    id: 35, title: 'The Time Machine', author: 'H. G. Wells', year: 1895,
    subjects: ['Time travel', 'Future', 'Science fiction'], topics: ['science fiction', 'adventure'],
    blurb: 'A Victorian inventor rides forward to the end of the world.',
    repo: 'The-Time-Machine_35', textFile: '35.txt',
  },
  {
    id: 120, title: 'Treasure Island', author: 'Robert Louis Stevenson', year: 1883,
    subjects: ['Pirates', 'Treasure', 'Adventure'], topics: ['adventure', 'fiction'],
    blurb: 'A map, a mutiny, and a boy learning what men are worth.',
    repo: 'Treasure-Island_120', textFile: '120.txt',
  },
  {
    id: 74, title: 'The Adventures of Tom Sawyer', author: 'Mark Twain', year: 1876,
    subjects: ['Mississippi', 'Boyhood', 'Missouri'], topics: ['adventure', 'fiction'],
    blurb: 'Fences, funerals, and a cave on the edge of town.',
    repo: 'The-Adventures-of-Tom-Sawyer_74', textFile: '74.txt',
  },
  {
    id: 158, title: 'Emma', author: 'Jane Austen', year: 1815,
    subjects: ['Matchmaking', 'England', 'Humour'], topics: ['romance', 'fiction'],
    blurb: 'A clever young woman with far too much confidence in her plans.',
    repo: 'Emma_158', textFile: '158.txt',
  },
  {
    id: 1260, title: 'Jane Eyre: An Autobiography', author: 'Charlotte Brontë', year: 1847,
    subjects: ['Governesses', 'Orphans', 'Gothic fiction'], topics: ['romance', 'fiction'],
    blurb: 'A small, fierce life insisting on its own worth.',
    repo: 'Jane-Eyre_1260', textFile: '1260.txt',
  },
  {
    id: 215, title: 'The Call of the Wild', author: 'Jack London', year: 1903,
    subjects: ['Dogs', 'Yukon', 'Survival'], topics: ['adventure', 'fiction'],
    blurb: 'A domestic dog answers something older in the snow.',
    repo: 'The-Call-of-the-Wild_215', textFile: '215.txt',
  },
  {
    id: 219, title: 'Heart of Darkness', author: 'Joseph Conrad', year: 1899,
    subjects: ['Africa', 'Colonialism', 'Voyages'], topics: ['adventure', 'philosophy'],
    blurb: 'A river journey into the machinery of empire.',
    repo: 'Heart-of-Darkness_219', textFile: '219.txt',
  },
].map((book) => ({
  ...book,
  authorSort: authorSortName(book.author),
  cover: coverUrl(book.id),
  htmlUrl: `https://www.gutenberg.org/ebooks/${book.id}`,
  languages: ['en'],
  downloads: 0,
  source: 'curated',
}));

const THEME_META = {
  paper: '#fbf9f5',
  sepia: '#f4ecd8',
  midnight: '#1e222a',
  oled: '#000000',
};

const FONT_STACKS = {
  georgia: "Georgia, 'Iowan Old Style', 'Palatino Linotype', 'Book Antiqua', serif",
  inter: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  opendyslexic: "'OpenDyslexic', Verdana, 'Comic Sans MS', sans-serif",
};

const TOPIC_LABELS = {
  all: 'All',
  fiction: 'Fiction',
  romance: 'Romance',
  adventure: 'Adventure',
  mystery: 'Mystery',
  philosophy: 'Philosophy',
  'science fiction': 'Science fiction',
};

/* --------------------------------------------------------------------------
   2. Tiny utilities
   -------------------------------------------------------------------------- */
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function debounce(fn, wait = 200) {
  let timer = null;
  const wrapped = (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
  wrapped.cancel = () => clearTimeout(timer);
  return wrapped;
}

function uid(prefix = 'id') {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function formatNumber(value) {
  return new Intl.NumberFormat('en').format(Number(value) || 0);
}

function formatCompact(value) {
  const number = Number(value) || 0;
  if (number >= 1000000) return `${(number / 1000000).toFixed(1).replace(/\.0$/, '')}m`;
  if (number >= 1000) return `${(number / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  return String(number);
}

function coverUrl(id) {
  return `https://www.gutenberg.org/cache/epub/${id}/pg${id}.cover.medium.jpg`;
}

function cleanBookTitle(title) {
  return String(title || 'Untitled')
    .replace(/\s+/g, ' ')
    .replace(/\s*;\s*/g, '; ')
    .trim();
}

function authorSortName(name) {
  const clean = String(name || '').replace(/\s+/g, ' ').trim();
  if (!clean) return '';
  const parts = clean.split(',');
  if (parts.length > 1) return `${parts[1].trim()} ${parts[0].trim()}`.trim();
  return clean;
}

function formatAuthor(name) {
  const clean = String(name || '').replace(/\s+/g, ' ').trim();
  if (!clean) return 'Unknown author';
  const parts = clean.split(',').map((part) => part.trim());
  if (parts.length > 1) {
    const surname = parts[0];
    const given = parts[1].replace(/\b\d{3,4}\b/g, '').replace(/^-+|-+$/g, '').trim();
    if (given) return `${given} ${surname}`;
  }
  return clean.replace(/\b\d{3,4}\b/g, '').replace(/\s+/g, ' ').trim();
}

function formatAuthors(authors) {
  if (!Array.isArray(authors) || !authors.length) return 'Unknown author';
  const names = authors.map((author) => formatAuthor(author.name)).filter(Boolean);
  if (!names.length) return 'Unknown author';
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} & ${names[1]}`;
  return `${names.slice(0, 2).join(', ')} & others`;
}

function stripDiacritics(value) {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function slugify(value) {
  return stripDiacritics(value)
    .replace(/['’]/g, '-')
    .replace(/&/g, ' and ')
    .replace(/[^A-Za-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-');
}

function normalizeWord(value) {
  let word = String(value || '')
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/^[^a-z]+|[^a-z]+$/g, '')
    .trim();
  if (!word) return '';
  if (!/^[a-z][a-z'\-]*$/.test(word)) {
    const match = word.match(/[a-z][a-z'\-]*/);
    word = match ? match[0] : '';
  }
  return word.slice(0, 60);
}

function tokenizeWords(text) {
  return String(text || '').match(/[A-Za-z][A-Za-z'’\-]*/g) || [];
}

function sentenceAround(text, index, word) {
  const source = String(text || '');
  if (!source) return '';
  const needle = String(word || '').toLowerCase();
  let pos = index;
  if (!Number.isFinite(pos) || pos < 0) {
    pos = needle ? source.toLowerCase().indexOf(needle) : 0;
  }
  if (pos < 0) pos = 0;

  let start = pos;
  let end = pos + Math.max(needle.length, 1);
  const lowerBound = Math.max(0, pos - 320);
  const upperBound = Math.min(source.length, pos + 360);

  while (start > lowerBound) {
    const boundaryIndex = start - 1;
    if (isSentenceBoundary(source, boundaryIndex)) break;
    if (source[boundaryIndex] === '\n' && source[start - 2] === '\n') break;
    start -= 1;
  }
  while (end < upperBound) {
    if (isSentenceBoundary(source, end)) {
      end += 1;
      while (/["'”’)]/.test(source[end] || '')) end += 1;
      break;
    }
    if (source[end] === '\n' && source[end + 1] === '\n') break;
    end += 1;
  }

  let sentence = source.slice(start, end).replace(/\s+/g, ' ').trim();
  if (sentence.length > 340) {
    const wordAt = sentence.toLowerCase().indexOf(needle);
    const center = wordAt >= 0 ? wordAt : Math.floor(sentence.length / 2);
    const from = Math.max(0, center - 150);
    const to = Math.min(sentence.length, center + 190);
    sentence = `${from > 0 ? '…' : ''}${sentence.slice(from, to).trim()}${to < sentence.length ? '…' : ''}`;
  }
  return sentence;
}

function isSentenceBoundary(text, index) {
  const char = text[index];
  if (!/[.!?]/.test(char)) return false;
  let next = index + 1;
  if (/["'”’)]/.test(text[next] || '')) next += 1;
  if (next < text.length && !/\s/.test(text[next])) return false;
  if (char === '.') {
    const before = text.slice(Math.max(0, index - 18), index + 1);
    if (/(?:^|\s)(?:Mr|Mrs|Ms|Dr|St|Jr|Sr|Prof|Rev|Hon|Capt|Col|Gen|Lt|Sgt|vs|etc|e\.g|i\.e|No|Vol|Ch|pp)\.$/i.test(before)) {
      return false;
    }
    if (/(?:^|\s)[A-Z]\.$/.test(before)) return false;
  }
  return true;
}

function relativeTime(timestamp) {
  const value = Number(timestamp) || Date.now();
  const diff = value - Date.now();
  const abs = Math.abs(diff);
  const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  if (abs < 45000) return 'just now';
  if (abs < 3600000) return formatter.format(Math.round(diff / 60000), 'minute');
  if (abs < 86400000) return formatter.format(Math.round(diff / 3600000), 'hour');
  if (abs < 604800000) return formatter.format(Math.round(diff / 86400000), 'day');
  if (abs < 2629800000) return formatter.format(Math.round(diff / 604800000), 'week');
  if (abs < 31557600000) return formatter.format(Math.round(diff / 2629800000), 'month');
  return formatter.format(Math.round(diff / 31557600000), 'year');
}

function dueLabel(entry) {
  const due = Number(entry.nextReviewDue);
  if (!due || due <= Date.now()) {
    if (entry.lastReviewed) {
      const days = Math.max(1, Math.floor((Date.now() - due) / DAY));
      return `Overdue by ${days} ${days === 1 ? 'day' : 'days'}`;
    }
    return 'Due now';
  }
  return `Due ${relativeTime(due)}`;
}

function statusOf(entry) {
  const count = Number(entry.reviewCount) || 0;
  if (count >= 4) return 'mastered';
  if (count >= 1) return 'practicing';
  return 'new';
}

function prefersReducedMotion() {
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

async function fetchWithTimeout(url, options = {}, timeout = 12000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function fetchJson(url, options = {}) {
  const { timeout = 12000, ...rest } = options;
  const response = await fetchWithTimeout(url, {
    mode: 'cors',
    headers: { Accept: 'application/json', ...(rest.headers || {}) },
    ...rest,
  }, timeout);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

async function fetchGutendex(url, timeout = 9000) {
  try {
    return await fetchJson(url, { timeout });
  } catch (directError) {
    // Some networks block Gutendex directly. A public CORS relay is a
    // best-effort fallback; the direct request remains the primary path.
    const relays = [
      `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
      `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
    ];
    const results = await Promise.allSettled(
      relays.map((relay) => fetchJson(relay, { timeout: 9000 }))
    );
    const success = results.find((result) => result.status === 'fulfilled');
    if (success) return success.value;
    throw directError;
  }
}

/* --------------------------------------------------------------------------
   3. State
   -------------------------------------------------------------------------- */
function defaultState() {
  return {
    version: APP.version,
    settings: {
      theme: 'paper',
      font: 'georgia',
      fontSize: 19,
      lineHeight: 1.65,
      bionic: false,
      pageTurn: typeof window === 'undefined' ? true : window.innerWidth > 720,
      rsvpWpm: 260,
      teleprompterSpeed: 30,
      ambient: 'off',
      ambientVolume: 0.45,
    },
    library: {
      activeBookId: null,
      books: {},
      recent: [],
    },
    wordBank: {},
    notes: {},
    stats: {
      wordsCaptured: 0,
      reviews: 0,
      readingSeconds: 0,
    },
  };
}

function sanitizeSettings(raw = {}) {
  const base = defaultState().settings;
  const settings = { ...base };
  if (['paper', 'sepia', 'midnight', 'oled'].includes(raw.theme)) settings.theme = raw.theme;
  if (['georgia', 'inter', 'opendyslexic'].includes(raw.font)) settings.font = raw.font;
  settings.fontSize = clamp(Number(raw.fontSize) || base.fontSize, 14, 32);
  settings.lineHeight = clamp(Number(raw.lineHeight) || base.lineHeight, 1.2, 2.2);
  settings.bionic = Boolean(raw.bionic);
  settings.pageTurn = raw.pageTurn === undefined ? base.pageTurn : Boolean(raw.pageTurn);
  settings.rsvpWpm = clamp(Number(raw.rsvpWpm) || base.rsvpWpm, 150, 500);
  settings.teleprompterSpeed = clamp(Number(raw.teleprompterSpeed) || base.teleprompterSpeed, 5, 120);
  settings.ambient = ['off', 'rain', 'cafe', 'fireplace'].includes(raw.ambient) ? raw.ambient : 'off';
  settings.ambientVolume = clamp(Number(raw.ambientVolume) || base.ambientVolume, 0, 1);
  return settings;
}

function normalizeBankEntry(entry) {
  if (!entry || typeof entry !== 'object') return null;
  const word = normalizeWord(entry.word || entry.key || '');
  if (!word) return null;
  const reviewCount = Math.max(0, Number(entry.reviewCount) || 0);
  return {
    word,
    phonetic: String(entry.phonetic || ''),
    audio: String(entry.audio || ''),
    definitions: Array.isArray(entry.definitions) ? entry.definitions.slice(0, 5) : [],
    context: String(entry.context || ''),
    contexts: Array.isArray(entry.contexts) ? entry.contexts.slice(0, 5) : [],
    bookId: entry.bookId ?? null,
    bookTitle: String(entry.bookTitle || ''),
    createdAt: Number(entry.createdAt) || Date.now(),
    updatedAt: Number(entry.updatedAt) || Number(entry.createdAt) || Date.now(),
    lastReviewed: entry.lastReviewed ? Number(entry.lastReviewed) : null,
    reviewCount,
    intervalIndex: clamp(Number(entry.intervalIndex) || 0, 0, SRS_INTERVALS.length - 1),
    nextReviewDue: Number(entry.nextReviewDue) || Date.now(),
    status: statusOf({ reviewCount }),
  };
}

function mergeState(raw) {
  const next = defaultState();
  if (!raw || typeof raw !== 'object') return next;
  next.settings = sanitizeSettings(raw.settings || {});
  if (raw.library && typeof raw.library === 'object') {
    next.library.activeBookId = raw.library.activeBookId ?? null;
    next.library.books = raw.library.books && typeof raw.library.books === 'object' ? raw.library.books : {};
    next.library.recent = Array.isArray(raw.library.recent) ? raw.library.recent.slice(0, 30) : [];
  }
  if (raw.wordBank && typeof raw.wordBank === 'object') {
    Object.entries(raw.wordBank).forEach(([key, entry]) => {
      const normalized = normalizeBankEntry({ ...entry, word: entry.word || key });
      if (normalized) next.wordBank[normalized.word] = normalized;
    });
  }
  if (raw.notes && typeof raw.notes === 'object') {
    Object.entries(raw.notes).forEach(([bookId, notes]) => {
      if (!Array.isArray(notes)) return;
      next.notes[bookId] = notes
        .filter((note) => note && typeof note.text === 'string' && note.text.trim())
        .map((note) => ({
          id: note.id || uid('note'),
          text: String(note.text).slice(0, 8000),
          page: Number(note.page) || 1,
          createdAt: Number(note.createdAt) || Date.now(),
          updatedAt: Number(note.updatedAt) || Number(note.createdAt) || Date.now(),
        }));
    });
  }
  if (raw.stats && typeof raw.stats === 'object') {
    next.stats.wordsCaptured = Number(raw.stats.wordsCaptured) || 0;
    next.stats.reviews = Number(raw.stats.reviews) || 0;
    next.stats.readingSeconds = Number(raw.stats.readingSeconds) || 0;
  }
  return next;
}

function loadState() {
  try {
    const raw = localStorage.getItem(APP.storageKey);
    if (!raw) return defaultState();
    return mergeState(JSON.parse(raw));
  } catch (error) {
    console.warn('Could not load saved state:', error);
    return defaultState();
  }
}

let state = loadState();
let saveTimer = null;
let quotaWarned = false;

function saveStateNow() {
  clearTimeout(saveTimer);
  saveTimer = null;
  try {
    localStorage.setItem(APP.storageKey, JSON.stringify(state));
  } catch (error) {
    if (!quotaWarned) {
      quotaWarned = true;
      toast('Local storage is full. Export your library to keep it safe.', 'error');
    }
    console.warn('Could not save state:', error);
  }
}

function saveStateSoon() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(saveStateNow, 250);
}

/* --------------------------------------------------------------------------
   4. UI state
   -------------------------------------------------------------------------- */
const ui = {
  view: 'library',
  search: {
    query: '',
    topic: 'all',
    results: [],
    next: null,
    page: 1,
    total: 0,
    loading: false,
    sort: 'popular',
  },
  currentBook: null,
  bookData: null,
  currentPage: 0,
  progressPercent: 0,
  pageRenderToken: 0,
  loadingBook: false,
  drawer: null,
  popup: null,
  lastPopupAt: 0,
  selectionTimer: null,
  noteEditingId: null,
  textCache: new Map(),
  dictCache: loadDictCache(),
  rsvp: { open: false, index: 0, playing: false, timer: null },
  review: { queue: [], index: 0, revealed: false },
  teleprompter: { active: false, paused: false, raf: null, last: 0 },
  lastFocus: null,
  ignoreHash: false,
};

/* --------------------------------------------------------------------------
   5. Settings & themes
   -------------------------------------------------------------------------- */
function applySettings(options = {}) {
  const settings = state.settings;
  const root = document.documentElement;
  root.dataset.theme = settings.theme;
  root.style.setProperty('--reader-size', `${settings.fontSize}px`);
  root.style.setProperty('--reader-leading', settings.lineHeight);
  root.style.setProperty('--reader-font', FONT_STACKS[settings.font] || FONT_STACKS.georgia);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', THEME_META[settings.theme] || THEME_META.paper);
  syncSettingsUI();
  if (options.rerender && ui.bookData) renderCurrentView();
}

function syncSettingsUI() {
  const settings = state.settings;
  $$('[data-theme-choice]').forEach((button) => {
    const active = button.dataset.themeChoice === settings.theme;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  $$('[data-font-choice]').forEach((button) => {
    const active = button.dataset.fontChoice === settings.font;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  $$('[data-sound]').forEach((button) => {
    const active = button.dataset.sound === settings.ambient;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });

  const fontSize = $('#font-size-range');
  if (fontSize) {
    fontSize.value = settings.fontSize;
    setRangeFill(fontSize);
  }
  const lineHeight = $('#line-height-range');
  if (lineHeight) {
    lineHeight.value = settings.lineHeight;
    setRangeFill(lineHeight);
  }
  const wpm = $('#wpm-range');
  if (wpm) {
    wpm.value = settings.rsvpWpm;
    setRangeFill(wpm);
  }
  const volume = $('#volume-range');
  if (volume) {
    volume.value = settings.ambientVolume;
    setRangeFill(volume);
  }
  const tp = $('#teleprompter-speed');
  if (tp) {
    tp.value = settings.teleprompterSpeed;
    setRangeFill(tp);
  }
  const rsvpWpm = $('#rsvp-wpm');
  if (rsvpWpm) {
    rsvpWpm.value = settings.rsvpWpm;
    setRangeFill(rsvpWpm);
  }

  setText('#font-size-readout', `${settings.fontSize}px`);
  setText('#line-height-readout', `${settings.lineHeight.toFixed(2)}×`);
  setText('#wpm-readout', `${settings.rsvpWpm} wpm`);
  setText('#volume-readout', `${Math.round(settings.ambientVolume * 100)}%`);
  setText('#teleprompter-speed-label', String(settings.teleprompterSpeed));
  setText('#rsvp-wpm-readout', `${settings.rsvpWpm} wpm`);
  setText('#ambient-readout', settings.ambient === 'off' ? 'Off' : capitalize(settings.ambient));

  const togglePageTurn = $('#toggle-pageturn');
  if (togglePageTurn) togglePageTurn.checked = settings.pageTurn;
  const toggleBionic = $('#toggle-bionic');
  if (toggleBionic) toggleBionic.checked = settings.bionic;
  updateBionicUI();
  updateModeUI();
  updateAmbientUI();
}

function setRangeFill(input) {
  if (!input) return;
  const min = Number(input.min) || 0;
  const max = Number(input.max) || 100;
  const value = Number(input.value) || 0;
  const percent = max > min ? ((value - min) / (max - min)) * 100 : 0;
  input.style.setProperty('--fill', `${percent}%`);
}

function setSetting(key, value, options = {}) {
  if (!(key in state.settings)) return;
  const previousPercent = key === 'pageTurn' ? currentPercent() : null;
  state.settings[key] = value;
  saveStateSoon();
  applySettings();
  if (options.repaginate) scheduleRepaginate();
  if (key === 'font' && document.fonts?.ready) {
    document.fonts.ready.then(() => scheduleRepaginate()).catch(() => {});
  }
  if (options.rerender) renderCurrentView();
  if (key === 'bionic') renderCurrentView();
  if (key === 'pageTurn') switchMode(value, { silent: true, percent: previousPercent });
  if (key === 'ambientVolume') Ambient.setVolume(value);
  if (key === 'rsvpWpm' && ui.rsvp.open && ui.rsvp.playing) restartRsvpTimer();
}

function updateBionicUI() {
  const active = state.settings.bionic;
  const button = $('#quick-bionic');
  if (button) button.setAttribute('aria-pressed', String(active));
  const toggle = $('#toggle-bionic');
  if (toggle) toggle.checked = active;
}

function updateModeUI() {
  const pageMode = state.settings.pageTurn;
  $$('.mode-btn').forEach((button) => {
    button.classList.toggle('is-active', button.dataset.mode === (pageMode ? 'page' : 'scroll'));
  });
  const pageViewport = $('#page-viewport');
  const scrollViewport = $('#scroll-viewport');
  if (pageViewport) pageViewport.hidden = !pageMode;
  if (scrollViewport) scrollViewport.hidden = pageMode;
}

function updateAmbientUI() {
  const active = state.settings.ambient !== 'off';
  const button = $('#quick-sound');
  if (button) button.setAttribute('aria-pressed', String(active));
  setText('#ambient-readout', state.settings.ambient === 'off' ? 'Off' : capitalize(state.settings.ambient));
}

function capitalize(value) {
  const text = String(value || '');
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function setText(selector, text) {
  const element = $(selector);
  if (element) element.textContent = text;
}

/* --------------------------------------------------------------------------
   6. Library
   -------------------------------------------------------------------------- */
function normalizeGutendexBook(raw) {
  const formats = raw.formats || {};
  const textKeys = Object.keys(formats).filter((key) => key.startsWith('text/plain'));
  const textUrl =
    formats['text/plain; charset=utf-8'] ||
    formats['text/plain'] ||
    textKeys.map((key) => formats[key]).find(Boolean) ||
    null;
  const htmlUrl = formats['text/html'] || formats['text/html; charset=utf-8'] || `https://www.gutenberg.org/ebooks/${raw.id}`;
  const cover = formats['image/jpeg'] || coverUrl(raw.id);
  return {
    id: raw.id,
    title: cleanBookTitle(raw.title),
    author: formatAuthors(raw.authors),
    authorSort: authorSortName(raw.authors?.[0]?.name || ''),
    subjects: Array.isArray(raw.subjects) ? raw.subjects : [],
    bookshelves: Array.isArray(raw.bookshelves) ? raw.bookshelves : [],
    languages: Array.isArray(raw.languages) ? raw.languages : ['en'],
    downloads: Number(raw.download_count) || 0,
    cover,
    textUrl,
    htmlUrl,
    repo: null,
    textFile: null,
    source: 'gutendex',
    year: raw.authors?.[0]?.birth_year || null,
  };
}

function renderCurated() {
  const grid = $('#book-grid');
  if (!grid) return;
  grid.innerHTML = '';
  CURATED.forEach((book, index) => {
    grid.appendChild(bookCard(book, index));
  });
}

function bookCard(book, index = 0) {
  const card = document.createElement('button');
  card.type = 'button';
  card.className = 'book-card';
  card.style.setProperty('--i', String(index % 12));
  card.setAttribute('aria-label', `Read ${book.title} by ${book.author}`);
  card.dataset.bookId = String(book.id);
  const fallbackClass = ['', 'is-warm', 'is-blue', 'is-gold'][Number(book.id) % 4];
  const badge = book.downloads > 0 ? `↓ ${formatCompact(book.downloads)}` : 'Free';
  const subject = (book.subjects && book.subjects[0]) || 'Classic literature';
  card.innerHTML = `
    <span class="book-cover">
      <span class="cover-fallback ${fallbackClass}">
        <span class="cover-fallback-title">${escapeHtml(book.title)}</span>
        <span class="cover-fallback-author">${escapeHtml(book.author)}</span>
      </span>
      <img src="${escapeHtml(book.cover)}" alt="" loading="lazy" decoding="async">
      <span class="book-badge">${escapeHtml(badge)}</span>
    </span>
    <span class="book-info">
      <span class="book-title">${escapeHtml(book.title)}</span>
      <span class="book-author">${escapeHtml(book.author)}</span>
      <span class="book-meta-row">
        <span class="book-subject">${escapeHtml(subject)}</span>
        <span class="dot"></span>
        <span>${book.year || 'Gutenberg'}</span>
      </span>
    </span>`;
  const image = card.querySelector('img');
  if (image) {
    image.addEventListener('error', () => image.remove(), { once: true });
  }
  card.addEventListener('click', () => openBook(book));
  return card;
}

function renderSkeletons(grid, count = 8) {
  if (!grid) return;
  grid.innerHTML = '';
  for (let i = 0; i < count; i += 1) {
    const skeleton = document.createElement('div');
    skeleton.className = 'book-skeleton';
    skeleton.setAttribute('aria-hidden', 'true');
    grid.appendChild(skeleton);
  }
}

async function performSearch(query, options = {}) {
  const topic = options.topic || 'all';
  const page = options.page || 1;
  const append = Boolean(options.append);
  if (ui.search.loading) return;

  ui.search.loading = true;
  ui.search.query = query;
  ui.search.topic = topic;
  ui.search.page = page;
  if (!append) {
    ui.search.results = [];
    ui.search.next = null;
    ui.search.total = 0;
    showResultsView();
    renderSkeletons($('#search-grid'), 8);
    setText('#results-heading', query ? `Results for “${query}”` : `${TOPIC_LABELS[topic] || 'Popular'} classics`);
    setText('#results-eyebrow', query ? 'Project Gutenberg search' : 'Browse the collection');
    setText('#results-sub', 'Searching the Gutendex catalogue…');
    setText('#grid-status', 'Contacting Gutendex…');
    const loadMore = $('#load-more');
    if (loadMore) loadMore.hidden = true;
  } else {
    setText('#grid-status', 'Loading more books…');
  }

  try {
    const url = new URL('https://gutendex.com/books/');
    url.searchParams.set('languages', 'en');
    url.searchParams.set('page', String(page));
    if (query) url.searchParams.set('search', query);
    if (topic && topic !== 'all') url.searchParams.set('topic', topic);
    url.searchParams.set('sort', ui.search.sort === 'popular' ? 'popular' : 'ascending');
    const data = await fetchGutendex(url.toString(), 12000);
    let books = (data.results || []).map(normalizeGutendexBook);
    if (ui.search.sort === 'title') books.sort((a, b) => a.title.localeCompare(b.title));
    if (ui.search.sort === 'author') books.sort((a, b) => a.authorSort.localeCompare(b.authorSort));
    ui.search.results = append ? [...ui.search.results, ...books] : books;
    ui.search.next = data.next || null;
    ui.search.total = Number(data.count) || ui.search.results.length;
    renderSearchResults();
    setText('#grid-status', `${formatNumber(ui.search.total)} books found${ui.search.next ? '' : ' · end of results'}`);
  } catch (error) {
    console.error('Search failed:', error);
    const grid = $('#search-grid');
    if (grid) {
      grid.innerHTML = `
        <div class="empty-state">
          <strong>Could not reach Gutendex</strong>
          <p>The catalogue may be busy, or this network may block the request. Try again in a moment.</p>
          <button class="btn btn-ghost btn-small" type="button" id="retry-search">Try again</button>
        </div>`;
      $('#retry-search')?.addEventListener('click', () => performSearch(query, { topic, page: 1 }));
    }
    setText('#grid-status', 'Search unavailable. Check your connection.');
  } finally {
    ui.search.loading = false;
  }
}

function showResultsView() {
  const shelf = $('#shelf-section');
  const results = $('#results-section');
  if (shelf) shelf.hidden = true;
  if (results) results.hidden = false;
  setText('#results-heading', ui.search.query ? `Results for “${ui.search.query}”` : `${TOPIC_LABELS[ui.search.topic] || 'Popular'} classics`);
  setText('#results-sub', '');
}

function renderSearchResults() {
  const grid = $('#search-grid');
  if (!grid) return;
  grid.innerHTML = '';
  if (!ui.search.results.length) {
    grid.innerHTML = `
      <div class="empty-state">
        <strong>No books found</strong>
        <p>Try a shorter title, an author’s surname, or a broader subject.</p>
      </div>`;
  } else {
    ui.search.results.forEach((book, index) => grid.appendChild(bookCard(book, index)));
  }
  const loadMore = $('#load-more');
  if (loadMore) loadMore.hidden = !ui.search.next;
  const heading = ui.search.query
    ? `Results for “${ui.search.query}”`
    : `${TOPIC_LABELS[ui.search.topic] || 'Popular'} classics`;
  setText('#results-heading', heading);
  const sortLabel = ui.search.sort === 'popular' ? 'most popular' : ui.search.sort === 'title' ? 'title A–Z' : 'author A–Z';
  setText('#results-sub', `${formatNumber(ui.search.total)} public-domain books · sorted by ${sortLabel}`);
}

function clearSearch(options = {}) {
  ui.search.query = '';
  ui.search.topic = 'all';
  ui.search.results = [];
  ui.search.next = null;
  ui.search.total = 0;
  ui.search.page = 1;
  const input = $('#search-input');
  if (input) input.value = '';
  $$('#genre-chips .chip').forEach((chip) => chip.classList.toggle('is-active', chip.dataset.topic === 'all'));
  const shelf = $('#shelf-section');
  const results = $('#results-section');
  if (shelf) shelf.hidden = false;
  if (results) results.hidden = true;
  if (!options.silent) renderCurated();
}

async function loadMoreResults() {
  if (!ui.search.next || ui.search.loading) return;
  try {
    ui.search.loading = true;
    setText('#grid-status', 'Loading more books…');
    const data = await fetchGutendex(ui.search.next, 12000);
    const books = (data.results || []).map(normalizeGutendexBook);
    ui.search.results = [...ui.search.results, ...books];
    ui.search.next = data.next || null;
    renderSearchResults();
    setText('#grid-status', `${formatNumber(ui.search.total)} books found${ui.search.next ? '' : ' · end of results'}`);
  } catch (error) {
    console.error('Load more failed:', error);
    toast('Could not load more books. Try again.', 'error');
  } finally {
    ui.search.loading = false;
  }
}

/* --------------------------------------------------------------------------
   7. Text engine: fetching, cleaning, chapters, pages
   -------------------------------------------------------------------------- */
function looksLikeBook(text) {
  if (!text || text.length < 800) return false;
  const head = text.slice(0, 400).toLowerCase();
  if (head.includes('<!doctype html') || head.includes('<html')) return false;
  if (head.includes('cloudflare') || head.includes('error code:')) return false;
  const letters = (text.match(/[A-Za-z]/g) || []).length;
  return letters / text.length > 0.35;
}

async function fetchText(url, timeout = 15000) {
  const response = await fetchWithTimeout(url, {
    mode: 'cors',
    headers: { Accept: 'text/plain, text/html;q=0.9, */*;q=0.8' },
  }, timeout);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const text = await response.text();
  if (!looksLikeBook(text)) throw new Error('Response was not a readable book');
  return text;
}

function gitenbergUrl(repo, file) {
  const safeRepo = repo.split('/').map(encodeURIComponent).join('/');
  const safeFile = file.split('/').map(encodeURIComponent).join('/');
  return `https://raw.githubusercontent.com/GITenberg/${safeRepo}/master/${safeFile}`;
}

function deriveRepoSlugs(title) {
  const base = cleanBookTitle(title)
    .replace(/\[[^\]]*\]/g, ' ')
    .replace(/\([^)]*\)/g, ' ')
    .replace(/\s*,\s*complete\s*$/i, '')
    .trim();
  const candidates = new Set();
  const add = (value) => {
    const slug = slugify(value);
    if (slug && slug.length > 2) candidates.add(slug);
  };
  add(base);
  add(base.split(';')[0]);
  add(base.split(':')[0]);
  add(base.split(/\s+[—–-]\s+/)[0]);
  add(base.replace(/^(the|a|an)\s+/i, ''));
  add(base.split(/\s+/).slice(0, 8).join(' '));
  add(base.split(/\s+/).slice(0, 6).join(' '));
  return Array.from(candidates).slice(0, 6);
}

async function resolveGitenbergRepos(book) {
  const repos = new Set();
  if (book.repo) repos.add(book.repo);
  if (!repos.size) {
    try {
      const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(String(book.id))}+in:name+org:GITenberg&per_page=4`;
      const data = await fetchJson(url, {
        timeout: 8000,
        headers: { Accept: 'application/vnd.github+json' },
      });
      (data.items || []).forEach((item) => {
        if (!item?.full_name) return;
        const repoName = item.full_name.split('/').pop();
        if (repoName.endsWith(`_${book.id}`)) repos.add(repoName);
      });
    } catch (error) {
      console.warn('GitHub repository lookup failed:', error.message);
    }
  }
  if (!repos.size) {
    deriveRepoSlugs(book.title).forEach((slug) => repos.add(`${slug}_${book.id}`));
  }
  return Array.from(repos);
}

async function getBookText(book, onStatus = () => {}) {
  const key = String(book.id);
  if (ui.textCache.has(key)) return ui.textCache.get(key);

  const attempts = [];
  const addAttempt = (url, label) => {
    if (url && !attempts.some((attempt) => attempt.url === url)) attempts.push({ url, label });
  };

  if (book.repo && book.textFile) addAttempt(gitenbergUrl(book.repo, book.textFile), 'GITenberg archive');

  // GITenberg is the most reliable CORS-enabled source. Try known repos and
  // derived names first, then a GitHub name search for unusual titles.
  const repos = await resolveGitenbergRepos(book);
  const fileVariants = [`${book.id}.txt`, `${book.id}-0.txt`, `${book.id}-8.txt`, `pg${book.id}.txt`];
  repos.slice(0, 5).forEach((repo) => {
    fileVariants.forEach((file) => addAttempt(gitenbergUrl(repo, file), 'GITenberg archive'));
  });

  if (book.textUrl) addAttempt(book.textUrl, 'Project Gutenberg');
  addAttempt(`https://www.gutenberg.org/cache/epub/${book.id}/pg${book.id}.txt`, 'Project Gutenberg mirror');
  addAttempt(`https://www.gutenberg.org/files/${book.id}/${book.id}-0.txt`, 'Project Gutenberg mirror');
  addAttempt(`https://www.gutenberg.org/files/${book.id}/${book.id}.txt`, 'Project Gutenberg mirror');

  const proxyTargets = [
    book.textUrl,
    `https://www.gutenberg.org/cache/epub/${book.id}/pg${book.id}.txt`,
  ].filter(Boolean);
  proxyTargets.forEach((target) => {
    addAttempt(`https://api.allorigins.win/raw?url=${encodeURIComponent(target)}`, 'CORS relay');
    addAttempt(`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(target)}`, 'CORS relay');
  });

  let lastError = null;
  for (const attempt of attempts) {
    onStatus(`Trying ${attempt.label}…`);
    try {
      const raw = await fetchText(attempt.url, 14000);
      const cleaned = cleanGutenbergText(raw);
      if (!cleaned || cleaned.length < 500) throw new Error('Text was too short after cleaning');
      ui.textCache.set(key, cleaned);
      return cleaned;
    } catch (error) {
      lastError = error;
    }
  }

  const error = new Error(lastError?.message || 'No readable text source was available.');
  error.book = book;
  throw error;
}

function cleanGutenbergText(raw) {
  let text = String(raw || '')
    .replace(/^\uFEFF/, '')
    .replace(/\r\n?/g, '\n')
    .replace(/\u00a0/g, ' ')
    .replace(/[ \t]+\n/g, '\n');

  const start = text.match(/\*\*\*\s*START OF (?:THE|THIS) PROJECT GUTENBERG EBOOK[^\n]*\*\*\*/i);
  if (start) text = text.slice(start.index + start[0].length);

  const end = text.match(/\*\*\*\s*END OF (?:THE|THIS) PROJECT GUTENBERG EBOOK[^\n]*\*\*\*/i);
  if (end) text = text.slice(0, end.index);

  text = text
    .replace(/^\s*Produced by[\s\S]{0,1200}?\n\s*\n/i, '')
    .replace(/^\s*Transcriber['’]?s note[\s\S]{0,800}?\n\s*\n/i, '')
    .replace(/\[Illustration[^\]]*\]/gi, '')
    .replace(/\[[^\]]{0,80}\]/g, '')
    .replace(/\n\s*End of (?:the )?Project Gutenberg[\s\S]*$/i, '')
    .replace(/\n\s*THE END\s*$/i, '')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  // Drop standalone page numbers and running heads that survived the split.
  text = text
    .split(/\n\s*\n/)
    .filter((block) => {
      const trimmed = block.trim();
      if (!trimmed) return false;
      if (/^(?:page\s+)?\d{1,4}$/i.test(trimmed)) return false;
      if (/^project gutenberg/i.test(trimmed) && trimmed.length < 120) return false;
      return true;
    })
    .join('\n\n');

  return text.trim();
}

function isChapterHeading(block) {
  const text = block.trim();
  if (!text || text.length > 120) return false;
  if (/\n/.test(text)) return false;
  if (/^(chapter|book|part|act|scene|section|letter|canto)\s+([IVXLCDM]+|\d+|[A-Z]+)\b/i.test(text)) return true;
  if (/^(prologue|epilogue|introduction|preface|foreword|afterword|conclusion|appendix|dedication)\b/i.test(text) && text.length < 70) return true;
  if (/^[IVXLCDM]+\.?$/.test(text)) return true;
  if (
    /^[A-Z0-9][A-Z0-9 ,.'’&:\-—]{3,80}$/.test(text) &&
    text.split(/\s+/).length <= 10 &&
    /[A-Z]{3}/.test(text) &&
    !/[.!?]$/.test(text)
  ) return true;
  return false;
}

function cleanHeading(block) {
  return block
    .replace(/\s+/g, ' ')
    .replace(/^[#*_\s]+|[#*_\s]+$/g, '')
    .trim()
    .slice(0, 120);
}

function parseChapters(text) {
  const blocks = String(text || '')
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .filter((block) => !/^(chapter|book|part|section|volume)$/i.test(block));
  const chapters = [];
  let current = { title: 'Full Text', blocks: [] };

  blocks.forEach((block) => {
    if (isChapterHeading(block)) {
      if (current.blocks.length) chapters.push(current);
      current = { title: cleanHeading(block) || `Chapter ${chapters.length + 1}`, blocks: [] };
      return;
    }
    current.blocks.push(block);
  });
  if (current.blocks.length) chapters.push(current);

  if (!chapters.length) {
    return [{ title: 'Full Text', blocks: ['The text of this book could not be divided into readable blocks.'] }];
  }

  return trimTitlePage(trimLeadingMatter(chapters));
}

function trimTitlePage(chapters) {
  if (!chapters.length) return chapters;
  const first = chapters[0];
  if (!first.blocks.length) return chapters;
  if (!/^(full text|untitled|front matter)$/i.test(first.title) && !/^[A-Z0-9 ,.'’&:\-—]{3,80}$/.test(first.title)) {
    return chapters;
  }
  let index = 0;
  while (index < first.blocks.length && index < 4) {
    const text = first.blocks[index].trim();
    const isTitleBlock =
      /^by\s+/i.test(text) ||
      (/^[A-Z0-9 ,.'’&:\-—\n]{3,200}$/.test(text) && !/[.!?]/.test(text)) ||
      /^(book|volume|part)\b/i.test(text);
    if (!isTitleBlock) break;
    index += 1;
  }
  if (index > 0 && index < first.blocks.length) {
    first.blocks = first.blocks.slice(index);
  }
  return chapters;
}

function trimLeadingMatter(chapters) {
  if (chapters.length < 2) return chapters;
  const chapterKeyword = /^(chapter|book|part|letter|canto|act|scene|section|prologue|epilogue)\s+([IVXLCDM]+|\d+|one|two|three|four|five|first|second|third)\b/i;
  const firstReal = chapters.findIndex((chapter) => chapterKeyword.test(chapter.title) && chapter.blocks.length);
  if (firstReal > 0) {
    const precedingBlocks = chapters
      .slice(0, firstReal)
      .reduce((total, chapter) => total + chapter.blocks.length, 0);
    // A title page, dedication, or very short front matter should not become a
    // blank first "chapter". Longer prefaces are kept.
    if (precedingBlocks < 10) return chapters.slice(firstReal);
  }
  return chapters;
}

function splitLongBlock(block, maxChars) {
  if (block.length <= maxChars) return [block];
  const sentences = block.match(/[^.!?]+[.!?]+["'”’)]?|\S[^.!?]*$/g) || [block];
  const chunks = [];
  let current = '';
  sentences.forEach((sentence) => {
    const next = current ? `${current} ${sentence.trim()}` : sentence.trim();
    if (next.length > maxChars && current) {
      chunks.push(current);
      current = sentence.trim();
    } else {
      current = next;
    }
  });
  if (current) chunks.push(current);
  return chunks.length ? chunks : [block];
}

function computePageLayout() {
  const body = document.querySelector('.page-body');
  const viewport = $('#page-viewport');
  let width;
  let height;
  if (body && body.clientWidth > 200 && body.clientHeight > 200) {
    width = body.clientWidth;
    height = body.clientHeight;
  } else {
    width = Math.max(260, (viewport?.clientWidth || 900) - 116);
    height = Math.max(240, (viewport?.clientHeight || 600) - 150);
  }
  const fontSize = state.settings.fontSize;
  const lineHeight = state.settings.lineHeight;
  return {
    width,
    height,
    fontSize,
    lineHeight,
    lineHeightPx: fontSize * lineHeight,
    charsPerLine: Math.max(24, Math.floor(width / (0.5 * fontSize))),
  };
}

function paginate(chapters, layout) {
  const pages = [];
  const {
    height,
    fontSize,
    lineHeight,
    lineHeightPx,
    charsPerLine,
  } = layout;
  const paragraphMargin = 0.92 * fontSize * lineHeight;
  const headingHeight = fontSize * 7.2;
  const maxBlockChars = Math.max(300, charsPerLine * Math.max(4, Math.floor(height / lineHeightPx) - 1));

  chapters.forEach((chapter, chapterIndex) => {
    let blocks = [];
    let chars = 0;
    let usedHeight = 0;
    let chapterStart = true;

    const flush = () => {
      if (!blocks.length) return;
      pages.push({
        index: pages.length,
        chapterIndex,
        chapterTitle: chapter.title,
        blocks,
        chars,
        chapterStart,
      });
      chapterStart = false;
      blocks = [];
      chars = 0;
      usedHeight = 0;
    };

    chapter.blocks.forEach((block) => {
      const chunks = splitLongBlock(block, maxBlockChars);
      chunks.forEach((chunk) => {
        const lines = Math.max(1, Math.ceil(chunk.length / charsPerLine));
        const blockHeight = lines * lineHeightPx + paragraphMargin;
        const heading = blocks.length === 0 && chapterStart ? headingHeight : 0;
        if (blocks.length && usedHeight + blockHeight > height) flush();
        blocks.push(chunk);
        chars += chunk.length;
        usedHeight += blockHeight + (blocks.length === 1 && chapterStart ? heading : 0);
      });
    });
    flush();
  });

  let wordCount = 0;
  pages.forEach((page) => {
    page.text = page.blocks.join('\n\n');
    page.startWord = wordCount;
    wordCount += tokenizeWords(page.text).length;
    page.endWord = wordCount;
  });
  return pages;
}

function pageAtPercent(percent) {
  const pages = ui.bookData?.pages || [];
  if (!pages.length) return 0;
  return clamp(Math.floor((clamp(percent, 0, 100) / 100) * pages.length), 0, pages.length - 1);
}

function buildRsvpWords(pages) {
  return pages.flatMap((page) => tokenizeWords(page.text));
}

/* --------------------------------------------------------------------------
   8. Book loading & reader rendering
   -------------------------------------------------------------------------- */
async function openBook(book, options = {}) {
  if (!book || ui.loadingBook) return;
  ui.loadingBook = true;
  const normalized = { ...book };
  showLoading('Opening your book', normalized.title || 'Preparing the text…');
  setLoadingStep(0);

  try {
    const id = String(normalized.id);
    const existing = state.library.books[id] || {};
    state.library.activeBookId = Number(normalized.id);
    state.library.books[id] = {
      ...existing,
      ...normalized,
      id: normalized.id,
      lastOpened: Date.now(),
      progress: existing.progress || null,
    };
    state.library.recent = [Number(normalized.id), ...state.library.recent.filter((item) => item !== Number(normalized.id))].slice(0, 20);
    saveStateSoon();

    setLoadingStep(1);
    const rawText = await getBookText(normalized, (message) => {
      setText('#loading-subtitle', message);
    });
    setLoadingStep(2);
    const chapters = parseChapters(rawText);
    const pages = paginate(chapters, computePageLayout());
    if (!pages.length) throw new Error('This book did not produce any readable pages.');

    ui.currentBook = { ...normalized, ...(state.library.books[id].repo ? { repo: state.library.books[id].repo } : {}) };
    ui.bookData = {
      book: ui.currentBook,
      chapters,
      pages,
      rsvpWords: buildRsvpWords(pages),
    };

    const progress = state.library.books[id].progress;
    if (progress) {
      ui.currentPage = clamp(Number(progress.page) || 0, 0, pages.length - 1);
      ui.progressPercent = clamp(Number(progress.scrollPercent ?? progress.percent) || 0, 0, 100);
    } else {
      ui.currentPage = 0;
      ui.progressPercent = 0;
    }
    if (!state.settings.pageTurn) ui.currentPage = pageAtPercent(ui.progressPercent);

    updateReaderHeader();
    renderChapterSelect();
    showReader({ replaceHash: Boolean(options.replaceHash) });
    renderCurrentView({ initial: true });
    setTimeout(scheduleRepaginate, 120);
    setLoadingStep(3);
    hideLoading();
    if (!options.silent) toast(`“${ui.currentBook.title}” is ready. Double-click any word to look it up.`, 'success');
  } catch (error) {
    console.error('Could not open book:', error);
    hideLoading();
    const action = error.book?.htmlUrl
      ? { label: 'Open on Gutenberg', onClick: () => window.open(error.book.htmlUrl, '_blank', 'noopener') }
      : null;
    toast(`Could not load this book. ${error.message}`, 'error', action, 7000);
    if (!ui.bookData) showLibrary({ replaceHash: true });
  } finally {
    ui.loadingBook = false;
  }
}

async function openBookById(id) {
  const numericId = Number(id);
  if (!numericId) {
    showLibrary({ replaceHash: true });
    return;
  }
  const stored = state.library.books[numericId];
  if (stored) {
    openBook(stored, { silent: true });
    return;
  }
  const curated = CURATED.find((book) => Number(book.id) === numericId);
  if (curated) {
    openBook(curated, { silent: true });
    return;
  }
  try {
    const raw = await fetchGutendex(`https://gutendex.com/books/${numericId}/`, 10000);
    const book = normalizeGutendexBook(raw);
    openBook(book, { silent: true });
  } catch (error) {
    console.error('Could not fetch book metadata:', error);
    toast('That book is not in your saved library and Gutendex could not be reached.', 'error');
    showLibrary({ replaceHash: true });
  }
}

function updateReaderHeader() {
  if (!ui.currentBook) return;
  setText('#reader-title', ui.currentBook.title);
  setText('#reader-author', ui.currentBook.author);
  document.title = `${ui.currentBook.title} · Gutenberg Reader Studio`;
}

function renderChapterSelect() {
  const select = $('#chapter-select');
  if (!select || !ui.bookData) return;
  const chapters = ui.bookData.chapters;
  select.innerHTML = chapters
    .map((chapter, index) => `<option value="${index}">${escapeHtml(chapter.title)}</option>`)
    .join('');
  if (ui.bookData.pages[ui.currentPage]) {
    select.value = String(ui.bookData.pages[ui.currentPage].chapterIndex);
  }
}

function renderCurrentView(options = {}) {
  if (!ui.bookData) return;
  updateModeUI();
  if (state.settings.pageTurn) {
    $('#scroll-viewport').hidden = true;
    $('#page-viewport').hidden = false;
    renderPage(ui.currentPage, options.direction || null);
  } else {
    $('#page-viewport').hidden = true;
    $('#scroll-viewport').hidden = false;
    renderScroll(options.initial);
  }
}

function pageHTML(page) {
  const pages = ui.bookData.pages;
  const chapterHeading =
    page.chapterStart && page.chapterTitle !== 'Full Text'
      ? `<div class="chapter-heading"><span class="chapter-kicker">${escapeHtml(/^chapter\b/i.test(page.chapterTitle) ? 'Chapter' : 'Book')}</span><h2>${escapeHtml(page.chapterTitle)}</h2></div>`
      : '';
  return `
    <header class="page-head">
      <span class="page-chapter">${escapeHtml(page.chapterTitle)}</span>
      <span class="page-number">${page.index + 1} / ${pages.length}</span>
    </header>
    <div class="page-body${noDropCap(page) ? ' no-dropcap' : ''}" data-page-index="${page.index}">
      ${chapterHeading}
      ${blocksToHtml(page.blocks)}
    </div>`;
}

function noDropCap(page) {
  if (state.settings.bionic) return true;
  const first = page?.blocks?.[0]?.trim() || '';
  if (!first) return true;
  if (/^["“'‘]/.test(first)) return true;
  if (first.length < 80) return true;
  if (!page.chapterStart && first.length < 160) return true;
  return false;
}

function renderPage(index, direction = null) {
  if (!ui.bookData) return;
  const pages = ui.bookData.pages;
  const safeIndex = clamp(index, 0, pages.length - 1);
  const viewport = $('#page-viewport');
  const oldSheet = viewport.querySelector('.page-sheet');
  const token = ++ui.pageRenderToken;
  ui.currentPage = safeIndex;

  const sheet = document.createElement('article');
  sheet.className = 'page-sheet';
  sheet.setAttribute('aria-label', `Page ${safeIndex + 1} of ${pages.length}`);
  sheet.innerHTML = pageHTML(pages[safeIndex]);

  const animate = Boolean(direction) && !prefersReducedMotion() && oldSheet;
  if (animate) {
    viewport.querySelectorAll('.page-sheet').forEach((existing) => {
      if (existing !== oldSheet) existing.remove();
    });
    oldSheet.classList.add(direction === 'next' ? 'is-leaving-next' : 'is-leaving-prev');
    sheet.classList.add(direction === 'next' ? 'is-entering-next' : 'is-entering-prev');
    viewport.appendChild(sheet);
    setTimeout(() => {
      if (token === ui.pageRenderToken) {
        viewport.querySelectorAll('.page-sheet').forEach((existing) => {
          if (existing !== sheet) existing.remove();
        });
      }
    }, 680);
  } else {
    viewport.replaceChildren(sheet);
  }
  const body = sheet.querySelector('.page-body');
  if (body) body.scrollTop = 0;
  updateProgress();
  renderChapterSelect();
}

function blocksToHtml(blocks) {
  return blocks.map((block) => blockToHtml(block)).join('');
}

function blockToHtml(block) {
  const trimmed = block.trim();
  if (!trimmed) return '';
  if (isSubheading(trimmed)) {
    return `<h3>${escapeHtml(trimmed.replace(/\s+/g, ' '))}</h3>`;
  }
  if (isPoemBlock(trimmed)) {
    const lines = trimmed.split('\n').map((line) => inlineTextHtml(line.replace(/--/g, '—')));
    return `<p class="poem">${lines.join('<br>')}</p>`;
  }
  const prose = trimmed.replace(/\s*\n\s*/g, ' ').replace(/\s{2,}/g, ' ').replace(/--/g, '—').trim();
  return `<p>${inlineTextHtml(prose)}</p>`;
}

function inlineTextHtml(text) {
  const source = String(text || '');
  const parts = source.split(/(_[^_\n]+_)/g);
  return parts.map((part) => {
    if (part.length > 2 && part.startsWith('_') && part.endsWith('_')) {
      const inner = part.slice(1, -1);
      return `<em>${state.settings.bionic ? bionicText(inner) : escapeHtml(inner)}</em>`;
    }
    return state.settings.bionic ? bionicText(part) : escapeHtml(part);
  }).join('');
}

function isSubheading(block) {
  if (block.length > 90 || /\n/.test(block)) return false;
  if (/[.!?]$/.test(block)) return false;
  return /^[A-Z0-9][A-Z0-9 ,.'’&:\-—]{3,90}$/.test(block) && block.split(/\s+/).length <= 12;
}

function isPoemBlock(block) {
  if (!block.includes('\n')) return false;
  const lines = block.split('\n').map((line) => line.trim()).filter(Boolean);
  if (lines.length < 2) return false;
  const average = lines.reduce((sum, line) => sum + line.length, 0) / lines.length;
  const shortLines = lines.filter((line) => line.length < 58).length;
  return average < 56 && shortLines / lines.length > 0.6;
}

function renderScroll(initial = false) {
  if (!ui.bookData) return;
  const viewport = $('#scroll-viewport');
  const percent = clamp(ui.progressPercent, 0, 100);
  const pages = ui.bookData.pages;
  const html = pages
    .map((page) => {
      const chapterHeading =
        page.chapterStart && page.chapterTitle !== 'Full Text'
          ? `<div class="chapter-heading"><span class="chapter-kicker">${escapeHtml(/^chapter\b/i.test(page.chapterTitle) ? 'Chapter' : 'Book')}</span><h2>${escapeHtml(page.chapterTitle)}</h2></div>`
          : '';
      return `<section class="scroll-page${noDropCap(page) ? ' no-dropcap' : ''}" data-page-index="${page.index}" aria-label="Page ${page.index + 1}">
        ${chapterHeading}
        ${blocksToHtml(page.blocks)}
        <div class="page-foot">${escapeHtml(page.chapterTitle)} · page ${page.index + 1} of ${pages.length}</div>
      </section>`;
    })
    .join('');
  viewport.innerHTML = html;

  const targetIndex = pageAtPercent(percent);
  const targetPage = viewport.querySelector(`.scroll-page[data-page-index="${targetIndex}"]`);
  const restore = () => {
    if (targetPage) {
      viewport.scrollTop = targetPage.offsetTop;
    } else {
      const max = Math.max(0, viewport.scrollHeight - viewport.clientHeight);
      viewport.scrollTop = (percent / 100) * max;
    }
  };
  requestAnimationFrame(() => {
    restore();
    setTimeout(() => {
      restore();
      ui.currentPage = pageAtPercent(percent);
      updateProgress();
    }, 100);
    setTimeout(restore, 450);
  });
  if (initial) {
    // A second nudge after fonts and cover-free layout settle.
    setTimeout(restore, 700);
  }
}

function currentPercent() {
  if (!ui.bookData) return 0;
  if (state.settings.pageTurn) {
    return ui.bookData.pages.length ? ((ui.currentPage + 1) / ui.bookData.pages.length) * 100 : 0;
  }
  return ui.progressPercent;
}

function updateProgress() {
  if (!ui.bookData) return;
  const pages = ui.bookData.pages;
  const percent = state.settings.pageTurn
    ? ((ui.currentPage + 1) / pages.length) * 100
    : ui.progressPercent;
  const bar = $('#reader-progress-bar');
  if (bar) bar.style.width = `${clamp(percent, 0, 100)}%`;
  setText('#reader-progress-label', `${Math.round(percent)}%`);
  setText('#page-label', `Page ${ui.currentPage + 1} of ${pages.length}`);
  const page = pages[ui.currentPage];
  setText('#chapter-label', page?.chapterTitle || '—');
  const prev = $('#btn-prev');
  const next = $('#btn-next');
  if (prev) prev.disabled = state.settings.pageTurn && ui.currentPage <= 0;
  if (next) next.disabled = state.settings.pageTurn && ui.currentPage >= pages.length - 1;
  const select = $('#chapter-select');
  if (select && page) select.value = String(page.chapterIndex);

  if (ui.currentBook) {
    const id = String(ui.currentBook.id);
    const existing = state.library.books[id] || {};
    state.library.books[id] = {
      ...existing,
      ...ui.currentBook,
      id: ui.currentBook.id,
      lastOpened: existing.lastOpened || Date.now(),
      progress: {
        page: ui.currentPage,
        scrollPercent: state.settings.pageTurn ? ((ui.currentPage + 1) / pages.length) * 100 : ui.progressPercent,
        percent,
        chapterIndex: page?.chapterIndex || 0,
        updatedAt: Date.now(),
      },
    };
    state.library.activeBookId = Number(ui.currentBook.id);
    saveStateSoon();
  }
  setText('#reader-status-text', `${pages.length} pages · ${formatNumber(pages[pages.length - 1]?.endWord || 0)} words`);
}

function navigate(delta) {
  if (!ui.bookData) return;
  if (state.settings.pageTurn) {
    goToPage(ui.currentPage + delta, delta > 0 ? 'next' : 'prev');
  } else {
    const viewport = $('#scroll-viewport');
    viewport.scrollBy({ top: delta * viewport.clientHeight * 0.9, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  }
}

function goToPage(index, direction = null) {
  if (!ui.bookData) return;
  const pages = ui.bookData.pages;
  const safeIndex = clamp(index, 0, pages.length - 1);
  if (state.settings.pageTurn) {
    renderPage(safeIndex, direction);
  } else {
    const target = $(`.scroll-page[data-page-index="${safeIndex}"]`);
    if (target) target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
    ui.currentPage = safeIndex;
    updateProgress();
  }
}

function jumpToChapter(chapterIndex) {
  if (!ui.bookData) return;
  const page = ui.bookData.pages.find((item) => item.chapterIndex === Number(chapterIndex));
  if (page) goToPage(page.index);
}

function switchMode(pageTurn, options = {}) {
  if (!ui.bookData) {
    state.settings.pageTurn = Boolean(pageTurn);
    updateModeUI();
    saveStateSoon();
    return;
  }
  const percent = Number.isFinite(options.percent) ? options.percent : currentPercent();
  state.settings.pageTurn = Boolean(pageTurn);
  ui.progressPercent = percent;
  ui.currentPage = pageAtPercent(percent);
  saveStateSoon();
  updateModeUI();
  if (!options.silent) renderCurrentView();
}

const scheduleRepaginate = debounce(() => {
  if (!ui.bookData) return;
  const percent = currentPercent();
  const pages = paginate(ui.bookData.chapters, computePageLayout());
  if (!pages.length) return;
  ui.bookData.pages = pages;
  ui.bookData.rsvpWords = buildRsvpWords(pages);
  ui.currentPage = pageAtPercent(percent);
  ui.progressPercent = percent;
  renderChapterSelect();
  renderCurrentView();
}, 260);

/* --------------------------------------------------------------------------
   9. Bionic reading
   -------------------------------------------------------------------------- */
function bionicText(text) {
  const source = String(text || '');
  let result = '';
  let lastIndex = 0;
  const regex = /[A-Za-z]+(?:['’\-][A-Za-z]+)*/g;
  let match;
  while ((match = regex.exec(source)) !== null) {
    result += escapeHtml(source.slice(lastIndex, match.index));
    result += bionicWord(match[0]);
    lastIndex = match.index + match[0].length;
  }
  result += escapeHtml(source.slice(lastIndex));
  return result;
}

function bionicWord(word) {
  const letters = Array.from(word).filter((char) => /[A-Za-z]/.test(char)).length;
  const boldCount = Math.max(1, Math.ceil(letters * 0.42));
  let seen = 0;
  let open = false;
  let out = '';
  for (const char of word) {
    if (/[A-Za-z]/.test(char)) {
      if (seen < boldCount) {
        if (!open) {
          out += '<b>';
          open = true;
        }
        out += escapeHtml(char);
      } else {
        if (open) {
          out += '</b>';
          open = false;
        }
        out += escapeHtml(char);
      }
      seen += 1;
    } else {
      if (open) {
        out += '</b>';
        open = false;
      }
      out += escapeHtml(char);
    }
  }
  if (open) out += '</b>';
  return `<span class="bw" data-word="${escapeHtml(word)}">${out}</span>`;
}

/* --------------------------------------------------------------------------
   10. Word capture, dictionary, word bank
   -------------------------------------------------------------------------- */
function loadDictCache() {
  try {
    const raw = localStorage.getItem(APP.dictKey);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    const now = Date.now();
    const fresh = {};
    Object.entries(parsed || {}).forEach(([key, value]) => {
      if (value && now - Number(value.ts) < 30 * DAY) fresh[key] = value;
    });
    return fresh;
  } catch (error) {
    return {};
  }
}

const persistDictCache = debounce(() => {
  try {
    const entries = Object.entries(ui.dictCache)
      .sort((a, b) => Number(b[1].ts) - Number(a[1].ts))
      .slice(0, 150);
    localStorage.setItem(APP.dictKey, JSON.stringify(Object.fromEntries(entries)));
  } catch (error) {
    // Cache is optional; ignore quota failures.
  }
}, 1000);

async function lookupWord(word) {
  const key = normalizeWord(word);
  if (!key) return null;
  const cached = ui.dictCache[key];
  if (cached && Date.now() - Number(cached.ts) < 30 * DAY) return cached.data;
  try {
    const result = await fetchDictionaryEntry(key);
    if (!result) return null;
    ui.dictCache[key] = { ts: Date.now(), data: result };
    persistDictCache();
    return result;
  } catch (error) {
    // Hyphenated compounds often miss the dictionary even when their parts
    // are common words. Try each part before giving up.
    if (key.includes('-')) {
      for (const part of key.split('-')) {
        if (part.length < 3) continue;
        try {
          const result = await fetchDictionaryEntry(part);
          if (result) {
            const merged = { ...result, word: key };
            ui.dictCache[key] = { ts: Date.now(), data: merged };
            persistDictCache();
            return merged;
          }
        } catch (partError) {
          // Try the next part.
        }
      }
    }
    throw error;
  }
}

async function fetchDictionaryEntry(key) {
  const data = await fetchJson(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(key)}`, { timeout: 9000 });
  if (!Array.isArray(data) || !data.length) return null;
  const entry = data[0];
  const phonetics = Array.isArray(entry.phonetics) ? entry.phonetics : [];
  const phonetic = entry.phonetic || phonetics.find((item) => item.text)?.text || '';
  const audio = phonetics.find((item) => item.audio)?.audio || '';
  const definitions = (entry.meanings || []).slice(0, 4).map((meaning) => ({
    pos: meaning.partOfSpeech || '',
    defs: (meaning.definitions || []).slice(0, 3).map((definition) => definition.definition).filter(Boolean),
  })).filter((meaning) => meaning.defs.length);
  return { word: entry.word || key, phonetic, audio, definitions };
}

function setupReaderSelection() {
  const surface = $('#reading-surface');
  if (!surface) return;
  surface.addEventListener('dblclick', (event) => {
    if (event.target.closest('.word-popup')) return;
    const info = wordInfoAtPoint(event.clientX, event.clientY);
    if (info) {
      ui.lastPopupAt = Date.now();
      showWordPopup(info);
    }
  });
  surface.addEventListener('mouseup', () => {
    clearTimeout(ui.selectionTimer);
    ui.selectionTimer = setTimeout(() => {
      if (Date.now() - ui.lastPopupAt < 500) return;
      const info = wordInfoFromSelection();
      if (info) showWordPopup(info);
    }, 260);
  });
  surface.addEventListener('touchend', () => {
    clearTimeout(ui.selectionTimer);
    ui.selectionTimer = setTimeout(() => {
      const info = wordInfoFromSelection();
      if (info) showWordPopup(info);
    }, 420);
  });
  surface.addEventListener('scroll', () => closeWordPopup(), true);
}

function wordInfoAtPoint(x, y) {
  let range = null;
  if (document.caretRangeFromPoint) {
    range = document.caretRangeFromPoint(x, y);
  } else if (document.caretPositionFromPoint) {
    const position = document.caretPositionFromPoint(x, y);
    if (position) {
      range = document.createRange();
      range.setStart(position.offsetNode, position.offset);
      range.collapse(true);
    }
  }
  if (!range || !range.startContainer || range.startContainer.nodeType !== Node.TEXT_NODE) return null;
  const node = range.startContainer;

  // Bionic reading splits each word into bold and normal fragments. Use the
  // wrapper so a double-click on the bold prefix still looks up the whole word.
  const bionicWrapper = node.parentElement?.closest('.bw');
  if (bionicWrapper && bionicWrapper.dataset.word) {
    const word = normalizeWord(bionicWrapper.dataset.word);
    if (!word || word.length < 2) return null;
    try {
      const selection = window.getSelection();
      const highlight = document.createRange();
      highlight.selectNodeContents(bionicWrapper);
      selection.removeAllRanges();
      selection.addRange(highlight);
    } catch (error) {
      // Selection is a nicety, not a requirement.
    }
    const rect = bionicWrapper.getBoundingClientRect();
    return {
      word,
      x: rect.left + rect.width / 2,
      y: rect.bottom,
      context: contextFromElement(bionicWrapper),
    };
  }

  const text = node.textContent || '';
  let start = range.startOffset;
  let end = start;
  const isWordChar = (char) => /[A-Za-z0-9'’\-]/.test(char);
  while (start > 0 && isWordChar(text[start - 1])) start -= 1;
  while (end < text.length && isWordChar(text[end])) end += 1;
  const raw = text.slice(start, end);
  const word = normalizeWord(raw);
  if (!word || word.length < 2) return null;

  try {
    const selection = window.getSelection();
    const highlight = document.createRange();
    highlight.setStart(node, start);
    highlight.setEnd(node, end);
    selection.removeAllRanges();
    selection.addRange(highlight);
  } catch (error) {
    // Selection is a nicety, not a requirement.
  }

  const rect = range.getBoundingClientRect();
  return {
    word,
    x: rect.left + rect.width / 2,
    y: rect.bottom,
    context: contextFromNode(node, start),
  };
}

function wordInfoFromSelection() {
  const selection = window.getSelection();
  if (!selection || selection.isCollapsed || !selection.rangeCount) return null;
  const selected = selection.toString().trim();
  const match = selected.match(/[A-Za-z][A-Za-z'’\-]{1,40}/);
  if (!match) return null;
  const word = normalizeWord(match[0]);
  if (!word) return null;
  const range = selection.getRangeAt(0);
  const node = range.startContainer;
  const anchorElement = node.nodeType === Node.TEXT_NODE ? node.parentElement : node;
  const bionicWrapper = anchorElement?.closest?.('.bw');
  if (bionicWrapper && bionicWrapper.dataset.word) {
    const fullWord = normalizeWord(bionicWrapper.dataset.word);
    const rect = bionicWrapper.getBoundingClientRect();
    return {
      word: fullWord,
      x: rect.left + rect.width / 2,
      y: rect.bottom,
      context: contextFromElement(bionicWrapper),
    };
  }
  const rect = range.getBoundingClientRect();
  const context = node.nodeType === Node.TEXT_NODE
    ? contextFromNode(node, range.startOffset)
    : sentenceAround(selected, 0, word);
  return {
    word,
    x: rect.left + rect.width / 2,
    y: rect.bottom,
    context,
  };
}

function contextFromElement(element) {
  if (!element) return '';
  const paragraph = element.closest('p, li, blockquote, .chapter-heading, .page-body, .scroll-page');
  if (!paragraph) return '';
  let offset = 0;
  try {
    const range = document.createRange();
    range.selectNodeContents(paragraph);
    range.setEndBefore(element);
    offset = range.toString().length;
  } catch (error) {
    offset = 0;
  }
  const word = element.dataset?.word || element.textContent || '';
  return sentenceAround(paragraph.textContent || '', offset, word);
}

function contextFromNode(node, offset) {
  if (!node || node.nodeType !== Node.TEXT_NODE) return '';
  const paragraph = node.parentElement?.closest('p, li, blockquote, .chapter-heading, .page-body, .scroll-page');
  if (!paragraph) return '';
  const full = paragraph.textContent || '';
  let charOffset = 0;
  try {
    const range = document.createRange();
    range.selectNodeContents(paragraph);
    range.setEnd(node, offset);
    charOffset = range.toString().length;
  } catch (error) {
    charOffset = full.indexOf(node.textContent || '');
  }
  const wordMatch = (node.textContent || '').slice(offset).match(/^[A-Za-z'’\-]+/);
  const word = wordMatch ? wordMatch[0] : '';
  return sentenceAround(full, Math.max(0, charOffset), word);
}

function showWordPopup(info) {
  const popup = $('#word-popup');
  if (!popup) return;
  ui.popup = { ...info, data: null, loading: true };
  setText('#popup-word', info.word);
  setText('#popup-phonetic', '');
  setText('#popup-context', info.context ? `“${info.context}”` : '');
  const body = $('#popup-body');
  body.innerHTML = '<div class="popup-loading"><span class="spinner spinner-small"></span> Looking up definition…</div>';
  const addButton = $('#popup-add');
  addButton.textContent = '➕ Add to Word Bank';
  addButton.disabled = false;
  setText('#popup-status', '');
  popup.hidden = false;
  popup.setAttribute('aria-hidden', 'false');
  positionPopup(info.x, info.y);

  lookupWord(info.word)
    .then((data) => {
      if (!ui.popup || ui.popup.word !== info.word) return;
      ui.popup.data = data;
      ui.popup.loading = false;
      renderWordPopup();
    })
    .catch((error) => {
      console.warn('Dictionary lookup failed:', error);
      if (!ui.popup || ui.popup.word !== info.word) return;
      ui.popup.loading = false;
      renderWordPopup(error);
    });
}

function renderWordPopup(error = null) {
  if (!ui.popup) return;
  const body = $('#popup-body');
  const addButton = $('#popup-add');
  const status = $('#popup-status');
  const existing = state.wordBank[ui.popup.word];
  setText('#popup-phonetic', ui.popup.data?.phonetic || '');
  setText('#popup-context', ui.popup.context ? `“${ui.popup.context}”` : '');

  if (ui.popup.data && ui.popup.data.definitions?.length) {
    body.innerHTML = ui.popup.data.definitions.map((meaning) => `
      <div class="popup-def">
        <span class="popup-pos">${escapeHtml(meaning.pos || 'definition')}</span>
        <ol>${meaning.defs.map((definition) => `<li>${escapeHtml(definition)}</li>`).join('')}</ol>
      </div>`).join('');
  } else {
    body.innerHTML = `
      <div class="popup-error">
        ${error ? 'The dictionary could not be reached right now.' : 'No definition was found for this word.'}
        You can still save it with the sentence for later.
        <a href="https://en.wiktionary.org/wiki/${encodeURIComponent(ui.popup.word)}" target="_blank" rel="noopener">Look it up on Wiktionary →</a>
      </div>`;
  }

  if (existing) {
    addButton.textContent = `✓ Saved · ${capitalize(statusOf(existing))}`;
    addButton.disabled = false;
    addButton.dataset.mode = 'saved';
    status.textContent = `${existing.reviewCount} ${existing.reviewCount === 1 ? 'review' : 'reviews'} · ${dueLabel(existing)}`;
  } else {
    addButton.textContent = '➕ Add to Word Bank';
    addButton.disabled = false;
    addButton.dataset.mode = 'add';
    status.textContent = '';
  }
  const audioButton = $('#popup-audio');
  audioButton.disabled = !ui.popup.word;
  positionPopup(ui.popup.x, ui.popup.y);
}

function positionPopup(x, y) {
  const popup = $('#word-popup');
  if (!popup || popup.hidden) return;
  if (window.innerWidth <= 720) {
    popup.style.left = '12px';
    popup.style.right = '12px';
    popup.style.top = 'auto';
    popup.style.bottom = '12px';
    return;
  }
  const width = popup.offsetWidth || 360;
  const height = popup.offsetHeight || 300;
  const left = clamp(x - width / 2, 12, window.innerWidth - width - 12);
  let top = y + 14;
  if (top + height > window.innerHeight - 12) top = Math.max(12, y - height - 18);
  popup.style.left = `${left}px`;
  popup.style.top = `${top}px`;
  popup.style.right = 'auto';
  popup.style.bottom = 'auto';
}

function closeWordPopup() {
  const popup = $('#word-popup');
  if (!popup || popup.hidden) return;
  popup.hidden = true;
  popup.setAttribute('aria-hidden', 'true');
  ui.popup = null;
}

function addCurrentWordToBank() {
  if (!ui.popup) return;
  const word = ui.popup.word;
  const existing = state.wordBank[word];
  if (existing) {
    closeWordPopup();
    openDrawer('wordbank');
    return;
  }
  const data = ui.popup.data;
  const entry = {
    word,
    phonetic: data?.phonetic || '',
    audio: data?.audio || '',
    definitions: data?.definitions || [],
    context: ui.popup.context || '',
    contexts: ui.popup.context ? [{ text: ui.popup.context, bookId: ui.currentBook?.id ?? null, bookTitle: ui.currentBook?.title || '' }] : [],
    bookId: ui.currentBook?.id ?? null,
    bookTitle: ui.currentBook?.title || '',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    lastReviewed: null,
    reviewCount: 0,
    intervalIndex: 0,
    nextReviewDue: Date.now(),
    status: 'new',
  };
  state.wordBank[word] = entry;
  state.stats.wordsCaptured += 1;
  saveStateNow();
  renderWordBank();
  renderWordPopup();
  toast(`“${word}” added to your Word Bank.`, 'success', {
    label: 'Review now',
    onClick: () => openReview([entry]),
  });
}

function removeWordFromBank(word) {
  const entry = state.wordBank[word];
  if (!entry) return;
  delete state.wordBank[word];
  saveStateNow();
  renderWordBank();
  toast(`Removed “${word}” from the Word Bank.`, 'info', {
    label: 'Undo',
    onClick: () => {
      state.wordBank[word] = entry;
      saveStateNow();
      renderWordBank();
    },
  });
}

function bankEntries() {
  return Object.values(state.wordBank).map(normalizeBankEntry).filter(Boolean);
}

function renderWordBank() {
  const entries = bankEntries();
  const counts = { new: 0, practicing: 0, mastered: 0, due: 0 };
  entries.forEach((entry) => {
    const status = statusOf(entry);
    counts[status] += 1;
    if (entry.nextReviewDue <= Date.now()) counts.due += 1;
  });
  setText('#stat-new', String(counts.new));
  setText('#stat-practicing', String(counts.practicing));
  setText('#stat-mastered', String(counts.mastered));
  setText('#stat-due', String(counts.due));
  setText('#nav-word-count', String(entries.length));
  const reviewButton = $('#start-review');
  if (reviewButton) {
    reviewButton.textContent = counts.due ? `Review due (${counts.due})` : 'Review all';
    reviewButton.disabled = !entries.length;
  }

  const search = ($('#bank-search')?.value || '').trim().toLowerCase();
  const filter = $('#bank-filter')?.value || 'all';
  let filtered = entries.filter((entry) => {
    if (search && !`${entry.word} ${entry.context} ${entry.bookTitle}`.toLowerCase().includes(search)) return false;
    if (filter === 'due') return entry.nextReviewDue <= Date.now();
    if (filter !== 'all' && statusOf(entry) !== filter) return false;
    return true;
  });
  filtered.sort((a, b) => {
    const order = { new: 0, practicing: 1, mastered: 2 };
    const byStatus = order[statusOf(a)] - order[statusOf(b)];
    if (byStatus) return byStatus;
    const byDue = (a.nextReviewDue || 0) - (b.nextReviewDue || 0);
    if (byDue) return byDue;
    return b.createdAt - a.createdAt;
  });

  const list = $('#bank-list');
  if (!list) return;
  if (!filtered.length) {
    list.innerHTML = `
      <div class="bank-empty">
        <strong>${entries.length ? 'No words match this view' : 'Your Word Bank is empty'}</strong>
        <p>${entries.length ? 'Try a different filter or search term.' : 'Double-click any word while reading to see its definition, then add it here with the surrounding sentence.'}</p>
      </div>`;
    return;
  }
  list.innerHTML = filtered.map((entry) => {
    const definition = entry.definitions?.[0]?.defs?.[0] || 'No definition saved.';
    const status = statusOf(entry);
    return `
      <article class="bank-card" data-word="${escapeHtml(entry.word)}">
        <div class="bank-card-head">
          <span class="bank-word">${escapeHtml(entry.word)}</span>
          <span class="bank-phonetic">${escapeHtml(entry.phonetic || '')}</span>
          <span class="bank-status status-${status}">${status === 'new' ? '🔴 New' : status === 'practicing' ? '🟡 Practicing' : '🟢 Mastered'}</span>
        </div>
        <p class="bank-def">${escapeHtml(definition)}</p>
        ${entry.context ? `<blockquote class="bank-context">“${escapeHtml(entry.context)}”</blockquote>` : ''}
        <div class="bank-foot">
          <span>${escapeHtml(entry.bookTitle || 'Unknown book')}</span>
          <span>·</span>
          <span>${entry.reviewCount} ${entry.reviewCount === 1 ? 'review' : 'reviews'}</span>
          <span>·</span>
          <span>${relativeTime(entry.createdAt)}</span>
          <span class="bank-due">${dueLabel(entry)}</span>
          <span class="bank-actions">
            <button class="icon-btn" type="button" data-audio-word="${escapeHtml(entry.word)}" aria-label="Hear ${escapeHtml(entry.word)}">🔊</button>
            <button class="icon-btn" type="button" data-review-word="${escapeHtml(entry.word)}" aria-label="Review ${escapeHtml(entry.word)}">↻</button>
            <button class="icon-btn" type="button" data-delete-word="${escapeHtml(entry.word)}" aria-label="Remove ${escapeHtml(entry.word)}">×</button>
          </span>
        </div>
      </article>`;
  }).join('');
}

function speakWord(word) {
  const entry = state.wordBank[normalizeWord(word)];
  if (entry?.audio) {
    const audio = new Audio(entry.audio);
    audio.play().catch(() => speakFallback(word));
    return;
  }
  speakFallback(word);
}

function speakFallback(word) {
  if (!('speechSynthesis' in window)) {
    toast('Speech playback is not available in this browser.', 'info');
    return;
  }
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = 'en-US';
  utterance.rate = 0.9;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

function gradeWord(entry, grade) {
  const now = Date.now();
  if (grade === 'again') {
    entry.reviewCount = Math.max(1, Number(entry.reviewCount) || 0);
    entry.intervalIndex = 0;
    entry.nextReviewDue = now + 10 * 60 * 1000;
  } else {
    entry.reviewCount = (Number(entry.reviewCount) || 0) + 1;
    const nextIndex = grade === 'easy'
      ? Math.min(entry.reviewCount, SRS_INTERVALS.length - 1)
      : Math.min(entry.reviewCount - 1, SRS_INTERVALS.length - 1);
    entry.intervalIndex = nextIndex;
    entry.nextReviewDue = now + SRS_INTERVALS[nextIndex] * DAY;
  }
  entry.lastReviewed = now;
  entry.updatedAt = now;
  entry.status = statusOf(entry);
  state.stats.reviews += 1;
  saveStateNow();
  renderWordBank();
}

function openReview(words = null) {
  let queue = words;
  if (!queue) {
    const due = bankEntries().filter((entry) => entry.nextReviewDue <= Date.now());
    queue = due.length ? due : bankEntries();
  }
  queue = queue.map((entry) => state.wordBank[entry.word] || entry).filter(Boolean);
  if (!queue.length) {
    toast('Add a word to your Word Bank first.', 'info');
    return;
  }
  ui.review = { queue, index: 0, revealed: false };
  renderReview();
  openModal('review-modal');
}

function renderReview() {
  const { queue, index, revealed } = ui.review;
  const progress = $('#review-progress-bar');
  const label = $('#review-progress-label');
  if (progress) progress.style.width = `${queue.length ? (index / queue.length) * 100 : 0}%`;
  if (label) label.textContent = `${Math.min(index + 1, queue.length)} / ${queue.length}`;

  if (index >= queue.length) {
    setText('#review-word', 'All done');
    setText('#review-phonetic', '');
    setText('#review-context', '');
    const answer = $('#review-answer');
    if (answer) answer.hidden = true;
    const grades = $('#review-grades');
    if (grades) grades.hidden = true;
    const actions = $('#review-actions');
    if (actions) actions.hidden = true;
    const summary = $('#review-summary');
    if (summary) {
      summary.hidden = false;
      summary.textContent = `You reviewed ${queue.length} ${queue.length === 1 ? 'word' : 'words'}. Come back when the next interval is due.`;
    }
    return;
  }

  const entry = queue[index];
  const status = statusOf(entry);
  setText('#review-word', entry.word);
  setText('#review-phonetic', entry.phonetic || '');
  setText('#review-context', entry.context ? `“${entry.context}”` : 'No context sentence saved.');
  setText('#review-definition', entry.definitions?.[0]?.defs?.[0] || 'No definition saved. Add one by looking the word up again.');
  setText('#review-meta', `${capitalize(status)} · ${entry.reviewCount} ${entry.reviewCount === 1 ? 'review' : 'reviews'} · ${dueLabel(entry)}`);
  const answer = $('#review-answer');
  if (answer) answer.hidden = !revealed;
  const grades = $('#review-grades');
  if (grades) grades.hidden = !revealed;
  const actions = $('#review-actions');
  if (actions) actions.hidden = revealed;
  const summary = $('#review-summary');
  if (summary) summary.hidden = true;
}

function handleReviewGrade(grade) {
  const entry = ui.review.queue[ui.review.index];
  if (!entry) return;
  gradeWord(entry, grade);
  ui.review.index += 1;
  ui.review.revealed = false;
  renderReview();
}

/* --------------------------------------------------------------------------
   11. Notes
   -------------------------------------------------------------------------- */
function noteBookIds() {
  return Object.keys(state.notes).filter((id) => Array.isArray(state.notes[id]) && state.notes[id].length);
}

function renderNotes() {
  const list = $('#notes-list');
  if (!list) return;
  const allNotes = [];
  Object.entries(state.notes).forEach(([bookId, notes]) => {
    notes.forEach((note) => {
      allNotes.push({ ...note, bookId, bookTitle: state.library.books[bookId]?.title || 'Unknown book' });
    });
  });
  allNotes.sort((a, b) => b.updatedAt - a.updatedAt);
  setText('#notes-count', `${allNotes.length} ${allNotes.length === 1 ? 'note' : 'notes'}`);

  const composer = $('#note-composer');
  if (composer) composer.hidden = !ui.currentBook;
  setText('#note-page-label', `Page ${ui.currentPage + 1}`);
  if (ui.noteEditingId) {
    setText('#note-composer-title', 'Edit note');
    setText('#note-save', 'Update note');
    const cancel = $('#note-cancel');
    if (cancel) cancel.hidden = false;
  } else {
    setText('#note-composer-title', 'Add a note');
    setText('#note-save', 'Add note');
    const cancel = $('#note-cancel');
    if (cancel) cancel.hidden = true;
  }

  if (!allNotes.length) {
    list.innerHTML = `<div class="bank-empty"><strong>No notes yet</strong><p>${ui.currentBook ? 'Capture a thought about the page you are reading. Notes are saved with the book and its page number.' : 'Open a book and use the Notes panel to capture a thought about the page you are reading.'}</p></div>`;
    return;
  }

  list.innerHTML = allNotes.map((note) => `
    <article class="note-card" data-note-id="${escapeHtml(note.id)}" data-book-id="${escapeHtml(note.bookId)}">
      <div class="note-card-head">
        <span class="note-book">${escapeHtml(note.bookTitle)}</span>
        <span class="note-page">p. ${note.page}</span>
        <span class="bank-actions">
          <button class="icon-btn" type="button" data-edit-note="${escapeHtml(note.id)}" data-note-book="${escapeHtml(note.bookId)}" aria-label="Edit note">✎</button>
          <button class="icon-btn" type="button" data-delete-note="${escapeHtml(note.id)}" data-note-book="${escapeHtml(note.bookId)}" aria-label="Delete note">×</button>
        </span>
      </div>
      <p class="note-text">${escapeHtml(note.text)}</p>
      <p class="note-time">${relativeTime(note.updatedAt)}${note.updatedAt !== note.createdAt ? ' · edited' : ''}</p>
    </article>`).join('');
}

function saveNote() {
  if (!ui.currentBook) {
    toast('Open a book before adding a note.', 'info');
    return;
  }
  const input = $('#note-input');
  const text = (input?.value || '').trim();
  if (!text) {
    toast('Write something first.', 'info');
    input?.focus();
    return;
  }
  const bookId = String(ui.currentBook.id);
  const notes = state.notes[bookId] || [];
  if (ui.noteEditingId) {
    const note = notes.find((item) => item.id === ui.noteEditingId);
    if (note) {
      note.text = text.slice(0, 8000);
      note.updatedAt = Date.now();
      note.page = ui.currentPage + 1;
    }
    ui.noteEditingId = null;
    toast('Note updated.', 'success');
  } else {
    notes.unshift({
      id: uid('note'),
      text: text.slice(0, 8000),
      page: ui.currentPage + 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    toast('Note saved.', 'success');
  }
  state.notes[bookId] = notes;
  if (input) input.value = '';
  saveStateNow();
  renderNotes();
}

function editNote(noteId, bookId) {
  const note = (state.notes[bookId] || []).find((item) => item.id === noteId);
  if (!note) return;
  const input = $('#note-input');
  if (input) {
    input.value = note.text;
    input.focus();
  }
  ui.noteEditingId = noteId;
  renderNotes();
}

function deleteNote(noteId, bookId) {
  const notes = state.notes[bookId] || [];
  const index = notes.findIndex((item) => item.id === noteId);
  if (index < 0) return;
  const [note] = notes.splice(index, 1);
  if (!notes.length) delete state.notes[bookId];
  saveStateNow();
  renderNotes();
  toast('Note deleted.', 'info', {
    label: 'Undo',
    onClick: () => {
      state.notes[bookId] = state.notes[bookId] || [];
      state.notes[bookId].splice(index, 0, note);
      saveStateNow();
      renderNotes();
    },
  });
}

/* --------------------------------------------------------------------------
   12. RSVP speed reader
   -------------------------------------------------------------------------- */
function openRsvp() {
  if (!ui.bookData) {
    toast('Open a book first.', 'info');
    return;
  }
  closeWordPopup();
  closeDrawers();
  stopTeleprompter();
  const toastStack = $('#toast-stack');
  if (toastStack) toastStack.replaceChildren();
  const page = ui.bookData.pages[ui.currentPage];
  const start = clamp(page?.startWord || 0, 0, Math.max(0, ui.bookData.rsvpWords.length - 1));
  ui.rsvp = { open: true, index: start, playing: false, timer: null };
  const overlay = $('#rsvp-overlay');
  overlay.hidden = false;
  document.body.classList.add('is-locked');
  setText('#rsvp-title', ui.currentBook?.title || 'Speed reading');
  setText('#rsvp-context-label', page?.chapterTitle || '');
  syncSettingsUI();
  renderRsvpWord();
  $('#rsvp-close')?.focus();
}

function rsvpWord() {
  return ui.bookData?.rsvpWords?.[ui.rsvp.index] || '';
}

function renderRsvpWord() {
  if (!ui.bookData) return;
  const words = ui.bookData.rsvpWords;
  const word = words[ui.rsvp.index] || '—';
  const before = $('#rsvp-word .rsvp-before');
  const orp = $('#rsvp-word .rsvp-orp');
  const after = $('#rsvp-word .rsvp-after');
  if (!before || !orp || !after) return;
  const orpIndex = Math.max(0, Math.ceil(word.length * 0.34) - 1);
  before.textContent = word.slice(0, orpIndex);
  orp.textContent = word.slice(orpIndex, orpIndex + 1);
  after.textContent = word.slice(orpIndex + 1);

  requestAnimationFrame(() => {
    const wordElement = $('#rsvp-word');
    const wrap = wordElement?.parentElement;
    if (!wordElement || !wrap || !orp) return;
    const target = wordElement.offsetWidth / 2 - (orp.offsetLeft + orp.offsetWidth / 2);
    wordElement.style.transform = `translateX(${target}px)`;
  });

  const progress = $('#rsvp-progress-bar');
  if (progress) progress.style.width = `${words.length ? ((ui.rsvp.index + 1) / words.length) * 100 : 0}%`;
  setText('#rsvp-position', `${formatNumber(ui.rsvp.index + 1)} / ${formatNumber(words.length)}`);
  const page = ui.bookData.pages.find((item) => ui.rsvp.index >= item.startWord && ui.rsvp.index < item.endWord);
  if (page) setText('#rsvp-context-label', page.chapterTitle);
}

function scheduleRsvpTick() {
  clearTimeout(ui.rsvp.timer);
  if (!ui.rsvp.playing) return;
  const word = rsvpWord();
  const base = 60000 / clamp(Number(state.settings.rsvpWpm) || 260, 150, 500);
  let delay = base;
  if (/[.,;:!?]$/.test(word)) delay *= 1.6;
  else if (word.length > 11) delay *= 1.18;
  ui.rsvp.timer = setTimeout(() => {
    if (!ui.rsvp.playing) return;
    if (ui.rsvp.index >= ui.bookData.rsvpWords.length - 1) {
      pauseRsvp();
      toast('You reached the end of the book.', 'success');
      return;
    }
    ui.rsvp.index += 1;
    renderRsvpWord();
    scheduleRsvpTick();
  }, delay);
}

function restartRsvpTimer() {
  if (ui.rsvp.playing) scheduleRsvpTick();
}

function playRsvp() {
  if (!ui.bookData) return;
  if (ui.rsvp.playing) {
    pauseRsvp();
    return;
  }
  if (ui.rsvp.index >= ui.bookData.rsvpWords.length - 1) ui.rsvp.index = 0;
  ui.rsvp.playing = true;
  const button = $('#rsvp-play');
  if (button) button.textContent = '❚❚ Pause';
  setText('#rsvp-hint', 'Press Space to pause · ← → to step');
  renderRsvpWord();
  scheduleRsvpTick();
}

function pauseRsvp() {
  ui.rsvp.playing = false;
  clearTimeout(ui.rsvp.timer);
  ui.rsvp.timer = null;
  const button = $('#rsvp-play');
  if (button) button.textContent = '▶ Resume';
}

function stepRsvp(delta) {
  if (!ui.bookData) return;
  pauseRsvp();
  ui.rsvp.index = clamp(ui.rsvp.index + delta, 0, ui.bookData.rsvpWords.length - 1);
  renderRsvpWord();
}

function closeRsvp() {
  pauseRsvp();
  const overlay = $('#rsvp-overlay');
  if (overlay) overlay.hidden = true;
  const wasOpen = ui.rsvp.open;
  ui.rsvp.open = false;
  document.body.classList.remove('is-locked');
  if (wasOpen && ui.bookData) {
    const page = ui.bookData.pages.find((item) => ui.rsvp.index >= item.startWord && ui.rsvp.index < item.endWord);
    if (page) {
      ui.currentPage = page.index;
      ui.progressPercent = ((page.index + 1) / ui.bookData.pages.length) * 100;
      if (state.settings.pageTurn) renderPage(page.index);
      else {
        const target = $(`.scroll-page[data-page-index="${page.index}"]`);
        target?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
        updateProgress();
      }
    }
  }
}

/* --------------------------------------------------------------------------
   13. Teleprompter
   -------------------------------------------------------------------------- */
function toggleTeleprompter() {
  if (ui.teleprompter.active) {
    stopTeleprompter();
    return;
  }
  if (!ui.bookData) {
    toast('Open a book first.', 'info');
    return;
  }
  if (state.settings.pageTurn) {
    switchMode(false);
  }
  startTeleprompter();
}

function startTeleprompter() {
  const hud = $('#teleprompter-hud');
  if (hud) hud.hidden = false;
  ui.teleprompter.active = true;
  ui.teleprompter.paused = false;
  ui.teleprompter.last = 0;
  const button = $('#teleprompter-toggle');
  if (button) button.textContent = 'Pause';
  const quick = $('#quick-teleprompter');
  if (quick) quick.setAttribute('aria-pressed', 'true');
  cancelAnimationFrame(ui.teleprompter.raf);
  ui.teleprompter.raf = requestAnimationFrame(teleprompterStep);
}

function teleprompterStep(timestamp) {
  if (!ui.teleprompter.active) return;
  if (!ui.teleprompter.last) ui.teleprompter.last = timestamp;
  const delta = Math.min(64, timestamp - ui.teleprompter.last);
  ui.teleprompter.last = timestamp;
  if (!ui.teleprompter.paused) {
    const viewport = $('#scroll-viewport');
    const speed = clamp(Number(state.settings.teleprompterSpeed) || 30, 5, 120);
    viewport.scrollTop += (speed * 2.2 * delta) / 1000;
    if (viewport.scrollTop + viewport.clientHeight >= viewport.scrollHeight - 2) {
      stopTeleprompter();
      toast('You reached the end of the book.', 'success');
      return;
    }
  }
  ui.teleprompter.raf = requestAnimationFrame(teleprompterStep);
}

function stopTeleprompter() {
  ui.teleprompter.active = false;
  ui.teleprompter.paused = false;
  cancelAnimationFrame(ui.teleprompter.raf);
  const hud = $('#teleprompter-hud');
  if (hud) hud.hidden = true;
  const quick = $('#quick-teleprompter');
  if (quick) quick.setAttribute('aria-pressed', 'false');
}

function toggleTeleprompterPause() {
  ui.teleprompter.paused = !ui.teleprompter.paused;
  const button = $('#teleprompter-toggle');
  if (button) button.textContent = ui.teleprompter.paused ? 'Resume' : 'Pause';
}

/* --------------------------------------------------------------------------
   14. Ambient Web Audio engine
   -------------------------------------------------------------------------- */
const Ambient = {
  ctx: null,
  master: null,
  nodes: [],
  timer: null,
  type: 'off',

  ensureContext() {
    if (!this.ctx) {
      const Context = window.AudioContext || window.webkitAudioContext;
      if (!Context) throw new Error('Web Audio is not available in this browser.');
      this.ctx = new Context();
    }
    return this.ctx;
  },

  noiseBuffer(seconds = 4, color = 'white') {
    const ctx = this.ensureContext();
    const length = Math.floor(ctx.sampleRate * seconds);
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    if (color === 'brown') {
      let last = 0;
      for (let i = 0; i < length; i += 1) {
        const white = Math.random() * 2 - 1;
        last = (last + 0.02 * white) / 1.02;
        data[i] = last * 3.5;
      }
    } else {
      for (let i = 0; i < length; i += 1) data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  },

  async start(type) {
    if (!type || type === 'off') {
      this.stop();
      return;
    }
    this.stop();
    const ctx = this.ensureContext();
    await ctx.resume();
    this.type = type;
    this.master = ctx.createGain();
    this.master.gain.value = clamp(Number(state.settings.ambientVolume) || 0.45, 0, 1);
    this.master.connect(ctx.destination);

    const source = ctx.createBufferSource();
    source.buffer = this.noiseBuffer(4, type === 'rain' ? 'white' : 'brown');
    source.loop = true;
    this.nodes.push(source);

    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    if (type === 'rain') {
      filter.type = 'bandpass';
      filter.frequency.value = 2200;
      filter.Q.value = 0.4;
      gain.gain.value = 0.34;
      const high = ctx.createBiquadFilter();
      high.type = 'highpass';
      high.frequency.value = 500;
      source.connect(high);
      high.connect(filter);
      filter.connect(gain);
      this.nodes.push(high, filter, gain);
    } else if (type === 'cafe') {
      filter.type = 'lowpass';
      filter.frequency.value = 760;
      filter.Q.value = 0.7;
      gain.gain.value = 0.26;
      source.connect(filter);
      filter.connect(gain);
      this.nodes.push(filter, gain);
      const murmur = ctx.createOscillator();
      const murmurGain = ctx.createGain();
      murmur.type = 'sine';
      murmur.frequency.value = 92;
      murmurGain.gain.value = 0.012;
      murmur.connect(murmurGain);
      murmurGain.connect(this.master);
      murmur.start();
      this.nodes.push(murmur, murmurGain);
    } else {
      filter.type = 'lowpass';
      filter.frequency.value = 460;
      filter.Q.value = 0.5;
      gain.gain.value = 0.42;
      source.connect(filter);
      filter.connect(gain);
      this.nodes.push(filter, gain);
    }

    gain.connect(this.master);
    source.start();
    this.scheduleCrackle(type);
  },

  scheduleCrackle(type) {
    clearInterval(this.timer);
    if (type !== 'fireplace' && type !== 'cafe') return;
    const tick = () => {
      if (!this.ctx || this.type === 'off') return;
      const ctx = this.ctx;
      const now = ctx.currentTime;
      if (type === 'fireplace') {
        const bursts = 1 + Math.floor(Math.random() * 3);
        for (let i = 0; i < bursts; i += 1) {
          const start = now + Math.random() * 0.25;
          const duration = 0.02 + Math.random() * 0.07;
          const buffer = this.noiseBuffer(duration, 'white');
          const crackle = ctx.createBufferSource();
          crackle.buffer = buffer;
          const band = ctx.createBiquadFilter();
          band.type = 'bandpass';
          band.frequency.value = 1200 + Math.random() * 2600;
          band.Q.value = 1.2;
          const envelope = ctx.createGain();
          envelope.gain.setValueAtTime(0.0001, start);
          envelope.gain.exponentialRampToValueAtTime(0.12 + Math.random() * 0.15, start + 0.006);
          envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);
          crackle.connect(band);
          band.connect(envelope);
          envelope.connect(this.master);
          crackle.start(start);
          crackle.stop(start + duration + 0.02);
        }
        this.timer = setTimeout(tick, 380 + Math.random() * 900);
      } else {
        const ping = ctx.createOscillator();
        const pingGain = ctx.createGain();
        ping.type = 'sine';
        ping.frequency.value = 900 + Math.random() * 900;
        pingGain.gain.setValueAtTime(0.0001, now);
        pingGain.gain.exponentialRampToValueAtTime(0.018, now + 0.01);
        pingGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
        ping.connect(pingGain);
        pingGain.connect(this.master);
        ping.start(now);
        ping.stop(now + 0.45);
        this.timer = setTimeout(tick, 5000 + Math.random() * 9000);
      }
    };
    this.timer = setTimeout(tick, 500);
  },

  setVolume(value) {
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(clamp(value, 0, 1), this.ctx.currentTime, 0.08);
    }
  },

  stop() {
    clearTimeout(this.timer);
    this.timer = null;
    this.type = 'off';
    const ctx = this.ctx;
    const master = this.master;
    this.master = null;
    this.nodes.forEach((node) => {
      try {
        if (typeof node.stop === 'function') node.stop();
        node.disconnect();
      } catch (error) {
        // Already disconnected.
      }
    });
    this.nodes = [];
    if (master && ctx) {
      try {
        master.gain.setTargetAtTime(0, ctx.currentTime, 0.05);
        setTimeout(() => master.disconnect(), 250);
      } catch (error) {
        // Ignore.
      }
    }
  },
};

async function setAmbient(type) {
  try {
    if (type === 'off' || type === state.settings.ambient) {
      Ambient.stop();
      state.settings.ambient = 'off';
      saveStateSoon();
      syncSettingsUI();
      return;
    }
    await Ambient.start(type);
    state.settings.ambient = type;
    saveStateSoon();
    syncSettingsUI();
    toast(`${capitalize(type)} ambience is playing.`, 'info');
  } catch (error) {
    console.error('Ambient audio failed:', error);
    state.settings.ambient = 'off';
    syncSettingsUI();
    toast('Your browser blocked audio. Tap the sound button again to allow it.', 'error');
  }
}

/* --------------------------------------------------------------------------
   15. Drawers, modals, toasts, loading
   -------------------------------------------------------------------------- */
function openDrawer(name) {
  const drawer = $(`#${name}-drawer`);
  if (!drawer) return;
  closeDrawers();
  ui.lastFocus = document.activeElement;
  ui.drawer = name;
  const backdrop = $('#drawer-backdrop');
  if (backdrop) backdrop.hidden = false;
  drawer.classList.add('is-open');
  drawer.setAttribute('aria-hidden', 'false');
  document.body.classList.add('is-locked');
  if (name === 'wordbank') renderWordBank();
  if (name === 'notes') renderNotes();
  if (name === 'settings') syncSettingsUI();
  const close = drawer.querySelector('[data-close-drawer]');
  close?.focus();
}

function closeDrawers() {
  $$('.drawer').forEach((drawer) => {
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
  });
  const backdrop = $('#drawer-backdrop');
  if (backdrop) backdrop.hidden = true;
  if (ui.drawer) {
    ui.drawer = null;
    if (!document.querySelector('.modal:not([hidden])') && !ui.rsvp.open) {
      document.body.classList.remove('is-locked');
    }
    if (ui.lastFocus && typeof ui.lastFocus.focus === 'function') ui.lastFocus.focus();
  }
}

function openModal(id) {
  const modal = $(`#${id}`);
  if (!modal) return;
  closeDrawers();
  closeWordPopup();
  modal.hidden = false;
  document.body.classList.add('is-locked');
  const focusable = modal.querySelector('button, [href], input, select, textarea');
  focusable?.focus();
}

function closeModal(id) {
  const modal = typeof id === 'string' ? $(`#${id}`) : id;
  if (!modal) return;
  modal.hidden = true;
  if (!document.querySelector('.modal:not([hidden])') && !ui.rsvp.open) {
    document.body.classList.remove('is-locked');
  }
}

function toast(message, type = 'info', action = null, duration = 4200) {
  const stack = $('#toast-stack');
  if (!stack) return;
  const element = document.createElement('div');
  element.className = `toast toast-${type}`;
  element.innerHTML = `<span>${escapeHtml(message)}</span>`;
  if (action) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = action.label;
    button.addEventListener('click', () => {
      action.onClick();
      dismiss();
    });
    element.appendChild(button);
  }
  stack.appendChild(element);
  const dismiss = () => {
    if (!element.isConnected) return;
    element.classList.add('is-leaving');
    setTimeout(() => element.remove(), 260);
  };
  const timer = setTimeout(dismiss, duration);
  element.addEventListener('mouseenter', () => clearTimeout(timer));
  element.addEventListener('mouseleave', () => setTimeout(dismiss, 1200));
}

function showLoading(title, subtitle) {
  const overlay = $('#loading-overlay');
  if (!overlay) return;
  setText('#loading-title', title);
  setText('#loading-subtitle', subtitle);
  overlay.hidden = false;
  setLoadingStep(0);
  document.body.classList.add('is-locked');
}

function setLoadingStep(step) {
  $$('#loading-steps .loading-step').forEach((element, index) => {
    element.classList.toggle('is-active', index === step);
    element.classList.toggle('is-done', index < step);
  });
}

function hideLoading() {
  const overlay = $('#loading-overlay');
  if (overlay) overlay.hidden = true;
  if (!document.querySelector('.modal:not([hidden])') && !ui.rsvp.open && !ui.drawer) {
    document.body.classList.remove('is-locked');
  }
}

/* --------------------------------------------------------------------------
   16. View routing
   -------------------------------------------------------------------------- */
function setHash(hash, replace = false) {
  if (ui.ignoreHash) return;
  try {
    if (replace) history.replaceState(null, '', hash);
    else history.pushState(null, '', hash);
  } catch (error) {
    // file:// can reject history changes.
  }
}

function showLibrary(options = {}) {
  ui.view = 'library';
  const library = $('#library-view');
  const reader = $('#reader-view');
  if (library) {
    library.hidden = false;
    library.classList.add('is-active');
  }
  if (reader) {
    reader.hidden = true;
    reader.classList.remove('is-active');
  }
  $$('.nav-btn').forEach((button) => button.classList.toggle('is-active', button.dataset.view === 'library'));
  updateContinueBanner();
  document.title = 'Gutenberg Reader Studio & Vocabulary Lab';
  setHash('#library', Boolean(options.replaceHash));
}

function showReader(options = {}) {
  ui.view = 'reader';
  const library = $('#library-view');
  const reader = $('#reader-view');
  if (library) {
    library.hidden = true;
    library.classList.remove('is-active');
  }
  if (reader) {
    reader.hidden = false;
    reader.classList.add('is-active');
  }
  $$('.nav-btn').forEach((button) => button.classList.toggle('is-active', button.dataset.view === 'reader'));
  if (ui.currentBook) {
    document.title = `${ui.currentBook.title} · Gutenberg Reader Studio`;
    setHash(`#read/${ui.currentBook.id}`, Boolean(options.replaceHash));
  }
}

function updateContinueBanner() {
  const banner = $('#continue-banner');
  if (!banner) return;
  const activeId = state.library.activeBookId;
  const book = activeId ? state.library.books[activeId] : null;
  if (!book) {
    banner.hidden = true;
    return;
  }
  const progress = book.progress;
  const percent = progress ? Math.round(Number(progress.percent) || 0) : 0;
  const page = progress ? Number(progress.page) + 1 : 1;
  banner.hidden = false;
  setText('#continue-title', book.title || 'Your book');
  setText('#continue-meta', `${page ? `Page ${page}` : 'Not started'} · ${percent}% read`);
  const cover = $('#continue-cover');
  if (cover) {
    cover.innerHTML = `<img src="${escapeHtml(book.cover || coverUrl(book.id))}" alt="" loading="lazy">`;
    cover.querySelector('img')?.addEventListener('error', (event) => event.target.remove(), { once: true });
  }
  const button = $('#continue-btn');
  if (button) {
    button.onclick = () => openBook(book, { silent: true });
  }
}

function updateNav() {
  const navReader = $('#nav-reader');
  if (navReader) navReader.disabled = !ui.currentBook;
}

function handleRoute() {
  const hash = window.location.hash || '#library';
  if (hash.startsWith('#read/')) {
    const id = hash.split('/')[1];
    if (ui.currentBook && String(ui.currentBook.id) === String(id) && ui.bookData) {
      showReader({ replaceHash: true });
      return;
    }
    openBookById(id);
    return;
  }
  showLibrary({ replaceHash: true });
}

/* --------------------------------------------------------------------------
   17. Import / export
   -------------------------------------------------------------------------- */
function exportState() {
  try {
    const payload = JSON.parse(JSON.stringify(state));
    payload.exportedAt = new Date().toISOString();
    payload.app = {
      name: APP.name,
      version: APP.version,
      repository: APP.repository,
      pages: APP.pages,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = APP.stateFileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast('Reading library saved as gutenberg_studio_state.json.', 'success');
  } catch (error) {
    console.error('Export failed:', error);
    toast('Could not export your library.', 'error');
  }
}

async function importState(file) {
  if (!file) return;
  try {
    const text = await file.text();
    const raw = JSON.parse(text);
    if (!raw || typeof raw !== 'object' || (!raw.settings && !raw.wordBank && !raw.notes && !raw.library)) {
      throw new Error('This file does not look like a Gutenberg Reader Studio library.');
    }
    const hasData =
      Object.keys(raw.wordBank || {}).length ||
      Object.keys(raw.notes || {}).length ||
      Object.keys(raw.library?.books || {}).length;
    const currentHasData =
      Object.keys(state.wordBank || {}).length ||
      Object.keys(state.notes || {}).length ||
      Object.keys(state.library?.books || {}).length;
    if (hasData && currentHasData && !window.confirm('Replace the current reading library, notes, and Word Bank with this file?')) return;
    state = mergeState(raw);
    saveStateNow();
    ui.currentBook = null;
    ui.bookData = null;
    ui.currentPage = 0;
    ui.progressPercent = 0;
    applySettings();
    clearSearch();
    renderWordBank();
    renderNotes();
    updateContinueBanner();
    updateNav();
    showLibrary({ replaceHash: true });
    toast('Reading library restored. Open a book to resume where you left off.', 'success');
  } catch (error) {
    console.error('Import failed:', error);
    toast(`Could not import this file. ${error.message}`, 'error');
  } finally {
    const input = $('#import-file');
    if (input) input.value = '';
  }
}

/* --------------------------------------------------------------------------
   18. Build provenance
   -------------------------------------------------------------------------- */
async function loadBuildState() {
  try {
    const response = await fetch('state.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('No state file');
    const data = await response.json();
    const build = data.build || {};
    const tokens = data.tokens || {};
    const model = data.model || {};
    const harness = data.harness || {};
    const summary = [
      build.durationHuman ? `Built in ${build.durationHuman}` : null,
      tokens.total ? `${formatNumber(tokens.total)} tokens` : null,
      model.name || null,
      harness.name ? `${harness.name}${harness.version ? ` ${harness.version}` : ''}` : null,
    ].filter(Boolean).join(' · ');
    if (summary) setText('#build-state-inline', `${summary}. Open state.json for the full provenance record.`);
  } catch (error) {
    setText('#build-state-inline', 'Build provenance is available in state.json in the repository.');
  }
}

function openBuildState() {
  window.open('state.json', '_blank', 'noopener');
}

/* --------------------------------------------------------------------------
   19. Keyboard shortcuts & event wiring
   -------------------------------------------------------------------------- */
function isTypingTarget(target) {
  if (!target) return false;
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable;
}

function setupEvents() {
  // Navigation
  $$('.nav-btn').forEach((button) => {
    button.addEventListener('click', () => {
      if (button.dataset.view === 'library') showLibrary();
      if (button.dataset.view === 'reader') {
        if (ui.currentBook && ui.bookData) showReader();
        else toast('Open a book first.', 'info');
      }
    });
  });
  $$('[data-open]').forEach((button) => {
    button.addEventListener('click', () => openDrawer(button.dataset.open));
  });
  $$('[data-close-drawer]').forEach((button) => button.addEventListener('click', closeDrawers));
  $('#drawer-backdrop')?.addEventListener('click', closeDrawers);
  $$('[data-close-modal]').forEach((button) => {
    button.addEventListener('click', () => closeModal(button.closest('.modal')));
  });
  $$('.modal').forEach((modal) => {
    modal.addEventListener('click', (event) => {
      if (event.target === modal) closeModal(modal);
    });
  });
  $('#brand-home')?.addEventListener('click', (event) => {
    event.preventDefault();
    showLibrary();
  });
  $('#btn-help')?.addEventListener('click', () => openModal('help-modal'));
  $('#btn-build-state')?.addEventListener('click', openBuildState);
  $('#btn-build-state-2')?.addEventListener('click', openBuildState);

  // Library
  $('#search-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const query = ($('#search-input')?.value || '').trim();
    if (!query) {
      clearSearch();
      return;
    }
    performSearch(query);
  });
  $('#genre-chips')?.addEventListener('click', (event) => {
    const chip = event.target.closest('.chip');
    if (!chip) return;
    $$('#genre-chips .chip').forEach((item) => item.classList.toggle('is-active', item === chip));
    const topic = chip.dataset.topic;
    if (topic === 'all') {
      clearSearch();
    } else {
      performSearch('', { topic });
    }
  });
  $('#clear-search')?.addEventListener('click', () => clearSearch());
  $('#load-more')?.addEventListener('click', loadMoreResults);
  $('#sort-select')?.addEventListener('change', (event) => {
    ui.search.sort = event.target.value;
    if (ui.search.results.length) {
      if (ui.search.sort === 'title') ui.search.results.sort((a, b) => a.title.localeCompare(b.title));
      if (ui.search.sort === 'author') ui.search.results.sort((a, b) => a.authorSort.localeCompare(b.authorSort));
      renderSearchResults();
    }
  });

  // Reader
  $('#btn-back')?.addEventListener('click', () => showLibrary());
  $('#btn-prev')?.addEventListener('click', () => navigate(-1));
  $('#btn-next')?.addEventListener('click', () => navigate(1));
  $('#chapter-select')?.addEventListener('change', (event) => jumpToChapter(event.target.value));
  $$('.mode-btn').forEach((button) => {
    button.addEventListener('click', () => switchMode(button.dataset.mode === 'page'));
  });
  $$('[data-quick]').forEach((button) => {
    button.addEventListener('click', () => {
      const action = button.dataset.quick;
      if (action === 'bionic') setSetting('bionic', !state.settings.bionic);
      if (action === 'rsvp') openRsvp();
      if (action === 'teleprompter') toggleTeleprompter();
      if (action === 'sound') {
        if (state.settings.ambient === 'off') setAmbient('rain');
        else setAmbient('off');
      }
    });
  });
  $('#scroll-viewport')?.addEventListener('scroll', () => {
    if (!ui.bookData || state.settings.pageTurn) return;
    const viewport = $('#scroll-viewport');
    const max = Math.max(0, viewport.scrollHeight - viewport.clientHeight);
    ui.progressPercent = max > 0 ? clamp((viewport.scrollTop / max) * 100, 0, 100) : 0;
    const pages = ui.bookData.pages;
    const targetY = viewport.scrollTop + viewport.clientHeight * 0.35;
    let index = 0;
    pages.forEach((page, pageIndex) => {
      const element = viewport.querySelector(`.scroll-page[data-page-index="${pageIndex}"]`);
      if (element && element.offsetTop <= targetY) index = pageIndex;
    });
    ui.currentPage = index;
    updateProgress();
  }, { passive: true });
  $('#scroll-viewport')?.addEventListener('wheel', () => {
    if (ui.teleprompter.active && !ui.teleprompter.paused) toggleTeleprompterPause();
  }, { passive: true });
  $('#scroll-viewport')?.addEventListener('touchstart', () => {
    if (ui.teleprompter.active && !ui.teleprompter.paused) toggleTeleprompterPause();
  }, { passive: true });

  // Settings
  $('#theme-grid')?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-theme-choice]');
    if (button) setSetting('theme', button.dataset.themeChoice);
  });
  $('#font-grid')?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-font-choice]');
    if (button) setSetting('font', button.dataset.fontChoice, { repaginate: true });
  });
  $('#font-size-range')?.addEventListener('input', (event) => {
    setText('#font-size-readout', `${event.target.value}px`);
    setRangeFill(event.target);
    setSetting('fontSize', Number(event.target.value), { repaginate: true });
  });
  $('#line-height-range')?.addEventListener('input', (event) => {
    setText('#line-height-readout', `${Number(event.target.value).toFixed(2)}×`);
    setRangeFill(event.target);
    setSetting('lineHeight', Number(event.target.value), { repaginate: true });
  });
  $('#wpm-range')?.addEventListener('input', (event) => {
    setText('#wpm-readout', `${event.target.value} wpm`);
    setRangeFill(event.target);
    setSetting('rsvpWpm', Number(event.target.value));
  });
  $('#volume-range')?.addEventListener('input', (event) => {
    setText('#volume-readout', `${Math.round(Number(event.target.value) * 100)}%`);
    setRangeFill(event.target);
    setSetting('ambientVolume', Number(event.target.value));
  });
  $('#teleprompter-speed')?.addEventListener('input', (event) => {
    setText('#teleprompter-speed-label', event.target.value);
    setRangeFill(event.target);
    setSetting('teleprompterSpeed', Number(event.target.value));
  });
  $('#toggle-pageturn')?.addEventListener('change', (event) => setSetting('pageTurn', event.target.checked));
  $('#toggle-bionic')?.addEventListener('change', (event) => setSetting('bionic', event.target.checked));
  $('#open-rsvp')?.addEventListener('click', openRsvp);
  $('#open-teleprompter')?.addEventListener('click', toggleTeleprompter);
  $('#sound-grid')?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-sound]');
    if (button) setAmbient(button.dataset.sound);
  });
  $('#btn-save')?.addEventListener('click', exportState);
  $('#btn-save-secondary')?.addEventListener('click', exportState);
  $('#btn-save-drawer')?.addEventListener('click', exportState);
  $('#btn-load')?.addEventListener('click', () => $('#import-file')?.click());
  $('#btn-load-secondary')?.addEventListener('click', () => $('#import-file')?.click());
  $('#btn-load-drawer')?.addEventListener('click', () => $('#import-file')?.click());
  $('#import-file')?.addEventListener('change', (event) => importState(event.target.files?.[0]));
  $('#btn-reset-data')?.addEventListener('click', () => {
    if (!window.confirm('Delete every saved book, note, word, and setting from this browser? Export first if you want a backup.')) return;
    state = defaultState();
    ui.currentBook = null;
    ui.bookData = null;
    ui.currentPage = 0;
    ui.progressPercent = 0;
    localStorage.removeItem(APP.storageKey);
    localStorage.removeItem(APP.dictKey);
    ui.dictCache = {};
    applySettings();
    clearSearch();
    renderWordBank();
    renderNotes();
    updateContinueBanner();
    updateNav();
    showLibrary({ replaceHash: true });
    toast('Studio data reset.', 'success');
  });

  // Word popup
  $('#popup-close')?.addEventListener('click', closeWordPopup);
  $('#popup-add')?.addEventListener('click', addCurrentWordToBank);
  $('#popup-audio')?.addEventListener('click', () => {
    if (!ui.popup) return;
    if (ui.popup.data?.audio) {
      new Audio(ui.popup.data.audio).play().catch(() => speakFallback(ui.popup.word));
    } else {
      speakFallback(ui.popup.word);
    }
  });
  document.addEventListener('pointerdown', (event) => {
    const popup = $('#word-popup');
    if (!popup || popup.hidden) return;
    if (popup.contains(event.target)) return;
    if (event.target.closest('#reading-surface')) return;
    closeWordPopup();
  });

  // Word bank
  $('#bank-search')?.addEventListener('input', debounce(renderWordBank, 120));
  $('#bank-filter')?.addEventListener('change', renderWordBank);
  $('#start-review')?.addEventListener('click', () => openReview());
  $('#bank-list')?.addEventListener('click', (event) => {
    const review = event.target.closest('[data-review-word]');
    if (review) {
      const entry = state.wordBank[review.dataset.reviewWord];
      if (entry) openReview([entry]);
      return;
    }
    const remove = event.target.closest('[data-delete-word]');
    if (remove) {
      removeWordFromBank(remove.dataset.deleteWord);
      return;
    }
    const audio = event.target.closest('[data-audio-word]');
    if (audio) speakWord(audio.dataset.audioWord);
  });

  // Notes
  $('#note-save')?.addEventListener('click', saveNote);
  $('#note-cancel')?.addEventListener('click', () => {
    ui.noteEditingId = null;
    const input = $('#note-input');
    if (input) input.value = '';
    renderNotes();
  });
  $('#notes-list')?.addEventListener('click', (event) => {
    const edit = event.target.closest('[data-edit-note]');
    if (edit) {
      editNote(edit.dataset.editNote, edit.dataset.noteBook);
      return;
    }
    const remove = event.target.closest('[data-delete-note]');
    if (remove) deleteNote(remove.dataset.deleteNote, remove.dataset.noteBook);
  });

  // RSVP
  $('#rsvp-close')?.addEventListener('click', closeRsvp);
  $('#rsvp-play')?.addEventListener('click', playRsvp);
  $('#rsvp-prev')?.addEventListener('click', () => stepRsvp(-1));
  $('#rsvp-next')?.addEventListener('click', () => stepRsvp(1));
  $('#rsvp-jump')?.addEventListener('click', closeRsvp);
  $('#rsvp-wpm')?.addEventListener('input', (event) => {
    setText('#rsvp-wpm-readout', `${event.target.value} wpm`);
    setRangeFill(event.target);
    setSetting('rsvpWpm', Number(event.target.value));
  });

  // Review
  $('#review-reveal')?.addEventListener('click', () => {
    ui.review.revealed = true;
    renderReview();
  });
  $('#review-grades')?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-grade]');
    if (button) handleReviewGrade(button.dataset.grade);
  });

  // Teleprompter
  $('#teleprompter-toggle')?.addEventListener('click', toggleTeleprompterPause);
  $('#teleprompter-close')?.addEventListener('click', stopTeleprompter);

  // Keyboard
  document.addEventListener('keydown', handleKeydown);

  // Persistence / layout
  window.addEventListener('beforeunload', saveStateNow);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') saveStateNow();
  });
  window.addEventListener('resize', debounce(() => {
    if (ui.bookData) scheduleRepaginate();
  }, 400));
  window.addEventListener('popstate', handleRoute);
  window.addEventListener('hashchange', () => {
    if (ui.ignoreHash) {
      ui.ignoreHash = false;
      return;
    }
    handleRoute();
  });
}

function handleKeydown(event) {
  if (event.key === 'Escape') {
    if (!ui.rsvp.open) {
      closeWordPopup();
    }
    if (ui.rsvp.open) {
      closeRsvp();
      return;
    }
    const openModalElement = document.querySelector('.modal:not([hidden])');
    if (openModalElement) {
      closeModal(openModalElement);
      return;
    }
    if (ui.drawer) {
      closeDrawers();
      return;
    }
    if (ui.teleprompter.active) {
      stopTeleprompter();
      return;
    }
  }

  if (ui.rsvp.open) {
    if (event.code === 'Space') {
      event.preventDefault();
      playRsvp();
      return;
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      stepRsvp(-1);
      return;
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      stepRsvp(1);
      return;
    }
    return;
  }

  if (isTypingTarget(event.target)) return;
  if (event.metaKey || event.ctrlKey) {
    if (event.key.toLowerCase() === 's') {
      event.preventDefault();
      exportState();
    }
    return;
  }

  const key = event.key.toLowerCase();
  if (key === '?' || (event.shiftKey && key === '/')) {
    event.preventDefault();
    openModal('help-modal');
    return;
  }
  if (key === '/') {
    event.preventDefault();
    if (ui.view === 'library') $('#search-input')?.focus();
    return;
  }
  if (key === 'w') {
    event.preventDefault();
    openDrawer('wordbank');
    return;
  }
  if (key === 'n') {
    event.preventDefault();
    openDrawer('notes');
    return;
  }
  if (key === 's' && ui.view === 'reader') {
    event.preventDefault();
    openDrawer('settings');
    return;
  }
  if (ui.view !== 'reader') return;
  if (key === 'b') {
    event.preventDefault();
    setSetting('bionic', !state.settings.bionic);
    return;
  }
  if (key === 'r') {
    event.preventDefault();
    openRsvp();
    return;
  }
  if (key === 't') {
    event.preventDefault();
    toggleTeleprompter();
    return;
  }
  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    navigate(-1);
    return;
  }
  if (event.key === 'ArrowRight') {
    event.preventDefault();
    navigate(1);
  }
}

/* --------------------------------------------------------------------------
   20. Initialisation
   -------------------------------------------------------------------------- */
function init() {
  // Ambient audio cannot auto-start without a gesture. Keep the preference
  // visible but start silent on a fresh load.
  if (state.settings.ambient !== 'off') {
    state.settings.ambient = 'off';
    saveStateSoon();
  }
  applySettings();
  setupEvents();
  setupReaderSelection();
  renderCurated();
  renderWordBank();
  renderNotes();
  updateContinueBanner();
  updateNav();
  loadBuildState();
  handleRoute();

  // Expose a tiny read-only debug surface for curious readers and automated
  // smoke tests. It intentionally does not expose mutation helpers.
  window.GutenbergStudio = {
    get state() { return state; },
    get book() { return ui.bookData; },
    get view() { return ui.view; },
    openBook,
    openRsvp,
    performSearch,
    version: APP.version,
  };
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
