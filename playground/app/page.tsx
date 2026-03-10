'use client';

import { useMemo, useState } from 'react';
import { createTigerClient } from 'tiger-openapi/browser';

import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

type ActionKey =
  | 'accountInfo'
  | 'commonPermission'
  | 'stockMarketStatus'
  | 'optionSymbols'
  | 'scanner'
  | 'cryptoSymbols'
  | 'fundSymbols'
  | 'warrantBriefs'
  | 'futureExchanges';

type Market = 'US' | 'HK';

const ACTIONS: Array<{ key: ActionKey; label: string }> = [
  { key: 'accountInfo', label: 'account.getManagedAccounts' },
  { key: 'commonPermission', label: 'quote.common.getQuotePermission' },
  { key: 'stockMarketStatus', label: 'quote.stock.getMarketStatus' },
  { key: 'optionSymbols', label: 'quote.options.getOptionSymbols' },
  { key: 'scanner', label: 'quote.scanner.getScanner' },
  { key: 'cryptoSymbols', label: 'quote.crypto.getSymbols' },
  { key: 'fundSymbols', label: 'quote.funds.getFundSymbols' },
  { key: 'warrantBriefs', label: 'quote.warrants.getWarrantBriefs' },
  { key: 'futureExchanges', label: 'quote.futures.getFutureExchanges' },
];

export default function Home() {
  const [tigerId, setTigerId] = useState('');
  const [account, setAccount] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [market, setMarket] = useState<Market>('US');
  const [symbol, setSymbol] = useState('29145');
  const [action, setAction] = useState<ActionKey>('accountInfo');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('Click Run to start.');

  const canRun = useMemo(() => {
    return Boolean(tigerId.trim() && account.trim() && privateKey.trim()) && !loading;
  }, [account, loading, privateKey, tigerId]);

  const runAction = async () => {
    if (!canRun) {
      setOutput('Please fill TIGER_ID / ACCOUNT / PRIVATE_KEY first.');
      return;
    }

    setLoading(true);
    setOutput('Loading...');

    try {
      const client = createTigerClient({
        tigerId: tigerId.trim(),
        account: account.trim(),
        privateKey: privateKey.trim(),
      });

      let result: unknown;
      switch (action) {
        case 'accountInfo':
          result = await client.account.getManagedAccounts({});
          break;
        case 'commonPermission':
          result = await client.quote.common.getQuotePermission();
          break;
        case 'stockMarketStatus':
          result = await client.quote.stock.getMarketStatus({ market });
          break;
        case 'optionSymbols':
          result = await client.quote.options.getOptionSymbols();
          break;
        case 'scanner':
          result = await client.quote.scanner.getScanner({ market, page: 1, page_size: 10 });
          break;
        case 'cryptoSymbols':
          result = await client.quote.crypto.getSymbols();
          break;
        case 'fundSymbols':
          result = await client.quote.funds.getFundSymbols();
          break;
        case 'warrantBriefs':
          result = await client.quote.warrants.getWarrantBriefs({
            symbols: [symbol.trim() || '29145'],
          });
          break;
        case 'futureExchanges':
          result = await client.quote.futures.getFutureExchanges();
          break;
        default:
          result = { message: `Unknown action: ${action as string}` };
      }

      setOutput(JSON.stringify(result, null, 2));
    } catch (error) {
      setOutput(
        JSON.stringify(
          {
            message: error instanceof Error ? error.message : String(error),
          },
          null,
          2
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl p-4 sm:p-6">
      <Card className="mx-auto mt-6 border-white/40 bg-white/75 shadow-xl backdrop-blur dark:border-white/10 dark:bg-slate-900/70">
        <CardHeader className="gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <CardTitle className="text-2xl tracking-tight">Tiger OpenAPI Playground</CardTitle>
            <CardDescription>
              Browser debugger for <code>tiger-openapi/browser</code>. Credentials stay in memory
              only.
            </CardDescription>
          </div>
          <ThemeToggle />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="tigerId">TIGER_ID</Label>
              <Input
                id="tigerId"
                value={tigerId}
                onChange={(e) => setTigerId(e.target.value)}
                placeholder="your tiger id"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="account">ACCOUNT</Label>
              <Input
                id="account"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                placeholder="your account"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="privateKey">PRIVATE_KEY</Label>
            <Textarea
              id="privateKey"
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
              placeholder="-----BEGIN PRIVATE KEY-----..."
              className="min-h-40"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
            <div className="space-y-2">
              <Label>ACTION</Label>
              <Select value={action} onValueChange={(value) => setAction(value as ActionKey)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose action" />
                </SelectTrigger>
                <SelectContent>
                  {ACTIONS.map((item) => (
                    <SelectItem key={item.key} value={item.key}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>MARKET</Label>
              <Select value={market} onValueChange={(value) => setMarket(value as Market)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="US">US</SelectItem>
                  <SelectItem value="HK">HK</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="symbol">SYMBOL</Label>
            <Input
              id="symbol"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              placeholder="29145"
            />
          </div>

          <Button type="button" onClick={runAction} disabled={!canRun} className="w-full md:w-auto">
            {loading ? 'Running...' : 'Run'}
          </Button>

          <pre className="max-h-[460px] overflow-auto rounded-lg border bg-slate-950 p-4 text-xs text-slate-100">
            {output}
          </pre>
        </CardContent>
      </Card>
    </main>
  );
}
