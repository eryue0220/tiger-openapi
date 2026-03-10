# tiger-openapi &middot; [![GitHub license](https://img.shields.io/badge/license-%20%20GNU%20GPLv3%20-green)](https://github.com/eryue0220/tiger-openapi/blob/main/LICENSE)

TypeScript monorepo for building a Tiger OpenAPI SDK across multiple runtimes and deployment environments.

The repository currently exposes one public package with a browser subpath export:

- `tiger-openapi`
- `tiger-openapi/browser`

It also supports multiple runtime targets at the architecture level:

- [Bun](https://bun.com/)
- [Deno](https://deno.com/)
- [Cloudflare Workers](https://workers.cloudflare.com/)

---

> [!IMPORTANT]  
> This is not the official NodeJS SDK, and currently it's still under development.
>
> If any bug, please open an [issue](https://github.com/eryue0220/tiger-openapi/issues)

---

## Installation

```bash
# via pnpm
pnpm add tiger-openapi

# via npm
npm i tiger-openapi

# via yarn
yarn add tiger-openapi
```

or

```bash
# via pnpm
pnpm add tiger-openapi

# via npm
npm i tiger-openapi

# via yarn
yarn add tiger-openapi
```

## Quick Start

### Node.js

```ts
import { TigerClient, createTigerClient } from 'tiger-openapi';

// apply in tiger openapi page
const tiger = new TigerClient({
  tigerId: '...',
  account: '...',
  privateKey: '-...',
});

// or

const tiger = createTigerClient({
  tigerId: '...',
  account: '...',
  privateKey: '-...',
});
```

### Browser

```ts
import { TigerClient, createTigerClient } from 'tiger-openapi/browser';

// apply in tiger openapi page
const tiger = new TigerClient({
  tigerId: '...',
  account: '...',
  privateKey: '-...',
});

// or

const tiger = createTigerClient({
  tigerId: '...',
  account: '...',
  privateKey: '-...',
});
```

## API Overview

## Quote

### Common

For more details please check the [API document](https://docs-en.itigerup.com/docs/quote-common).

```typescript
await tiger.quote.common.grabQuotePermission();

await tiger.quote.common.getQuotePermission();

await tiger.quote.common.getKlineQuote({
  /* */
});
```

### Crypto

This is still development.

### Funds

This is still development.

### Futures

This is still development.

### Options

Please ensure you have permission to enable query options before you call the API.

```typescript
await tiger.quote.options.getOptionExpirations({
  /* */
});

await tiger.quote.options.getOptionBriefs({
  /* */
});
```

For more details about Options, please check the [document](https://docs-en.itigerup.com/docs/quote-option).

### Stock

Please ensure you have permission to enable query stock before you call the API.

```typescript
await tiger.quote.stock.getMarketStatus({
  /* */
});

await tiger.quote.stock.getTradingCalendar({
  /* */
});
```

For more details please check the [API document](https://docs-en.itigerup.com/docs/quote-stock) about stock.

### Warrants

This is still development.

## Accounts

This is still development.

## Trading

This is still development.

## Stream

This is still development.

## References

- [Tiger OpenAPI Docs](https://docs-en.itigerup.com/docs/overview)
