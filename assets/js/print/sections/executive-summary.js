(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(
      require('../../print-sections.js'),
      require('../models/executive-summary-model.js')
    );
  } else {
    root.CoverageFitPrintSections = root.CoverageFitPrintSections || {};
    root.CoverageFitPrintSections['executive-summary'] = factory(
      root.CoverageFitPrintSectionRegistry,
      root.CoverageFitExecutiveSummaryModel
    );
  }
})(typeof window !== 'undefined' ? window : globalThis, function (registry, executiveSummaryModel) {
  'use strict';

  if (!executiveSummaryModel || typeof executiveSummaryModel.create !== 'function') {
    throw new Error('CoverageFit Executive Summary Model is required.');
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function formatDate(value) {
    if (!value) return 'Date not available';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return escapeHtml(value);
    return new Intl.DateTimeFormat('en-US', {
      month: 'long', day: 'numeric', year: 'numeric'
    }).format(date);
  }

  function scoreBand(value) {
    if (!Number.isFinite(value)) return { label: 'Not scored', className: 'unscored' };
    if (value >= 85) return { label: 'Well Prepared', className: 'strong' };
    if (value >= 70) return { label: 'Strong Foundation', className: 'good' };
    if (value >= 50) return { label: 'Review Recommended', className: 'review' };
    return { label: 'Several Areas to Review', className: 'priority' };
  }

  function renderList(items, emptyMessage, className) {
    const values = Array.isArray(items) ? items.filter(Boolean) : [];
    if (!values.length) {
      return `<p class="cf-exec-empty">${escapeHtml(emptyMessage)}</p>`;
    }
    return `<ol class="${className}">${values.map((item, index) => (
      `<li><span class="cf-exec-list-number">${index + 1}</span><span>${escapeHtml(item)}</span></li>`
    )).join('')}</ol>`;
  }

  function renderStrengths(items) {
    const values = Array.isArray(items) ? items.filter(Boolean) : [];
    if (!values.length) return '';
    return `<div class="cf-exec-strengths" aria-label="Coverage strengths">${values.map(item => (
      `<span class="cf-exec-strength">${escapeHtml(item)}</span>`
    )).join('')}</div>`;
  }

  const section = Object.freeze({
    id: 'executive-summary',
    name: 'Executive Summary',
    version: '1.2.0',
    order: 10,
    requiredPaths: Object.freeze([]),
    createModel(model) {
      return executiveSummaryModel.create(model);
    },
    shouldRender(model) {
      return executiveSummaryModel.hasContent(this.createModel(model));
    },
    emptyState: Object.freeze({ message: 'No executive summary data is available for this consultation.' }),
    render(model) {
      const sectionModel = this.createModel(model);
      const score = sectionModel.protectionScore.value;
      const band = scoreBand(score);
      const clientName = sectionModel.client.name || 'Client';
      const preparedBy = sectionModel.consultation.preparedBy || 'Dylan Haysbert';
      const agency = sectionModel.consultation.agency || 'Virginia Tam Insurance Agency';
      const summary = sectionModel.summary || 'This consultation snapshot highlights the strongest parts of the current protection plan and the areas worth reviewing together.';

      const html = `<section class="cf-print-section cf-executive-summary" aria-labelledby="cf-exec-title">
  <header class="cf-exec-masthead">
    <div>
      <p class="cf-exec-eyebrow">CoverageFit Consultation</p>
      <h1 id="cf-exec-title">${escapeHtml(sectionModel.consultation.title || 'Executive Summary')}</h1>
      <p class="cf-exec-client">Prepared for <strong>${escapeHtml(clientName)}</strong></p>
    </div>
    <div class="cf-exec-brand" aria-label="CoverageFit">CoverageFit<span>®</span></div>
  </header>

  <div class="cf-exec-context">
    <div><span>Property</span><strong>${escapeHtml(sectionModel.property.address || 'Address not available')}</strong></div>
    <div><span>Consultation date</span><strong>${formatDate(sectionModel.consultation.date)}</strong></div>
    <div><span>Prepared by</span><strong>${escapeHtml(preparedBy)}</strong><small>${escapeHtml(agency)}</small></div>
  </div>

  <div class="cf-exec-hero-grid">
    <article class="cf-exec-score-card cf-exec-score-${band.className}" aria-label="Protection Score">
      <p class="cf-exec-card-label">Protection Score</p>
      <div class="cf-exec-score-value"><strong>${Number.isFinite(score) ? escapeHtml(score) : '—'}</strong><span>${Number.isFinite(score) ? '/ 100' : ''}</span></div>
      <p class="cf-exec-score-band">${escapeHtml(sectionModel.protectionScore.status || band.label)}</p>
      <p class="cf-exec-score-note">A planning and review score, not an underwriting or eligibility decision.</p>
    </article>

    <article class="cf-exec-summary-card">
      <p class="cf-exec-card-label">Consultation overview</p>
      <h2>What this review is designed to accomplish</h2>
      <p>${escapeHtml(summary)}</p>
      ${renderStrengths(sectionModel.strengths)}
    </article>
  </div>

  <div class="cf-exec-action-grid">
    <article class="cf-exec-panel cf-exec-priorities">
      <div class="cf-exec-panel-heading">
        <span>01</span><div><p>Discussion priorities</p><h2>What we should review together</h2></div>
      </div>
      ${renderList(sectionModel.priorities, 'No priority items were identified.', 'cf-exec-priority-list')}
    </article>

    <article class="cf-exec-panel cf-exec-next-steps">
      <div class="cf-exec-panel-heading">
        <span>02</span><div><p>Recommended path</p><h2>Next steps</h2></div>
      </div>
      ${renderList(sectionModel.nextSteps, 'Next steps will be confirmed during the consultation.', 'cf-exec-next-list')}
    </article>
  </div>

  <footer class="cf-exec-footer-note">
    <strong>CoverageFit</strong> helps organize a professional coverage conversation. Final coverage availability, terms, and pricing remain subject to carrier underwriting and policy documentation.
  </footer>
</section>`;

      return Object.freeze({
        id: this.id,
        html,
        model: sectionModel,
        diagnostics: executiveSummaryModel.getDiagnostics(sectionModel)
      });
    }
  });

  if (registry && typeof registry.registerSection === 'function') {
    registry.registerSection(section.id, section, { replace: true });
  }

  return section;
});
