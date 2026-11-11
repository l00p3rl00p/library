/** Standalone OTel neuron connector; transport, Collector and storage are owned elsewhere. */
export type Attribute = string | number | boolean | null;
export type Observation = {
  producer: string;
  name: string;
  kind?: string;
  body?: string;
  timestamp?: number;
  attributes?: Record<string, Attribute>;
};
export type EmissionRecord = {
  eventName: string;
  body?: string;
  timestamp: number;
  attributes: Record<string, Attribute>;
};
export interface Emitter {
  emit(record: EmissionRecord): void | Promise<void>;
  shutdown?(signal?: unknown): void | Promise<void>;
}
export interface Receipt {
  ok: boolean;
  state: 'emitted' | 'failed';
  producer: string;
  name: string;
  timestamp: number;
  error?: string;
}
export interface TelemetryConfig {
  enabled?: boolean;
  defaultProducer?: string;
}
export interface Telemetry {
  emit(observation: Observation): Promise<Receipt>;
  status(): Readonly<{ enabled: boolean; emitted: number; failed: number; last?: Receipt }>;
  shutdown(signal?: unknown): Promise<void>;
}
function nonEmpty(value: string | undefined, field: string): string {
  if (!value || !value.trim()) throw new TypeError(`${field} must be a nonempty string`);
  return value;
}
function toRecord(item: Observation, defaultProducer?: string): EmissionRecord {
  const producer = nonEmpty(item.producer || defaultProducer, 'producer');
  const name = nonEmpty(item.name, 'name');
  const attributes: Record<string, Attribute> = { ...item.attributes, 'telemetry.producer': producer };
  if (item.kind) attributes['telemetry.kind'] = item.kind;
  return { eventName: name, body: item.body, timestamp: item.timestamp ?? Date.now(), attributes };
}
/** Create a shared, lightweight emission interface from a working native reporter. */
export function createTelemetry(emitter: Emitter, config: TelemetryConfig = {}): Telemetry {
  if (!emitter || typeof emitter.emit !== 'function') throw new TypeError('An emitter with emit(record) is required');
  const enabled = config.enabled !== false;
  let emitted = 0;
  let failed = 0;
  let last: Receipt | undefined;
  let closed = false;
  return {
    async emit(observation) {
      if (closed) throw new Error('Telemetry is shut down');
      const record = toRecord(observation, config.defaultProducer);
      const producer = String(record.attributes['telemetry.producer']);
      const receipt: Receipt = {ok: true, state: 'emitted', producer, name: record.eventName, timestamp: record.timestamp};
      if (!enabled) return { ...receipt, ok: false, state: 'failed', error: 'disabled' };
      try {
        await emitter.emit(record);
        emitted += 1;
        last = receipt;
        return receipt;
      } catch (error) {
        failed += 1;
        last = { ...receipt, ok: false, state: 'failed', error: String(error) };
        return last;
      }
    },
    status() { return { enabled: enabled && !closed, emitted, failed, ...(last && {last: {...last}}) }; },
    async shutdown(signal) {
      if (closed) return;
      closed = true;
      await emitter.shutdown?.(signal);
    }
  };
}
/** In-process observation sink for live local consumers and deterministic checks. */
export function createMemoryEmitter(onRecord: (record: EmissionRecord) => void | Promise<void>): Emitter {
  return { emit: onRecord };
}
