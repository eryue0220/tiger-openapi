import type { PbCodec, PbEnvelope, TickCompressionAdapter } from './types.js';

export class PbCodecRegistry {
  private readonly codecs = new Map<string, PbCodec>();

  register<TDecoded>(type: string, codec: PbCodec<TDecoded>): this {
    this.codecs.set(type, codec as PbCodec);
    return this;
  }

  decode<TDecoded>(envelope: PbEnvelope): TDecoded {
    const codec = this.codecs.get(envelope.type);
    if (!codec) {
      throw new Error(`No protobuf codec registered for message type "${envelope.type}"`);
    }

    return codec.decode(envelope.payload) as TDecoded;
  }
}

export function decodeTickPayload(
  payload: Uint8Array,
  adapter?: TickCompressionAdapter
): Uint8Array {
  return adapter ? adapter.decompress(payload) : payload;
}
