# tiger-openapi

TypeScript monorepo for building a Tiger OpenAPI SDK across multiple runtimes and deployment environments.

The repository currently exposes two public entry packages:

- `@tiger-openapi/node`
- `@tiger-openapi/browser`

Internally, the SDK is organized into focused packages for HTTP transport, streaming, protobuf helpers, shared utilities, and high-level resource clients.

## Why This Project

This project aims to provide a modern Tiger OpenAPI SDK with:

- A clean TypeScript-first API
- Separate public entry points for Node.js and browser usage
- Shared core logic for quote, trading, and account domains
- Built-in support for multiple Tiger environments
- Runtime-friendly primitives based on standard Web APIs such as `fetch`, `Headers`, `AbortController`, and `WebSocket`

## Features

- High-level resource clients for `quote`, `trading`, and `account`
- HTTP request handling with retry support
- Streaming client with heartbeat and reconnect support
- Protobuf codec scaffolding for push data decoding
- Runtime overrides for custom `WebSocket` and logging integration
- Monorepo package boundaries that keep public and internal modules separated

## Environment Support

The SDK already supports multiple Tiger environments through the `env` option:

- `prod`
- `us`
- `sandbox`

It also supports multiple runtime targets at the architecture level:

- Public packages: `Node.js`, `Browser`
- Runtime detection utilities already cover: `Node.js`, `Bun`, `Deno`, `Cloudflare Workers`, and `Browser`

Today, the officially exposed packages are still `@tiger-openapi/node` and `@tiger-openapi/browser`, while the shared runtime layer is designed so the SDK can be adapted to more environments as the project evolves.

## Installation

```bash
pnpm add @tiger-openapi/node
```

or

```bash
pnpm add @tiger-openapi/browser
```

## Quick Start

### Node.js

```ts
import { TigerClient } from '@tiger-openapi/node';

const tiger = new TigerClient({
  env: 'sandbox',
  tigerId: '20150144',
  account: 'U123456789',
  privateKey: '-----BEGIN PRIVATE KEY-----...',
  http: {
    defaultHeaders: {
      'x-client-name': 'demo-app',
    },
  },
  runtime: {
    createWebSocket: (url) => new WebSocket(url),
  },
});

const contracts = await tiger.quote.stock.getContracts({
  symbols: ['AAPL', 'NVDA'],
  market: 'US',
});

const order = await tiger.trading.placeOrder({
  symbol: 'AAPL',
  market: 'US',
  secType: 'STK',
  action: 'BUY',
  orderType: 'LMT',
  quantity: 1,
  limitPrice: 200,
});

const positions = await tiger.account.getPositions({
  account: 'U123456789',
});
```

### Browser

```ts
import { TigerClient } from '@tiger-openapi/browser';

const tiger = new TigerClient({
  env: 'prod',
  tigerId: '20150144',
  account: 'U123456789',
  privateKey: '-----BEGIN PRIVATE KEY-----...',
  http: {
    defaultHeaders: {
      'x-client-name': 'web-app',
    },
  },
});

const expirations = await tiger.quote.options.getOptionExpirations({
  symbol: 'AAPL',
  market: 'US',
});

const optionChain = await tiger.quote.options.getOptionChain(
  {
    symbol: 'AAPL',
    expiry: '2025-01-17',
    market: 'US',
  },
  {
    timeoutMs: 5_000,
  }
);
```

## API Overview

### Quote

```ts
await tiger.quote.stock.getContracts({
  symbols: ['AAPL'],
  market: 'US',
});

await tiger.quote.stock.getSecurities({
  symbols: ['AAPL'],
  market: 'US',
});

await tiger.quote.futures.getContracts({
  symbols: ['ES'],
  market: 'US',
});

await tiger.quote.crypto.getContracts({
  symbols: ['BTCUSD'],
});

await tiger.quote.options.getOptionExpirations({
  symbol: 'AAPL',
  market: 'US',
});

await tiger.quote.options.getOptionChain({
  symbol: 'AAPL',
  expiry: '2025-01-17',
  market: 'US',
});
```

### Trading

```ts
await tiger.trading.getContract({
  symbol: 'AAPL',
  market: 'US',
  secType: 'STK',
});

await tiger.trading.placeOrder({
  account: 'U123456789',
  symbol: 'AAPL',
  market: 'US',
  secType: 'STK',
  action: 'BUY',
  orderType: 'LMT',
  quantity: 1,
  limitPrice: 200,
});

await tiger.trading.getOrders({
  account: 'U123456789',
  symbol: 'AAPL',
});
```

### Account

```ts
await tiger.account.getManagedAccounts();

await tiger.account.getAssets({
  account: 'U123456789',
});

await tiger.account.getPrimeAssets({
  account: 'U123456789',
  segment: 'S',
});

await tiger.account.getPositions({
  account: 'U123456789',
  symbol: 'AAPL',
});
```

## Streaming

When stream configuration is provided, the client can open a push connection and manage subscriptions through the built-in stream layer.

```ts
const tiger = new TigerClient({
  env: 'prod',
  tigerId: '20150144',
  account: 'U123456789',
  privateKey: '-----BEGIN PRIVATE KEY-----...',
  http: {},
  stream: {
    heartbeatIntervalMs: 30_000,
    reconnect: {
      retries: 3,
    },
  },
  runtime: {
    createWebSocket: (url) => new WebSocket(url),
  },
});

await tiger.connect();

const unsubscribe = tiger.subscribe({
  topic: 'quote',
  listener(message) {
    console.log(message);
  },
});

unsubscribe?.();
tiger.close();
```

## Monorepo Layout

```text
packages/
  shared/   # runtime helpers, signing, errors, logger, retry helpers
  http/     # fetch-based HTTP client
  pb/       # protobuf registry and codec utilities
  stream/   # websocket client, reconnect, subscription management
  core/     # high-level SDK composition for quote / trading / account
  node/     # public Node.js entry package
  browser/  # public browser entry package
```

## Project Status

This repository is already usable as an SDK foundation, but it is still evolving.

- Public entry points are currently limited to `@tiger-openapi/node` and `@tiger-openapi/browser`
- Internal packages such as `core`, `http`, `stream`, `pb`, and `shared` are not intended as stable public SDK surfaces
- The high-level resource model for `quote`, `trading`, and `account` is in place
- Some protocol details and endpoint coverage still need further alignment with the official Tiger OpenAPI specification

## References

- [Tiger OpenAPI Docs](https://docs-en.itigerup.com/docs/overview)
- [Get Contract](https://docs-en.itigerup.com/docs/get-contract)
- [Accounts](https://docs-en.itigerup.com/docs/accounts)
- [Tiger OpenAPI Python SDK](https://github.com/tigerfintech/openapi-python-sdk)

## Development

```bash
pnpm install
pnpm build
pnpm dev
pnpm lint
pnpm typecheck
pnpm test
```
