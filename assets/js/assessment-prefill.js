(() => {
  'use strict';

  const PROFILE_KEY = 'coveragefit_prospect_profile_v1';
  const PROPERTY_KEY = 'coveragefit_property_profile_v1';
  const TRIGGER_KEY = 'coveragefit_trigger';
  const CONTEXT_KEY = 'coveragefit_review_context_v1';

  const clean = (value, max = 220) => String(value || '').trim().replace(/[<>\u0000-\u001F\u007F]/g, '').slice(0, max);
  const readJson = (storage, key) => {
    try { return JSON.parse(storage.getItem(key) || 'null'); } catch (_) { return null; }
  };
  const writeJson = (storage, key, value) => {
    try { storage.setItem(key, JSON.stringify(value)); return true; } catch (_) { return false; }
  };

  const getProfile = () => window.CoverageFitPrefill?.get?.()
    || readJson(sessionStorage, PROFILE_KEY)
    || readJson(localStorage, PROFILE_KEY)
    || null;

  const normalizeContext = value => clean(value, 120).toLowerCase().replace(/[_]+/g, ' ').replace(/\s+/g, ' ');
  const triggerFor = value => {
    const context = normalizeContext(value);
    if (!context) return '';
    if (/buying|purchas|new home|homebuyer/.test(context)) return 'homebuyer';
    if (/renew/.test(context)) return 'renewal';
    if (/premium|rate increase|price increase/.test(context)) return 'premium-increase';
    if (/remodel|renovat/.test(context)) return 'remodel';
    if (/family|baby|child/.test(context)) return 'new-family';
    if (/rental|landlord/.test(context)) return 'landlord';
    return '';
  };

  const profile = getProfile();
  if (!profile) {
    window.CoverageFitAssessmentPrefill = { applied: false, profile: null, reviewContext: '', trigger: '' };
    return;
  }

  const reviewContext = clean(profile.reviewContext, 120);
  const trigger = triggerFor(reviewContext);
  if (reviewContext) {
    writeJson(sessionStorage, CONTEXT_KEY, { value: reviewContext, receivedAt: profile.receivedAt || new Date().toISOString() });
  }
  if (trigger) {
    try { sessionStorage.setItem(TRIGGER_KEY, trigger); } catch (_) {}
  }

  const PI = window.CoverageFitPropertyIntelligence;
  const existingProperty = PI?.load?.() || readJson(localStorage, PROPERTY_KEY) || readJson(sessionStorage, PROPERTY_KEY);
  let propertySeeded = false;
  const sourceAddress = profile.address || {};
  const formatted = clean(profile.propertyAddress || sourceAddress.formattedAddress, 220);
  const addressInput = {
    formatted,
    line1: clean(sourceAddress.street, 180),
    city: clean(sourceAddress.city, 100),
    state: clean(sourceAddress.state, 2).toUpperCase(),
    postalCode: clean(sourceAddress.postalCode, 10),
    county: clean(sourceAddress.county, 100),
    country: clean(sourceAddress.country || 'US', 2).toUpperCase(),
    providerPlaceId: clean(sourceAddress.placeId, 180)
  };

  if (PI && !existingProperty && (addressInput.formatted || addressInput.line1 || addressInput.postalCode)) {
    const seeded = PI.createProfile({
      address: addressInput,
      provider: { id: '408farmers-prefill', name: '408FARMERS intake', defaultConfidence: 0.9 },
      status: 'prefilled_pending_confirmation'
    });
    PI.save(seeded);
    try { sessionStorage.setItem(PROPERTY_KEY, JSON.stringify(seeded)); } catch (_) {}
    propertySeeded = true;
  }

  window.CoverageFitAssessmentPrefill = {
    applied: true,
    profile,
    reviewContext,
    trigger,
    propertySeeded,
    getReviewContext: () => reviewContext
  };

  try {
    window.dispatchEvent(new CustomEvent('coveragefit:assessment-prefill-ready', {
      detail: {
        applied: true,
        hasReviewContext: Boolean(reviewContext),
        trigger,
        propertySeeded,
        source: profile.integration?.source || ''
      }
    }));
  } catch (_) {}
})();
