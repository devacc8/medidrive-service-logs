# MediDrive — Service Log Manager

Service log management application built with React, Redux Toolkit, and MUI.

## Tech Stack

- **React 19** + TypeScript + Vite
- **Redux Toolkit** + redux-persist for state management and persistence
- **React Hook Form** + Yup for form handling and validation
- **MUI v7** + Emotion for UI components and styling

## Features

### Service Log Form
- Create and manage drafts with auto-save (500ms debounce)
- Yup schema validation on submission
- Start date defaults to today, end date auto-syncs to start date + 1 day
- Visual save status indicator ("Saving..." / "Draft saved")
- All draft data persists across page reloads via redux-persist

### Service Logs Table
- Search across provider ID, service order, car ID, and description
- Filter by date range (start date) and service type
- Color-coded service type badges (planned/unplanned/emergency)
- Edit via dialog, delete with confirmation
- Export filtered logs to JSON

### Draft Management
- Multiple concurrent drafts
- Quick switch between drafts
- Delete individual or clear all drafts
- Relative timestamps ("2m ago", "1h ago")

## Getting Started

```bash
npm install
npm run dev
```

## Project Structure

```
src/
├── app/                     # Store config, theme, root component
├── common/
│   ├── types/               # Shared TypeScript types
│   ├── components/          # Reusable UI (ConfirmDialog, StatusChip)
│   └── utils/               # Date utilities
└── features/
    ├── drafts/              # Redux slice, selectors, DraftManager, DraftIndicator
    ├── serviceLogForm/      # Form component, Yup schema, auto-save & date sync hooks
    └── serviceLogs/         # Redux slice, selectors, table, filters, edit dialog
```

## Architecture Decisions

- **Feature-based structure** — each domain (drafts, form, logs) is self-contained
- **Const objects over enums** — compatible with `erasableSyntaxOnly` TypeScript config
- **`useWatch` for auto-save** — isolates re-renders to the auto-save hook, not the entire form
- **Form reset depends on draft ID, not draft object** — prevents infinite loop between auto-save and form reset
- **ISO string date comparison** — no date library needed for filtering (`YYYY-MM-DD` sorts lexicographically)
- **Chunk splitting** — MUI, Redux, and form libraries in separate vendor chunks

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
