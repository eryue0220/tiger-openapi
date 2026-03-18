import { describe, expect, it } from 'vitest';
import {
  parseOptionalBoolean,
  parseOptionalNumber,
  parseOptionalStringArray,
} from '../src/utils.js';

describe('utils', () => {
  it('parses optional numbers', () => {
    expect(parseOptionalNumber(undefined)).toBeUndefined();
    expect(parseOptionalNumber('12.5')).toBe(12.5);
    expect(() => parseOptionalNumber('not-a-number')).toThrow('Invalid number value');
  });

  it('parses optional booleans', () => {
    expect(parseOptionalBoolean(undefined)).toBeUndefined();
    expect(parseOptionalBoolean('true')).toBe(true);
    expect(parseOptionalBoolean('false')).toBe(false);
    expect(() => parseOptionalBoolean('1')).toThrow('Invalid boolean value');
  });

  it('parses optional comma-separated strings', () => {
    expect(parseOptionalStringArray(undefined)).toBeUndefined();
    expect(parseOptionalStringArray('AAPL, TSLA ,  ')).toEqual(['AAPL', 'TSLA']);
  });
});
