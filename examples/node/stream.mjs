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
  const topic = process.env.STREAM_TOPIC ?? 'cc:BTC';
  const timeoutMs = Number(process.env.STREAM_TIMEOUT_MS ?? 30_000);
  const env = process.env.TIGER_ENV;
  let messageCount = 0;

  const client = createTigerClient({
    tigerId: assertRequiredEnv('TIGER_ID'),
    account: assertRequiredEnv('ACCOUNT'),
    privateKey: assertRequiredEnv('PRIVATE_KEY'),
    env: env === 'prod' || env === 'us' || env === 'sandbox' ? env : undefined,
    stream: {
      protocol: 'tiger-push',
      reconnect: {
        retries: 5,
      },
      // Can be changed to false if you want to manually manage subscribe/unsubscribe messages.
      subscription: {
        autoManage: true,
      },
    },
  });

  console.log('connecting stream...');
  await client.connect();
  console.log(`connected, subscribing topic: ${topic}`);

  const unsubscribe = client.subscribe({
    topic,
    listener: (message) => {
      messageCount += 1;
      console.log(`stream message #${messageCount}::`, message);
    },
  });

  const unsubscribeAll = client.subscribe({
    topic: '*',
    listener: (message) => {
      if (typeof message.topic === 'string' && message.topic.startsWith('__control__')) {
        console.log('control::', message);
      }
    },
  });

  await new Promise((resolve) => {
    globalThis.setTimeout(resolve, timeoutMs);
  });

  unsubscribe?.();
  unsubscribeAll?.();
  client.close();

  if (messageCount === 0) {
    console.log(
      `no stream payload received in ${timeoutMs}ms. check STREAM_TOPIC / account quote permission / market trading session.`
    );
    process.exitCode = 2;
    return;
  }

  console.log(`received ${messageCount} stream messages.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
