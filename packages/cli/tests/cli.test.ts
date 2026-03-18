import { describe, expect, it } from 'vitest';

import { createProgram } from '../src/cli.ts';

describe('tiger-openapi-cli command map', () => {
  it('registers all order subcommands', () => {
    const program = createProgram();
    const orderCommand = program.commands.find((command) => command.name() === 'order');

    expect(orderCommand).toBeDefined();
    expect(orderCommand?.commands.map((command) => command.name())).toEqual([
      'place',
      'query',
      'modify',
      'open',
      'cancelled',
      'filled',
      'preview',
      'transactions',
      'contract',
      'contracts',
      'derivative-contracts',
      'cancel',
    ]);
  });

  it('exposes key options for new order commands', () => {
    const program = createProgram();
    const orderCommand = program.commands.find((command) => command.name() === 'order');
    const transactionsCommand = orderCommand?.commands.find(
      (command) => command.name() === 'transactions'
    );
    const previewCommand = orderCommand?.commands.find((command) => command.name() === 'preview');

    expect(transactionsCommand?.options.map((option) => option.flags)).toEqual(
      expect.arrayContaining([
        '--order_id <order_id>',
        '--limit <limit>',
        '--page_token <page_token>',
      ])
    );
    expect(previewCommand?.options.map((option) => option.flags)).toEqual(
      expect.arrayContaining(['--action <action>', '--order_type <order_type>'])
    );
  });
});
