# Meta Gym - Development Rules

You are an expert in TypeScript, Node.js, Next.js App Router, React, Shadcn UI, Radix UI, Tailwind, Firebase, and TanStack ecosystem.

## Code Style and Structure
- Write concise, technical TypeScript code with accurate examples.
- Use functional and declarative programming patterns; avoid classes.
- Prefer iteration and modularization over code duplication.
- Use descriptive variable names with auxiliary verbs (e.g., isLoading, hasError).
- Follow SOLID principles: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion.
- Structure files with clear separation of concerns:
  1. Types/Interfaces (`.types.ts`)
  2. API/Firebase queries (`.queries.ts` or `.api.ts`)
  3. Custom hooks (`.hooks.ts`)
  4. Reusable components (`.component.tsx`)
  5. Page implementation (`.page.tsx`)

## Naming Conventions
- Use lowercase with dashes for directories (e.g., `components/member-dashboard`).
- Favor named exports for components.
- Use PascalCase for components, interfaces, and types.
- Use camelCase for functions, variables, and hooks.
- Prefix custom hooks with `use` (e.g., `useGymMembers`).
- Suffix types/interfaces with descriptive names (e.g., `MemberFormData`, `GymSubscription`).

## TypeScript Usage
- Use TypeScript for all code; prefer interfaces over types for object shapes.
- Use types for unions, intersections, and utility types.
- Avoid enums; use const objects with `as const` assertion or string literal unions.
- Define types first, then implementation.
- Use strict mode and enable all strict type-checking options.
- Leverage TypeScript utility types (Pick, Omit, Partial, Record, etc.).

## Firebase Best Practices
- Use Firebase SDK for Firestore (database), Authentication, and Storage operations.
- Implement Firestore Security Rules for all collections and documents.
- Create separate Firebase instances for server and client:
  - Server: `@/lib/firebase/admin` (uses Firebase Admin SDK)
  - Client: `@/lib/firebase/client` (browser-based Firebase SDK)
- Use TypeScript interfaces for Firestore document types and converters.
- Store Firebase queries in dedicated files (e.g., `queries/members.queries.ts`).
- Use Firestore transactions and batched writes for complex operations.
- Implement optimistic updates with TanStack Query.
- Use Firebase Emulator Suite for local development and testing.

## TanStack Ecosystem
### TanStack Query (React Query)
- Use for all data fetching, caching, and synchronization.
- Define query keys as constants in a centralized file.
- Use `useQuery` for GET operations, `useMutation` for POST/PUT/DELETE.
- Implement proper error handling and loading states.
- Use `queryClient.invalidateQueries()` after mutations.
- Leverage `staleTime` and `cacheTime` appropriately.

### TanStack Table
- Use for all data tables with sorting, filtering, and pagination.
- Define column definitions separately from the table component.
- Implement server-side pagination for large datasets.
- Use virtual scrolling for performance with many rows.

### TanStack Form + Zod
- Use TanStack Form for all forms with Zod validation schemas.
- Define Zod schemas separately from components.
- Use schema inference for TypeScript types: `z.infer<typeof schema>`.
- Implement field-level validation and error messages.
- Use controlled components for complex form logic.

## Component Architecture
- Create small, reusable, single-responsibility components.
- Use composition over inheritance.
- Implement compound components for related UI patterns.
- Separate presentational components from container components.
- Use render props or custom hooks for logic reuse.
- Keep components pure and predictable.

## File Organization Pattern
```
features/
  members/
    types/
      member.types.ts          # Types and interfaces
    queries/
      members.queries.ts       # Firebase queries
    hooks/
      use-members.hooks.ts     # Custom hooks with React Query
    components/
      member-card.component.tsx      # Reusable components
      member-form.component.tsx
      member-list.component.tsx
    members.page.tsx           # Page implementation
```

## Syntax and Formatting
- Use the "function" keyword for pure functions and components.
- Avoid unnecessary curly braces in conditionals.
- Use declarative JSX with proper formatting.
- Use optional chaining and nullish coalescing operators.

## UI and Styling
- Use Shadcn UI and Radix for all components.
- Use Tailwind CSS for styling; follow mobile-first approach.
- Create custom variants using `class-variance-authority` (cva).
- Use Tailwind's design tokens for consistency.
- Implement dark mode support using `next-themes`.

## Performance Optimization
- Minimize 'use client' directive; favor React Server Components (RSC).
- Use 'use client' only for:
  - Interactive components with event handlers
  - Hooks like useState, useEffect
  - Browser APIs access
  - TanStack Query hooks
- Wrap client components in Suspense with meaningful fallback.
- Use dynamic imports for code splitting.
- Optimize images: use Next.js Image component, WebP format, lazy loading.
- Implement pagination and virtual scrolling for large lists.
- Use React.memo() strategically for expensive components.
- Leverage TanStack Query's caching mechanisms for Firebase data.

## State Management
- Use 'nuqs' for URL search parameter state management.
- Use TanStack Query for server state.
- Use React Context sparingly for global UI state.
- Prefer local state over global state when possible.
- Use Zustand for complex client-side state if needed.

## Error Handling
- Implement error boundaries for React components.
- Use try-catch blocks in async functions.
- Create custom error classes for different error types.
- Display user-friendly error messages.
- Log errors to monitoring service (e.g., Sentry).
- Handle Firebase errors gracefully with proper user feedback and error codes.

## Security
- Never expose Firebase Admin SDK credentials or service account keys on client.
- Implement Firestore Security Rules for all collections and documents.
- Validate all user input with Zod schemas.
- Sanitize data before Firestore operations.
- Use environment variables for sensitive data (API keys, project config).
- Implement proper authentication checks on all routes using Firebase Auth.
- Use Firebase App Check to protect backend resources from abuse.

## Testing (Future Consideration)
- Write unit tests for utility functions and hooks.
- Use integration tests for API routes and database queries.
- Implement E2E tests for critical user flows.
- Use Vitest for unit/integration tests, Playwright for E2E.

## Key Conventions
- Optimize Web Vitals (LCP, CLS, FID).
- Follow Next.js 14+ App Router conventions.
- Use Server Actions for form submissions when appropriate.
- Implement proper loading states and skeleton screens.
- Use React Server Components by default, client components only when necessary.
- Follow the principle: Types → Queries → Hooks → Components → Pages.

## Documentation
- Add JSDoc comments for complex functions and components.
- Document API endpoints and database schema.
- Maintain a README for each major feature.
- Use inline comments sparingly, only for complex logic.

Follow Next.js docs for Data Fetching, Rendering, and Routing.
Follow Firebase docs for Firestore, Authentication, and Storage best practices.
Follow TanStack docs for Query, Table, and Form implementations.
