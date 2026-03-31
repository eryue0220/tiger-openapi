import { createTigerClient } from 'tiger-openapi';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(currentDir, '.env.local') });

function assertRequiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env: ${name}`);
  }
  return value;
}

async function main() {
  const client = createTigerClient({
    tigerId: assertRequiredEnv('TIGER_ID'),
    account: assertRequiredEnv('ACCOUNT'),
    privateKey: assertRequiredEnv('PRIVATE_KEY'),
    stream: {
      reconnect: {
        retries: 5,
      },
      // Can be changed to false if you want to manually manage subscribe/unsubscribe messages.
      subscription: {
        autoManage: true,
      },
    },
  });

  await client.connect();

  const topic = 'quote.AAPL';
  const unsubscribe = client.subscribe({
    topic,
    listener: (message) => {
      console.log('stream message::', message);
    },
  });

  // If needed, you can also send the raw stream command manually.
  client.publish({
    topic,
    payload: JSON.stringify({ action: 'subscribe', topic }),
  });

  setTimeout(() => {
    unsubscribe?.();
    client.close();
  }, 30_000);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
