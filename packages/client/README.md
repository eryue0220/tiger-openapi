<p align="center">
  <img src="https://raw.githubusercontent.com/eryue0220/tiger-openapi/HEAD/playground/public/tiger-openapi-icon.svg" alt="Tiger OpenAPI icon" width="172" height="172" />
</p>

# tiger-openapi

[![GitHub license](https://img.shields.io/badge/license-%20%20GNU%20GPLv3%20-green)](https://github.com/eryue0220/tiger-openapi/blob/main/LICENSE)
[![CI](https://github.com/eryue0220/tiger-openapi/actions/workflows/ci.yml/badge.svg)](https://github.com/eryue0220/tiger-openapi/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/tiger-openapi.svg)](https://www.npmjs.com/package/tiger-openapi)

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
> Before you start to use this api, ensure you have opened tiger api call. Or you can visit this [page](https://developer.itigerup.com/) to start.
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

## Quick Start

### Node.js

```ts
import { TigerClient, createTigerClient } from 'tiger-openapi';

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

## Example

Here is some example about how to call the quote / account / order api, you can visit the [examples](./examples/) for more details.

### Quote

#### Common

For more details please check the [API document](https://docs-en.itigerup.com/docs/quote-common).

```typescript
await tiger.quote.common.grabQuotePermission();

await tiger.quote.common.getQuotePermission();

await tiger.quote.common.getKlineQuote({
  /* */
});
```

#### Crypto

For more details please check the [API document](https://docs-en.itigerup.com/docs/quote-cc).

```typescript
await tiger.quote.crypto.getSymbols();
```

#### Funds

For more details please check the [API document](https://docs-en.itigerup.com/docs/quote-fund)

```typescript
await client.quote.funds.getFundSymbols();
```

#### Futures

For more details please check the [API document](https://docs-en.itigerup.com/docs/quote-future)

```typescript
await client.quote.futures.getFutureExchanges();
```

#### Options

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

#### Stock

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

#### Warrants

For more details please check the [API document](https://docs-en.itigerup.com/docs/quote-warrant) about warrant.

```typescript
await tiger.quote.warrants.getWarrantBriefs({
  /* */
});
```

## Accounts

For more details please check the [API document](https://docs-en.itigerup.com/docs/accounts) about warrant.

```typescript
const accountInfo = await client.account.getAccountInfo();
console.log('accountInfo::', accountInfo);

const accountBalance = await client.account.getAccountBalance();
console.log('accountBalance::', accountBalance);
```

## Order

For more details please check the [API document](https://docs-en.itigerup.com/docs/get-contract) about warrant.

```typescript
// 1. getContract
const contract = await client.order.getContract({ symbol: 'AAPL', sec_type: 'STK' });
logResult('getContract', contract);

// 2. getContracts
const contracts = await client.order.getContracts({ symbols: ['AAPL'], sec_type: 'STK' });
logResult('getContracts', contracts);
```

## Stream

```typescript
const client = createTigerClient({
  tigerId: '...',
  account: '...',
  privateKey: '...',
  stream: {
    reconnect: { retries: 5 },
    subscription: {
      // default: true. if true, subscribe()/unsubscribe() will auto-send
      // stream commands and auto re-subscribe after reconnect.
      autoManage: true,
    },
  },
});

await client.connect();

const topic = 'quote.AAPL';
const unsubscribe = client.subscribe({
  topic,
  listener: (message) => {
    console.log('stream::', message.topic, message.payload);
  },
});

// manual publish if needed
client.publish({
  topic,
  payload: JSON.stringify({ action: 'subscribe', topic }),
});

// explicit topic controls
client.subscribeTopic(topic);
client.unsubscribeTopic(topic);

unsubscribe?.();
client.close();
```

Node example: [examples/node/stream.mjs](../../examples/node/stream.mjs)

## References

- [Tiger OpenAPI Docs](https://docs-en.itigerup.com/docs/overview)

# License

Licensed under the GPL-3.0
