import protobuf from 'protobufjs';
import { TigerStreamError } from 'tiger-openapi-shared';

import type { EncodedStreamMessage, StreamDecoder, StreamSubscriptionEncoder } from './types.js';

const tigerPushProto = `
syntax = "proto3";

enum Command {
  UNKNOWN = 0;
  CONNECT = 1;
  CONNECTED = 2;
  SEND = 3;
  SUBSCRIBE = 4;
  UNSUBSCRIBE = 5;
  DISCONNECT = 6;
  MESSAGE = 7;
  HEARTBEAT = 8;
  ERROR = 9;
}

enum DataType {
  Unknown = 0;
  Quote = 1;
  Option = 2;
  Future = 3;
  QuoteDepth = 4;
  TradeTick = 5;
  Asset = 6;
  Position = 7;
  OrderStatus = 8;
  OrderTransaction = 9;
  StockTop = 10;
  OptionTop = 11;
  Kline = 12;
  Cc = 13;
}

enum QuoteType {
  None = 0;
  BASIC = 1;
  BBO = 2;
  ALL = 3;
}

message ConnectBody {
  string tigerId = 1;
  string sign = 2;
  string sdkVersion = 3;
  string acceptVersion = 4;
  uint32 sendInterval = 5;
  uint32 receiveInterval = 6;
  bool useFullTick = 7;
}

message SubscribeBody {
  DataType dataType = 1;
  string symbols = 2;
  string account = 3;
  string market = 4;
}

message Request {
  Command command = 1;
  uint32 id = 2;
  SubscribeBody subscribe = 3;
  ConnectBody connect = 4;
}

message PushData {
  DataType dataType = 1;
  bytes rawData = 2;
}

message Response {
  Command command = 1;
  uint32 id = 2;
  int32 code = 3;
  string msg = 4;
  PushData body = 5;
}
`;

const root = protobuf.parse(tigerPushProto).root;
const RequestType = root.lookupType('Request');
const ResponseType = root.lookupType('Response');

const Command = {
  CONNECT: 1,
  CONNECTED: 2,
  SUBSCRIBE: 4,
  UNSUBSCRIBE: 5,
  HEARTBEAT: 8,
} as const;

const DataType = {
  Quote: 1,
  Option: 2,
  Future: 3,
  QuoteDepth: 4,
  TradeTick: 5,
  Asset: 6,
  Position: 7,
  OrderStatus: 8,
  OrderTransaction: 9,
  StockTop: 10,
  OptionTop: 11,
  Kline: 12,
  Cc: 13,
} as const;

type TigerPushDataType = keyof typeof DataType;

const TOPIC_TO_DATA_TYPE: Record<string, TigerPushDataType> = {
  quote: 'Quote',
  option: 'Option',
  future: 'Future',
  quotedepth: 'QuoteDepth',
  depth: 'QuoteDepth',
  tradetick: 'TradeTick',
  tick: 'TradeTick',
  kline: 'Kline',
  cc: 'Cc',
  crypto: 'Cc',
};

const DATA_TYPE_TO_TOPIC: Record<number, string> = {
  [DataType.Quote]: 'quote',
  [DataType.Option]: 'option',
  [DataType.Future]: 'future',
  [DataType.QuoteDepth]: 'quoteDepth',
  [DataType.TradeTick]: 'tradeTick',
  [DataType.Kline]: 'kline',
  [DataType.Cc]: 'cc',
};

let requestId = 1;
function nextRequestId(): number {
  const current = requestId;
  requestId += 1;
  if (requestId > 0x7fffffff) {
    requestId = 1;
  }
  return current;
}

function ensureBytes(data: string | ArrayBuffer | ArrayBufferView): Uint8Array {
  if (typeof data === 'string') {
    return new TextEncoder().encode(data);
  }

  if (data instanceof ArrayBuffer) {
    return new Uint8Array(data);
  }

  if (ArrayBuffer.isView(data)) {
    return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
  }

  throw new TigerStreamError('Unsupported binary payload type');
}

function encodeRequest(payload: Record<string, unknown>): Uint8Array {
  const message = RequestType.create(payload);
  return RequestType.encode(message).finish();
}

function parseTopic(topic: string): { dataType: number; symbols?: string } {
  const [prefixRaw, suffixRaw] = topic.includes(':') ? topic.split(':', 2) : topic.split('.', 2);
  const prefix = prefixRaw?.trim().toLowerCase();
  const suffix = suffixRaw?.trim();

  const dataTypeName = prefix ? TOPIC_TO_DATA_TYPE[prefix] : undefined;
  if (!dataTypeName) {
    throw new TigerStreamError(`Unsupported stream topic "${topic}"`);
  }

  return {
    dataType: DataType[dataTypeName],
    symbols: suffix || undefined,
  };
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const out = new Uint8Array(bytes.byteLength);
  out.set(bytes);
  return out.buffer;
}

