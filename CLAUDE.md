# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start        # Dev server on port 3000
npm run build    # Production build to /build
npm test         # Run tests (jest + @testing-library/react)
npm run deploy   # Build + deploy to GitHub Pages ("deploy" branch)
```

## Architecture

This is a **React 18 resume website** styled as a macOS window/code editor interface. Built with Create React App.

### Core Concepts

- **Window metaphor**: The entire UI mimics a draggable, minimizable, maximizable macOS window. `Layout.js` manages all window state (minimized/maximized/closed) and passes it down via `useOutletContext()`.
- **File-based routing**: Pages are presented as "files" in a code editor. Routes like `/files/about`, `/files/experience` map to pages displayed with syntax highlighting (highlight.js). Uses **HashRouter** for GitHub Pages compatibility.
- **Three-language i18n**: English, Spanish, Catalan via i18next. Translations are inline in `src/i18n.js` (not separate JSON files). ~100+ keys.
- **No external state management**: React context via `useOutletContext()` from Layout, plus local component state.

### Key Files

- `src/Layout.js` — Root layout: window controls, sidebar, tabs, footer. All shared state lives here.
- `src/routes.js` — Route definitions with file icons and tab metadata.
- `src/i18n.js` — All translation strings for en/es/ca.
- `src/pages/Console.js` — Interactive CLI-like console with typed commands (about, skills, contact, help, clear).

### Styling

- **Tailwind CSS** with custom colors in `tailwind.config.js`: `primary` (purple #a772a7), `secondary` (blue #7094db).
- Additional CSS in `src/styles/` for avatar, carousel, code blocks, and Material Symbols icons.
- Responsive breakpoint at `lg` (1024px); mobile detection via `useResponsive` hook.

### Code Style

- ESLint + Prettier (2-space indent, no tabs — see `.prettierrc`).
- Functional components with hooks throughout. No class components.
