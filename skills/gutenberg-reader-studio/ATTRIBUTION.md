# Attribution

## Origin

The reference implementation in `assets/template/` is the released source of **Gutenberg Reader
Studio & Vocabulary Lab**, built on 2026-11-01 and extended with read-aloud narration on
2026-11-02. It was written from scratch in a single agent session using OpenCode 2.2.5 with
DeepSeek V4.1 Flash (`opencode-go/deepseek-v4.1-flash`). The build record is `state.json` /
`STATE.md` in the originating repository.

The original product brief asked for a static, read-only-hostable reading application combining
Gutendex discovery, Gutenberg text fetching and cleaning, customizable typography, 3D page turns,
bionic reading, RSVP, a vocabulary bank with SRS, local persistence, and ambient sound. Read-aloud
narration was added in a follow-up session.

## What is new here

Everything in `assets/template/` is original application code written for this project:

- the three-file static architecture;
- the local-first catalogue and search merge;
- the GITenberg / Standard Ebooks / Gutenberg / relay source chain;
- the text cleaner, chapter heuristics, and measured pagination model;
- the page-turn DOM/CSS contract and scroll-mode conversion;
- bionic rendering and context-aware word capture;
- the Word Bank and fixed-ladder SRS;
- the RSVP and teleprompter timers;
- the sentence-level read-aloud pipeline, voice picker and highlighting;
- the Web Audio ambient engine;
- the state schema, caches and JSON export/import.

No third-party JavaScript library, framework, CSS framework, icon pack or audio file is bundled.
`script.js` and `style.css` are hand-written. The page uses system font stacks plus an optional
Google Fonts stylesheet (Fraunces, Inter) and an optional OpenDyslexic font from a font CDN, loaded
over the network at runtime.

## Data and third-party services

- Book text: Project Gutenberg and GITenberg (public domain in the United States; check local law).
  Standard Ebooks editions are public domain / CC0 per their own pages.
- Metadata and discovery: Gutendex (`gutendex.com`).
- Definitions, phonetics and pronunciation audio: Free Dictionary API (`dictionaryapi.dev`).
- Fonts: Google Fonts (Fraunces, Inter) and Fontsource/jsDelivr (OpenDyslexic).
- Speech: the browser/OS `speechSynthesis` engine. No speech audio is recorded or uploaded.

Project Gutenberg is a registered trademark of the Project Gutenberg Literary Archive Foundation.
This project is independent and is not affiliated with Project Gutenberg, Gutendex, Standard
Ebooks, or the Free Dictionary API.

## Licence status

- The application source in this skill is released under the MIT licence, matching the originating
  repository (`LICENSE`).
- Book text is **not** included and remains subject to the terms of its source.
- The screenshots, social card and other repository images are not part of this skill.
- Attribution is required if you republish the template as a distinct product; keep this file with
  the template.
