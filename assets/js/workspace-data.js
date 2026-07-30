(function (root, factory) {
  'use strict';
  const api = factory(root);
  root.CoverageFitWorkspaceData = api;
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root.dispatchEvent && root.CustomEvent) {
    root.dispatchEvent(new root.CustomEvent('coveragefit:workspace-data-ready', {
      detail: { version: api.VERSION, schemaVersion: api.SCHEMA_VERSION }
    }));
  }
})(typeof window !== 'undefined' ? window : globalThis, function (root) {
  'use strict';

  const VERSION = '1.1.0';
  const SCHEMA_VERSION = '1.0';
  const REPORT_KEY = 'coveragefit_home_report';
  const PROPERTY_KEY = 'coveragefit_property_profile_v1';
  const PRODUCT = 'home';

  function clone(value) {
    if (value == null) return value;
    try { return JSON.parse(JSON.stringify(value)); } catch (_) { return null; }
  }

  function safeParse(value) {
    try { return value ? JSON.parse(value) : null; } catch (_) { return null; }
  }

  function storageGet(storage, key) {
    try { return storage && typeof storage.getItem === 'function' ? storage.getItem(key) : null; } catch (_) { return null; }
  }

  function readReport(options) {
    if (Object.prototype.hasOwnProperty.call(options, 'report')) return clone(options.report);
    const storage = options.storage || root.localStorage;
    return safeParse(storageGet(storage, REPORT_KEY));
  }

  function readPropertyProfile(report, options) {
    if (Object.prototype.hasOwnProperty.call(options, 'propertyProfile')) return clone(options.propertyProfile);
    if (report && report.propertyProfile) return clone(report.propertyProfile);
    try {
      const loaded = root.CoverageFitPropertyIntelligence?.load?.();
      if (loaded) return clone(loaded);
    } catch (_) {}
    const storage = options.storage || root.localStorage;
    return safeParse(storageGet(storage, PROPERTY_KEY));
  }

  function stringValue(value, fallback) {
    if (value === 0) return '0';
    if (typeof value === 'string' && value.trim()) return value.trim();
    if (typeof value === 'number' && Number.isFinite(value)) return String(value);
    return fallback || '';
  }

  function numberValue(value) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  function scoreStatus(score, suppliedStatus) {
    if (stringValue(suppliedStatus)) return stringValue(suppliedStatus);
    if (score == null) return 'Review Summary';
    if (score >= 85) return 'Well Prepared';
    if (score >= 70) return 'Strong Foundation';
    if (score >= 50) return 'Review Recommended';
    return 'Several Areas to Review';
  }

  function fullName(report) {
    return stringValue(
      report?.consumer?.name ||
      [report?.consumer?.firstName, report?.consumer?.lastName].filter(Boolean).join(' ') ||
      report?.profile?.name ||
      [report?.profile?.firstName, report?.profile?.lastName].filter(Boolean).join(' ') ||
      report?.firstName,
      'Not provided'
    );
  }

  function normalizeRecommendation(item, index) {
    const evidence = Array.isArray(item?.supportingAnswers)
      ? item.supportingAnswers
      : Array.isArray(item?.evidence) ? item.evidence : [];
    return {
      id: stringValue(item?.ruleId || item?.id || item?.tag || item?.category, `topic-${index + 1}`),
      order: index + 1,
      title: stringValue(item?.name || item?.title || item?.tag || item?.category, 'Protection topic'),
      category: stringValue(item?.category || item?.tag, 'General review'),
      priority: stringValue(item?.priority || item?.impactLabel || item?.impact, 'Review topic'),
      confidence: numberValue(item?.confidence),
      explanation: stringValue(
        item?.clientExplanation || item?.insight || item?.whyMatters,
        'This answer created a useful topic to confirm during the licensed review.'
      ),
      conversationStarter: stringValue(
        item?.conversationStarter || item?.discussionQuestion,
        'Can we confirm how this topic is addressed by the current policy?'
      ),
      producerNotes: stringValue(item?.producerNotes || item?.agentNotes, ''),
      evidence: evidence.filter(Boolean).map(String),
      source: clone(item)
    };
  }

  function recommendationSource(report) {
    if (Array.isArray(report?.recommendations) && report.recommendations.length) return report.recommendations;
    if (Array.isArray(report?.priorities)) return report.priorities;
    return [];
  }

  function readPropertyField(profile, aliases) {
    const sources = [profile?.data, profile?.fields, profile].filter(Boolean);
    for (const source of sources) {
      for (const key of aliases) {
        const candidate = source[key];
        if (candidate && typeof candidate === 'object' && Object.prototype.hasOwnProperty.call(candidate, 'value')) return candidate.value;
        if (candidate !== undefined && candidate !== null && candidate !== '') return candidate;
      }
    }
    return null;
  }

  function propertyAddress(profile) {
    const address = profile?.address || profile?.normalizedAddress;
    if (typeof address === 'string') return address.trim();
    if (address && typeof address === 'object') {
      return stringValue(address.formatted) || [
        address.line1 || address.street,
        address.line2,
        address.city,
        [address.state, address.postalCode || address.zip].filter(Boolean).join(' ')
      ].filter(Boolean).join(', ');
    }
    return stringValue(readPropertyField(profile, ['address', 'propertyAddress']));
  }

  function propertyConfirmation(profile) {
    if (!profile) return { label: 'No property profile saved', verifiedCount: 0, requiresConfirmation: true };
    const meta = profile.fieldMeta || profile.fields || {};
    const rows = Object.values(meta).filter(value => value && typeof value === 'object');
    const verifiedCount = rows.filter(value => value.verifiedByUser).length;
    if (verifiedCount) return {
      label: `${verifiedCount} field${verifiedCount === 1 ? '' : 's'} customer-confirmed`,
      verifiedCount,
      requiresConfirmation: false
    };
    if (profile.verifiedByUser) return { label: 'Customer-confirmed', verifiedCount: 1, requiresConfirmation: false };
    return { label: 'Property details require confirmation', verifiedCount: 0, requiresConfirmation: true };
  }

  function normalizeProperty(profile) {
    const confirmation = propertyConfirmation(profile);
    return {
      available: Boolean(profile),
      address: propertyAddress(profile),
      yearBuilt: readPropertyField(profile, ['yearBuilt', 'year_built']),
      livingArea: readPropertyField(profile, ['squareFeet', 'livingArea', 'sqft']),
      stories: readPropertyField(profile, ['stories']),
      construction: readPropertyField(profile, ['constructionType', 'construction']),
      roof: readPropertyField(profile, ['roofType', 'roof', 'roofYear']),
      foundation: readPropertyField(profile, ['foundationType', 'foundation']),
      pool: readPropertyField(profile, ['pool', 'hasPool']),
      detachedStructures: readPropertyField(profile, ['detachedStructures', 'hasDetachedStructures']),
      quality: clone(profile?.quality) || null,
      confirmation,
      source: clone(profile)
    };
  }

  function buildDiagnostics(report, property, recommendations) {
    const warnings = [];
    if (!report) warnings.push('No saved Home report was found.');
    if (report && numberValue(report.score) == null) warnings.push('The saved report does not contain a numeric Protection Score.');
    if (report && fullName(report) === 'Not provided') warnings.push('Customer name is not available in the saved report.');
    if (report && !recommendations.length) warnings.push('No recommendation topics are available in the saved report.');
    if (report && !property.available) warnings.push('No Property Intelligence profile is available.');
    return {
      isReady: Boolean(report),
      hasReport: Boolean(report),
      hasProperty: property.available,
      recommendationCount: recommendations.length,
      warnings
    };
  }

  function getSnapshot(options) {
    const settings = options || {};
    const report = readReport(settings);
    if (!report || typeof report !== 'object' || !Object.keys(report).length) {
      return {
        schemaVersion: SCHEMA_VERSION,
        adapterVersion: VERSION,
        product: PRODUCT,
        state: 'empty',
        generatedAt: new Date().toISOString(),
        source: { reportKey: REPORT_KEY, propertyKey: PROPERTY_KEY, reportVersion: null },
        customer: { name: 'Not provided', firstName: '', lastName: '', email: '', phone: '', propertyAddress: '', reviewContext: '' },
        integration: { source: '', campaign: '', entry: '', sessionId: '', prefilled: false },
        assessment: { createdAt: null, score: null, status: 'Review Summary', strongest: '', topPriority: '' },
        strengths: [],
        recommendations: [],
        property: normalizeProperty(readPropertyProfile(null, settings)),
        executiveSummary: '',
        diagnostics: { isReady: false, hasReport: false, hasProperty: false, recommendationCount: 0, warnings: ['No saved Home report was found.'] }
      };
    }

    const property = normalizeProperty(readPropertyProfile(report, settings));
    const recommendations = recommendationSource(report).slice(0, 20).map(normalizeRecommendation);
    const strengths = Array.isArray(report.strengths) ? report.strengths.filter(Boolean).map(String) : [];
    const score = numberValue(report.score);
    const primaryTopic = recommendations[0]?.title || stringValue(report.topPriority, 'the customer’s current policy details');
    const primaryStrength = strengths[0] || stringValue(report.strongest, 'completion of a structured protection review');
    const executiveSummary = stringValue(report.executiveSummary) ||
      `Begin with ${primaryTopic}, while recognizing ${primaryStrength}. Use the consultation to confirm limits, deductibles, endorsements, exclusions, and current household details against the issued policy.`;

    const snapshot = {
      schemaVersion: SCHEMA_VERSION,
      adapterVersion: VERSION,
      product: stringValue(report.assessment, PRODUCT),
      state: 'ready',
      generatedAt: new Date().toISOString(),
      source: {
        reportKey: REPORT_KEY,
        propertyKey: PROPERTY_KEY,
        reportVersion: stringValue(report.version) || null
      },
      customer: {
        name: fullName(report),
        firstName: stringValue(report?.consumer?.firstName || report?.prospectProfile?.firstName || report?.profile?.firstName),
        lastName: stringValue(report?.consumer?.lastName || report?.prospectProfile?.lastName || report?.profile?.lastName),
        email: stringValue(report?.consumer?.email || report?.prospectProfile?.email || report?.profile?.email),
        phone: stringValue(report?.consumer?.phone || report?.prospectProfile?.phone || report?.profile?.phone),
        propertyAddress: stringValue(report?.consumer?.propertyAddress || report?.prospectProfile?.propertyAddress || property.address),
        reviewContext: stringValue(report?.consumer?.reviewContext || report?.reviewContext || report?.prospectProfile?.reviewContext)
      },
      integration: {
        source: stringValue(report?.integration?.source || report?.attribution?.source),
        campaign: stringValue(report?.integration?.campaign || report?.attribution?.campaign),
        entry: stringValue(report?.integration?.entry || report?.attribution?.entry),
        sessionId: stringValue(report?.integration?.sessionId || report?.attribution?.sessionId),
        prefilled: Boolean(report?.integration?.prefilled || report?.prospectProfile)
      },
      assessment: {
        createdAt: stringValue(report.createdAt) || null,
        score,
        status: scoreStatus(score, report.status),
        strongest: primaryStrength,
        topPriority: primaryTopic,
        trigger: stringValue(report.trigger),
        categories: clone(report.categories) || {}
      },
      strengths,
      recommendations,
      property,
      executiveSummary,
      attribution: clone(report.attribution),
      diagnostics: null
    };
    snapshot.diagnostics = buildDiagnostics(report, property, recommendations);
    return snapshot;
  }

  function subscribe(callback) {
    if (typeof callback !== 'function' || !root.addEventListener) return function () {};
    const handler = event => {
      if (!event || event.key === REPORT_KEY || event.key === PROPERTY_KEY || event.type === 'coveragefit:workspace-data-refresh') {
        callback(getSnapshot(), event);
      }
    };
    root.addEventListener('storage', handler);
    root.addEventListener('coveragefit:workspace-data-refresh', handler);
    return function unsubscribe() {
      root.removeEventListener('storage', handler);
      root.removeEventListener('coveragefit:workspace-data-refresh', handler);
    };
  }

  return Object.freeze({
    VERSION,
    SCHEMA_VERSION,
    REPORT_KEY,
    PROPERTY_KEY,
    getSnapshot,
    subscribe
  });
});
