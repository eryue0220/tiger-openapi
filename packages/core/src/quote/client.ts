import type { TigerClient } from '../tiger-client.js';

import { createQuoteCommonClient, QuoteCommonClient } from './common/index.js';
import { createQuoteCryptoClient, QuoteCryptoClient } from './crypto/index.js';
import { createQuoteFundsClient, QuoteFundsClient } from './funds/index.js';
import { createQuoteFuturesClient, QuoteFuturesClient } from './futures/index.js';
import { createQuoteOptionsClient, QuoteOptionsClient } from './options/index.js';
import { createQuoteStockClient, QuoteStockClient } from './stock/index.js';
import { createQuoteWarrantsClient, QuoteWarrantsClient } from './warrants/index.js';

export class QuoteClient {
  readonly common: QuoteCommonClient;
  readonly crypto: QuoteCryptoClient;
  readonly funds: QuoteFundsClient;
  readonly futures: QuoteFuturesClient;
  readonly options: QuoteOptionsClient;
  readonly stock: QuoteStockClient;
  readonly warrants: QuoteWarrantsClient;

  constructor(private readonly client: TigerClient) {
    this.common = createQuoteCommonClient(client);
    this.crypto = createQuoteCryptoClient(client);
    this.funds = createQuoteFundsClient(client);
    this.futures = createQuoteFuturesClient(client);
    this.options = createQuoteOptionsClient(client);
    this.stock = createQuoteStockClient(client);
    this.warrants = createQuoteWarrantsClient(client);
  }
}

export function createQuoteClient(client: TigerClient): QuoteClient {
  return new QuoteClient(client);
}
