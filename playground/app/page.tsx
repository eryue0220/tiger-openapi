'use client';

import JsonView from '@uiw/react-json-view';
import Image from 'next/image';
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

function normalizeOutput(value: unknown): Record<string, unknown> {
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value) as unknown;
      if (parsed && typeof parsed === 'object') {
        return parsed as Record<string, unknown>;
      }
      return { value: parsed };
    } catch {
      return { value };
    }
  }

  if (value && typeof value === 'object') {
    return value as Record<string, unknown>;
  }

  return { value };
}

export default function Home() {
  const [tigerId, setTigerId] = useState('');
  const [account, setAccount] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [market, setMarket] = useState<Market>('US');
  const [symbol, setSymbol] = useState('29145');
  const [action, setAction] = useState<ActionKey>('accountInfo');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<Record<string, unknown>>({
    message: 'Click Run to start.',
  });

  const canRun = useMemo(() => {
    return Boolean(tigerId.trim() && account.trim() && privateKey.trim()) && !loading;
  }, [account, loading, privateKey, tigerId]);
  const jsonViewStyle = useMemo(
    () =>
      ({
        '--w-rjv-font-family': 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
        '--w-rjv-color': 'hsl(var(--foreground))',
        '--w-rjv-key-string': 'hsl(var(--foreground))',
        '--w-rjv-background-color': 'transparent',
        '--w-rjv-line-color': 'hsl(var(--border) / 0.45)',
        '--w-rjv-arrow-color': 'hsl(var(--muted-foreground))',
        '--w-rjv-edit-color': 'hsl(var(--foreground))',
        '--w-rjv-info-color': 'hsl(var(--muted-foreground))',
        '--w-rjv-update-color': '#f59e0b',
        '--w-rjv-copied-color': 'hsl(var(--foreground))',
        '--w-rjv-copied-success-color': '#16a34a',
        '--w-rjv-curlybraces-color': '#38bdf8',
        '--w-rjv-colon-color': 'hsl(var(--foreground))',
        '--w-rjv-brackets-color': '#38bdf8',
        '--w-rjv-quotes-color': '#f59e0b',
        '--w-rjv-quotes-string-color': 'var(--w-rjv-type-string-color)',
        '--w-rjv-type-string-color': '#f59e0b',
        '--w-rjv-type-int-color': '#38bdf8',
        '--w-rjv-type-float-color': '#38bdf8',
        '--w-rjv-type-bigint-color': '#38bdf8',
        '--w-rjv-type-boolean-color': '#22c55e',
        '--w-rjv-type-date-color': '#a3b6cc',
        '--w-rjv-type-url-color': '#60a5fa',
        '--w-rjv-type-null-color': '#fb7185',
        '--w-rjv-type-nan-color': '#fb7185',
        '--w-rjv-type-undefined-color': '#a3b6cc',
      }) as React.CSSProperties,
    []
  );

  const runAction = async () => {
    if (!canRun) {
      setOutput({ error: 'Please fill TIGER_ID / ACCOUNT / PRIVATE_KEY first.' });
      return;
    }

    setLoading(true);
    setOutput({ status: 'Loading...' });

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

      setOutput(normalizeOutput(result));
    } catch (error) {
      setOutput({
        error: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl p-4 sm:p-6">
      <Card className="mx-auto mt-6 border-emerald-200/70 bg-white/78 shadow-xl shadow-cyan-300/20 backdrop-blur dark:border-amber-300/20 dark:bg-slate-900/72 dark:shadow-cyan-500/10">
        <CardHeader className="gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-start gap-3">
              <Image
                src="/tiger-openapi-icon.svg"
                alt="Tiger OpenAPI icon"
                width={40}
                height={40}
              />
              <div className="flex flex-col">
                <CardTitle className="text-2xl tracking-tight">Tiger OpenAPI Playground</CardTitle>
                <CardDescription>
                  Browser debugger for <code>tiger-openapi/browser</code>. Credentials stay in
                  memory only.
                </CardDescription>
              </div>
            </div>
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

          <div className="max-h-[460px] overflow-auto rounded-lg border border-emerald-200/70 bg-white/72 p-3 dark:border-amber-300/20 dark:bg-slate-950/80">
            <JsonView
              value={output}
              collapsed={1}
              displayDataTypes={false}
              displayObjectSize={false}
              enableClipboard
              shortenTextAfterLength={120}
              style={jsonViewStyle}
            />
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
