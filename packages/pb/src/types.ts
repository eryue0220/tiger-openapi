export interface PbEnvelope<TPayload = Uint8Array> {
  type: string;
  payload: TPayload;
}

export interface TickCompressionAdapter {
  decompress(payload: Uint8Array): Uint8Array;
}

export interface PbCodec<TDecoded = unknown> {
  decode(payload: Uint8Array): TDecoded;
  encode?(message: TDecoded): Uint8Array;
}
