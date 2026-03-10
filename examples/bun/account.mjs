import { createTigerClient } from 'tiger-openapi';
import dotenv from 'dotenv';

dotenv.config({ path: new URL('./.env.local', import.meta.url).pathname });

async function main() {
  const client = createTigerClient({
    tigerId: process.env.TIGER_ID,
    account: process.env.ACCOUNT,
    privateKey: process.env.PRIVATE_KEY,
  });

  const accountInfo = await client.account.getAccountInfo();
  console.log('accountInfo::', accountInfo);

  const accountBalance = await client.account.getAccountBalance();
  console.log('accountBalance::', accountBalance);

  const accountPositions = await client.account.getAccountPositions();
  console.log('accountPositions::', accountPositions);

  const accountOrders = await client.account.getAccountOrders();
  console.log('accountOrders::', accountOrders);

  const accountOpenOrders = await client.account.getAccountOpenOrders();
  console.log('accountOpenOrders::', accountOpenOrders);

  const accountTransactions = await client.account.getAccountTransactions();
  console.log('accountTransactions::', accountTransactions);

  const accountFundingHistory = await client.account.getAccountFundingHistory();
  console.log('accountFundingHistory::', accountFundingHistory);

  const accountFundingDetails = await client.account.getAccountFundingDetails();
  console.log('accountFundingDetails::', accountFundingDetails);

  const accountFundingTransactions = await client.account.getAccountFundingTransactions();
  console.log('accountFundingTransactions::', accountFundingTransactions);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
