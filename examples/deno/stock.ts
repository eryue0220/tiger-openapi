import { createTigerClient } from 'npm:tiger-openapi';

async function loadEnv(file: URL): Promise<Record<string, string>> {
  const text = await Deno.readTextFile(file);
  const env: Record<string, string> = {};

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) {
      continue;
    }

    const index = line.indexOf('=');
    if (index <= 0) {
      continue;
    }

    const key = line.slice(0, index).trim();
    let value = line.slice(index + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    env[key] = value;
  }

  return env;
}

async function main() {
  const env = await loadEnv(new URL('./.env.local', import.meta.url));

  const client = createTigerClient({
    tigerId: env.TIGER_ID,
    account: env.ACCOUNT,
    privateKey: env.PRIVATE_KEY,
  });

  const marketStatus = await client.quote.stock.getMarketStatus({ market: 'US' });
  console.log('marketStatus::', marketStatus);

  const symbolBriefs = await client.quote.stock.getSymbolBriefs({ symbols: ['AAPL'] });
  console.log('symbolBriefs::', symbolBriefs);
}

main().catch((err) => {
  console.error(err);
  Deno.exit(1);
});
