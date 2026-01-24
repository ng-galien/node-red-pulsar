# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Node-RED plugin providing Apache Pulsar integration nodes. Built on the [pulsar-client](https://github.com/apache/pulsar-client-node) library.

## Build & Development Commands

```bash
npm run build       # Compile TypeScript and copy HTML files to dist/
npm run clean       # Remove build artifacts
npm run lint        # Run ESLint
npm run format      # Run ESLint with auto-fix
npm test            # Run all tests with ts-mocha
npm run deploy      # Install package to local Node-RED (~/.node-red)
npm run test-node-red  # Full cycle: stop, build, deploy, start Node-RED
```

### Running a Single Test
```bash
npx ts-mocha --exit -p tsconfig.json test/parsing/parseNumber.spec.ts
```

## Architecture

### Node Types
The plugin provides 6 Node-RED nodes:
- **pulsar-client**: Configuration node managing Pulsar client connections (stores client in `node.credentials`)
- **pulsar-authentication**: Configuration node for auth (Token, OAuth2, TLS)
- **pulsar-schema**: Configuration node for Avro/JSON schemas
- **pulsar-producer**: Flow node that sends messages to Pulsar topics
- **pulsar-consumer**: Flow node that receives messages via subscriptions
- **pulsar-reader**: Flow node that reads messages (supports seek operations)

### Source Structure
Each node has two files:
- `src/<node>/<node>.ts` - Server-side Node-RED runtime code
- `src/<node>/<node>.html.ts` - Browser-side editor UI code (compiled to HTML)

### Key Source Files
- [PulsarDefinition.ts](src/PulsarDefinition.ts) - TypeScript interfaces for all node configs and constants
- [PulsarConfig.ts](src/PulsarConfig.ts) - Configuration parsing functions (clientConfig, producerConfig, consumerConfig, readerConfig)
- [PulsarNode.ts](src/PulsarNode.ts) - Helper functions to retrieve client/schema from config nodes
- [html-utils/html-utils.html.ts](src/html-utils/html-utils.html.ts) - Shared browser-side utilities for Node-RED editor

### Configuration Node Pattern
Config nodes (client, auth, schema) store their runtime objects in `node.credentials`. Actor nodes (producer, consumer, reader) retrieve these via `requireClient()` and `requireSchema()` from PulsarNode.ts.

## Testing

Tests use:
- **ts-mocha** with chai for unit tests
- **node-red-node-test-helper** for Node-RED integration
- **testcontainers** for Pulsar container in integration tests

Integration tests in `test/node-red/Nodes.spec.ts` spin up a real Pulsar container and test the full flow.

## E2E Testing with Docker

Two Docker configurations are available:

### Development (local changes)

Test local code changes before publishing:

```bash
# 1. Build and pack the local package
npm run build && npm pack && mv *.tgz docker/

# 2. Start Pulsar + Node-RED with local package
cd docker && docker-compose -f docker-compose.dev.yml up -d --build

# 3. Open Node-RED at http://localhost:1880
# 4. Import the test flow from examples/e2e-test-flow.json

# Stop containers
docker-compose -f docker-compose.dev.yml down
```

### Production (published package)

Test the published npm package:

```bash
cd docker && docker-compose up -d --build
# Open http://localhost:1880
docker-compose down
```

### Docker Files

| File                             | Purpose                                     |
| -------------------------------- | ------------------------------------------- |
| `docker/Dockerfile`              | Installs from npm registry                  |
| `docker/docker-compose.yml`      | Runs published package                      |
| `docker/Dockerfile.dev`          | Installs from local .tgz                    |
| `docker/docker-compose.dev.yml`  | Runs local dev build                        |
| `examples/e2e-test-flow.json`    | Test flow with Producer, Consumer, Reader   |

## Conventions

- Commits follow [Conventional Commits](https://www.conventionalcommits.org/) (enforced by commitlint)
- Pre-commit hook runs tests
- ESLint requires explicit return types on functions and JSDoc on classes/methods
- 2-space indentation
