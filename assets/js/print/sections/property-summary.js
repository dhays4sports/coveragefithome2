(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../../print-sections.js'), require('../models/property-summary-model.js'));
  } else {
    root.CoverageFitPrintSections = root.CoverageFitPrintSections || {};
    root.CoverageFitPrintSections['property-summary'] = factory(root.CoverageFitPrintSectionRegistry, root.CoverageFitPropertySummaryModel);
  }
})(typeof window !== 'undefined' ? window : globalThis, function (registry, propertySummaryModel) {
  'use strict';
  if (!propertySummaryModel || typeof propertySummaryModel.create !== 'function') throw new Error('CoverageFit Property Summary Model is required.');

  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
  }
  function display(value, fallback) { return value == null || value === '' ? fallback : escapeHtml(value); }
  function number(value) { return Number.isFinite(value) ? new Intl.NumberFormat('en-US').format(value) : 'Not available'; }
  function currency(value) { return Number.isFinite(value) ? new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(value) : 'Not available'; }
  function fact(label, value) { return `<div class="cf-property-fact"><dt>${escapeHtml(label)}</dt><dd>${value}</dd></div>`; }

  const section = Object.freeze({
    id: 'property-summary', name: 'Property Summary', version: '1.2.0', order: 20, requiredPaths: Object.freeze([]),
    createModel(model) { return propertySummaryModel.create(model); },
    shouldRender(model) { return propertySummaryModel.hasContent(this.createModel(model)); },
    emptyState: Object.freeze({ message: 'No property information is available for this consultation.' }),
    render(model) {
      const m = this.createModel(model);
      const address = m.property.address || [m.property.street,m.property.city,m.property.state,m.property.zip].filter(Boolean).join(', ');
      const risks = Array.isArray(m.riskHighlights) ? m.riskHighlights : [];
      const constructionFacts = [
        ['Year built', number(m.construction.yearBuilt)],
        ['Square feet', number(m.construction.squareFeet)],
        ['Stories', number(m.construction.stories)],
        ['Construction', display(m.construction.constructionType,'Not available')],
        ['Foundation', display(m.construction.foundationType,'Not available')],
        ['Roof', display(m.construction.roof,'Not available')]
      ];
      const coverageFacts = [
        ['Replacement cost', currency(m.coverage.replacementCost), 'Estimated structure rebuilding limit'],
        ['Deductible', currency(m.coverage.deductible), 'Current property deductible'],
        ['Current carrier', display(m.coverage.currentCarrier,'Not available'), 'Carrier recorded during review']
      ];
      const riskMarkup = risks.length
        ? `<ol class="cf-property-risk-list">${risks.map((item,index)=>`<li><span>${String(index+1).padStart(2,'0')}</span><p>${escapeHtml(item)}</p></li>`).join('')}</ol>`
        : '<div class="cf-property-empty"><strong>No specific risk highlights captured</strong><p>This does not mean the property has no exposures. It means no additional highlights were recorded in the current consultation snapshot.</p></div>';
      const html = `<section class="cf-print-section cf-property-summary" aria-labelledby="cf-property-title">
  <header class="cf-property-header">
    <div class="cf-property-heading-copy"><p class="cf-property-eyebrow">Property Profile</p><h1 id="cf-property-title">Property Summary</h1><p class="cf-property-address">${display(address,'Property address not available')}</p></div>
    <div class="cf-property-brand" aria-label="CoverageFit">CoverageFit<span>®</span><small>Consultation record</small></div>
  </header>
  <section class="cf-property-overview" aria-label="Property overview">
    <div><span>Residence type</span><strong>${display(m.construction.constructionType,'Not available')}</strong></div>
    <div><span>Built</span><strong>${number(m.construction.yearBuilt)}</strong></div>
    <div><span>Size</span><strong>${Number.isFinite(m.construction.squareFeet) ? number(m.construction.squareFeet) + ' sq. ft.' : 'Not available'}</strong></div>
    <div><span>Current carrier</span><strong>${display(m.coverage.currentCarrier,'Not available')}</strong></div>
  </section>
  <div class="cf-property-main-grid">
    <section class="cf-property-panel" aria-labelledby="cf-property-details-heading">
      <div class="cf-property-section-heading"><p>01</p><div><span>Property characteristics</span><h2 id="cf-property-details-heading">Construction and residence details</h2></div></div>
      <dl class="cf-property-grid">${constructionFacts.map(([label,value])=>fact(label,value)).join('')}</dl>
    </section>
    <section class="cf-property-panel cf-property-coverage-panel" aria-labelledby="cf-property-coverage-heading">
      <div class="cf-property-section-heading"><p>02</p><div><span>Recorded policy information</span><h2 id="cf-property-coverage-heading">Current coverage snapshot</h2></div></div>
      <dl class="cf-property-coverage-cards">${coverageFacts.map(([label,value,note])=>`<div class="cf-property-coverage-card"><dt>${escapeHtml(label)}</dt><dd>${value}</dd><small>${escapeHtml(note)}</small></div>`).join('')}</dl>
      <p class="cf-property-coverage-note">Coverage figures shown here reflect information captured during the consultation and should be confirmed against the current declarations page.</p>
    </section>
  </div>
  <section class="cf-property-panel cf-property-risks" aria-labelledby="cf-property-risks-heading">
    <div class="cf-property-section-heading"><p>03</p><div><span>Items for discussion</span><h2 id="cf-property-risks-heading">Property risk highlights</h2></div></div>
    ${riskMarkup}
  </section>
  <footer class="cf-property-footer"><p><strong>Purpose of this page:</strong> Establish a shared property profile before reviewing coverage recommendations.</p><p>CoverageFit · Confidential consultation material</p></footer>
</section>`;
      return Object.freeze({ id:this.id, html, model:m, diagnostics:propertySummaryModel.getDiagnostics(m) });
    }
  });
  if (registry && typeof registry.registerSection === 'function') registry.registerSection(section.id, section, { replace:true });
  return section;
});
