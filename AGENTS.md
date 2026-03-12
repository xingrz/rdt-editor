# RDT Editor

A web-based visual editor for Wikipedia [Route Diagram Template (RDT)](https://en.wikipedia.org/wiki/WP:RDT). It provides a split-view interface with a text editor on the left and a live-rendered route diagram preview on the right.

Deployed at <https://rdt.xingrz.me/>.

## Tech Stack

- **Framework**: Vue 3 with Composition API, TypeScript
- **State Management**: Pinia
- **Code Editor**: Ace Editor (with custom RDT syntax highlighting)
- **UI Components**: Naive UI
- **Build Tool**: Vite
- **Testing**: Vitest
- **Styling**: SCSS

## Project Structure

```
src/
├── ast.ts              # RDT syntax parser (text → AST)
├── components/         # Vue components (editor, map preview, app bar)
├── composables/        # Vue composables for editor bindings
├── editor/             # Ace editor extensions (syntax highlighting)
├── stores/             # Pinia stores (editor state, icon loading)
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## Key Concepts

- **RDT Syntax**: A text-based format used on Wikipedia to describe transit/railway route diagrams. Each line represents a row of the diagram, containing icons and text cells separated by specific delimiters.
- **AST**: The parser transforms raw RDT text into an abstract syntax tree of rows, cells, icons, text elements, and sidebar info. This AST drives the visual preview rendering.
- **BSicon**: Standardized SVG icons hosted on Wikimedia Commons, used to represent stations, lines, and other route elements. The app fetches and caches these icons at runtime.

## Git Conventions

- Commit messages should be concise, in English, starting with a verb in imperative mood (e.g. `Add`, `Fix`, `Refactor`, `Remove`).
- When implementing a feature or fix, commit at reasonable granularity — each commit should represent a single logical change. Do not squash everything into one commit, but also avoid committing every trivial edit separately.
- Every AI-authored or AI-assisted commit must include a `Co-Authored-By` trailer with the model name used, for example:
  ```
  Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
  ```

## Development

```sh
npm install
npm run dev     # Start dev server at localhost:8080
npm run build   # Production build
npm run lint    # Run ESLint
npm run test    # Run tests with Vitest
```
