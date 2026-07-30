const fs=require('fs');
const path='assets/js/assessment-engine.js';
const s=fs.readFileSync(path,'utf8');
const tests=[
 ['consumer firstName',/p\.consumer=\{firstName:/],
 ['consumer lastName',/lastName:/],
 ['consumer propertyAddress',/propertyAddress:/],
 ['consumer reviewContext',/reviewContext:p\.reviewContext/],
 ['integration payload',/integration,trigger:/],
 ['integration source fallback',/source:p\.integration\?\.source\|\|p\.attribution\?\.source/],
 ['integration session id',/sessionId:p\.integration\?\.sessionId/],
 ['backward compatible name',/name:enteredName/],
 ['backward compatible detail',/detail,propertyAddress/],
 ['prospect profile retained',/prospectProfile:prospect/],
 ['prefilled boolean',/prefilled:Boolean\(prospect/]
];
let failed=0;for(const [name,re] of tests){const ok=re.test(s);console.log(`${ok?'PASS':'FAIL'} ${name}`);if(!ok)failed++;}
if(failed)process.exit(1);console.log(`CF-INT-1F: ${tests.length}/${tests.length} passed`);
