<p align="center">
  <img src="https://raw.githubusercontent.com/eryue0220/tiger-openapi/HEAD/playground/public/tiger-openapi-icon.svg" alt="Tiger OpenAPI icon" width="172" height="172" />
</p>

# tiger-openapi-cli

[![GitHub license](https://img.shields.io/badge/license-%20%20GNU%20GPLv3%20-green)](https://github.com/eryue0220/tiger-openapi/blob/main/LICENSE)
[![CI](https://github.com/eryue0220/tiger-openapi/actions/workflows/ci.yml/badge.svg)](https://github.com/eryue0220/tiger-openapi/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/tiger-openapi-cli.svg)](https://www.npmjs.com/package/tiger-openapi-cli)

`tiger-openapi-cli` is a command-line tool built on top of the `tiger-openapi` SDK. It helps you quickly validate configuration and query account and market data (stocks, options, funds, crypto, futures, warrants, and more).

## Installation

```bash
# npm
npm i -g tiger-openapi-cli

# pnpm
pnpm add -g tiger-openapi-cli

# yarn
yarn global add tiger-openapi-cli
```

After installation, run:

```bash
tiger-openapi --help
```

## Credentials Setup

The CLI requires the following credentials:

- `TIGER_ID` (or `TIGER_OPENAPI_TIGER_ID`)
- `TIGER_ACCOUNT` (or `TIGER_OPENAPI_ACCOUNT`)
- `TIGER_PRIVATE_KEY` (or `TIGER_OPENAPI_PRIVATE_KEY`)

Optional:

- `TIGER_ENV` (or `TIGER_OPENAPI_ENV`), available values: `prod | us | sandbox`, default is `prod`

### Option 1: Use a `.env` file (recommended)

Create a `.env` file in your project root:

```env
TIGER_ID=your_tiger_id
TIGER_ACCOUNT=your_account
TIGER_PRIVATE_KEY=-----BEGIN RSA PRIVATE KEY-----
...
-----END RSA PRIVATE KEY-----
TIGER_ENV=prod
```

### Option 2: Use the CLI config file

Write config with the command below (saved to `~/.tiger-openapi-cli.json`):

```bash
tiger-openapi config \
  --tiger_id your_tiger_id \
  --account your_account \
  --private_key "your_private_key" \
  --env prod
```

Show current config:

```bash
tiger-openapi config
```

### Configuration Priority

Command-line arguments > CLI config file > environment variables (including `.env`).

For example, `--account xxx` overrides `account` from both the config file and `.env`.

## Check Configuration First

```bash
tiger-openapi check
```

This command prints whether the current configuration is valid, along with environment info and SDK version.

## Common Commands

### Account

```bash
tiger-openapi account
```

### Stock

```bash
tiger-openapi stock --symbol AAPL
```

### Options

```bash
# Query available expirations
tiger-openapi options --symbol AAPL

# Query option chain for a specific expiration
tiger-openapi options --symbol AAPL --expiry 2026-03-20
```

### Fund

```bash
tiger-openapi fund --symbol 000001
```

### Crypto

```bash
tiger-openapi crypto --symbol BTCUSD
```

### Futures

```bash
tiger-openapi futures --symbol ESmain
```

### Warrants

```bash
tiger-openapi warrants --symbol 12345
```

### Market Scanner

```bash
tiger-openapi scanner --market US --page 1 --page_size 20
```

Optional arguments:

- `--sec_type`: for example `STK`, `OPT`, `FUT`
- `--page`: page number, default `1`
- `--page_size`: page size, default `20`

## Common Override Flags

Most query commands support the following override flags (for temporary overrides):

- `--path <path>`: specify a `.env` file path
- `--tiger_id <tiger_id>`
- `--private_key <private_key>`
- `--account <account>`

Example:

```bash
tiger-openapi stock --symbol TSLA --path ./.env.prod
```

## Development

Run these commands from the monorepo root:

```bash
pnpm --filter tiger-openapi-cli build
pnpm --filter tiger-openapi-cli dev
pnpm --filter tiger-openapi-cli typecheck
```

## License

GPL-3.0-only
