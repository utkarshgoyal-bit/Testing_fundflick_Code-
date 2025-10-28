# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `pnpm dev` or `pnpm local` (runs on port 3100)
- **Build for production**: `pnpm build` (TypeScript compilation + Vite build)
- **Lint code**: `pnpm lint` (ESLint with TypeScript support)
- **Preview production build**: `pnpm preview`
- **Commit with linting**: `pnpm commit` (runs lint before commit)

## Project Architecture

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with Radix UI components
- **State Management**: Redux Toolkit + Redux Saga
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod validation
- **Internationalization**: i18next
- **Charts**: Recharts + Chart.js
- **Notifications**: Firebase + Socket.io

### Key Directory Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn/ui components (forms, buttons, etc.)
│   └── shared/         # Application-specific shared components
├── pages/              # Route-specific page components
│   ├── auth/           # Login, forgot password
│   ├── dashboard/      # Main dashboard
│   ├── files/          # Loan file management (steps, photos, credit)
│   ├── collection/     # Collection management and payments
│   ├── employees/      # Employee management
│   └── users/          # User management
├── redux/              # State management
│   ├── slices/         # Redux Toolkit slices
│   ├── saga/           # Redux Saga effects
│   └── store/          # Store configuration
├── routes/             # Routing configuration
├── lib/                # Core utilities
│   ├── interfaces/     # TypeScript interfaces
│   ├── enums/          # Application enums
│   └── contexts/       # React contexts
├── helpers/            # Utility functions
├── translations/       # i18n configuration and translations
└── socket/             # WebSocket handlers
```

### State Management Pattern
- Uses Redux Toolkit with Redux Saga for async operations
- Each feature has its own slice and saga files
- Sagas handle API calls and side effects
- Store is configured with dev tools and logger in development

### Component Architecture
- Uses Shadcn/ui for base components in `components/ui/`
- Custom application components in `components/shared/`
- Page-specific components in respective `pages/` subdirectories
- Form handling with React Hook Form + Zod schemas

### API Integration
- Axios for HTTP requests via `helpers/apiHelper.ts`
- Redux Saga handles async API calls
- Centralized error handling and loading states

### Routing Structure
- Protected routes under `/app/*` path
- Public routes for authentication
- Layout components provide consistent UI structure
- Route-based code splitting with React Suspense

### Styling Conventions
- Tailwind CSS with custom design system variables
- CSS variables for theming support
- Radix UI primitives for accessible components
- Custom color scheme with light/dark mode support

### Important Configuration
- Uses `@` alias for `src/` directory imports
- ESLint configured with strict TypeScript rules
- Prettier integrated with lint-staged for pre-commit formatting
- Vite config optimized for React with path aliases

### Business Domain
This is a Loan Origination System (LOS) frontend that handles:
- Loan application processing and file management
- Collection management and payment tracking
- Employee and user management
- Document processing and verification
- Task management and notifications
- Dashboard analytics and reporting