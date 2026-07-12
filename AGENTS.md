# Agent Guidelines for MyNovelReader

## Commands

- **Build**: `npm run build`
- **Dev**: `npm run dev`
- **Preview**: `npm run preview`
- **Lint**: `npm run lint` (warnings allowed) | `npm run lint:strict` (zero warnings)
- **Lint fix**: `npm run lint:fix`
- **Format**: `npm run format`
- **Typecheck**: `npm run typecheck`
- **Test all**: `npm test`
- **Test run**: `npm run test:run`
- **Test coverage**: `npm run test:coverage`
- **Single test**: `npx vitest run tests/unit/xxx.test.ts`
- **E2E smoke**: `npm run e2e:smoke`

## Code Style

- **Formatting**: Prettier - single quotes, semicolons, 2-space indent, 100 char width
- **Types**: TypeScript (.ts) for all new files
- **Imports**: ES modules; GM\_\* APIs are globals; no @require dependencies currently
- **Naming**: camelCase for functions/variables, PascalCase for classes/components
- **Error handling**: Prefer logging errors; avoid silent failures

## Engineering Principles

- Keep scope tight. Do not clean up unrelated files or refactor unrelated modules while fixing a
  specific issue.
- Prefer direct, current code paths over compatibility shims. Do not add migration or legacy
  compatibility layers unless explicitly required.
- For performance changes, preserve behavior first. Avoid selector range narrowing, skip logic, or
  detector shortcuts unless they are proven output-equivalent and browser-verified.
- Generated/local artifacts such as `coverage/` and `test-results/` are for validation only and
  should not be committed.

## Validation Policy

- For ordinary code changes, run the smallest relevant unit tests first, then the appropriate gate:
  `npm run lint:strict`, `npm run typecheck`, and either `npm run test:run` or
  `npm run test:coverage` when CI coverage can be affected.
- GitHub Actions `User script generation` is the authoritative CI line. It runs
  `lint:strict`, `typecheck`, `test:coverage`, `build`, EOL normalization, and generated-script
  push logic.
- Coverage thresholds are intentional project policy: `lines: 88`, `statements: 88`,
  `functions: 88`, `branches: 76`. Do not loosen them just to make CI pass. First inspect
  `coverage/lcov.info`, confirm whether the gate is reasonable, and add focused low-coupling
  behavior tests when practical.
- For browser-visible behavior, UserScript injection, Shadow DOM styling, detector/parser runtime
  behavior, or real-site compatibility, use Playwright-backed validation. Do not stop at unit tests
  when the question is actual browser behavior.
- Real-site smoke validation may require explicit proxy settings in WSL and, for Cloudflare-protected
  sites, a headed warmup or persistent profile. Treat anti-bot/session limits as external state, not
  as proof the feature is broken.

## Release and Artifact Rules

- `scripts/MyNovelReader.user.js` is a generated build artifact. Rebuild it after version,
  metadata, runtime, detector/parser, CSS injection, or release-surface changes.
- For patch/minor releases, use `npm version <patch|minor> --no-git-tag-version`, rebuild the
  userscript, then rerun validation before committing.
- A release or CI-fix task is not complete until the relevant commit is pushed and the remote
  `User script generation` workflow has been checked.
- If dependencies or package metadata changed, include `npm audit --audit-level=moderate` and
  `npm outdated` in the release check, and report any remaining update-only noise separately.

## Project Structure

- `src/index.ts` - Entry point
- `src/bootstrap.ts` - Startup logic
- `src/meta.ts` - UserScript metadata
- `src/core/` - Core logic (detection, parser, rules, converter, protection, utils)
- `src/ui/` - UI components
- `tests/unit/` - Vitest unit tests
- `scripts/` - Build output (`scripts/MyNovelReader.user.js`)

## Notes

- This is a UserScript (Tampermonkey); GM\_\* APIs are globals
- Vue 3 + Vite 8 + TypeScript 6; builds to `scripts/MyNovelReader.user.js`
- ESLint has relaxed rules for legacy code; fix warnings incrementally
