# Contributing to node-red-pulsar

Thank you for your interest in contributing to node-red-pulsar! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## How to Contribute

### Reporting Issues

Before creating an issue, please:

1. Search existing issues to avoid duplicates
2. Use the issue templates when available
3. Include as much detail as possible:
   - Node-RED version
   - Node.js version
   - Pulsar version
   - Steps to reproduce
   - Expected vs actual behavior
   - Relevant logs or screenshots

### Suggesting Features

Feature requests are welcome! Please:

1. Check if the feature has already been requested
2. Describe the use case and expected behavior
3. Explain why this feature would be useful

### Pull Requests

1. Fork the repository
2. Create a feature branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes following our coding standards
4. Write or update tests as needed
5. Ensure all tests pass:
   ```bash
   npm test
   ```
6. Ensure code passes linting:
   ```bash
   npm run lint
   ```
7. Commit your changes using [Conventional Commits](https://www.conventionalcommits.org/):
   ```bash
   git commit -m "feat: add new feature"
   git commit -m "fix: resolve issue with consumer"
   git commit -m "docs: update README"
   ```
8. Push to your fork and create a pull request

## Development Setup

### Prerequisites

- Node.js >= 18.0.0
- npm
- Docker (for running Pulsar locally)

### Installation

```bash
git clone https://github.com/ng-galien/node-red-contrib-pulsar.git
cd node-red-contrib-pulsar
npm install
```

### Building

```bash
npm run build
```

### Testing

```bash
# Run all tests
npm test

# Run a specific test file
npx ts-mocha --exit -p tsconfig.json test/path/to/test.spec.ts
```

### Running Locally

```bash
# Start a local Pulsar instance
docker run -it -p 6650:6650 -p 8080:8080 apachepulsar/pulsar:3.0.2 bin/pulsar standalone

# Build and deploy to local Node-RED
npm run build
npm run deploy

# Start Node-RED
npm run start-node-red
```

## Coding Standards

### TypeScript

- Use TypeScript for all source code
- Enable strict mode
- Provide explicit return types for functions
- Use meaningful variable and function names

### Style

- 2-space indentation
- ESLint and Prettier are enforced via pre-commit hooks
- Run `npm run format` to auto-fix style issues

### Documentation

- Add JSDoc comments to classes and public methods
- Update README.md for user-facing changes
- Include inline comments for complex logic

### Testing

- Write tests for new features
- Maintain existing test coverage
- Use descriptive test names

## Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

## Release Process

Releases are managed by maintainers using:

```bash
npm run release
```

This uses `standard-version` to bump versions and generate changelog.

## Questions?

Feel free to open an issue for any questions about contributing.
