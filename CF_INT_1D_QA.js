const fs = require('fs');
const assert = require('assert');
const root = __dirname;
const assessment = fs.readFileSync(`${root}/assessment/index.html`, 'utf8');
const prefill = fs.readFileSync(`${root}/assets/js/assessment-prefill.js`, 'utf8');
const engine = fs.readFileSync(`${root}/assets/js/assessment-engine.js`, 'utf8');

assert(assessment.includes('/assets/js/prefill-intake.js'));
assert(assessment.includes('/assets/js/assessment-prefill.js'));
assert(assessment.indexOf('/assets/js/assessment-prefill.js') < assessment.indexOf('/assets/js/property-confirmation.js'));
assert(prefill.includes("'homebuyer'"));
assert(prefill.includes("'renewal'"));
assert(prefill.includes("'premium-increase'"));
assert(prefill.includes('prefilled_pending_confirmation'));
assert(prefill.includes('if (PI && !existingProperty'));
assert(prefill.includes('coveragefit:assessment-prefill-ready'));
assert(engine.includes('reviewContext:window.CoverageFitAssessmentPrefill?.reviewContext'));
assert(engine.includes('prospectProfile:window.CoverageFitAssessmentPrefill?.profile'));
console.log('CF-INT-1D QA: 10/10 passed');
