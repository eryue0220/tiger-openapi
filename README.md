# tiger-openapi

TypeScript monorepo for building a Tiger OpenAPI SDK across multiple runtimes and deployment environments.

The repository currently exposes two public entry packages:

- `@tiger-openapi/node`
- `@tiger-openapi/browser`

It also supports multiple runtime targets at the architecture level:

- [Bun](https://bun.com/)
- [Deno](https://deno.com/)
- [Cloudflare Workers](https://workers.cloudflare.com/)

---

> [!IMPORTANT]  
> This is not the official NodeJS SDK
---

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

// apply in tiger openapi page
const tiger = new TigerClient({
  tigerId: '...',
  account: '...',
  privateKey: '-...',
});

```

### Browser

```ts
import { TigerClient } from '@tiger-openapi/browser';

// apply in tiger openapi page
const tiger = new TigerClient({
  tigerId: '...',
  account: '...',
  privateKey: '-...',
});
```

## API Overview

## Monorepo Layout

## References

- [Tiger OpenAPI Docs](https://docs-en.itigerup.com/docs/overview)

## Development
