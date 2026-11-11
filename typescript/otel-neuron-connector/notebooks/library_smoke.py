"""Marimo experiment: test the compiled JS library using a real in-process consumer.

Run in Marimo Studio:
    marimo edit notebooks/library_smoke.py

Does not claim network, Collector, or ClickHouse delivery.
"""
import marimo
app = marimo.App(width="medium")

@app.cell
def _():
    import json
    import subprocess
    from pathlib import Path
    import marimo as mo
    return json, subprocess, Path, mo

@app.cell
def _(mo):
    mo.md("# OTel Neuron Connector — Working String 1\nObservation → Library → In-process emitter → Consumer")
    return

@app.cell
def _(Path, json, subprocess, mo):
    library_dir = Path(__file__).resolve().parents[1]
    js = """
    import { createTelemetry, createMemoryEmitter } from './dist/index.js';
    const received = [];
    const telemetry = createTelemetry(createMemoryEmitter(r => received.push(r)));
    const result = await telemetry.emit({producer:'marimo',name:'probe',kind:'event',attributes:{sequence:1}});
    console.log(JSON.stringify({result,received,status:telemetry.status()}));
    await telemetry.shutdown();
    """
    run = subprocess.run(['node','--input-type=module','-e',js], cwd=library_dir, capture_output=True, text=True, check=True)
    data = json.loads(run.stdout)
    assert data['result']['ok']
    assert len(data['received']) == 1
    assert data['received'][0]['attributes']['sequence'] == 1
    mo.md(f"**PASS:** {len(data['received'])} observation received; status: `{data['result']['state']}`")
    return data,

if __name__ == '__main__':
    app.run()
