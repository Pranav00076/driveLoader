# Contributing to @driveloader/react

Thank you for your interest in contributing to `@driveloader/react`!

## Development Setup

1. Fork and clone the repository:
   ```bash
   git clone https://github.com/Pranav00076/driveLoader.git
   cd driveLoader
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run test suite:
   ```bash
   npm test
   ```

4. Run typecheck & linter:
   ```bash
   npm run typecheck
   npm run lint
   ```

5. Launch local documentation sandbox app:
   ```bash
   npm run dev
   ```

## Pull Request Guidelines

- Ensure all new features or bug fixes include corresponding unit/component tests in `src/tests/`.
- Maintain 100% strict TypeScript types (zero `any`).
- Add a changeset using `npx changeset` before submitting your PR.
