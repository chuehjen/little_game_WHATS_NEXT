# WHAT'S NEXT

A minimalist color memory game — memorize a color, recreate it with HSL sliders, and test your color instinct across 3 rounds.

## How to Play

Each of the 3 rounds follows two phases:

1. **Memorize** — A random color fills the screen for 3 seconds. Study it.
2. **Tune** — The color disappears. You have 15 seconds to recreate it using Hue, Saturation, and Lightness sliders.

Your score for each round (0.00–10.00) is calculated from the RGB Euclidean distance between the target color and your guess. The closer you get, the higher your score.

## Live Demo

Play it at: https://chuehjen.github.io/little_game_WHATS_NEXT/

## Project Structure

```
├── src/
│   ├── game.ts      # Core game logic + event binding
│   ├── colors.ts    # Color utilities (hslToRgb, calcScore, randomColor)
│   ├── scores.ts    # localStorage score persistence
│   ├── ui.ts        # DOM manipulation, UI helpers
│   └── types.ts     # TypeScript types
├── tests/
│   └── colors.test.ts  # Unit tests for color utilities
├── index.html       # Vite entry point (HTML + CSS)
├── vite.config.ts   # Vite configuration
├── tsconfig.json    # TypeScript config (strict mode)
├── build.mjs        # Bundles to single-file dist/index.html
├── dist/            # Production build (GitHub Pages)
└── package.json
```

## Development

```bash
npm install       # Install dependencies
npm run dev       # Start dev server (Vite + HMR)
npm run build     # Type-check + production build
npm run bundle    # Build single-file dist/index.html for GitHub Pages
npm run test      # Run unit tests
npm run preview   # Preview production build locally
```

## Deploy to GitHub Pages

```bash
npm run bundle    # Builds dist/index.html (single-file, zero dependencies)
# Then push dist/index.html to GitHub Pages branch
```

## Tech Stack

- TypeScript (strict mode) + Vite
- Zero runtime dependencies
- 20 unit tests (vitest)

## Scoring Algorithm

```
RGB distance = sqrt((r1-r2)^2 + (g1-g2)^2 + (b1-b2)^2)
Score = max(0, 10 - distance / 44.167)
```

Max possible distance (~441.67) maps to 0.00. A perfect match scores 10.00.

## License

MIT
