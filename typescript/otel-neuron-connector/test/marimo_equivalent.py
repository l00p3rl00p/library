"""Executable equivalent of the Marimo notebook's Node boundary test."""
import json
import subprocess
from pathlib import Path
root=Path(__file__).resolve().parents[1]
js="""
import { createTelemetry, createMemoryEmitter } from './dist/index.js';
const received = [];
const telemetry = createTelemetry(createMemoryEmitter(r => received.push(r)));
const result = await telemetry.emit({producer:'marimo',name:'probe',kind:'event',attributes:{sequence:1}});
console.log(JSON.stringify({result,received,status:telemetry.status()}));
await telemetry.shutdown();
"""
r=subprocess.run(['node','--input-type=module','-e',js],cwd=root,capture_output=True,text=True,check=True)
d=json.loads(r.stdout)
assert d['result']['ok'] and len(d['received']) == 1 and d['received'][0]['attributes']['sequence'] == 1
print('Marimo notebook experiment logic: PASS (executed without Marimo UI)')
