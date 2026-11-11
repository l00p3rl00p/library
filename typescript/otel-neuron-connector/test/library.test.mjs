import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createMemoryEmitter, createTelemetry } from '../dist/index.js';

test('one real event traverses the library and reaches subscribed in-memory consumer', async () => {
  const received = [];
  const telemetry = createTelemetry(createMemoryEmitter(r => received.push(r)));
  const receipt = await telemetry.emit({producer:'soup', name:'trajectory.drift', kind:'drift', attributes:{kl:0.34, threshold:0.2}});
  assert.equal(receipt.ok, true);
  assert.equal(received.length, 1);
  assert.equal(received[0].eventName, 'trajectory.drift');
  assert.equal(received[0].attributes['telemetry.producer'], 'soup');
  assert.equal(received[0].attributes.kl, 0.34);
  assert.deepEqual(telemetry.status().emitted, 1);
});
test('emission errors remain observable, not exceptions to producer', async () => {
  const telemetry = createTelemetry({ emit(){throw new Error('connection refused');} });
  const result = await telemetry.emit({producer:'acc',name:'fix.attempt'});
  assert.equal(result.ok,false);
  assert.match(result.error, /connection refused/);
  assert.equal(telemetry.status().failed, 1);
});
test('validation, disabled behavior and shutdown', async () => {
  const t=createTelemetry(createMemoryEmitter(()=>{}),{enabled:false});
  assert.equal((await t.emit({producer:'soup',name:'ping'})).ok, false);
  await assert.rejects(()=>t.emit({producer:'',name:''}), /producer/);
  await t.shutdown();
  await assert.rejects(()=>t.emit({producer:'soup',name:'ping'}), /shut down/);
});
