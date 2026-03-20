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

  it('exposes option query args that map to core quote.options APIs', () => {
    const program = createProgram();
    const optionsCommand = program.commands.find((command) => command.name() === 'options');

    expect(optionsCommand).toBeDefined();
    expect(optionsCommand?.options.map((option) => option.flags)).toEqual(
      expect.arrayContaining([
        '-s, --symbol <symbol>',
        '-e, --expiry <expiry>',
        '-m, --market <market>',
        '-r, --right <right>',
        '--strike <strike>',
        '--return_greek_value <return_greek_value>',
      ])
    );
  });
});
