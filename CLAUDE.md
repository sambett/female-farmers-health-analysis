# CLAUDE.md - Guidelines for Agentic Coding Assistants

## Build/Development Commands
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run lint       # Run ESLint
npm run preview    # Preview production build
```

## Code Style Guidelines
- **TypeScript**: Use with React, strict mode off, target ES2020
- **Components**: Use functional components with explicit prop interfaces
- **Naming**: PascalCase for components/interfaces, camelCase for variables/functions
- **Imports**: Group by external/internal, use '@' alias for src directory
- **Types**: Define interfaces in src/types, use optional properties where appropriate
- **Styling**: Use TailwindCSS utility classes following existing patterns
- **Error Handling**: Use try/catch for async operations, validate data before use
- **File Structure**: Components in src/components/, pages in src/pages/, services in src/services/
- **State Management**: Use React hooks (useState, useEffect) following existing patterns

## Tech Stack
React 19, TypeScript, Vite, ESLint, TailwindCSS, MUI, Natural.js, XLSX, Recharts

## Project Purpose
Data visualization dashboard for agricultural health analysis with text analysis and risk prediction tools.