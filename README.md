# Nonogram Daily

A daily nonogram puzzle game built with Nuxt 4 and Tailwind CSS. Every day generates two new puzzles — a 5×5 and a 7×7 — seeded from the date so everyone gets the same puzzle.

## Features

- **Daily puzzles** — deterministic generation from the current date means puzzles reset at midnight and are consistent across devices
- **Two sizes** — 5×5 (quick) and 7×7 (challenging)
- **3-state cells** — cycle through blank, filled, and crossed-out with a single click/tap
- **Check progress** — highlights mismatched rows and columns in red without revealing the solution
- **Timer** — starts on first interaction, stops on solve
- **Share results** — native share sheet on mobile, clipboard copy on desktop
- **No account needed** — progress saved to localStorage, no backend required
- **Dark mode** — follows system preference automatically

## How Nonograms Work

Nonograms are logic puzzles where you fill in a grid based on numeric clues. Each clue describes the lengths of consecutive filled cells in that row or column. For example, a clue of `2 1` means there are two filled cells in a row, a gap, then one filled cell.

## Tech Stack

- [Nuxt 4](https://nuxt.com) — Vue framework (SSR disabled, static)
- [Tailwind CSS](https://tailwindcss.com) — utility-first styling
- [Mulberry32](https://github.com/bryc/code/blob/master/jshash/PRNGs.md#mulberry32) — seeded PRNG for deterministic puzzle generation
- localStorage — puzzle state and timer persistence

## Getting Started

Install dependencies:

```bash
npm install
```

Start the dev server at `http://localhost:3000`:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview production build locally:

```bash
npm run preview
```

## Deployment

The app is configured for [Vercel](https://vercel.com) out of the box (`nitro preset: 'vercel'`, SSR disabled). Connect the repo to a Vercel project and it will deploy automatically on push.

## Project Structure

```
app/
├── pages/
│   └── index.vue              # Main page with tab UI
├── components/
│   ├── NonogramGrid.vue        # Interactive grid with clues
│   ├── PuzzleTimer.vue         # Elapsed time display
│   ├── ShareButton.vue         # Share/copy result
│   └── HowToPlayModal.vue      # Interactive tutorial
├── composables/
│   ├── useNonogramGenerator.ts # Date seed → puzzle clues
│   ├── usePuzzleState.ts       # Grid state + win detection
│   ├── usePuzzleStorage.ts     # localStorage persistence
│   └── useTimer.ts             # Timer logic
└── utils/
    └── seededRandom.ts         # Mulberry32 PRNG
```

## Puzzle Generation

Puzzles are generated deterministically:

1. The current date (`YYYYMMDD`) is used as an integer seed
2. A Mulberry32 PRNG generates a random N×N binary grid
3. Row and column clues are derived from the grid
4. The solution grid is discarded — win detection compares player-derived clues to puzzle clues, which correctly handles puzzles with multiple valid solutions

The 5×5 and 7×7 use the same date seed with an offset so they produce different puzzles.
