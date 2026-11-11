import {createTelemetry,createMemoryEmitter} from '../dist/index.js';
const receiver = createMemoryEmitter(record => console.log(JSON.stringify(record)));
const telemetry = createTelemetry(receiver);
console.log(await telemetry.emit({producer:'example',name:'hello',kind:'event',attributes:{ok:true}}));
await telemetry.shutdown();
