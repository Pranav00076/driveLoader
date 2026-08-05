# Contributing to @driveloader/react

Thank you for your interest in making `@driveloader/react` the premier Google Drive media SDK for React! We welcome contributions from developers of all skill levels.

---

## 🚀 Quick Setup

1. **Fork and clone the repository**:
   ```bash
   git clone https://github.com/Pranav00076/driveLoader.git
   cd driveLoader
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run test suite**:
   ```bash
   npm test
   ```

4. **Run typecheck & linter**:
   ```bash
   npm run typecheck
   npm run lint
   ```

5. **Launch local interactive playground**:
   ```bash
   npm run dev
   ```

---

## 💡 How to Contribute

### 1. Good First Issues
If you are new to the repository, look for issues labeled [`good first issue`](https://github.com/Pranav00076/driveLoader/labels/good%20first%20issue) on GitHub.

### 2. Feature Requests & RFC Process
For major architectural changes or new core APIs:
1. Open a GitHub Discussion under **RFC (Request for Comments)**.
2. Outline the motivation, proposed API design, backward compatibility considerations, and alternatives.
3. Wait for feedback from maintainers before starting implementation.

---

## 📏 Code & Testing Standards

- **Zero Breaking Changes**: All public API modifications must be strictly additive and backward compatible.
- **Strict TypeScript**: 100% strict type safety with explicit return types and zero `any`.
- **Actionable Errors**: Use `DriveLoaderError` hierarchy for error handling.
- **Test Coverage**: All bug fixes and new components must include tests in `src/tests/`.
- **Changesets**: Run `npx changeset` to create a changeset before opening a PR.

---

## 📜 Code of Conduct

Please treat all community members with respect and professionalism.

