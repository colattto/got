# Technical Context: Gotime Settings Module

## Technology Stack

### Core Framework

- **React 18.3.1** - UI library with concurrent features
- **Vite 5.4.0** - Build tool with HMR and ESM support
- **TypeScript 5.6.3** - Strict type checking enabled

### UI Framework

- **Ant Design 5.22.0** - Complete UI component library
- **@ant-design/icons 5.5.0** - Icon library

### Build & Dev Tools

- **@vitejs/plugin-react-swc 3.7.1** - Fast React refresh with SWC
- **ESLint** - Code linting for TypeScript

## Development Setup

### Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Project Structure

```
src/
├── components/
│   ├── settings/        # Tab components and modals
│   └── shared/          # Reusable components
├── hooks/               # Custom hooks (business logic)
├── services/            # API/data access layer
├── types/               # TypeScript interfaces
├── pages/               # Page orchestrators
└── constants/           # Constants and configs
```

## Technical Constraints

### Mandatory Patterns

1. **No native HTML** - Use Ant Design components exclusively
2. **No hardcoded values** - Use `theme.useToken()` for all styles
3. **Service layer** - All data access via `src/services/`
4. **Hook layer** - Business logic in `src/hooks/`
5. **dayjs** - For all date operations

### TypeScript Rules

- `noImplicitAny: true`
- `strictNullChecks: true`
- Explicit types for all function parameters and returns
- No `any` type usage

## Current Dependencies

All dependencies are currently in production-ready versions. No known security vulnerabilities or deprecation warnings.