export interface TigerPushProtocolOptions {
  tigerId: string;
  sign: string;
  sdkVersion?: string;
  acceptVersion?: string;
  sendIntervalMs?: number;
  receiveIntervalMs?: number;
  useFullTick?: boolean;
}

export function createTigerPushSubscriptionEncoder(): StreamSubscriptionEncoder {
  return {
    encodeSubscribe: (topic) => {
      const { dataType, symbols } = parseTopic(topic);
      const payload = encodeRequest({
        command: Command.SUBSCRIBE,
        id: nextRequestId(),
        subscribe: {
          dataType,
          symbols,
        },
      });

      return { topic, payload };
    },
    encodeUnsubscribe: (topic) => {
      const { dataType, symbols } = parseTopic(topic);
      const payload = encodeRequest({
        command: Command.UNSUBSCRIBE,
        id: nextRequestId(),
        subscribe: {
          dataType,
          symbols,
        },
      });

      return { topic, payload };
    },
  };
}

export function createTigerPushConnectMessage(
  options: TigerPushProtocolOptions
): EncodedStreamMessage {
  const payload = encodeRequest({
    command: Command.CONNECT,
    id: nextRequestId(),
    connect: {
      tigerId: options.tigerId,
      sign: options.sign,
      sdkVersion: options.sdkVersion ?? 'OpenApiJs/0.0.1',
      acceptVersion: options.acceptVersion ?? '3',
      sendInterval: options.sendIntervalMs ?? 10_000,
      receiveInterval: options.receiveIntervalMs ?? 10_000,
      useFullTick: options.useFullTick ?? false,
    },
  });

  return {
    topic: '__control__:connect',
    payload,
  };
}

export function createTigerPushHeartbeatMessage(): EncodedStreamMessage {
  return {
    topic: '__control__:heartbeat',
    payload: encodeRequest({
      command: Command.HEARTBEAT,
      id: nextRequestId(),
    }),
  };
}

export const tigerPushConnectAckTopic = '__control__:connected';

export function createTigerPushDecoder(): StreamDecoder {
  return async (event) => {
    const bytes = ensureBytes(event.data as string | ArrayBuffer | ArrayBufferView);
    const response = ResponseType.decode(bytes);
    const body = ResponseType.toObject(response, {
      longs: Number,
      enums: Number,
    }) as {
      command?: number;
      code?: number;
      msg?: string;
      body?: {
        dataType?: number;
      };
    };

    if (body.command === Command.CONNECTED) {
      return {
        topic: tigerPushConnectAckTopic,
        payload: body,
      };
    }

    const dataType = body.body?.dataType;
    if (typeof dataType === 'number') {
      const topicPrefix = DATA_TYPE_TO_TOPIC[dataType] ?? `type-${dataType}`;
      return {
        topic: topicPrefix,
        payload: body,
      };
    }

    return {
      topic: '__control__:message',
      payload: body,
    };
  };
}

export function encodeVarintFrame(payload: string | ArrayBuffer | ArrayBufferView): Uint8Array {
  const body = ensureBytes(payload);
  let value = body.length >>> 0;
  const header: number[] = [];

  do {
    const bits = value & 0x7f;
    value >>>= 7;
    header.push(value ? bits | 0x80 : bits);
  } while (value);

  const out = new Uint8Array(header.length + body.length);
  out.set(header, 0);
  out.set(body, header.length);
  return out;
}

export class VarintFrameReader {
  private buffer = new Uint8Array(0);

  push(chunk: ArrayBuffer | ArrayBufferView, onFrame: (frame: ArrayBuffer) => void): void {
    const incoming = ensureBytes(chunk as ArrayBuffer | ArrayBufferView);
    const next = new Uint8Array(this.buffer.length + incoming.length);
    next.set(this.buffer, 0);
    next.set(incoming, this.buffer.length);
    this.buffer = next;

    let offset = 0;
    while (offset < this.buffer.length) {
      let value = 0;
      let shift = 0;
      let headerBytes = 0;
      let complete = false;

      while (offset + headerBytes < this.buffer.length) {
        const b = this.buffer[offset + headerBytes];
        value |= (b & 0x7f) << shift;
        headerBytes += 1;
        if ((b & 0x80) === 0) {
          complete = true;
          break;
        }
        shift += 7;
      }

      if (!complete) {
        break;
      }

      const frameStart = offset + headerBytes;
      const frameEnd = frameStart + value;
      if (frameEnd > this.buffer.length) {
        break;
      }

      const frame = this.buffer.subarray(frameStart, frameEnd);
      onFrame(toArrayBuffer(frame));
      offset = frameEnd;
    }

    this.buffer = this.buffer.subarray(offset);
  }
}
