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
  searchCacheKey: 'gutenbergStudio.searchCache.v1',
  stateFileName: 'gutenberg_studio_state.json',
  repository: 'https://github.com/somphol/gutenberg-reader-studio',
  pages: 'https://somphol.github.io/gutenberg-reader-studio/',
};

const DAY = 86400000;
const TEXT_CACHE_VERSION = 3;
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

const POPULAR_GUTENBERG = [
  {
    "id": 37683,
    "title": "Chambers's Twentieth Century Dictionary (part 1 of 4: A-D)",
    "author": "Unknown author",
    "authorSort": "",
    "subjects": [
      "English language -- Dictionaries"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 94005,
    "cover": "https://www.gutenberg.org/cache/epub/37683/pg37683.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/37683.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/37683.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 1513,
    "title": "Romeo and Juliet",
    "author": "William Shakespeare",
    "authorSort": "William Shakespeare",
    "subjects": [
      "Conflict of generations -- Drama",
      "Juliet (Fictitious character) -- Drama",
      "Romeo (Fictitious character) -- Drama",
      "Tragedies (Drama)"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 81893,
    "cover": "https://www.gutenberg.org/cache/epub/1513/pg1513.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/1513.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/1513.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 100,
    "title": "The Complete Works of William Shakespeare",
    "author": "William Shakespeare",
    "authorSort": "William Shakespeare",
    "subjects": [
      "English drama -- Early modern and Elizabethan, 1500-1600"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 76146,
    "cover": "https://www.gutenberg.org/cache/epub/100/pg100.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/100.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/100.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 43,
    "title": "The strange case of Dr. Jekyll and Mr. Hyde",
    "author": "Robert Louis Stevenson",
    "authorSort": "Robert Louis Stevenson",
    "subjects": [
      "Horror tales",
      "London (England) -- Fiction",
      "Multiple personality -- Fiction",
      "Physicians -- Fiction"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 71859,
    "cover": "https://www.gutenberg.org/cache/epub/43/pg43.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/43.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/43.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 2641,
    "title": "A Room with a View",
    "author": "E. M. (Edward Morgan) Forster",
    "authorSort": "E. M. (Edward Morgan) Forster",
    "subjects": [
      "British -- Italy -- Fiction",
      "England -- Fiction",
      "Florence (Italy) -- Fiction",
      "Humorous stories"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 70690,
    "cover": "https://www.gutenberg.org/cache/epub/2641/pg2641.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/2641.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/2641.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 145,
    "title": "Middlemarch",
    "author": "George Eliot",
    "authorSort": "George Eliot",
    "subjects": [
      "Bildungsromans",
      "City and town life -- Fiction",
      "Didactic fiction",
      "Domestic fiction"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 70535,
    "cover": "https://www.gutenberg.org/cache/epub/145/pg145.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/145.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/145.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 49297,
    "title": "The Works of William Shakespeare [Cambridge Edition] [Vol. 5 of 9]",
    "author": "William Shakespeare",
    "authorSort": "William Shakespeare",
    "subjects": [
      "English drama"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 67762,
    "cover": "https://www.gutenberg.org/cache/epub/49297/pg49297.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/49297.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/49297.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 1727,
    "title": "The Odyssey: Rendered into English prose for the use of those who cannot read the original",
    "author": "Homer",
    "authorSort": "Homer",
    "subjects": [
      "Epic poetry, Greek -- Translations into English",
      "Homer -- Translations into English",
      "Odysseus, King of Ithaca (Mythological character)"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 63666,
    "cover": "https://www.gutenberg.org/cache/epub/1727/pg1727.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/1727.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/1727.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 67979,
    "title": "The Blue Castle: a novel",
    "author": "L. M. (Lucy Maud) Montgomery",
    "authorSort": "L. M. (Lucy Maud) Montgomery",
    "subjects": [
      "Canada -- History -- 1914-1945 -- Fiction",
      "Choice (Psychology) -- Fiction",
      "Love -- Fiction",
      "Romance fiction"
    ],
    "topics": [
      "fiction",
      "romance"
    ],
    "downloads": 62659,
    "cover": "https://www.gutenberg.org/cache/epub/67979/pg67979.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/67979.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/67979.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 37106,
    "title": "Little Women; Or, Meg, Jo, Beth, and Amy",
    "author": "Louisa May Alcott",
    "authorSort": "Louisa May Alcott",
    "subjects": [
      "Autobiographical fiction",
      "Bildungsromans",
      "Domestic fiction",
      "Family life -- New England -- Fiction"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 57282,
    "cover": "https://www.gutenberg.org/cache/epub/37106/pg37106.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/37106.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/37106.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 1184,
    "title": "The Count of Monte Cristo",
    "author": "Alexandre Dumas",
    "authorSort": "Alexandre Dumas",
    "subjects": [
      "Adventure stories",
      "Dantès, Edmond (Fictitious character) -- Fiction",
      "France -- History -- 19th century -- Fiction",
      "Historical fiction"
    ],
    "topics": [
      "adventure",
      "fiction"
    ],
    "downloads": 53145,
    "cover": "https://www.gutenberg.org/cache/epub/1184/pg1184.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/1184.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/1184.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 2680,
    "title": "Meditations",
    "author": "Emperor of Rome Marcus Aurelius",
    "authorSort": "Emperor of Rome Marcus Aurelius",
    "subjects": [
      "Ethics",
      "Life",
      "Stoics"
    ],
    "topics": [
      "philosophy"
    ],
    "downloads": 50637,
    "cover": "https://www.gutenberg.org/cache/epub/2680/pg2680.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/2680.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/2680.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 16328,
    "title": "Beowulf: An Anglo-Saxon Epic Poem",
    "author": "Unknown author",
    "authorSort": "",
    "subjects": [
      "Dragons -- Poetry",
      "Epic poetry, English (Old)",
      "Monsters -- Poetry"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 50413,
    "cover": "https://www.gutenberg.org/cache/epub/16328/pg16328.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/16328.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/16328.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 65238,
    "title": "The Secret of Chimneys",
    "author": "Agatha Christie",
    "authorSort": "Agatha Christie",
    "subjects": [
      "Battle, Superintendent (Fictitious character) -- Fiction",
      "Detective and mystery stories",
      "Police -- England -- Fiction"
    ],
    "topics": [
      "fiction",
      "mystery"
    ],
    "downloads": 50307,
    "cover": "https://www.gutenberg.org/cache/epub/65238/pg65238.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/65238.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/65238.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 5197,
    "title": "My Life — Volume 1",
    "author": "Richard Wagner",
    "authorSort": "Richard Wagner",
    "subjects": [
      "Composers -- Germany -- Biography",
      "Wagner, Richard, 1813-1883"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 50152,
    "cover": "https://www.gutenberg.org/cache/epub/5197/pg5197.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/5197.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/5197.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 16389,
    "title": "The Enchanted April",
    "author": "Elizabeth Von Arnim",
    "authorSort": "Elizabeth Von Arnim",
    "subjects": [
      "British -- Italy -- Fiction",
      "Domestic fiction",
      "Female friendship -- Fiction",
      "Italy -- Fiction"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 47374,
    "cover": "https://www.gutenberg.org/cache/epub/16389/pg16389.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/16389.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/16389.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 1952,
    "title": "The Yellow Wallpaper",
    "author": "Charlotte Perkins Gilman",
    "authorSort": "Charlotte Perkins Gilman",
    "subjects": [
      "Feminist fiction",
      "Married women -- Psychology -- Fiction",
      "Mentally ill women -- Fiction",
      "Psychological fiction"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 46806,
    "cover": "https://www.gutenberg.org/cache/epub/1952/pg1952.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/1952.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/1952.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 1259,
    "title": "Twenty years after",
    "author": "Alexandre Dumas",
    "authorSort": "Alexandre Dumas",
    "subjects": [
      "France -- History -- Louis XIV, 1643-1715 -- Fiction"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 46606,
    "cover": "https://www.gutenberg.org/cache/epub/1259/pg1259.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/1259.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/1259.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 1232,
    "title": "The Prince",
    "author": "Niccolò Machiavelli",
    "authorSort": "Niccolò Machiavelli",
    "subjects": [
      "Political ethics -- Early works to 1800",
      "Political science -- Philosophy -- Early works to 1800",
      "State, The -- Early works to 1800"
    ],
    "topics": [
      "philosophy"
    ],
    "downloads": 45102,
    "cover": "https://www.gutenberg.org/cache/epub/1232/pg1232.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/1232.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/1232.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 394,
    "title": "Cranford",
    "author": "Elizabeth Cleghorn Gaskell",
    "authorSort": "Elizabeth Cleghorn Gaskell",
    "subjects": [
      "England -- Fiction",
      "Female friendship -- Fiction",
      "Older women -- Fiction",
      "Pastoral fiction"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 44534,
    "cover": "https://www.gutenberg.org/cache/epub/394/pg394.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/394.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/394.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 8492,
    "title": "The King in Yellow",
    "author": "Robert W. (Robert William) Chambers",
    "authorSort": "Robert W. (Robert William) Chambers",
    "subjects": [
      "Horror tales, American",
      "Short stories, American",
      "United States -- Social life and customs -- 19th century -- Fiction"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 44422,
    "cover": "https://www.gutenberg.org/cache/epub/8492/pg8492.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/8492.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/8492.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 2160,
    "title": "The Expedition of Humphry Clinker",
    "author": "T. (Tobias) Smollett",
    "authorSort": "T. (Tobias) Smollett",
    "subjects": [
      "Epistolary fiction",
      "Great Britain -- Fiction",
      "Travelers -- Fiction"
    ],
    "topics": [
      "adventure",
      "fiction"
    ],
    "downloads": 43773,
    "cover": "https://www.gutenberg.org/cache/epub/2160/pg2160.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/2160.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/2160.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 6761,
    "title": "The Adventures of Ferdinand Count Fathom — Complete",
    "author": "T. (Tobias) Smollett",
    "authorSort": "T. (Tobias) Smollett",
    "subjects": [
      "Adventure stories",
      "Gothic fiction"
    ],
    "topics": [
      "adventure",
      "fiction"
    ],
    "downloads": 43606,
    "cover": "https://www.gutenberg.org/cache/epub/6761/pg6761.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/6761.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/6761.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 6593,
    "title": "History of Tom Jones, a Foundling",
    "author": "Henry Fielding",
    "authorSort": "Henry Fielding",
    "subjects": [
      "Bildungsromans",
      "England -- Fiction",
      "Foundlings -- Fiction",
      "Humorous stories"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 43175,
    "cover": "https://www.gutenberg.org/cache/epub/6593/pg6593.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/6593.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/6593.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 4085,
    "title": "The Adventures of Roderick Random",
    "author": "T. (Tobias) Smollett",
    "authorSort": "T. (Tobias) Smollett",
    "subjects": [
      "England -- Fiction",
      "Impressment -- Fiction",
      "Picaresque literature",
      "Rogues and vagabonds -- Fiction"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 42492,
    "cover": "https://www.gutenberg.org/cache/epub/4085/pg4085.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/4085.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/4085.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 23,
    "title": "Narrative of the Life of Frederick Douglass, an American Slave",
    "author": "Frederick Douglass",
    "authorSort": "Frederick Douglass",
    "subjects": [
      "Abolitionists -- United States -- Biography",
      "African American abolitionists -- Biography",
      "Douglass, Frederick, 1818-1895",
      "Enslaved persons -- United States -- Biography"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 42092,
    "cover": "https://www.gutenberg.org/cache/epub/23/pg23.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/23.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/23.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 49008,
    "title": "The Works of William Shakespeare [Cambridge Edition] [Vol. 8 of 9]",
    "author": "William Shakespeare",
    "authorSort": "William Shakespeare",
    "subjects": [
      "English drama"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 40595,
    "cover": "https://www.gutenberg.org/cache/epub/49008/pg49008.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/49008.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/49008.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 59828,
    "title": "The String of Pearls; Or, The Barber of Fleet Street. A Domestic Romance.",
    "author": "Thomas Peckett Prest",
    "authorSort": "Thomas Peckett Prest",
    "subjects": [
      "Bakers -- Fiction",
      "Barbers -- Fiction",
      "Cannibalism -- Fiction",
      "Fleet Street (London, England) -- Fiction"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 40572,
    "cover": "https://www.gutenberg.org/cache/epub/59828/pg59828.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/59828.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/59828.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 25344,
    "title": "The Scarlet Letter",
    "author": "Nathaniel Hawthorne",
    "authorSort": "Nathaniel Hawthorne",
    "subjects": [
      "Adultery -- Fiction",
      "Boston (Mass.) -- History -- Colonial period, ca. 1600-1775 -- Fiction",
      "Clergy -- Fiction",
      "Historical fiction"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 40216,
    "cover": "https://www.gutenberg.org/cache/epub/25344/pg25344.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/25344.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/25344.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 3296,
    "title": "The Confessions of St. Augustine",
    "author": "of Hippo Augustine",
    "authorSort": "of Hippo Augustine",
    "subjects": [
      "Augustine, of Hippo, Saint, 354-430",
      "Bishops -- Algeria -- Hippo (Extinct city) -- Biography",
      "Catholic Church -- Bishops -- Biography",
      "Christian saints -- Algeria -- Hippo (Extinct city) -- Biography"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 39021,
    "cover": "https://www.gutenberg.org/cache/epub/3296/pg3296.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/3296.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/3296.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 55,
    "title": "The Wonderful Wizard of Oz",
    "author": "L. Frank (Lyman Frank) Baum",
    "authorSort": "L. Frank (Lyman Frank) Baum",
    "subjects": [
      "Courage -- Juvenile fiction",
      "Cowardly Lion (Fictitious character) -- Juvenile fiction",
      "Cyclones -- Juvenile fiction",
      "Dreams -- Juvenile fiction"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 38574,
    "cover": "https://www.gutenberg.org/cache/epub/55/pg55.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/55.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/55.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 1400,
    "title": "Great Expectations",
    "author": "Charles Dickens",
    "authorSort": "Charles Dickens",
    "subjects": [
      "Benefactors -- Fiction",
      "Bildungsromans",
      "England -- Fiction",
      "Ex-convicts -- Fiction"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 38268,
    "cover": "https://www.gutenberg.org/cache/epub/1400/pg1400.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/1400.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/1400.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 2591,
    "title": "Grimms' Fairy Tales",
    "author": "Jacob Grimm",
    "authorSort": "Jacob Grimm",
    "subjects": [
      "Fairy tales -- Germany"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 37383,
    "cover": "https://www.gutenberg.org/cache/epub/2591/pg2591.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/2591.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/2591.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 1080,
    "title": "A Modest Proposal: For preventing the children of poor people in Ireland, from being a burden on their parents or country, and for making them beneficial to the publick",
    "author": "Jonathan Swift",
    "authorSort": "Jonathan Swift",
    "subjects": [
      "Ireland -- Politics and government -- 18th century -- Humor",
      "Political satire, English",
      "Religious satire, English"
    ],
    "topics": [
      "philosophy"
    ],
    "downloads": 37350,
    "cover": "https://www.gutenberg.org/cache/epub/1080/pg1080.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/1080.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/1080.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 78033,
    "title": "The silent Baltic: or, Detained near Kiel",
    "author": "Marcus Knox",
    "authorSort": "Marcus Knox",
    "subjects": [
      "World War, 1914-1918 -- Personal narratives"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 37335,
    "cover": "https://www.gutenberg.org/cache/epub/78033/pg78033.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/78033.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/78033.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 161,
    "title": "Sense and Sensibility",
    "author": "Jane Austen",
    "authorSort": "Jane Austen",
    "subjects": [
      "Domestic fiction",
      "England -- Fiction",
      "England -- Social life and customs -- 19th century -- Fiction",
      "Gentry -- England -- Fiction"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 37222,
    "cover": "https://www.gutenberg.org/cache/epub/161/pg161.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/161.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/161.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 244,
    "title": "A Study in Scarlet",
    "author": "Arthur Conan Doyle",
    "authorSort": "Arthur Conan Doyle",
    "subjects": [
      "Detective and mystery stories",
      "England -- Fiction",
      "Holmes, Sherlock (Fictitious character) -- Fiction",
      "Private investigators -- England -- Fiction"
    ],
    "topics": [
      "fiction",
      "mystery"
    ],
    "downloads": 37075,
    "cover": "https://www.gutenberg.org/cache/epub/244/pg244.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/244.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/244.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 3207,
    "title": "Leviathan",
    "author": "Thomas Hobbes",
    "authorSort": "Thomas Hobbes",
    "subjects": [
      "Political science -- Early works to 1800",
      "State, The -- Early works to 1800"
    ],
    "topics": [
      "philosophy"
    ],
    "downloads": 36709,
    "cover": "https://www.gutenberg.org/cache/epub/3207/pg3207.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/3207.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/3207.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 76,
    "title": "Adventures of Huckleberry Finn",
    "author": "Mark Twain",
    "authorSort": "Mark Twain",
    "subjects": [
      "Adventure stories",
      "Bildungsromans",
      "Boys -- Fiction",
      "Finn, Huckleberry (Fictitious character) -- Fiction"
    ],
    "topics": [
      "adventure",
      "fiction"
    ],
    "downloads": 36044,
    "cover": "https://www.gutenberg.org/cache/epub/76/pg76.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/76.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/76.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 768,
    "title": "Wuthering Heights",
    "author": "Emily Brontë",
    "authorSort": "Emily Brontë",
    "subjects": [
      "Domestic fiction",
      "Foundlings -- Fiction",
      "Heathcliff (Fictitious character : Brontë) -- Fiction",
      "Love stories"
    ],
    "topics": [
      "fiction",
      "romance"
    ],
    "downloads": 35636,
    "cover": "https://www.gutenberg.org/cache/epub/768/pg768.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/768.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/768.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 78118,
    "title": "Barry Locke, half-back",
    "author": "Ralph Henry Barbour",
    "authorSort": "Ralph Henry Barbour",
    "subjects": [
      "Football players -- Juvenile fiction",
      "Football stories"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 33952,
    "cover": "https://www.gutenberg.org/cache/epub/78118/pg78118.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/78118.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/78118.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 205,
    "title": "Walden, and On The Duty Of Civil Disobedience",
    "author": "Henry David Thoreau",
    "authorSort": "Henry David Thoreau",
    "subjects": [
      "Authors, American -- 19th century -- Biography",
      "Civil disobedience",
      "Government, Resistance to",
      "Natural history -- Massachusetts -- Walden Woods"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 33667,
    "cover": "https://www.gutenberg.org/cache/epub/205/pg205.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/205.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/205.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 4300,
    "title": "Ulysses",
    "author": "James Joyce",
    "authorSort": "James Joyce",
    "subjects": [
      "Alienation (Social psychology) -- Fiction",
      "Artists -- Fiction",
      "City and town life -- Fiction",
      "Domestic fiction"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 33146,
    "cover": "https://www.gutenberg.org/cache/epub/4300/pg4300.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/4300.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/4300.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 2542,
    "title": "A Doll's House : a play",
    "author": "Henrik Ibsen",
    "authorSort": "Henrik Ibsen",
    "subjects": [
      "Man-woman relationships -- Drama",
      "Marriage -- Drama",
      "Norwegian drama -- Translations into English",
      "Wives -- Drama"
    ],
    "topics": [
      "romance"
    ],
    "downloads": 32656,
    "cover": "https://www.gutenberg.org/cache/epub/2542/pg2542.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/2542.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/2542.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 41,
    "title": "The Legend of Sleepy Hollow",
    "author": "Washington Irving",
    "authorSort": "Washington Irving",
    "subjects": [
      "Ghosts -- Fiction",
      "New York (State) -- History -- 1775-1865 -- Fiction"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 31979,
    "cover": "https://www.gutenberg.org/cache/epub/41/pg41.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/41.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/41.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 844,
    "title": "The Importance of Being Earnest: A Trivial Comedy for Serious People",
    "author": "Oscar Wilde",
    "authorSort": "Oscar Wilde",
    "subjects": [
      "Comedy plays",
      "England -- Drama",
      "Foundlings -- Drama",
      "Identity (Psychology) -- Drama"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 31888,
    "cover": "https://www.gutenberg.org/cache/epub/844/pg844.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/844.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/844.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 45,
    "title": "Anne of Green Gables",
    "author": "L. M. (Lucy Maud) Montgomery",
    "authorSort": "L. M. (Lucy Maud) Montgomery",
    "subjects": [
      "Bildungsromans",
      "Canada -- History -- 1867-1914 -- Fiction",
      "Country life -- Prince Edward Island -- Fiction",
      "Friendship -- Fiction"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 31124,
    "cover": "https://www.gutenberg.org/cache/epub/45/pg45.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/45.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/45.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 7370,
    "title": "Second Treatise of Government",
    "author": "John Locke",
    "authorSort": "John Locke",
    "subjects": [
      "Liberty -- Early works to 1800",
      "Political science -- Early works to 1800",
      "Toleration -- Early works to 1800"
    ],
    "topics": [
      "philosophy"
    ],
    "downloads": 30985,
    "cover": "https://www.gutenberg.org/cache/epub/7370/pg7370.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/7370.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/7370.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 2148,
    "title": "The Works of Edgar Allan Poe — Volume 2",
    "author": "Edgar Allan Poe",
    "authorSort": "Edgar Allan Poe",
    "subjects": [
      "American fiction -- 19th century",
      "Fantasy fiction",
      "Horror tales, American",
      "Short stories"
    ],
    "topics": [
      "fiction",
      "science fiction"
    ],
    "downloads": 30902,
    "cover": "https://www.gutenberg.org/cache/epub/2148/pg2148.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/2148.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/2148.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 3268,
    "title": "The Mysteries of Udolpho",
    "author": "Ann Ward Radcliffe",
    "authorSort": "Ann Ward Radcliffe",
    "subjects": [
      "Castles -- Fiction",
      "Gothic fiction",
      "Guardian and ward -- Fiction",
      "Horror tales"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 30860,
    "cover": "https://www.gutenberg.org/cache/epub/3268/pg3268.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/3268.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/3268.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 28054,
    "title": "The Brothers Karamazov",
    "author": "Fyodor Dostoyevsky",
    "authorSort": "Fyodor Dostoyevsky",
    "subjects": [
      "Brothers -- Fiction",
      "Didactic fiction",
      "Fathers and sons -- Fiction",
      "Russia -- Social life and customs -- 1533-1917 -- Fiction"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 30834,
    "cover": "https://www.gutenberg.org/cache/epub/28054/pg28054.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/28054.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/28054.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 69087,
    "title": "The murder of Roger Ackroyd",
    "author": "Agatha Christie",
    "authorSort": "Agatha Christie",
    "subjects": [
      "Belgians -- England -- Fiction",
      "Detective and mystery stories",
      "Murder -- Investigation -- Fiction",
      "Poirot, Hercule (Fictitious character) -- Fiction"
    ],
    "topics": [
      "fiction",
      "mystery"
    ],
    "downloads": 30771,
    "cover": "https://www.gutenberg.org/cache/epub/69087/pg69087.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/69087.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/69087.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 68283,
    "title": "The call of Cthulhu",
    "author": "H. P. (Howard Phillips) Lovecraft",
    "authorSort": "H. P. (Howard Phillips) Lovecraft",
    "subjects": [
      "Cthulhu (Fictitious character) -- Fiction",
      "Horror tales"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 29992,
    "cover": "https://www.gutenberg.org/cache/epub/68283/pg68283.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/68283.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/68283.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 408,
    "title": "The Souls of Black Folk",
    "author": "W. E. B. (William Edward Burghardt) Du Bois",
    "authorSort": "W. E. B. (William Edward Burghardt) Du Bois",
    "subjects": [
      "African Americans"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 29969,
    "cover": "https://www.gutenberg.org/cache/epub/408/pg408.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/408.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/408.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 61262,
    "title": "Poirot Investigates",
    "author": "Agatha Christie",
    "authorSort": "Agatha Christie",
    "subjects": [
      "Belgians -- England -- Fiction",
      "Detective and mystery stories, English",
      "Poirot, Hercule (Fictitious character) -- Fiction",
      "Private investigators -- England -- Fiction"
    ],
    "topics": [
      "fiction",
      "mystery"
    ],
    "downloads": 29928,
    "cover": "https://www.gutenberg.org/cache/epub/61262/pg61262.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/61262.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/61262.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 20203,
    "title": "Autobiography of Benjamin Franklin",
    "author": "Benjamin Franklin",
    "authorSort": "Benjamin Franklin",
    "subjects": [
      "Franklin, Benjamin, 1706-1790",
      "Statesmen -- United States -- Biography"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 29881,
    "cover": "https://www.gutenberg.org/cache/epub/20203/pg20203.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/20203.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/20203.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 58866,
    "title": "The Murder on the Links",
    "author": "Agatha Christie",
    "authorSort": "Agatha Christie",
    "subjects": [
      "Detective and mystery stories",
      "Poirot, Hercule (Fictitious character) -- Fiction",
      "Private investigators -- England -- Fiction"
    ],
    "topics": [
      "fiction",
      "mystery"
    ],
    "downloads": 29614,
    "cover": "https://www.gutenberg.org/cache/epub/58866/pg58866.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/58866.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/58866.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 209,
    "title": "The Turn of the Screw",
    "author": "Henry James",
    "authorSort": "Henry James",
    "subjects": [
      "Children -- Fiction",
      "England -- Fiction",
      "Ghost stories",
      "Governesses -- Fiction"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 29238,
    "cover": "https://www.gutenberg.org/cache/epub/209/pg209.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/209.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/209.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 61168,
    "title": "The Man in the Brown Suit",
    "author": "Agatha Christie",
    "authorSort": "Agatha Christie",
    "subjects": [
      "Detective and mystery stories",
      "London (England) -- Fiction",
      "Murder -- Investigation -- Fiction",
      "South Africa -- Fiction"
    ],
    "topics": [
      "fiction",
      "mystery"
    ],
    "downloads": 29124,
    "cover": "https://www.gutenberg.org/cache/epub/61168/pg61168.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/61168.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/61168.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 46,
    "title": "A Christmas Carol in Prose; Being a Ghost Story of Christmas",
    "author": "Charles Dickens",
    "authorSort": "Charles Dickens",
    "subjects": [
      "Christmas stories",
      "Ghost stories",
      "London (England) -- Fiction",
      "Misers -- Fiction"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 28618,
    "cover": "https://www.gutenberg.org/cache/epub/46/pg46.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/46.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/46.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 1998,
    "title": "Thus Spake Zarathustra: A Book for All and None",
    "author": "Friedrich Wilhelm Nietzsche",
    "authorSort": "Friedrich Wilhelm Nietzsche",
    "subjects": [
      "Philosophy, German",
      "Superman (Philosophical concept)"
    ],
    "topics": [
      "philosophy"
    ],
    "downloads": 28518,
    "cover": "https://www.gutenberg.org/cache/epub/1998/pg1998.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/1998.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/1998.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 57669,
    "title": "The problem of Cell 13",
    "author": "Jacques Futrelle",
    "authorSort": "Jacques Futrelle",
    "subjects": [
      "Boston (Mass.) -- Fiction",
      "College teachers -- Fiction",
      "Detective and mystery stories",
      "Van Dusen, Augustus S. F. X. (Fictitious character) -- Fiction"
    ],
    "topics": [
      "fiction",
      "mystery"
    ],
    "downloads": 28419,
    "cover": "https://www.gutenberg.org/cache/epub/57669/pg57669.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/57669.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/57669.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 2465,
    "title": "Carmen",
    "author": "Prosper Mérimée",
    "authorSort": "Prosper Mérimée",
    "subjects": [
      "Carmen (Fictitious character) -- Fiction",
      "Spain -- Social life and customs -- 19th century -- Fiction"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 27559,
    "cover": "https://www.gutenberg.org/cache/epub/2465/pg2465.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/2465.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/2465.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 58820,
    "title": "Whose Body? A Lord Peter Wimsey Novel",
    "author": "Dorothy L. (Dorothy Leigh) Sayers",
    "authorSort": "Dorothy L. (Dorothy Leigh) Sayers",
    "subjects": [
      "Detective and mystery stories",
      "Murder -- Investigation -- Fiction",
      "Private investigators -- England -- Fiction",
      "Wimsey, Peter, Lord (Fictitious character), 1890- -- Fiction"
    ],
    "topics": [
      "fiction",
      "mystery"
    ],
    "downloads": 27392,
    "cover": "https://www.gutenberg.org/cache/epub/58820/pg58820.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/58820.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/58820.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 4363,
    "title": "Beyond Good and Evil",
    "author": "Friedrich Wilhelm Nietzsche",
    "authorSort": "Friedrich Wilhelm Nietzsche",
    "subjects": [
      "Ethics",
      "Philosophy, German"
    ],
    "topics": [
      "philosophy"
    ],
    "downloads": 26971,
    "cover": "https://www.gutenberg.org/cache/epub/4363/pg4363.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/4363.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/4363.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 1497,
    "title": "The Republic",
    "author": "Plato",
    "authorSort": "Plato",
    "subjects": [
      "Classical literature",
      "Justice -- Early works to 1800",
      "Political science -- Early works to 1800",
      "Utopias -- Early works to 1800"
    ],
    "topics": [
      "philosophy"
    ],
    "downloads": 26842,
    "cover": "https://www.gutenberg.org/cache/epub/1497/pg1497.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/1497.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/1497.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 15399,
    "title": "The Interesting Narrative of the Life of Olaudah Equiano, Or Gustavus Vassa, The African: Written By Himself",
    "author": "Olaudah Equiano",
    "authorSort": "Olaudah Equiano",
    "subjects": [
      "Enslaved persons -- Great Britain -- Biography",
      "Enslaved persons -- United States -- Biography",
      "Equiano, Olaudah, 1745-1797"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 26791,
    "cover": "https://www.gutenberg.org/cache/epub/15399/pg15399.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/15399.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/15399.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 59892,
    "title": "Changeling, and Other Stories",
    "author": "Donn Byrne",
    "authorSort": "Donn Byrne",
    "subjects": [
      "Ireland -- Social life and customs -- Fiction",
      "Short stories, Irish"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 26601,
    "cover": "https://www.gutenberg.org/cache/epub/59892/pg59892.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/59892.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/59892.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 63469,
    "title": "Washington Confidential",
    "author": "Jack Lait",
    "authorSort": "Jack Lait",
    "subjects": [
      "Washington (D.C.) -- Description and travel",
      "Washington (D.C.) -- Social life and customs"
    ],
    "topics": [
      "adventure"
    ],
    "downloads": 26580,
    "cover": "https://www.gutenberg.org/cache/epub/63469/pg63469.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/63469.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/63469.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 1695,
    "title": "The Man Who Was Thursday: A Nightmare",
    "author": "G. K. (Gilbert Keith) Chesterton",
    "authorSort": "G. K. (Gilbert Keith) Chesterton",
    "subjects": [
      "Allegories",
      "Anarchists -- Fiction",
      "Detective and mystery stories",
      "Fantasy fiction"
    ],
    "topics": [
      "fiction",
      "mystery",
      "science fiction"
    ],
    "downloads": 26053,
    "cover": "https://www.gutenberg.org/cache/epub/1695/pg1695.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/1695.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/1695.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 78102,
    "title": "The wheel of earth",
    "author": "Helga Sandburg",
    "authorSort": "Helga Sandburg",
    "subjects": [
      "Farm life -- Fiction",
      "Kentucky -- Fiction",
      "Teenage girls -- Fiction",
      "Young women -- Fiction"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 25951,
    "cover": "https://www.gutenberg.org/cache/epub/78102/pg78102.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/78102.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/78102.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 78084,
    "title": "The mysterious Mr. Quin",
    "author": "Agatha Christie",
    "authorSort": "Agatha Christie",
    "subjects": [
      "Detective and mystery stories, English",
      "Short stories, English"
    ],
    "topics": [
      "fiction",
      "mystery"
    ],
    "downloads": 25718,
    "cover": "https://www.gutenberg.org/cache/epub/78084/pg78084.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/78084.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/78084.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 16,
    "title": "Peter Pan: [Peter and Wendy]",
    "author": "J. M. (James Matthew) Barrie",
    "authorSort": "J. M. (James Matthew) Barrie",
    "subjects": [
      "Fairies -- Fiction",
      "Fantasy literature",
      "Never-Never Land (Imaginary place) -- Fiction",
      "Peter Pan (Fictitious character) -- Fiction"
    ],
    "topics": [
      "fiction",
      "science fiction"
    ],
    "downloads": 25701,
    "cover": "https://www.gutenberg.org/cache/epub/16/pg16.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/16.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/16.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 12342,
    "title": "The Nuttall encyclopædia: being a concise and comprehensive dictionary of general knowledge",
    "author": "P. Austin Nuttall",
    "authorSort": "P. Austin Nuttall",
    "subjects": [
      "Encyclopedias and dictionaries"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 25634,
    "cover": "https://www.gutenberg.org/cache/epub/12342/pg12342.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/12342.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/12342.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 78016,
    "title": "Herman Melville",
    "author": "Lewis Mumford",
    "authorSort": "Lewis Mumford",
    "subjects": [
      "Melville, Herman, 1819-1891",
      "Novelists, American -- 19th century -- Biography"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 25410,
    "cover": "https://www.gutenberg.org/cache/epub/78016/pg78016.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/78016.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/78016.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 204,
    "title": "The innocence of Father Brown",
    "author": "G. K. (Gilbert Keith) Chesterton",
    "authorSort": "G. K. (Gilbert Keith) Chesterton",
    "subjects": [
      "Brown, Father (Fictitious character) -- Fiction",
      "Catholics -- Fiction",
      "Clergy -- Fiction",
      "Detective and mystery stories, English"
    ],
    "topics": [
      "fiction",
      "mystery"
    ],
    "downloads": 25386,
    "cover": "https://www.gutenberg.org/cache/epub/204/pg204.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/204.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/204.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 78009,
    "title": "A guide to the history of physical education",
    "author": "Fred Eugene Leonard",
    "authorSort": "Fred Eugene Leonard",
    "subjects": [
      "Physical education and training",
      "Physical education and training -- History"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 25383,
    "cover": "https://www.gutenberg.org/cache/epub/78009/pg78009.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/78009.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/78009.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 34901,
    "title": "On Liberty",
    "author": "John Stuart Mill",
    "authorSort": "John Stuart Mill",
    "subjects": [
      "Liberty"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 25348,
    "cover": "https://www.gutenberg.org/cache/epub/34901/pg34901.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/34901.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/34901.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 2852,
    "title": "The Hound of the Baskervilles",
    "author": "Arthur Conan Doyle",
    "authorSort": "Arthur Conan Doyle",
    "subjects": [
      "Blessing and cursing -- Fiction",
      "Dartmoor (England) -- Fiction",
      "Detective and mystery stories",
      "Dogs -- Fiction"
    ],
    "topics": [
      "fiction",
      "mystery"
    ],
    "downloads": 25319,
    "cover": "https://www.gutenberg.org/cache/epub/2852/pg2852.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/2852.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/2852.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 78017,
    "title": "The Swiss family Robinson",
    "author": "Johann David Wyss",
    "authorSort": "Johann David Wyss",
    "subjects": [
      "Family life -- Fiction",
      "Islands -- Fiction",
      "Survival -- Fiction"
    ],
    "topics": [
      "adventure",
      "fiction"
    ],
    "downloads": 25237,
    "cover": "https://www.gutenberg.org/cache/epub/78017/pg78017.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/78017.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/78017.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 78065,
    "title": "The anatomy of revolution",
    "author": "Crane Brinton",
    "authorSort": "Crane Brinton",
    "subjects": [
      "Revolutions"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 25201,
    "cover": "https://www.gutenberg.org/cache/epub/78065/pg78065.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/78065.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/78065.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 78122,
    "title": "The history of the Norman conquest of England, its causes and its results, Volume 3 (of 6)",
    "author": "Edward A. (Edward Augustus) Freeman",
    "authorSort": "Edward A. (Edward Augustus) Freeman",
    "subjects": [
      "Great Britain -- History -- Anglo-Saxon period, 449-1066",
      "Great Britain -- History -- Norman period, 1066-1154",
      "Hastings, Battle of, England, 1066",
      "Normans -- England"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 25028,
    "cover": "https://www.gutenberg.org/cache/epub/78122/pg78122.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/78122.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/78122.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 78105,
    "title": "Tales grotesque and curious",
    "author": "Ryūnosuke Akutagawa",
    "authorSort": "Ryūnosuke Akutagawa",
    "subjects": [
      "Japan -- Social life and customs -- Fiction",
      "Short stories, Japanese -- Translations into English"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 25025,
    "cover": "https://www.gutenberg.org/cache/epub/78105/pg78105.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/78105.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/78105.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 78119,
    "title": "Humanism and America: Essays on the outlook of modern civilisation",
    "author": "Unknown author",
    "authorSort": "",
    "subjects": [
      "Humanism",
      "Literature -- Philosophy",
      "Philosophy, Modern",
      "United States -- Civilization -- 20th century"
    ],
    "topics": [
      "philosophy"
    ],
    "downloads": 25003,
    "cover": "https://www.gutenberg.org/cache/epub/78119/pg78119.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/78119.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/78119.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 78025,
    "title": "Main currents in American thought: An interpretation of American literature from the beginnings to 1920",
    "author": "Vernon Louis Parrington",
    "authorSort": "Vernon Louis Parrington",
    "subjects": [
      "American literature -- History and criticism",
      "Philosophy, American",
      "United States -- Civilization",
      "United States -- Intellectual life"
    ],
    "topics": [
      "philosophy"
    ],
    "downloads": 25000,
    "cover": "https://www.gutenberg.org/cache/epub/78025/pg78025.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/78025.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/78025.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 863,
    "title": "The Mysterious Affair at Styles",
    "author": "Agatha Christie",
    "authorSort": "Agatha Christie",
    "subjects": [
      "Belgians -- England -- Fiction",
      "Detective and mystery stories",
      "Poirot, Hercule (Fictitious character) -- Fiction",
      "Private investigators -- England -- Fiction"
    ],
    "topics": [
      "fiction",
      "mystery"
    ],
    "downloads": 24963,
    "cover": "https://www.gutenberg.org/cache/epub/863/pg863.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/863.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/863.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 78022,
    "title": "Præraphaelite diaries and letters",
    "author": "Dante Gabriel Rossetti",
    "authorSort": "Dante Gabriel Rossetti",
    "subjects": [
      "Brown, Ford Madox, 1821-1893",
      "Pre-Raphaelites -- Great Britain -- Correspondence",
      "Pre-Raphaelites -- Great Britain -- Diaries",
      "Pre-Raphaelitism -- Great Britain"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 24920,
    "cover": "https://www.gutenberg.org/cache/epub/78022/pg78022.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/78022.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/78022.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 78013,
    "title": "Arrian on coursing: the Cynegeticus of the younger Xenophon, translated from the Greek, with classical and practical annotations, and a brief sketch of the life and writings of the author. To which is added an appendix, containing some account of the Canes Venatici of classical antiquity",
    "author": "Arrian",
    "authorSort": "Arrian",
    "subjects": [
      "Coursing",
      "Hunting"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 24899,
    "cover": "https://www.gutenberg.org/cache/epub/78013/pg78013.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/78013.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/78013.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 78124,
    "title": "1066 and all that: A memorable history of England, comprising all the parts you can remember, including 103 good things, 5 bad kings and 2 genuine dates",
    "author": "Walter Carruthers Sellar",
    "authorSort": "Walter Carruthers Sellar",
    "subjects": [
      "English wit and humor -- 20th century",
      "Great Britain -- History -- Humor"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 24874,
    "cover": "https://www.gutenberg.org/cache/epub/78124/pg78124.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/78124.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/78124.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 78120,
    "title": "The marvellous land of Snergs",
    "author": "E. A. (Edward Augustine) Wyke-Smith",
    "authorSort": "E. A. (Edward Augustine) Wyke-Smith",
    "subjects": [
      "Fantasy fiction",
      "Imaginary places -- Juvenile fiction"
    ],
    "topics": [
      "fiction",
      "science fiction"
    ],
    "downloads": 24859,
    "cover": "https://www.gutenberg.org/cache/epub/78120/pg78120.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/78120.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/78120.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 78047,
    "title": "The dogaressas of Venice (the wives of the doges)",
    "author": "Edgcumbe Staley",
    "authorSort": "Edgcumbe Staley",
    "subjects": [
      "Venice (Italy) -- Dogaressas",
      "Venice (Italy) -- Social life and customs"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 24851,
    "cover": "https://www.gutenberg.org/cache/epub/78047/pg78047.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/78047.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/78047.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 78029,
    "title": "The dangerous game",
    "author": "William Le Queux",
    "authorSort": "William Le Queux",
    "subjects": [
      "Detective and mystery stories",
      "English fiction -- 19th century",
      "Spy stories"
    ],
    "topics": [
      "fiction",
      "mystery"
    ],
    "downloads": 24835,
    "cover": "https://www.gutenberg.org/cache/epub/78029/pg78029.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/78029.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/78029.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 78011,
    "title": "Three sevens: A detective story",
    "author": "Perley Poore Sheehan",
    "authorSort": "Perley Poore Sheehan",
    "subjects": [
      "Detective and mystery stories",
      "Escaped prisoners -- Fiction",
      "Escapes -- Fiction",
      "Thrillers (Fiction)"
    ],
    "topics": [
      "fiction",
      "mystery"
    ],
    "downloads": 24815,
    "cover": "https://www.gutenberg.org/cache/epub/78011/pg78011.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/78011.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/78011.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 78039,
    "title": "Boston: a novel",
    "author": "Upton Sinclair",
    "authorSort": "Upton Sinclair",
    "subjects": [
      "Historical fiction",
      "Legal stories",
      "Sacco, Nicola, 1891-1927 -- Fiction",
      "Sacco-Vanzetti Trial, Dedham, Mass., 1921 -- Fiction"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 24810,
    "cover": "https://www.gutenberg.org/cache/epub/78039/pg78039.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/78039.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/78039.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 78053,
    "title": "Field Artillery Training. 1914",
    "author": "Great Britain. War Office",
    "authorSort": "Great Britain. War Office",
    "subjects": [
      "Great Britain. Army. Royal Field Artillery"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 24808,
    "cover": "https://www.gutenberg.org/cache/epub/78053/pg78053.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/78053.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/78053.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 10,
    "title": "The King James Version of the Bible",
    "author": "Unknown author",
    "authorSort": "",
    "subjects": [
      "Bible"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 24756,
    "cover": "https://www.gutenberg.org/cache/epub/10/pg10.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/10.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/10.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 78020,
    "title": "The cruise of the Nona: The story of a cruise from Holyhead to the Wash, with reflections and judgments on life and letters, men and manners",
    "author": "Hilaire Belloc",
    "authorSort": "Hilaire Belloc",
    "subjects": [
      "England -- Description and travel",
      "Nona (Cutter)"
    ],
    "topics": [
      "adventure"
    ],
    "downloads": 24750,
    "cover": "https://www.gutenberg.org/cache/epub/78020/pg78020.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/78020.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/78020.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 78077,
    "title": "Cartels: challenge to a free world",
    "author": "Wendell Berge",
    "authorSort": "Wendell Berge",
    "subjects": [
      "Monopolies",
      "Restraint of trade",
      "Trusts, Industrial"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 24745,
    "cover": "https://www.gutenberg.org/cache/epub/78077/pg78077.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/78077.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/78077.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 78044,
    "title": "Claribel: or, Rest at last",
    "author": "Lucy Ellen Guernsey",
    "authorSort": "Lucy Ellen Guernsey",
    "subjects": [
      "Christian life -- Juvenile fiction",
      "Conduct of life -- Juvenile fiction",
      "People with disabilities -- Juvenile fiction",
      "Schools -- Juvenile fiction"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 24739,
    "cover": "https://www.gutenberg.org/cache/epub/78044/pg78044.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/78044.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/78044.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 78090,
    "title": "Blackwood's Edinburgh magazine, volume 456, no. 10, October 1853",
    "author": "Various",
    "authorSort": "Various",
    "subjects": [
      "England -- Periodicals",
      "Scotland -- Periodicals"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 24724,
    "cover": "https://www.gutenberg.org/cache/epub/78090/pg78090.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/78090.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/78090.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 78092,
    "title": "Records of Captain Clapperton's last expedition to Africa, Vol. 2 (of 2)",
    "author": "Richard Lander",
    "authorSort": "Richard Lander",
    "subjects": [
      "Clapperton, Hugh, 1788-1827",
      "Sudan (Region) -- Description and travel"
    ],
    "topics": [
      "adventure"
    ],
    "downloads": 24674,
    "cover": "https://www.gutenberg.org/cache/epub/78092/pg78092.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/78092.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/78092.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 78087,
    "title": "The black pearl",
    "author": "Marie Lion",
    "authorSort": "Marie Lion",
    "subjects": [
      "French -- Australia -- Fiction",
      "Man-woman relationships -- Fiction",
      "Theosophy -- Fiction",
      "Young women -- Fiction"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 24659,
    "cover": "https://www.gutenberg.org/cache/epub/78087/pg78087.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/78087.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/78087.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 78078,
    "title": "The adventures of an ensign",
    "author": "Valentine Williams",
    "authorSort": "Valentine Williams",
    "subjects": [
      "Somme, 1st Battle of the, France, 1916",
      "World War, 1914-1918 -- Personal narratives, British"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 24633,
    "cover": "https://www.gutenberg.org/cache/epub/78078/pg78078.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/78078.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/78078.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 78046,
    "title": "Joan and Co.",
    "author": "Frederick Orin Bartlett",
    "authorSort": "Frederick Orin Bartlett",
    "subjects": [
      "Business enterprises -- Fiction",
      "Children of the rich -- Fiction",
      "Inventors -- Fiction",
      "Man-woman relationships -- Fiction"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 24630,
    "cover": "https://www.gutenberg.org/cache/epub/78046/pg78046.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/78046.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/78046.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 78107,
    "title": "Body-build and its inheritance",
    "author": "Charles Benedict Davenport",
    "authorSort": "Charles Benedict Davenport",
    "subjects": [
      "Heredity",
      "Human anatomy"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 24615,
    "cover": "https://www.gutenberg.org/cache/epub/78107/pg78107.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/78107.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/78107.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 78028,
    "title": "The loot of the Lazy A",
    "author": "W. C. (Wilbur C.) Tuttle",
    "authorSort": "W. C. (Wilbur C.) Tuttle",
    "subjects": [
      "Ranches -- Fiction",
      "Vendetta -- Fiction",
      "Western stories"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 24606,
    "cover": "https://www.gutenberg.org/cache/epub/78028/pg78028.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/78028.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/78028.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 78040,
    "title": "Kate Mulhall: A romance of the Oregon Trail",
    "author": "Ezra Meeker",
    "authorSort": "Ezra Meeker",
    "subjects": [
      "Oregon National Historic Trail -- Fiction",
      "Western stories",
      "Women pioneers -- Fiction"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 24597,
    "cover": "https://www.gutenberg.org/cache/epub/78040/pg78040.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/78040.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/78040.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 78104,
    "title": "An historical account of all the voyages round the world, performed by English navigators, vol. 4 of 4: Including those lately undertaken by order of His present Majesty. The whole faithfully extracted from the journals of the voyagers",
    "author": "Unknown author",
    "authorSort": "",
    "subjects": [
      "Voyages around the world -- Early works to 1800"
    ],
    "topics": [
      "adventure"
    ],
    "downloads": 24587,
    "cover": "https://www.gutenberg.org/cache/epub/78104/pg78104.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/78104.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/78104.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 78075,
    "title": "The eclipse of Russia",
    "author": "Emile Joseph Dillon",
    "authorSort": "Emile Joseph Dillon",
    "subjects": [
      "Russia -- Politics and government -- 1894-1917",
      "Soviet Union -- Foreign relations"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 24586,
    "cover": "https://www.gutenberg.org/cache/epub/78075/pg78075.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/78075.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/78075.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 78005,
    "title": "The Green Dolphin",
    "author": "Sara Ware Bassett",
    "authorSort": "Sara Ware Bassett",
    "subjects": [
      "Family-owned business enterprises -- Fiction",
      "Husband and wife -- Fiction",
      "Man-woman relationships -- Fiction",
      "Manners and customs -- Fiction"
    ],
    "topics": [
      "fiction",
      "romance"
    ],
    "downloads": 24555,
    "cover": "https://www.gutenberg.org/cache/epub/78005/pg78005.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/78005.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/78005.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 78117,
    "title": "Democracy—false or true?: A prologue and a dream",
    "author": "W. B. (William Blake) Richmond",
    "authorSort": "W. B. (William Blake) Richmond",
    "subjects": [
      "Great Britain -- Social conditions",
      "Labor -- Great Britain"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 24551,
    "cover": "https://www.gutenberg.org/cache/epub/78117/pg78117.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/78117.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/78117.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 78095,
    "title": "Great rivers of the world: as seen and described by famous writers",
    "author": "Unknown author",
    "authorSort": "",
    "subjects": [
      "Rivers"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 24536,
    "cover": "https://www.gutenberg.org/cache/epub/78095/pg78095.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/78095.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/78095.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 78126,
    "title": "The weird of the wanderer: Being the papyrus records of some incidents in one of the previous lives of Mr. Nicholas Crabbe",
    "author": "Frederick Rolfe",
    "authorSort": "Frederick Rolfe",
    "subjects": [
      "Fantasy fiction",
      "Time travel -- Fiction"
    ],
    "topics": [
      "adventure",
      "fiction",
      "science fiction"
    ],
    "downloads": 24530,
    "cover": "https://www.gutenberg.org/cache/epub/78126/pg78126.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/78126.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/78126.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 78083,
    "title": "Fawn in the wood",
    "author": "Unknown",
    "authorSort": "Unknown",
    "subjects": [
      "Fairy tales"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 24519,
    "cover": "https://www.gutenberg.org/cache/epub/78083/pg78083.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/78083.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/78083.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 78111,
    "title": "How they loved him, Vol. 2 (of 3): A novel",
    "author": "Florence Marryat",
    "authorSort": "Florence Marryat",
    "subjects": [
      "English fiction -- 19th century"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 24519,
    "cover": "https://www.gutenberg.org/cache/epub/78111/pg78111.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/78111.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/78111.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 78004,
    "title": "An historical account of all the voyages round the world, performed by English navigators, vol. 2 of 4: Including those lately undertaken by order of His present Majesty. The whole faithfully extracted from the journals of the voyagers",
    "author": "Unknown author",
    "authorSort": "",
    "subjects": [
      "Voyages around the world -- Early works to 1800"
    ],
    "topics": [
      "adventure"
    ],
    "downloads": 24517,
    "cover": "https://www.gutenberg.org/cache/epub/78004/pg78004.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/78004.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/78004.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 78019,
    "title": "An historical account of all the voyages round the world, performed by English navigators, vol. 3 of 4: Including those lately undertaken by order of His present Majesty. The whole faithfully extracted from the journals of the voyagers",
    "author": "Unknown author",
    "authorSort": "",
    "subjects": [
      "Voyages around the world -- Early works to 1800"
    ],
    "topics": [
      "adventure"
    ],
    "downloads": 24510,
    "cover": "https://www.gutenberg.org/cache/epub/78019/pg78019.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/78019.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/78019.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 78103,
    "title": "The trouble at Pinelands: A detective story",
    "author": "Ernest M. Poate",
    "authorSort": "Ernest M. Poate",
    "subjects": [
      "Detective and mystery stories",
      "Distilling, Illicit -- Fiction",
      "Murder -- Investigation -- Fiction",
      "North Carolina -- Fiction"
    ],
    "topics": [
      "fiction",
      "mystery"
    ],
    "downloads": 24507,
    "cover": "https://www.gutenberg.org/cache/epub/78103/pg78103.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/78103.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/78103.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 78106,
    "title": "Things near & far",
    "author": "Arthur Machen",
    "authorSort": "Arthur Machen",
    "subjects": [
      "Authors, English -- 20th century -- Biography",
      "Authors, Welsh -- 20th century -- Biography",
      "Autobiography",
      "Fantasy fiction -- Authorship"
    ],
    "topics": [
      "fiction",
      "science fiction"
    ],
    "downloads": 24505,
    "cover": "https://www.gutenberg.org/cache/epub/78106/pg78106.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/78106.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/78106.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 78032,
    "title": "Twelve years in the army: or, The incidents of a soldier's life",
    "author": "John G. Gollan",
    "authorSort": "John G. Gollan",
    "subjects": [
      "Great Britain. Army. Queen's Own Cameron Highlanders"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 24501,
    "cover": "https://www.gutenberg.org/cache/epub/78032/pg78032.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/78032.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/78032.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 78012,
    "title": "Success",
    "author": "Una L. Silberrad",
    "authorSort": "Una L. Silberrad",
    "subjects": [
      "Engineers -- Fiction",
      "England -- Social life and customs -- 20th century -- Fiction",
      "Inventors -- Fiction"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 24493,
    "cover": "https://www.gutenberg.org/cache/epub/78012/pg78012.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/78012.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/78012.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 78112,
    "title": "Astronomy for beginners",
    "author": "Hereward Carrington",
    "authorSort": "Hereward Carrington",
    "subjects": [
      "Astronomy"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 24489,
    "cover": "https://www.gutenberg.org/cache/epub/78112/pg78112.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/78112.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/78112.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 78015,
    "title": "Khartoum, and the Blue and White Niles, Vol. 2 (of 2)",
    "author": "George Melly",
    "authorSort": "George Melly",
    "subjects": [
      "Egypt -- Description and travel",
      "Nile River",
      "Sudan -- Description and travel"
    ],
    "topics": [
      "adventure"
    ],
    "downloads": 24480,
    "cover": "https://www.gutenberg.org/cache/epub/78015/pg78015.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/78015.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/78015.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 78094,
    "title": "The haunting hand",
    "author": "Walter Adolphe Roberts",
    "authorSort": "Walter Adolphe Roberts",
    "subjects": [
      "Astoria (New York, N.Y.) -- Fiction",
      "Detective and mystery stories",
      "Man-woman relationships -- Fiction",
      "Motion picture industry -- Fiction"
    ],
    "topics": [
      "fiction",
      "mystery"
    ],
    "downloads": 24472,
    "cover": "https://www.gutenberg.org/cache/epub/78094/pg78094.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/78094.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/78094.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 78024,
    "title": "The woman of Andros",
    "author": "Thornton Wilder",
    "authorSort": "Thornton Wilder",
    "subjects": [
      "Courtesans -- Fiction",
      "Greece -- Social life and customs -- Fiction",
      "Historical fiction",
      "Man-woman relationships -- Fiction"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 24470,
    "cover": "https://www.gutenberg.org/cache/epub/78024/pg78024.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/78024.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/78024.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 78010,
    "title": "The unknown seven: A detective story",
    "author": "Herman Landon",
    "authorSort": "Herman Landon",
    "subjects": [
      "Detective and mystery stories",
      "New York (N.Y.) -- Fiction",
      "Private investigators -- Fiction",
      "Secret societies -- Fiction"
    ],
    "topics": [
      "fiction",
      "mystery"
    ],
    "downloads": 24458,
    "cover": "https://www.gutenberg.org/cache/epub/78010/pg78010.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/78010.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/78010.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 78060,
    "title": "A young man's story",
    "author": "Sarah Doudney",
    "authorSort": "Sarah Doudney",
    "subjects": [
      "Betrothal -- Juvenile fiction",
      "England -- Juvenile fiction",
      "Man-woman relationships -- Fiction",
      "Short stories"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 24452,
    "cover": "https://www.gutenberg.org/cache/epub/78060/pg78060.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/78060.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/78060.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 78043,
    "title": "Bushy: a romance founded on fact",
    "author": "Cynthia May Westover Alden",
    "authorSort": "Cynthia May Westover Alden",
    "subjects": [
      "Fathers and daughters -- Fiction",
      "Frontier and pioneer life -- Rocky Mountains -- Fiction",
      "Girls -- Fiction",
      "Historical fiction"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 24426,
    "cover": "https://www.gutenberg.org/cache/epub/78043/pg78043.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/78043.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/78043.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 78121,
    "title": "The servant's behaviour book: or, Hints on manners and dress for maid servants in small households",
    "author": "Emily A. (Emily Augusta) Patmore",
    "authorSort": "Emily A. (Emily Augusta) Patmore",
    "subjects": [
      "Women household employees -- England -- Handbooks, manuals, etc."
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 24421,
    "cover": "https://www.gutenberg.org/cache/epub/78121/pg78121.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/78121.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/78121.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 78114,
    "title": "Miniatures of French history",
    "author": "Hilaire Belloc",
    "authorSort": "Hilaire Belloc",
    "subjects": [
      "France -- History"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 24420,
    "cover": "https://www.gutenberg.org/cache/epub/78114/pg78114.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/78114.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/78114.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 78076,
    "title": "Robert Frost: A study in sensibility and good sense",
    "author": "Gorham Bert Munson",
    "authorSort": "Gorham Bert Munson",
    "subjects": [
      "Frost, Robert, 1874-1963",
      "Poets, American -- 20th century -- Biography"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 24414,
    "cover": "https://www.gutenberg.org/cache/epub/78076/pg78076.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/78076.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/78076.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 78048,
    "title": "Sandhills sketches",
    "author": "Williams Haynes",
    "authorSort": "Williams Haynes",
    "subjects": [
      "North Carolina -- Description and travel"
    ],
    "topics": [
      "adventure"
    ],
    "downloads": 24412,
    "cover": "https://www.gutenberg.org/cache/epub/78048/pg78048.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/78048.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/78048.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 78091,
    "title": "Records of Captain Clapperton's last expedition to Africa, Vol. 1 (of 2)",
    "author": "Richard Lander",
    "authorSort": "Richard Lander",
    "subjects": [
      "Clapperton, Hugh, 1788-1827",
      "Sudan (Region) -- Description and travel"
    ],
    "topics": [
      "adventure"
    ],
    "downloads": 24402,
    "cover": "https://www.gutenberg.org/cache/epub/78091/pg78091.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/78091.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/78091.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 78109,
    "title": "Grateful Peter's new year's gift",
    "author": "Ruth Lamb",
    "authorSort": "Ruth Lamb",
    "subjects": [
      "Almshouses -- Juvenile fiction",
      "Charity -- Juvenile fiction",
      "Christian life -- Juvenile fiction",
      "Kindness -- Juvenile fiction"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 24399,
    "cover": "https://www.gutenberg.org/cache/epub/78109/pg78109.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/78109.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/78109.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 78031,
    "title": "How they loved him, Vol. 1 (of 3): A novel",
    "author": "Florence Marryat",
    "authorSort": "Florence Marryat",
    "subjects": [
      "English fiction -- 19th century"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 24398,
    "cover": "https://www.gutenberg.org/cache/epub/78031/pg78031.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/78031.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/78031.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 78082,
    "title": "The yellow book, an illustrated quarterly. Vol. 3, October, 1894",
    "author": "Unknown author",
    "authorSort": "",
    "subjects": [
      "English literature -- 19th century -- Periodicals",
      "Great Britain -- Periodicals",
      "Literature, Modern -- 19th century -- Periodicals"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 24397,
    "cover": "https://www.gutenberg.org/cache/epub/78082/pg78082.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/78082.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/78082.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 108,
    "title": "The Return of Sherlock Holmes",
    "author": "Arthur Conan Doyle",
    "authorSort": "Arthur Conan Doyle",
    "subjects": [
      "Detective and mystery stories, English",
      "Holmes, Sherlock (Fictitious character) -- Fiction",
      "Private investigators -- England -- Fiction"
    ],
    "topics": [
      "fiction",
      "mystery"
    ],
    "downloads": 24396,
    "cover": "https://www.gutenberg.org/cache/epub/108/pg108.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/108.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/108.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 78085,
    "title": "The Catholic Church and history",
    "author": "Hilaire Belloc",
    "authorSort": "Hilaire Belloc",
    "subjects": [
      "Catholic Church -- Controversial literature",
      "Catholic Church -- Doctrines",
      "Catholic Church -- History"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 24395,
    "cover": "https://www.gutenberg.org/cache/epub/78085/pg78085.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/78085.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/78085.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 78067,
    "title": "Joe Strong and his wings of steel: or, A young acrobat in the clouds",
    "author": "Vance Barnum",
    "authorSort": "Vance Barnum",
    "subjects": [
      "Circus performers -- Juvenile fiction",
      "Flying-machines -- Juvenile fiction"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 24373,
    "cover": "https://www.gutenberg.org/cache/epub/78067/pg78067.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/78067.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/78067.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  },
  {
    "id": 78108,
    "title": "The bitter tea of General Yen",
    "author": "Grace Zaring Stone",
    "authorSort": "Grace Zaring Stone",
    "subjects": [
      "China -- History -- 20th century -- Fiction",
      "Missionaries, Medical -- Fiction"
    ],
    "topics": [
      "fiction"
    ],
    "downloads": 24372,
    "cover": "https://www.gutenberg.org/cache/epub/78108/pg78108.cover.medium.jpg",
    "htmlUrl": "https://www.gutenberg.org/ebooks/78108.html.images",
    "textUrl": "https://www.gutenberg.org/ebooks/78108.txt.utf-8",
    "source": "catalog",
    "languages": [
      "en"
    ],
    "year": null
  }
];

const STANDARD_EBOOKS = [
  { title: 'Persuasion', author: 'Jane Austen', year: 1817, seSlug: 'jane-austen/persuasion', subjects: ['Romance', 'England'], topics: ['romance', 'fiction'] },
  { title: 'Northanger Abbey', author: 'Jane Austen', year: 1817, seSlug: 'jane-austen/northanger-abbey', subjects: ['Romance', 'Gothic fiction'], topics: ['romance', 'fiction'] },
  { title: 'Mansfield Park', author: 'Jane Austen', year: 1814, seSlug: 'jane-austen/mansfield-park', subjects: ['Romance', 'Family'], topics: ['romance', 'fiction'] },
  { title: 'Wuthering Heights', author: 'Emily Brontë', year: 1847, seSlug: 'emily-bronte/wuthering-heights', subjects: ['Romance', 'Yorkshire'], topics: ['romance', 'fiction'] },
  { title: 'The Hound of the Baskervilles', author: 'Arthur Conan Doyle', year: 1902, seSlug: 'arthur-conan-doyle/the-hound-of-the-baskervilles', subjects: ['Detectives', 'Mystery'], topics: ['mystery', 'fiction'] },
  { title: 'Around the World in Eighty Days', author: 'Jules Verne', year: 1872, seSlug: 'jules-verne/around-the-world-in-eighty-days/george-makepeace-towle', subjects: ['Voyages', 'Adventure'], topics: ['adventure', 'fiction'] },
  { title: 'Meditations', author: 'Marcus Aurelius', year: 180, seSlug: 'marcus-aurelius/meditations/george-long', subjects: ['Stoicism', 'Philosophy'], topics: ['philosophy'] },
  { title: 'The Art of War', author: 'Sun Tzu', year: 'c. 500 BCE', seSlug: 'sun-tzu/the-art-of-war/lionel-giles', subjects: ['Military art and science', 'Strategy'], topics: ['philosophy'] },
  { title: 'The Odyssey', author: 'Homer', year: 'c. 8th century BCE', seSlug: 'homer/the-odyssey/william-cullen-bryant', subjects: ['Epic poetry', 'Voyages'], topics: ['adventure', 'fiction'] },
].map((book) => ({
  ...book,
  id: `se-${book.seSlug.replace(/\//g, '-')}`,
  authorSort: authorSortName(book.author),
  cover: `https://standardebooks.org/ebooks/${book.seSlug}/downloads/cover.jpg`,
  htmlUrl: `https://standardebooks.org/ebooks/${book.seSlug}`,
  textUrl: `https://standardebooks.org/ebooks/${book.seSlug}/text/single-page`,
  source: 'standardebooks',
  languages: ['en'],
  downloads: 0,
}));

function catalogKey(book) {
  const title = String(book?.title || '')
    .toLowerCase()
    .split(/[;:]/)[0]
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
  return `${title}|${String(book?.author || '').toLowerCase()}`;
}

const LOCAL_CATALOG = (() => {
  const seen = new Set();
  return [...CURATED, ...POPULAR_GUTENBERG, ...STANDARD_EBOOKS].filter((book) => {
    const key = catalogKey(book);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
})();

const STANDARD_EBOOKS_BY_TITLE = new Map(STANDARD_EBOOKS.map((book) => [catalogKey(book), book]));
LOCAL_CATALOG.forEach((book) => {
  const fallback = STANDARD_EBOOKS_BY_TITLE.get(catalogKey(book));
  if (fallback && fallback !== book) book.seFallback = fallback;
});

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

function booksLabel(count) {
  return `${formatNumber(count)} ${Number(count) === 1 ? 'book' : 'books'}`;
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
      popupFontSize: 14,
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
  settings.popupFontSize = clamp(Number(raw.popupFontSize) || base.popupFontSize, 12, 20);
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
    pending: false,
    requestId: 0,
    sort: 'popular',
  },
  searchCache: loadSearchCache(),
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
  root.style.setProperty('--popup-font-size', `${settings.popupFontSize}px`);
  syncPopupFontUI();
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

function syncPopupFontUI() {
  const size = clamp(Number(state.settings.popupFontSize) || 14, 12, 20);
  setText('#popup-font-size-label', `${size}px`);
  const down = $('#popup-font-down');
  const up = $('#popup-font-up');
  if (down) down.disabled = size <= 12;
  if (up) up.disabled = size >= 20;
}

function adjustPopupFontSize(delta) {
  const current = clamp(Number(state.settings.popupFontSize) || 14, 12, 20);
  const next = clamp(current + delta, 12, 20);
  if (next === current) return;
  setSetting('popupFontSize', next);
  if (ui.popup) {
    requestAnimationFrame(() => positionPopup(ui.popup.x, ui.popup.y));
  }
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
function inferTopics(subjects = []) {
  const text = subjects.join(' ').toLowerCase();
  const topics = new Set();
  if (/romance|love|marriage|courtship|husband|wife/.test(text)) topics.add('romance');
  if (/adventure|sea|voyage|travel|pirates|survival/.test(text)) topics.add('adventure');
  if (/mystery|detective|crime|murder|holmes/.test(text)) topics.add('mystery');
  if (/philosophy|ethics|metaphysics|political|stoicism|strategy/.test(text)) topics.add('philosophy');
  if (/science fiction|sci-fi|time travel|future|fantasy/.test(text)) topics.add('science fiction');
  if (/fiction|novel|short stories|tales/.test(text)) topics.add('fiction');
  return topics.size ? Array.from(topics) : ['fiction'];
}

function mergeBookLists(...lists) {
  const seen = new Set();
  const merged = [];
  lists.flat().forEach((book) => {
    if (!book || !book.title) return;
    const key = catalogKey(book);
    if (seen.has(key)) return;
    seen.add(key);
    merged.push(book);
  });
  return merged;
}

function searchLocalCatalog(query, topic = 'all') {
  const q = String(query || '').trim().toLowerCase();
  const openedBooks = Object.values(state.library.books || {}).filter((book) => book && book.title);
  const catalog = mergeBookLists(LOCAL_CATALOG, openedBooks);
  return catalog
    .filter((book) => {
      if (topic && topic !== 'all') {
        const topics = book.topics || inferTopics(book.subjects || []);
        const subjectText = (book.subjects || []).join(' ').toLowerCase();
        if (!topics.includes(topic) && !subjectText.includes(topic)) return false;
      }
      if (!q) return true;
      const haystack = `${book.title} ${book.author} ${(book.subjects || []).join(' ')} ${(book.bookshelves || []).join(' ')}`.toLowerCase();
      return q.split(/\s+/).every((part) => haystack.includes(part));
    })
    .sort((a, b) => (Number(b.downloads) || 0) - (Number(a.downloads) || 0) || a.title.localeCompare(b.title));
}

function searchCacheKey(query, topic, sort) {
  return `${String(query || '').trim().toLowerCase()}|${topic || 'all'}|${sort || 'popular'}`;
}

function loadSearchCache() {
  try {
    const raw = localStorage.getItem(APP.searchCacheKey);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    const now = Date.now();
    const fresh = {};
    Object.entries(parsed || {}).forEach(([key, value]) => {
      if (value && now - Number(value.ts) < 7 * DAY) fresh[key] = value;
    });
    return fresh;
  } catch (error) {
    return {};
  }
}

function getCachedSearch(query, topic, sort) {
  const entry = ui.searchCache[searchCacheKey(query, topic, sort)];
  if (!entry) return null;
  if (Date.now() - Number(entry.ts) > 7 * DAY) {
    delete ui.searchCache[searchCacheKey(query, topic, sort)];
    return null;
  }
  return entry;
}

function saveSearchCache(query, topic, sort, payload) {
  const key = searchCacheKey(query, topic, sort);
  ui.searchCache[key] = { ts: Date.now(), ...payload };
  try {
    const entries = Object.entries(ui.searchCache)
      .sort((a, b) => Number(b[1].ts) - Number(a[1].ts))
      .slice(0, 40);
    ui.searchCache = Object.fromEntries(entries);
    localStorage.setItem(APP.searchCacheKey, JSON.stringify(ui.searchCache));
  } catch (error) {
    // Search cache is optional; ignore quota failures.
  }
}

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
  const subjects = Array.isArray(raw.subjects) ? raw.subjects : [];
  return {
    id: raw.id,
    title: cleanBookTitle(raw.title),
    author: formatAuthors(raw.authors),
    authorSort: authorSortName(raw.authors?.[0]?.name || ''),
    subjects,
    topics: inferTopics(subjects),
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

function renderCatalogShelf() {
  const grid = $('#catalog-grid');
  if (!grid) return;
  const local = LOCAL_CATALOG.filter((book) => book.source !== 'curated');
  const standardEbooks = local.filter((book) => book.source === 'standardebooks').slice(0, 4);
  const shelfExclude = /dictionary|encyclopedia|catalogue|catalog|the works of .*volume|volume \d|vol\.|complete works|my life/i;
  const popular = local
    .filter((book) => book.source !== 'standardebooks' && !shelfExclude.test(book.title))
    .sort((a, b) => (Number(b.downloads) || 0) - (Number(a.downloads) || 0));
  const picks = mergeBookLists(standardEbooks, popular).slice(0, 12);
  grid.innerHTML = '';
  picks.forEach((book, index) => grid.appendChild(bookCard(book, index)));
  setText('#catalog-sub', `${formatNumber(local.length)} additional books cached locally from Project Gutenberg and Standard Ebooks. Search checks this shelf first, then asks Gutendex for anything else.`);
  setText('#offline-count', formatNumber(LOCAL_CATALOG.length));
  const section = $('#catalog-section');
  if (section) section.hidden = !picks.length;
}

function bookCard(book, index = 0) {
  const card = document.createElement('button');
  card.type = 'button';
  card.className = 'book-card';
  card.style.setProperty('--i', String(index % 12));
  card.setAttribute('aria-label', `Read ${book.title} by ${book.author}`);
  card.dataset.bookId = String(book.id);
  card.dataset.source = book.source || 'catalog';
  const numericId = Number(book.id);
  const hashId = Number.isFinite(numericId)
    ? numericId
    : Array.from(String(book.id)).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const fallbackClass = ['', 'is-warm', 'is-blue', 'is-gold'][hashId % 4];
  const badge = book.source === 'standardebooks'
    ? 'SE'
    : book.downloads > 0
      ? `↓ ${formatCompact(book.downloads)}`
      : 'Free';
  const subject = (book.subjects && book.subjects[0]) || 'Classic literature';
  const sourceLabel = book.source === 'standardebooks' ? 'Standard Ebooks' : 'Gutenberg';
  card.innerHTML = `
    <span class="book-cover">
      <span class="cover-fallback ${fallbackClass}">
        <span class="cover-fallback-title">${escapeHtml(book.title)}</span>
        <span class="cover-fallback-author">${escapeHtml(book.author)}</span>
      </span>
      <img src="${escapeHtml(book.cover || coverUrl(book.id))}" alt="" loading="lazy" decoding="async">
      <span class="book-badge" title="${escapeHtml(sourceLabel)}">${escapeHtml(badge)}</span>
    </span>
    <span class="book-info">
      <span class="book-title">${escapeHtml(book.title)}</span>
      <span class="book-author">${escapeHtml(book.author)}</span>
      <span class="book-meta-row">
        <span class="book-subject">${escapeHtml(subject)}</span>
        <span class="dot"></span>
        <span>${book.year || sourceLabel}</span>
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
  const localOnly = Boolean(options.localOnly);
  const requestId = ++ui.search.requestId;

  ui.search.query = query;
  ui.search.topic = topic;
  ui.search.page = page;
  ui.search.loading = true;
  ui.search.pending = !localOnly;

  const local = searchLocalCatalog(query, topic);
  const cached = localOnly ? null : getCachedSearch(query, topic, ui.search.sort);
  const cachedResults = cached?.results || [];

  if (!append) {
    const initial = mergeBookLists(local, cachedResults);
    ui.search.results = initial;
    ui.search.next = cached?.next || null;
    ui.search.total = Math.max(Number(cached?.total) || 0, initial.length);
    showResultsView();
    setText('#results-heading', query ? `Results for “${query}”` : `${TOPIC_LABELS[topic] || 'Popular'} classics`);
    setText('#results-eyebrow', query ? 'Project Gutenberg search' : 'Browse the collection');
    if (initial.length) {
      renderSearchResults();
      const initialSource = local.length ? 'Local catalogue' : 'Cached catalogue';
      setText('#grid-status', localOnly
        ? `Local catalogue · ${booksLabel(initial.length)} ready offline`
        : `${initialSource} · ${booksLabel(initial.length)} · checking Gutendex…`);
      setText('#results-sub', `${booksLabel(ui.search.total || initial.length)} · ${local.length ? 'local' : 'cached'} catalogue first`);
    } else {
      renderSkeletons($('#search-grid'), 8);
      setText('#grid-status', localOnly ? 'No local matches.' : 'Searching the full Gutendex catalogue…');
      setText('#results-sub', localOnly ? 'No books in the local catalogue match this search.' : 'Checking the full Gutendex catalogue…');
    }
    const loadMore = $('#load-more');
    if (loadMore) loadMore.hidden = true;
  } else {
    setText('#grid-status', 'Loading more books…');
  }

  if (localOnly) {
    ui.search.results = local;
    ui.search.total = local.length;
    ui.search.next = null;
    renderSearchResults();
    setText('#grid-status', `Local catalogue · ${booksLabel(local.length)} ready offline`);
    setText('#results-sub', `${booksLabel(local.length)} · local catalogue only`);
    ui.search.loading = false;
    ui.search.pending = false;
    return;
  }

  try {
    const url = new URL('https://gutendex.com/books/');
    url.searchParams.set('languages', 'en');
    url.searchParams.set('page', String(page));
    if (query) url.searchParams.set('search', query);
    if (topic && topic !== 'all') url.searchParams.set('topic', topic);
    url.searchParams.set('sort', ui.search.sort === 'popular' ? 'popular' : 'ascending');
    const data = await fetchGutendex(url.toString(), 12000);
    if (requestId !== ui.search.requestId) return;
    let books = (data.results || []).map(normalizeGutendexBook);
    if (ui.search.sort === 'title') books.sort((a, b) => a.title.localeCompare(b.title));
    if (ui.search.sort === 'author') books.sort((a, b) => a.authorSort.localeCompare(b.authorSort));
    if (append) {
      ui.search.results = mergeBookLists(ui.search.results, books);
    } else {
      ui.search.results = mergeBookLists(searchLocalCatalog(query, topic), books);
    }
    ui.search.next = data.next || null;
    ui.search.total = data.next ? Math.max(Number(data.count) || 0, ui.search.results.length) : ui.search.results.length;
    saveSearchCache(query, topic, ui.search.sort, {
      results: books,
      next: data.next || null,
      total: Number(data.count) || 0,
    });
    renderSearchResults();
    setText('#grid-status', `${booksLabel(ui.search.total)} found${ui.search.next ? '' : ' · end of results'}`);
    const sortLabel = ui.search.sort === 'popular' ? 'most popular' : ui.search.sort === 'title' ? 'title A–Z' : 'author A–Z';
    setText('#results-sub', `${booksLabel(ui.search.total)} · local catalogue first · sorted by ${sortLabel}`);
  } catch (error) {
    if (requestId !== ui.search.requestId) return;
    console.error('Search failed:', error);
    const fallback = mergeBookLists(searchLocalCatalog(query, topic), cachedResults);
    ui.search.results = fallback;
    ui.search.total = fallback.length;
    ui.search.next = null;
    if (fallback.length) {
      renderSearchResults();
      setText('#grid-status', `Offline catalogue · ${booksLabel(fallback.length)} cached`);
      setText('#results-sub', `${booksLabel(fallback.length)} · cached locally`);
    } else {
      renderSearchError(query, topic);
      setText('#grid-status', 'Search unavailable. Check your connection.');
    }
  } finally {
    if (requestId === ui.search.requestId) {
      ui.search.loading = false;
      ui.search.pending = false;
    }
  }
}

function renderSearchError(query, topic) {
  const grid = $('#search-grid');
  if (!grid) return;
  grid.innerHTML = `
    <div class="empty-state">
      <strong>Could not reach Gutendex</strong>
      <p>The catalogue may be busy, or this network may block the request. Try again, or browse the local catalogue.</p>
      <button class="btn btn-ghost btn-small" type="button" id="retry-search">Try again</button>
    </div>`;
  $('#retry-search')?.addEventListener('click', () => performSearch(query, { topic, page: 1 }));
}

function showResultsView() {
  const shelf = $('#shelf-section');
  const catalog = $('#catalog-section');
  const results = $('#results-section');
  if (shelf) shelf.hidden = true;
  if (catalog) catalog.hidden = true;
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
  setText('#results-sub', `${booksLabel(ui.search.total)} · sorted by ${sortLabel}`);
}

function clearSearch(options = {}) {
  ui.search.requestId += 1;
  ui.search.loading = false;
  ui.search.pending = false;
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
  const catalog = $('#catalog-section');
  const results = $('#results-section');
  if (shelf) shelf.hidden = false;
  if (catalog) catalog.hidden = false;
  if (results) results.hidden = true;
  if (!options.silent) renderCurated();
}

async function loadMoreResults() {
  if (!ui.search.next || ui.search.loading) return;
  const requestId = ++ui.search.requestId;
  try {
    ui.search.loading = true;
    setText('#grid-status', 'Loading more books…');
    const data = await fetchGutendex(ui.search.next, 12000);
    if (requestId !== ui.search.requestId) return;
    const books = (data.results || []).map(normalizeGutendexBook);
    ui.search.results = mergeBookLists(ui.search.results, books);
    ui.search.next = data.next || null;
    ui.search.total = data.next ? Math.max(Number(data.count) || 0, ui.search.results.length) : ui.search.results.length;
    renderSearchResults();
    setText('#grid-status', `${booksLabel(ui.search.total)} found${ui.search.next ? '' : ' · end of results'}`);
  } catch (error) {
    if (requestId !== ui.search.requestId) return;
    console.error('Load more failed:', error);
    toast('Could not load more books. Try again.', 'error');
  } finally {
    if (requestId === ui.search.requestId) ui.search.loading = false;
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

async function fetchHtml(url, timeout = 22000) {
  const response = await fetchWithTimeout(url, {
    mode: 'cors',
    headers: { Accept: 'application/xhtml+xml, text/html;q=0.9, */*;q=0.8' },
  }, timeout);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.text();
}

function extractStandardEbooksText(html) {
  try {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const main = doc.querySelector('main') || doc.body;
    if (!main) return '';
    const isSkipped = (node) => {
      let parent = node.parentElement;
      while (parent && parent !== main) {
        const id = parent.id || '';
        const type = parent.getAttribute('epub:type')
          || parent.getAttributeNS('http://www.idpf.org/2007/ops', 'type')
          || '';
        const className = String(parent.className || '');
        if (/^(nav|footer|aside)$/i.test(parent.tagName)) return true;
        if (parent.tagName === 'HEADER' && !/^H[1-3]$/.test(node.tagName)) return true;
        if (/toc|colophon|uncopyright|copyright|imprint|titlepage|endnotes|loi|backmatter|frontmatter/i.test(`${id} ${type} ${className}`)) {
          return true;
        }
        parent = parent.parentElement;
      }
      return false;
    };
    const blocks = [];
    main.querySelectorAll('h1, h2, h3, p, li').forEach((node) => {
      if (isSkipped(node)) return;
      const text = (node.textContent || '').replace(/\s+/g, ' ').trim();
      if (!text || !/[A-Za-z0-9]/.test(text)) return;
      if (/^H[123]$/.test(node.tagName)) {
        if (/^[IVXLCDM\d]+$/i.test(text)) blocks.push(`CHAPTER ${text}`);
        else if (text.length <= 140) blocks.push(text);
        return;
      }
      blocks.push(text);
    });
    return blocks.filter((block, index) => block !== blocks[index - 1]).join('\n\n');
  } catch (error) {
    console.warn('Could not parse Standard Ebooks XHTML:', error);
    return '';
  }
}

const TextCacheDB = {
  dbPromise: null,
  open() {
    if (!('indexedDB' in window)) return Promise.reject(new Error('IndexedDB unavailable'));
    if (this.dbPromise) return this.dbPromise;
    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open('gutenbergStudioText', 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('texts')) db.createObjectStore('texts');
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    return this.dbPromise;
  },
  async get(key) {
    try {
      const db = await this.open();
      return await new Promise((resolve, reject) => {
        const tx = db.transaction('texts', 'readonly');
        const request = tx.objectStore('texts').get(key);
        request.onsuccess = () => {
          const record = request.result;
          resolve(record && record.version === TEXT_CACHE_VERSION ? record.text : '');
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      return '';
    }
  },
  async put(key, text) {
    try {
      const db = await this.open();
      await new Promise((resolve, reject) => {
        const tx = db.transaction('texts', 'readwrite');
        tx.objectStore('texts').put({ text, savedAt: Date.now(), version: TEXT_CACHE_VERSION }, key);
        tx.oncomplete = resolve;
        tx.onerror = () => reject(tx.error);
      });
    } catch (error) {
      // Full text caching is an optimization; ignore quota or privacy errors.
    }
  },
  async clear() {
    try {
      const db = await this.open();
      await new Promise((resolve, reject) => {
        const tx = db.transaction('texts', 'readwrite');
        tx.objectStore('texts').clear();
        tx.oncomplete = resolve;
        tx.onerror = () => reject(tx.error);
      });
    } catch (error) {
      // Ignore.
    }
  },
};

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

async function fetchStandardEbooksText(seBook, key, onStatus = () => {}) {
  onStatus('Downloading from Standard Ebooks…');
  const html = await fetchHtml(seBook.textUrl, 25000);
  const extracted = extractStandardEbooksText(html);
  if (!extracted || extracted.length < 500) throw new Error('The Standard Ebooks page had no readable text');
  ui.textCache.set(key, extracted);
  TextCacheDB.put(key, extracted);
  return extracted;
}

async function getBookText(book, onStatus = () => {}) {
  const key = String(book.id);
  if (ui.textCache.has(key)) return ui.textCache.get(key);

  const diskCached = await TextCacheDB.get(key);
  if (diskCached && diskCached.length > 500) {
    ui.textCache.set(key, diskCached);
    return diskCached;
  }

  let lastError = null;

  if (book.source === 'standardebooks' && book.textUrl) {
    try {
      return await fetchStandardEbooksText(book, key, onStatus);
    } catch (error) {
      const wrapped = new Error(`Standard Ebooks text could not be read: ${error.message}`);
      wrapped.book = book;
      throw wrapped;
    }
  }

  // Popular catalogue entries often have a Standard Ebooks edition. Try it
  // before the slower Gutenberg/GITenberg/relay chain.
  if (book.source === 'catalog' && book.seFallback?.textUrl) {
    try {
      return await fetchStandardEbooksText(book.seFallback, key, onStatus);
    } catch (error) {
      lastError = error;
    }
  }

  const attempts = [];
  const addAttempt = (url, label, timeout = 14000) => {
    if (url && !attempts.some((attempt) => attempt.url === url)) attempts.push({ url, label, timeout });
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
    addAttempt(`https://api.allorigins.win/raw?url=${encodeURIComponent(target)}`, 'CORS relay', 8000);
    addAttempt(`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(target)}`, 'CORS relay', 8000);
  });

  for (const attempt of attempts) {
    onStatus(`Trying ${attempt.label}…`);
    try {
      const raw = await fetchText(attempt.url, attempt.timeout || 14000);
      const cleaned = cleanGutenbergText(raw);
      if (!cleaned || cleaned.length < 500) throw new Error('Text was too short after cleaning');
      ui.textCache.set(key, cleaned);
      TextCacheDB.put(key, cleaned);
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
  const list = chapters.slice();
  const isProseBlock = (block) => {
    const text = String(block || '').trim();
    const lines = text.split(/\n/).map((line) => line.trim()).filter(Boolean);
    if (lines.length >= 3) {
      const tocLines = lines.filter((line) => /^(?:[IVXLCDM]+|\d+)[.)]\s+/.test(line) || /^chapter\s+/i.test(line)).length;
      if (tocLines >= 2) return false;
      const average = lines.reduce((sum, line) => sum + line.length, 0) / lines.length;
      if (lines.length >= 5 && average < 60) return false;
    }
    if (text.length > 220) return true;
    return text.split(/\s+/).length > 12 && /[.!?]/.test(text);
  };
  let guard = 0;
  while (list.length && guard < 5) {
    guard += 1;
    const first = list[0];
    const titleLike =
      /^(full text|untitled|front matter)$/i.test(first.title) ||
      /^[A-Z0-9 ,.'’&:\-—]{3,80}$/.test(first.title) ||
      /^by\b/i.test(first.title);
    if (!titleLike) break;
    if (!first.blocks.some(isProseBlock)) {
      list.shift();
      continue;
    }
    let index = 0;
    while (index < first.blocks.length && index < 4) {
      const text = first.blocks[index].trim();
      const isTitleBlock =
        /^by\b/i.test(text) ||
        (/^[A-Z0-9 ,.'’&:\-—\n]{3,200}$/.test(text) && !/[.!?]/.test(text)) ||
        /^(book|volume|part)\b/i.test(text);
      if (!isTitleBlock) break;
      index += 1;
    }
    if (index > 0 && index < first.blocks.length) first.blocks = first.blocks.slice(index);
    break;
  }
  return list.filter((chapter) => chapter.blocks.length);
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
    state.library.activeBookId = normalized.id;
    state.library.books[id] = {
      ...existing,
      ...normalized,
      id: normalized.id,
      lastOpened: Date.now(),
      progress: existing.progress || null,
    };
    state.library.recent = [normalized.id, ...state.library.recent.filter((item) => String(item) !== String(normalized.id))].slice(0, 20);
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
      const savedPercent = Number(progress.scrollPercent ?? progress.percent);
      ui.progressPercent = Number.isFinite(savedPercent) && savedPercent > 0
        ? clamp(savedPercent, 0, 100)
        : clamp(((ui.currentPage + 1) / pages.length) * 100, 0, 100);
    } else {
      ui.currentPage = 0;
      ui.progressPercent = 0;
    }
    if (!state.settings.pageTurn) ui.currentPage = pageAtPercent(ui.progressPercent);

    updateReaderHeader();
    renderChapterSelect();
    showReader({ replaceHash: Boolean(options.replaceHash) });
    renderCurrentView({ initial: true });

    // The first render gives the page body its real dimensions. Re-paginate
    // once against the measured layout before the loading overlay is removed,
    // so the page count never visibly changes on open.
    await new Promise((resolve) => setTimeout(resolve, 60));
    const fittedPages = paginate(chapters, computePageLayout());
    if (fittedPages.length && fittedPages.length !== ui.bookData.pages.length) {
      const percent = ui.progressPercent || ((ui.currentPage + 1) / ui.bookData.pages.length) * 100;
      ui.bookData.pages = fittedPages;
      ui.bookData.rsvpWords = buildRsvpWords(fittedPages);
      ui.progressPercent = percent;
      ui.currentPage = pageAtPercent(percent);
      renderCurrentView({ initial: true });
    }

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
  const key = String(id || '').trim();
  if (!key) {
    showLibrary({ replaceHash: true });
    return;
  }
  const stored = state.library.books[key];
  if (stored) {
    openBook(stored, { silent: true });
    return;
  }
  const local = LOCAL_CATALOG.find((book) => String(book.id) === key);
  if (local) {
    openBook(local, { silent: true });
    return;
  }
  const numericId = Number(key);
  if (!Number.isFinite(numericId) || numericId <= 0) {
    toast('That book is not in the local catalogue. Try searching for it.', 'error');
    showLibrary({ replaceHash: true });
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
  const chapterKicker = /^chapter\b/i.test(page.chapterTitle) || /^[IVXLCDM]+\.?$/i.test(page.chapterTitle)
    ? 'Chapter'
    : /^book\b/i.test(page.chapterTitle)
      ? 'Book'
      : /^part\b/i.test(page.chapterTitle)
        ? 'Part'
        : 'Book';
  const chapterDisplayTitle = page.chapterTitle.replace(/^(chapter|book|part|letter|canto|act|scene)\s+/i, '');
  const chapterHeading =
    page.chapterStart && page.chapterTitle !== 'Full Text'
      ? `<div class="chapter-heading"><span class="chapter-kicker">${escapeHtml(chapterKicker)}</span><h2>${escapeHtml(chapterDisplayTitle)}</h2></div>`
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

    if (direction === 'next') {
      // The new page is already underneath; the current page hinges on the
      // spine and swings left, revealing it.
      sheet.classList.add('is-under');
      viewport.insertBefore(sheet, oldSheet);
      oldSheet.classList.add('is-turning', 'is-turning-next');
    } else {
      // Going back: the current page waits underneath while the previous page
      // swings in from the left, as if lifted back into place.
      oldSheet.classList.add('is-under');
      sheet.classList.add('is-turning', 'is-turning-prev');
      viewport.appendChild(sheet);
    }

    setTimeout(() => {
      if (token !== ui.pageRenderToken) return;
      viewport.querySelectorAll('.page-sheet').forEach((existing) => {
        if (existing !== sheet) existing.remove();
      });
      sheet.classList.remove('is-under', 'is-turning', 'is-turning-next', 'is-turning-prev');
    }, 820);
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
      const chapterKicker = /^chapter\b/i.test(page.chapterTitle) || /^[IVXLCDM]+\.?$/i.test(page.chapterTitle)
        ? 'Chapter'
        : /^book\b/i.test(page.chapterTitle)
          ? 'Book'
          : /^part\b/i.test(page.chapterTitle)
            ? 'Part'
            : 'Book';
      const chapterDisplayTitle = page.chapterTitle.replace(/^(chapter|book|part|letter|canto|act|scene)\s+/i, '');
      const chapterHeading =
        page.chapterStart && page.chapterTitle !== 'Full Text'
          ? `<div class="chapter-heading"><span class="chapter-kicker">${escapeHtml(chapterKicker)}</span><h2>${escapeHtml(chapterDisplayTitle)}</h2></div>`
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
    state.library.activeBookId = ui.currentBook.id;
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
  syncPopupFontUI();
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
  const maxTop = Math.max(12, window.innerHeight - height - 12);
  const minTop = Math.min(84, maxTop);
  let top = y + 14;
  if (top + height > window.innerHeight - 12) top = y - height - 18;
  top = clamp(top, minTop, maxTop);
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
  $('#browse-catalog')?.addEventListener('click', () => performSearch('', { localOnly: true }));
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
    localStorage.removeItem(APP.searchCacheKey);
    ui.dictCache = {};
    ui.searchCache = {};
    ui.textCache.clear();
    TextCacheDB.clear();
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
  $('#popup-font-down')?.addEventListener('click', () => adjustPopupFontSize(-1));
  $('#popup-font-up')?.addEventListener('click', () => adjustPopupFontSize(1));
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
  renderCatalogShelf();
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
