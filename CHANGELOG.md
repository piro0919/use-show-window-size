# Changelog

## [Unreleased]

> Earlier releases (0.0.1, 1.0.0, 1.0.1) were not recorded here. Their changes
> are in the git history and on npm.

### Fixed

- Passing `style` as an inline object no longer causes an infinite render
  loop. `style` is compared by value, and the returned size only updates
  when width or height actually change.
- Numeric `style` values now get `px` the way React renders them
  (`fontSize: 14` → `14px`); unitless properties such as `opacity` and
  `zIndex` are left as-is. Before, numeric lengths were silently dropped.
- Multiple instances share one badge. Before, a second instance replaced the
  first one's badge, and unmounting either removed the badge for both.

### Changed

- When several instances are mounted, the most recently mounted or updated
  one decides `position` and `style`. Not breaking for a single instance.
- `exports` now gives CommonJS consumers `index.d.cts` (separate `types` per
  condition) and exposes `./package.json`.

### Added

- `pnpm check:package` runs publint and `@arethetypeswrong/cli`.
- CI runs the tests on Node 22 and 24 and checks the built package loads on
  Node 20, the lowest version `engines` allows.
