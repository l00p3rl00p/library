# OTel Neuron Connector (standalone, 0.1.0)

A small reusable emission seam. **Not** an OpenTelemetry Collector, DSH plugin, exporter, routing service, or database.

## Usage

```ts
import { createTelemetry } from 'otel-neuron-connector';
const telemetry = createTelemetry(existingReporter);
await telemetry.emit({producer:'soup', name:'trajectory.drift', kind:'drift', attributes:{kl:0.34}});
```

`existingReporter` is a native reporter that exposes `emit({eventName, body?, timestamp, attributes})`; it owns the actual export and transport. Framework-specific integrations supply their compatible reporter. This library does not import or depend on DSH. `createMemoryEmitter` provides real in-process delivery and tests.

## Contract

- Emits structured named events using one call.
- Does not initialize a second SDK or Collector.
- Does not claim ClickHouse persistence: successful emission means only the supplied reporter's `emit` resolved.
- Exposes emission counts, latest result, and failures.
- Independently versioned; a DSH plugin may consume a tested release.

## Verify

`npm test` builds TypeScript and runs Node tests.
`node examples/standalone.mjs` demonstrates local event delivery.
`python test/marimo_equivalent.py` executes the notebook's test logic.
`marimo edit notebooks/library_smoke.py` opens the experiment in a configured Marimo Studio environment.
`npm pack --dry-run` checks package contents.

## Evidence and limits

Version 0.1.0 passes three local Node tests and the Python-to-Node boundary test. The Marimo UI and live OTel Collector → ClickHouse delivery have not been verified. Those are separate future integration gates, not claims of this release.
