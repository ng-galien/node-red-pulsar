# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## 1.2.0

### Fixed

- Fix config node selectors not appearing in editor (issue #98)
  - Race condition in async script loading caused undefined constants
  - Chained `$.getScript()` callbacks to ensure proper load order

### Added

- E2E testing setup with Docker (Pulsar + Node-RED)
- GitHub community health files (CONTRIBUTING, CODE_OF_CONDUCT, SECURITY)
- Issue and PR templates
- commitlint for conventional commits enforcement

### Enhanced

- Improved README with badges, table of contents, and better documentation
- Added LICENSE file (ISC)
- URL validation supports both `pulsar://` and `pulsar+ssl://` schemes

### Maintenance

- Added husky pre-commit hooks
- Updated dependencies

### [1.1.9](https://github.com/ng-galien/node-red-pulsar/compare/v1.2.0...v1.1.9) (2025-06-05)

## 1.1.7

### Enhanced

- Allow to configure Pulsar service URL with typed input
  - String
  - Environment variable
  - Flow or global context
- Allow to configure topics with typed input
  - String
  - Environment variable
  - Flow or global context
- Pulsar topic is in the message object

### Maintenance

- Update dependencies
- Use Prettier for code formatting
- Use ESLint for code linting

## 1.1.4

### Enhanced

- Pulsar Producer node properties from input message and set them in the message

## 1.1.3

### Fixed

- Documentation fixes

## 1.1.2

### Fixed

- Pulsar schema node

## 1.1.1

### Fixed

- Build fixes

## [1.1.0](https://github.com/ng-galien/node-red-contrib-pulsar/compare/v1.0.2...v1.1.0) (2024-04-28)

### Added

- Reader node
- Authorization node

### Changed

- Nodes are written in TypeScript
