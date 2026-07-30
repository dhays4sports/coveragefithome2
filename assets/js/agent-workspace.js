(function () {
  'use strict';

  if (typeof window.__CoverageFitAgentWorkspaceTeardown === 'function') {
    window.__CoverageFitAgentWorkspaceTeardown('reinitialize');
  }

  const byId = id => document.getElementById(id);
  const data = window.CoverageFitWorkspaceData;
  const planner = window.CoverageFitConversationPlanner;
  const checklistEngine = window.CoverageFitConsultationChecklist;
  let currentConversationPlan = null;
  let checklistShellState = 'loading';
  let lastAnnouncedChecklistSignature = '';
  let pendingFocusItemId = '';
  let pendingFocusTimelineItemId = '';
  let mobileSidebarPreference = null;
  let previousChecklistMotionState = new Map();
  let checklistHasRendered = false;
  let previousTimelineMotionState = new Map();
  let timelineHasRendered = false;
  let previousProgressMotionState = null;
  let workspaceHasRendered = false;
  let loadingExitTimer = null;
  let surfaceMotionTimer = null;
  let lastChecklistStructureSignature = '';
  let lastTimelineStructureSignature = '';
  let lastPropertySignature = '';
  let lastRecommendationSignature = '';
  let workspaceDisposed = false;
  let workspaceRenderInProgress = false;
  let headerScrolled = false;
  const lifecycleCleanups = [];
  const lifecycleStats = { listeners: 0, subscriptions: 0, teardowns: 0 };

  function registerCleanup(callback, type) {
    if (typeof callback !== 'function') return function () {};
    let active = true;
    lifecycleCleanups.push(() => {
      if (!active) return;
      active = false;
      callback();
      if (type === 'listener') lifecycleStats.listeners = Math.max(0, lifecycleStats.listeners - 1);
      if (type === 'subscription') lifecycleStats.subscriptions = Math.max(0, lifecycleStats.subscriptions - 1);
    });
    if (type === 'listener') lifecycleStats.listeners += 1;
    if (type === 'subscription') lifecycleStats.subscriptions += 1;
    return lifecycleCleanups[lifecycleCleanups.length - 1];
  }

  function listen(target, eventName, handler, options) {
    if (!target?.addEventListener || typeof handler !== 'function') return function () {};
    target.addEventListener(eventName, handler, options);
    return registerCleanup(() => target.removeEventListener?.(eventName, handler, options), 'listener');
  }

  function clearWorkspaceTimers() {
    if (loadingExitTimer !== null && typeof window.clearTimeout === 'function') window.clearTimeout(loadingExitTimer);
    if (surfaceMotionTimer !== null && typeof window.clearTimeout === 'function') window.clearTimeout(surfaceMotionTimer);
    loadingExitTimer = null;
    surfaceMotionTimer = null;
  }

  function teardownWorkspace(reason) {
    if (workspaceDisposed) return false;
    workspaceDisposed = true;
    clearWorkspaceTimers();
    while (lifecycleCleanups.length) {
      const cleanup = lifecycleCleanups.pop();
      try { cleanup(); } catch (error) { /* teardown remains best-effort */ }
    }
    lifecycleStats.teardowns += 1;
    if (window.__CoverageFitAgentWorkspaceTeardown === teardownWorkspace) {
      window.__CoverageFitAgentWorkspaceTeardown = null;
    }
    return reason || true;
  }

  window.__CoverageFitAgentWorkspaceTeardown = teardownWorkspace;
  const performanceStats = {
    checklistRenders: 0,
    checklistSkips: 0,
    timelineRenders: 0,
    timelineSkips: 0,
    progressUpdates: 0,
    propertyRenders: 0,
    propertySkips: 0,
    recommendationRenders: 0,
    recommendationSkips: 0,
    lastEventDurationMs: 0
  };

  function text(value, fallback) {
    if (value === 0) return '0';
    if (typeof value === 'string' && value.trim()) return value.trim();
    if (typeof value === 'number' && Number.isFinite(value)) return String(value);
    return fallback || 'Not provided';
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>'\"]/g, character => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '\"': '&quot;'
    })[character]);
  }

  function stableSignature(value) {
    try {
      return JSON.stringify(value, (key, item) => {
        if (item && typeof item === 'object' && !Array.isArray(item)) {
          return Object.keys(item).sort().reduce((ordered, name) => {
            ordered[name] = item[name];
            return ordered;
          }, {});
        }
        return item;
      });
    } catch (error) {
      return String(value);
    }
  }

  function nowMs() {
    return window.performance?.now?.() ?? Date.now();
  }


  function prefersReducedMotion() {
    return Boolean(window.CoverageFitWorkspaceMotion?.prefersReducedMotion?.());
  }

  function safeScrollIntoView(element, options) {
    if (!element?.scrollIntoView) return false;
    const settings = { block: 'nearest', inline: 'nearest', ...(options || {}) };
    settings.behavior = prefersReducedMotion() ? 'auto' : (settings.behavior || 'smooth');
    try {
      element.scrollIntoView(settings);
      return true;
    } catch (error) {
      try { element.scrollIntoView(); return true; } catch (fallbackError) { return false; }
    }
  }

  function isTypingTarget(target) {
    const tag = String(target?.tagName || '').toLowerCase();
    return Boolean(target?.isContentEditable || ['input', 'textarea', 'select'].includes(tag));
  }

  function setRefreshBusy(busy) {
    const control = byId('refreshWorkspace');
    if (!control) return;
    control.disabled = Boolean(busy);
    control.setAttribute?.('aria-busy', String(Boolean(busy)));
    control.classList?.toggle?.('is-busy', Boolean(busy));
  }

  function syncStickyHeaderDepth() {
    const header = document.querySelector?.('.workspace-header');
    if (!header) return;
    const scrolled = Number(window.scrollY || window.pageYOffset || 0) > 6;
    if (scrolled === headerScrolled) return;
    headerScrolled = scrolled;
    header.classList?.toggle?.('is-scrolled', scrolled);
  }

  function updateText(element, value) {
    if (!element) return false;
    const next = String(value ?? '');
    if (element.textContent === next) return false;
    element.textContent = next;
    return true;
  }

  function setHidden(element, hidden) {
    if (!element || element.hidden === Boolean(hidden)) return false;
    element.hidden = Boolean(hidden);
    return true;
  }

  function getPerformanceSnapshot() {
    return Object.freeze({ ...performanceStats });
  }

  window.CoverageFitAgentWorkspacePerformance = Object.freeze({
    version: '1.0.0',
    getSnapshot: getPerformanceSnapshot,
    reset() {
      Object.keys(performanceStats).forEach(key => { performanceStats[key] = 0; });
      return getPerformanceSnapshot();
    }
  });

  window.CoverageFitAgentWorkspaceLifecycle = Object.freeze({
    version: '1.0.0',
    getSnapshot() {
      return Object.freeze({
        disposed: workspaceDisposed,
        listeners: lifecycleStats.listeners,
        subscriptions: lifecycleStats.subscriptions,
        teardowns: lifecycleStats.teardowns,
        pendingTimers: Number(loadingExitTimer !== null) + Number(surfaceMotionTimer !== null)
      });
    },
    teardown: teardownWorkspace
  });

  function displayDate(value) {
    if (!value) return 'Date unavailable';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Date unavailable';
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
  }

  function formatPropertyValue(key, value) {
    if (value === true) return 'Yes';
    if (value === false) return 'No';
    if (key === 'livingArea' && value && !String(value).toLowerCase().includes('sq')) {
      const numeric = Number(String(value).replace(/,/g, ''));
      return Number.isFinite(numeric) ? `${numeric.toLocaleString('en-US')} sq. ft.` : text(value);
    }
    return text(value);
  }


  function setInlineState(id, options) {
    const region = byId(id);
    if (!region) return;
    const settings = options || {};
    region.hidden = !settings.visible;
    region.classList?.toggle?.('workspace-inline-state--warning', settings.tone === 'warning');
    region.classList?.toggle?.('workspace-inline-state--error', settings.tone === 'error');
    if (settings.visible) {
      region.innerHTML = `<strong>${escapeHtml(settings.title || 'Information unavailable')}</strong><p>${escapeHtml(settings.message || '')}</p>${settings.actionLabel ? `<button class="button button--secondary button--compact cf-button cf-button--secondary cf-button--compact" type="button" data-workspace-action="${escapeHtml(settings.action || 'retry')}">${escapeHtml(settings.actionLabel)}</button>` : ''}`;
      if (!window.CoverageFitWorkspaceMotion?.prefersReducedMotion?.()) {
        region.classList?.remove?.('workspace-surface--motion-enter');
        void region.offsetWidth;
        region.classList?.add?.('workspace-surface--motion-enter');
      }
    } else {
      region.innerHTML = '';
    }
  }

  function configurePageState(options) {
    const state = byId('emptyState');
    if (!state) return;
    const settings = options || {};
    state.dataset.state = settings.tone || 'empty';
    byId('emptyStateEyebrow').textContent = settings.eyebrow || 'Workspace unavailable';
    byId('emptyStateTitle').textContent = settings.title || 'The Workspace could not be prepared.';
    byId('emptyStateMessage').textContent = settings.message || 'Try loading the Workspace again.';
    const primary = byId('emptyStatePrimaryAction');
    if (primary) {
      primary.hidden = !settings.primaryLabel;
      primary.textContent = settings.primaryLabel || '';
      primary.href = settings.primaryHref || '/assessment/';
    }
    const retry = byId('emptyStateRetry');
    if (retry) retry.hidden = settings.showRetry === false;
    if (!window.CoverageFitWorkspaceMotion?.prefersReducedMotion?.()) {
      state.classList?.remove?.('workspace-surface--motion-enter');
      void state.offsetWidth;
      state.classList?.add?.('workspace-surface--motion-enter');
    }
  }


  function humanizeSource(integration) {
    const source = text(integration?.source, '').toLowerCase();
    const campaign = text(integration?.campaign, '');
    if (source.includes('408')) return campaign ? `408FARMERS · ${campaign}` : '408FARMERS';
    if (source) return campaign ? `${text(integration.source)} · ${campaign}` : text(integration.source);
    return 'CoverageFit direct';
  }

  function renderClientIntake(snapshot) {
    const customer = snapshot?.customer || {};
    const integration = snapshot?.integration || {};
    updateText(byId('clientIntakeName'), text(customer.name));
    updateText(byId('clientIntakePhone'), text(customer.phone));
    updateText(byId('clientIntakeEmail'), text(customer.email));
    updateText(byId('clientIntakeProperty'), text(customer.propertyAddress || snapshot?.property?.address));
    updateText(byId('clientIntakeReason'), text(customer.reviewContext, 'General coverage review'));
    updateText(byId('clientIntakeSource'), humanizeSource(integration));
    updateText(byId('clientIntakeStatus'), integration.prefilled ? '408FARMERS handoff' : 'Assessment provided');
    updateText(byId('clientIntakeNote'), integration.prefilled
      ? 'Information was carried into CoverageFit from 408FARMERS and remains customer-editable. Confirm contact details and the reason for review before quoting.'
      : 'Confirm the client’s contact information and review reason before beginning the consultation.');
  }

  function renderProperty(property) {
    const signature = stableSignature(property || null);
    if (signature === lastPropertySignature) {
      performanceStats.propertySkips += 1;
      return false;
    }
    lastPropertySignature = signature;
    performanceStats.propertyRenders += 1;
    const grid = byId('propertyGrid');
    if (!property?.available) {
      if (grid) grid.hidden = true;
      setInlineState('propertyState', { visible: true, title: 'Property details unavailable', message: 'No Property Intelligence profile was found. Confirm the address, construction, roof, foundation, and other material details during the consultation.', actionLabel: 'Refresh property data' });
    } else {
      if (grid) grid.hidden = false;
      setInlineState('propertyState', { visible: false });
    }
    const rows = [
      ['Address', property.address, 'address'],
      ['Year built', property.yearBuilt, 'yearBuilt'],
      ['Living area', property.livingArea, 'livingArea'],
      ['Stories', property.stories, 'stories'],
      ['Construction', property.construction, 'construction'],
      ['Roof', property.roof, 'roof'],
      ['Foundation', property.foundation, 'foundation'],
      ['Pool', property.pool, 'pool'],
      ['Detached structures', property.detachedStructures, 'detachedStructures']
    ];
    byId('propertyGrid').innerHTML = rows.map(([label, value, key]) => `
      <div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(formatPropertyValue(key, value))}</dd></div>
    `).join('');
    byId('propertyConfidence').textContent = property.confirmation.label;
    byId('propertyNote').textContent = property.available
      ? 'Use these facts as a consultation starting point. Confirm material property details before relying on them.'
      : 'No Property Intelligence profile was found. Confirm all property details during the consultation.';
    return true;
  }

  function renderRecommendations(recommendations) {
    const priorities = (Array.isArray(recommendations) ? recommendations : []).slice(0, 3);
    const signature = stableSignature(priorities);
    if (signature === lastRecommendationSignature) {
      performanceStats.recommendationSkips += 1;
      return false;
    }
    lastRecommendationSignature = signature;
    performanceStats.recommendationRenders += 1;
    const container = byId('recommendationList');
    if (!priorities.length) {
      container.hidden = true;
      setInlineState('recommendationState', { visible: true, title: 'No recommendation topics available', message: 'The saved assessment did not include recommendation topics. Review the customer’s answers and current policy manually before the consultation.', actionLabel: 'Refresh recommendations' });
      return true;
    }
    container.hidden = false;
    setInlineState('recommendationState', { visible: false });
    container.innerHTML = priorities.map(item => {
      const tags = [item.priority, item.confidence != null && item.confidence > 0 ? `${item.confidence}% confidence` : 'Review topic'].filter(Boolean);
      return `<article class="recommendation-card cf-card cf-card--inset">
        <span class="recommendation-number">${item.order}</span>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.explanation)}</p>
        <div class="recommendation-meta">${tags.map(tag => `<span>${escapeHtml(tag)}</span>`).join('')}</div>
      </article>`;
    }).join('');
    return true;
  }

  function setStatus(message, state) {
    const status = byId('workspaceStatus');
    status.className = `workspace-status ${state ? `is-${state}` : ''}`.trim();
    status.querySelector('span:last-child').textContent = message;
  }

  function setWorkspaceLoading(isLoading) {
    const loading = byId('workspaceLoading');
    if (!loading) return;
    if (loadingExitTimer && typeof window.clearTimeout === 'function') {
      window.clearTimeout(loadingExitTimer);
      loadingExitTimer = null;
    }
    loading.setAttribute?.('aria-busy', String(Boolean(isLoading)));
    if (isLoading) {
      loading.hidden = false;
      loading.classList?.remove?.('is-leaving');
      return;
    }
    const motion = window.CoverageFitWorkspaceMotion;
    const reduced = Boolean(motion?.prefersReducedMotion?.());
    if (reduced || loading.hidden) {
      loading.hidden = true;
      loading.classList?.remove?.('is-leaving');
      return;
    }
    loading.classList?.add?.('is-leaving');
    const duration = Number(motion?.getDuration?.('fast')) || 0;
    if (!duration || typeof window.setTimeout !== 'function') {
      loading.hidden = true;
      loading.classList?.remove?.('is-leaving');
      return;
    }
    loadingExitTimer = window.setTimeout(() => {
      loading.hidden = true;
      loading.classList?.remove?.('is-leaving');
      loadingExitTimer = null;
    }, duration + 40);
  }

  function animateWorkspaceSurfaces() {
    const layout = byId('workspaceLayout');
    if (!layout) return;
    const motion = window.CoverageFitWorkspaceMotion;
    if (motion?.prefersReducedMotion?.()) {
      layout.classList?.remove?.('workspace-layout--entering');
      workspaceHasRendered = true;
      return;
    }
    if (surfaceMotionTimer && typeof window.clearTimeout === 'function') {
      window.clearTimeout(surfaceMotionTimer);
      surfaceMotionTimer = null;
    }
    layout.classList?.remove?.('workspace-layout--entering');
    void layout.offsetWidth;
    layout.classList?.add?.('workspace-layout--entering');
    const duration = Number(motion?.getDuration?.(workspaceHasRendered ? 'fast' : 'slow')) || 0;
    if (typeof window.setTimeout === 'function') {
      surfaceMotionTimer = window.setTimeout(() => {
        layout.classList?.remove?.('workspace-layout--entering');
        surfaceMotionTimer = null;
      }, duration + 180);
    }
    workspaceHasRendered = true;
  }




  function announce(message) {
    const region = byId('workspaceAnnouncements');
    if (!region || !message) return;
    region.textContent = '';
    const defer = typeof window.setTimeout === 'function' ? window.setTimeout.bind(window) : (callback => callback());
    defer(() => { region.textContent = message; }, 20);
  }

  function focusChecklistItem(itemId) {
    if (!itemId) return;
    const selector = `[data-checklist-item-id="${CSS.escape(itemId)}"] [data-checklist-action="toggle-complete"]`;
    document.querySelector(selector)?.focus?.({ preventScroll: true });
  }

  function focusTimelineItem(itemId) {
    if (!itemId) return;
    const selector = `[data-checklist-item-id="${CSS.escape(itemId)}"]`;
    byId('conversationTimeline')?.querySelector(selector)?.focus?.({ preventScroll: true });
  }

  function restoreInteractionFocus() {
    if (pendingFocusItemId) {
      focusChecklistItem(pendingFocusItemId);
      pendingFocusItemId = '';
    } else if (pendingFocusTimelineItemId) {
      focusTimelineItem(pendingFocusTimelineItemId);
      pendingFocusTimelineItemId = '';
    }
  }

  function setChecklistShellState(nextState) {
    const sidebar = byId('checklistSidebar');
    const loading = byId('checklistLoadingState');
    const empty = byId('checklistEmptyState');
    const error = byId('checklistErrorState');
    const phaseShell = byId('checklistPhaseShell');
    if (!sidebar || !loading || !empty || !error || !phaseShell) return;

    const state = ['loading', 'ready', 'empty', 'error'].includes(nextState) ? nextState : 'error';
    checklistShellState = state;
    if (sidebar.dataset) sidebar.dataset.state = state;
    if (sidebar.classList?.toggle) {
      sidebar.classList.toggle('is-loading', state === 'loading');
      sidebar.classList.toggle('is-ready', state === 'ready');
      sidebar.classList.toggle('is-empty', state === 'empty');
      sidebar.classList.toggle('is-error', state === 'error');
    }
    loading.hidden = state !== 'loading';
    empty.hidden = state !== 'empty';
    error.hidden = state !== 'error';
    phaseShell.hidden = state !== 'ready';
  }

  function setChecklistSidebarCollapsed(collapsed, options) {
    const sidebar = byId('checklistSidebar');
    const toggle = byId('checklistSidebarToggle');
    if (!sidebar || !toggle) return;
    const wasCollapsed = sidebar.classList.contains('is-collapsed');
    sidebar.classList.toggle('is-collapsed', Boolean(collapsed));
    if (wasCollapsed !== Boolean(collapsed) && !window.CoverageFitWorkspaceMotion?.prefersReducedMotion?.()) {
      const motion = window.CoverageFitWorkspaceMotion;
      if (typeof motion?.restartClass === 'function') motion.restartClass(sidebar, 'checklist-sidebar--motion-toggle', 'normal', 80);
      else {
        sidebar.classList?.remove?.('checklist-sidebar--motion-toggle');
        void sidebar.offsetWidth;
        sidebar.classList?.add?.('checklist-sidebar--motion-toggle');
      }
    }
    toggle.setAttribute('aria-expanded', String(!collapsed));
    const label = toggle.querySelector('.checklist-sidebar__toggle-label');
    if (label) label.textContent = collapsed ? 'Show' : 'Hide';
    if (options?.remember) mobileSidebarPreference = Boolean(collapsed);
  }

  function syncChecklistSidebarForViewport() {
    const sidebar = byId('checklistSidebar');
    if (!sidebar || !window.matchMedia) return;
    const mobile = window.matchMedia('(max-width: 860px)').matches;
    if (!mobile) {
      setChecklistSidebarCollapsed(false);
      return;
    }
    const collapsed = mobileSidebarPreference == null ? true : mobileSidebarPreference;
    setChecklistSidebarCollapsed(collapsed);
  }


  function formatMinutes(value) {
    const minutes = Number(value);
    if (!Number.isFinite(minutes) || minutes <= 0) return 'Time not estimated';
    const rounded = Math.round(minutes * 10) / 10;
    return `${rounded} min`;
  }

  function phaseStatus(phase, items, currentPhaseId) {
    const phaseItems = items.filter(item => item.phaseId === phase.id);
    const completed = phaseItems.filter(item => item.status === 'complete').length;
    if (phaseItems.length && completed === phaseItems.length) return 'complete';
    if (phase.id === currentPhaseId || phaseItems.some(item => item.status === 'active')) return 'current';
    return 'pending';
  }


  function captureProgressMotionState(percentage, completed, remainingMinutes, currentPhaseId, complete) {
    return { percentage, completed, remainingMinutes, currentPhaseId: String(currentPhaseId || ''), complete: Boolean(complete) };
  }

  function applyProgressMotion(nextState) {
    const motion = window.CoverageFitWorkspaceMotion;
    const reduced = Boolean(motion?.prefersReducedMotion?.());
    const previous = previousProgressMotionState;
    previousProgressMotionState = nextState;
    if (!previous || reduced) return;

    const targets = [];
    if (previous.percentage !== nextState.percentage) targets.push(byId('checklistProgressPlaceholder'), byId('checklistProgressTrack'));
    if (previous.completed !== nextState.completed) targets.push(byId('checklistProgressCount'));
    if (previous.remainingMinutes !== nextState.remainingMinutes) targets.push(byId('checklistRemainingMinutes'));
    if (previous.currentPhaseId !== nextState.currentPhaseId) targets.push(byId('checklistCurrentPhase'));
    if (!previous.complete && nextState.complete) targets.push(byId('checklistCompleteState'));

    const duration = motion?.getDuration?.('normal') ?? 220;
    targets.filter(Boolean).forEach(element => {
      if (typeof motion?.restartClass === 'function') motion.restartClass(element, 'checklist-progress--motion-update', duration, 80);
      else element.classList?.add('checklist-progress--motion-update');
    });
  }

  function renderChecklistProgress(state, phases, items) {
    const summary = state?.summary || {};
    const progress = state?.progress || {};
    const total = Number(summary.total ?? progress.total ?? items.length) || 0;
    const completed = Number(summary.completed ?? progress.completed) || 0;
    const percentage = Math.max(0, Math.min(100, Number(progress.completionPercent ?? summary.completionPercent) || 0));
    const remainingMinutes = Math.max(0, Number(state?.remainingMinutes ?? progress.remainingMinutes) || 0);
    const currentPhaseId = state?.currentPhase || '';
    const currentPhase = phases.find(phase => phase.id === currentPhaseId);
    const complete = total > 0 && completed === total;

    const percentageLabel = byId('checklistProgressPlaceholder');
    const countLabel = byId('checklistProgressCount');
    const minutesLabel = byId('checklistRemainingMinutes');
    const phaseLabel = byId('checklistCurrentPhase');
    const track = byId('checklistProgressTrack');
    const bar = byId('checklistProgressBar');
    const completeState = byId('checklistCompleteState');

    let changed = false;
    changed = updateText(percentageLabel, `${percentage}%`) || changed;
    changed = updateText(countLabel, `${completed}/${total}`) || changed;
    changed = updateText(minutesLabel, formatMinutes(remainingMinutes)) || changed;
    changed = updateText(phaseLabel, complete ? 'Complete' : text(currentPhase?.title, total ? 'Not started' : 'Preparing')) || changed;
    if (track?.setAttribute && track.getAttribute?.('aria-valuenow') !== String(percentage)) {
      track.setAttribute('aria-valuenow', String(percentage));
      changed = true;
    }
    if (bar?.style && bar.style.width !== `${percentage}%`) {
      bar.style.width = `${percentage}%`;
      changed = true;
    }
    changed = setHidden(completeState, !complete) || changed;
    if (changed) performanceStats.progressUpdates += 1;
    applyProgressMotion(captureProgressMotionState(percentage, completed, remainingMinutes, currentPhaseId, complete));
  }


  function captureChecklistMotionState(items) {
    const snapshot = new Map();
    (Array.isArray(items) ? items : []).forEach(item => {
      if (item?.id) snapshot.set(String(item.id), String(item.status || 'pending'));
    });
    return snapshot;
  }

  function applyChecklistMotion(items) {
    const motion = window.CoverageFitWorkspaceMotion;
    const reduced = Boolean(motion?.prefersReducedMotion?.());
    const nextState = captureChecklistMotionState(items);
    if (!checklistHasRendered || reduced) {
      previousChecklistMotionState = nextState;
      checklistHasRendered = true;
      return;
    }

    nextState.forEach((status, itemId) => {
      const previous = previousChecklistMotionState.get(itemId);
      const element = byId(`checklist-item-${itemId}`);
      if (!element || previous === status) return;
      let className = 'checklist-item--motion-state';
      if (status === 'complete') className = 'checklist-item--motion-complete';
      else if (previous === 'complete') className = 'checklist-item--motion-reopen';
      else if (status === 'active') className = 'checklist-item--motion-active';
      const duration = motion?.getDuration?.('normal') ?? 220;
      if (typeof motion?.restartClass === 'function') motion.restartClass(element, className, duration, 80);
      else element.classList?.add(className);
    });

    const list = byId('checklistPhaseList');
    const refreshDuration = motion?.getDuration?.('fast') ?? 160;
    if (typeof motion?.restartClass === 'function') motion.restartClass(list, 'checklist-phase-list--motion-refresh', refreshDuration, 60);
    else list?.classList?.add('checklist-phase-list--motion-refresh');
    previousChecklistMotionState = nextState;
  }

  function renderChecklist(state) {
    const list = byId('checklistPhaseList');
    const overview = byId('checklistOverviewText');
    if (!list) return;

    const checklist = state?.checklist;
    const phases = Array.isArray(checklist?.phases) ? checklist.phases : [];
    const items = Array.isArray(checklist?.items) ? checklist.items : [];
    if (!phases.length || !items.length) {
      const emptySignature = 'empty';
      if (lastChecklistStructureSignature !== emptySignature) {
        list.innerHTML = '';
        lastChecklistStructureSignature = emptySignature;
        performanceStats.checklistRenders += 1;
      } else {
        performanceStats.checklistSkips += 1;
      }
      if (overview) updateText(overview, 'No consultation items are available for this plan.');
      renderChecklistProgress(state, phases, items);
      return false;
    }

    if (overview) {
      overview.textContent = `${phases.length} phase${phases.length === 1 ? '' : 's'} · ${items.length} discussion item${items.length === 1 ? '' : 's'} prepared`;
    }
    renderChecklistProgress(state, phases, items);
    const resetAll = byId('checklistResetAll');
    if (resetAll) resetAll.disabled = !(state?.summary?.completed || state?.summary?.active);

    const structureSignature = stableSignature({
      currentPhase: state?.currentPhase || '',
      phases: phases.map(phase => ({ id: phase.id, title: phase.title, estimatedMinutes: phase.estimatedMinutes })),
      items: items.map(item => ({
        id: item.id,
        phaseId: item.phaseId,
        order: item.order,
        title: item.title,
        description: item.description,
        estimatedMinutes: item.estimatedMinutes,
        required: item.required,
        status: item.status
      }))
    });
    if (structureSignature === lastChecklistStructureSignature) {
      performanceStats.checklistSkips += 1;
      return false;
    }
    lastChecklistStructureSignature = structureSignature;
    performanceStats.checklistRenders += 1;

    list.innerHTML = phases.map((phase, phaseIndex) => {
      const phaseItems = items
        .filter(item => item.phaseId === phase.id)
        .sort((a, b) => Number(a.order || 0) - Number(b.order || 0));
      const status = phaseStatus(phase, items, state.currentPhase);
      const statusLabel = status === 'complete' ? 'Complete' : status === 'current' ? 'Current' : 'Upcoming';
      const phaseMinutes = phase.estimatedMinutes || phaseItems.reduce((sum, item) => sum + Number(item.estimatedMinutes || 0), 0);
      return `<section class="checklist-phase cf-card cf-card--inset checklist-phase--${status}" data-phase-id="${escapeHtml(phase.id)}" role="listitem" aria-labelledby="checklist-phase-title-${escapeHtml(phase.id)}">
        <div class="checklist-phase__header">
          <div class="checklist-phase__identity">
            <span class="checklist-phase__number">${phaseIndex + 1}</span>
            <div>
              <h3 id="checklist-phase-title-${escapeHtml(phase.id)}">${escapeHtml(phase.title || `Phase ${phaseIndex + 1}`)}</h3>
              <p>${escapeHtml(formatMinutes(phaseMinutes))}</p>
            </div>
          </div>
          <div class="checklist-phase__header-actions">
            <span class="checklist-phase__status">${statusLabel}</span>
            <button class="checklist-phase__reset" type="button" data-checklist-action="reset-phase" data-phase-id="${escapeHtml(phase.id)}">Reset phase</button>
          </div>
        </div>
        <ol class="checklist-item-list" aria-label="${escapeHtml(phase.title || `Phase ${phaseIndex + 1}`)} checklist items">
          ${phaseItems.map(item => {
            const itemStatus = item.status === 'complete' ? 'complete' : item.status === 'active' ? 'active' : 'pending';
            const requirement = item.required === false ? 'Optional' : 'Required';
            const checkboxLabel = itemStatus === 'complete' ? `Reopen ${item.title}` : `Complete ${item.title}`;
            return `<li class="checklist-item cf-card--inset checklist-item--${itemStatus}" id="checklist-item-${escapeHtml(item.id)}" data-checklist-item-id="${escapeHtml(item.id)}" aria-current="${itemStatus === 'active' ? 'step' : 'false'}">
              <button class="checklist-item__check" type="button" data-checklist-action="toggle-complete" data-item-id="${escapeHtml(item.id)}" aria-label="${escapeHtml(checkboxLabel)}" aria-pressed="${itemStatus === 'complete'}" aria-describedby="checklist-item-status-${escapeHtml(item.id)}">
                <span class="checklist-item__marker" aria-hidden="true"></span>
              </button>
              <div class="checklist-item__content">
                <div class="checklist-item__title-row">
                  <span class="checklist-item__title">${escapeHtml(item.title)}</span>
                  <span class="checklist-item__time">${escapeHtml(formatMinutes(item.estimatedMinutes))}</span>
                </div>
                ${item.description ? `<p>${escapeHtml(item.description)}</p>` : ''}
                <div class="checklist-item__meta" id="checklist-item-status-${escapeHtml(item.id)}">
                  <span>${requirement}</span>
                  <span>${itemStatus === 'complete' ? 'Completed' : itemStatus === 'active' ? 'In review' : 'Not started'}</span>
                </div>
                <div class="checklist-item__actions">
                  ${itemStatus !== 'complete' ? `<button type="button" data-checklist-action="activate" data-item-id="${escapeHtml(item.id)}">${itemStatus === 'active' ? 'Active' : 'Review now'}</button>` : ''}
                  ${itemStatus !== 'pending' ? `<button type="button" data-checklist-action="reset-item" data-item-id="${escapeHtml(item.id)}">Reset item</button>` : ''}
                </div>
              </div>
            </li>`;
          }).join('')}
        </ol>
      </section>`;
    }).join('');
    applyChecklistMotion(items);
    return true;
  }


  function captureTimelineMotionState(planItems, checklistBySource, currentPhaseId) {
    const snapshot = new Map();
    planItems.forEach(item => {
      const checklistItem = checklistBySource.get(item.id);
      snapshot.set(String(item.id), timelineItemStatus(checklistItem, item.phase, currentPhaseId));
    });
    return snapshot;
  }

  function applyTimelineMotion(planItems, checklistBySource, currentPhaseId) {
    const motion = window.CoverageFitWorkspaceMotion;
    const reduced = Boolean(motion?.prefersReducedMotion?.());
    const nextState = captureTimelineMotionState(planItems, checklistBySource, currentPhaseId);
    if (!timelineHasRendered || reduced) {
      previousTimelineMotionState = nextState;
      timelineHasRendered = true;
      return;
    }

    nextState.forEach((status, sourceId) => {
      const previous = previousTimelineMotionState.get(sourceId);
      if (!previous || previous === status) return;
      const item = byId('conversationTimeline')?.querySelector?.(`[data-timeline-source-id="${CSS.escape(sourceId)}"]`);
      if (!item) return;
      const className = status === 'complete'
        ? 'conversation-timeline__item--motion-complete'
        : status === 'current'
          ? 'conversation-timeline__item--motion-current'
          : 'conversation-timeline__item--motion-update';
      const duration = motion?.getDuration?.('normal') ?? 220;
      if (typeof motion?.restartClass === 'function') motion.restartClass(item, className, duration, 80);
      else item.classList?.add(className);
    });

    const current = byId('conversationTimeline')?.querySelector?.('.conversation-timeline__item--current');
    safeScrollIntoView(current, { behavior: reduced ? 'auto' : 'smooth', block: 'nearest', inline: 'center' });
    previousTimelineMotionState = nextState;
  }

  function timelineItemStatus(checklistItem, phaseId, currentPhaseId) {
    if (!checklistItem) return phaseId === currentPhaseId ? 'current' : 'upcoming';
    if (checklistItem.status === 'complete') return 'complete';
    if (checklistItem.status === 'active' || phaseId === currentPhaseId) return 'current';
    return 'upcoming';
  }

  function renderConversationTimeline(state) {
    const container = byId('conversationTimeline');
    const summary = byId('conversationTimelineSummary');
    if (!container) return;
    const plan = currentConversationPlan;
    const planItems = Array.isArray(plan?.items) ? plan.items : [];
    const checklistItems = Array.isArray(state?.checklist?.items) ? state.checklist.items : [];
    const currentPhaseId = state?.currentPhase || '';

    if (!plan || plan.state !== 'ready' || !planItems.length) {
      if (lastTimelineStructureSignature !== 'empty') {
        container.innerHTML = '<div class="conversation-timeline__empty">A conversation timeline will appear after the consultation plan is prepared.</div>';
        lastTimelineStructureSignature = 'empty';
        performanceStats.timelineRenders += 1;
      } else {
        performanceStats.timelineSkips += 1;
      }
      if (summary) updateText(summary, 'Timeline unavailable');
      return false;
    }

    const checklistBySource = new Map(checklistItems.map(item => [item.sourceItemId, item]));
    const completed = checklistItems.filter(item => item.status === 'complete').length;
    if (summary) updateText(summary, `${completed}/${checklistItems.length} topics reviewed`);
    const structureSignature = stableSignature({
      currentPhaseId,
      items: planItems.map(item => ({
        id: item.id,
        phase: item.phase,
        title: item.title,
        estimatedMinutes: item.estimatedMinutes,
        checklistId: checklistBySource.get(item.id)?.id || '',
        status: timelineItemStatus(checklistBySource.get(item.id), item.phase, currentPhaseId)
      }))
    });
    if (structureSignature === lastTimelineStructureSignature) {
      performanceStats.timelineSkips += 1;
      return false;
    }
    lastTimelineStructureSignature = structureSignature;
    performanceStats.timelineRenders += 1;

    container.innerHTML = `<ol class="conversation-timeline__list cf-list" aria-label="Conversation timeline">
      ${planItems.map((item, index) => {
        const checklistItem = checklistBySource.get(item.id);
        const status = timelineItemStatus(checklistItem, item.phase, currentPhaseId);
        const stateLabel = status === 'complete' ? 'Reviewed' : status === 'current' ? 'Current' : 'Upcoming';
        return `<li class="conversation-timeline__item conversation-timeline__item--${status}" data-timeline-source-id="${escapeHtml(item.id)}" data-phase-id="${escapeHtml(item.phase)}">
          <button type="button" class="conversation-timeline__button" data-timeline-action="activate" data-checklist-item-id="${escapeHtml(checklistItem?.id || '')}" ${checklistItem ? '' : 'disabled'} ${status === 'current' ? 'aria-current="step"' : ''} tabindex="${status === 'current' ? '0' : '-1'}" aria-label="${escapeHtml(`${item.title}. ${stateLabel}. ${formatMinutes(item.estimatedMinutes)}`)}">
            <span class="conversation-timeline__marker" aria-hidden="true">${status === 'complete' ? '✓' : index + 1}</span>
            <span class="conversation-timeline__content">
              <span class="conversation-timeline__state">${stateLabel}</span>
              <strong>${escapeHtml(item.title)}</strong>
              <small>${escapeHtml(formatMinutes(item.estimatedMinutes))}</small>
            </span>
          </button>
        </li>`;
      }).join('')}
    </ol>`;
    applyTimelineMotion(planItems, checklistBySource, currentPhaseId);
    return true;
  }

  function handleTimelineAction(event) {
    const control = event.target.closest?.('[data-timeline-action="activate"]');
    if (!control || control.disabled || !checklistEngine) return;
    const itemId = control.dataset.checklistItemId;
    if (!itemId) return;
    const state = window.CoverageFitAgentWorkspaceChecklist;
    const item = state?.checklist?.items?.find(entry => entry.id === itemId);
    if (!item || item.status === 'complete' || item.status === 'active') return;
    try {
      pendingFocusTimelineItemId = itemId;
      checklistEngine.activate(itemId);
      safeScrollIntoView(byId(`checklist-item-${itemId}`), { block: 'nearest' });
    } catch (error) {
      console.error('[CoverageFit Agent Workspace] Timeline activation failed.', error);
      setStatus('Timeline topic could not be activated', 'warning');
    }
  }

  function checklistStatusMessage(state, reason) {
    const plan = currentConversationPlan;
    if (!plan || plan.state !== 'ready') return '';
    const topicLabel = `${plan.summary.topicCount} priority topic${plan.summary.topicCount === 1 ? '' : 's'}`;
    const checklistCount = state?.summary?.total || 0;
    const checklistReady = state?.checklist?.state === 'ready';
    const checklistLabel = checklistReady
      ? ` · ${checklistCount} checklist item${checklistCount === 1 ? '' : 's'} prepared`
      : '';
    const progressLabel = checklistReady && reason !== 'plan-restored'
      ? ` · ${state.summary.completed || 0}/${checklistCount} complete`
      : '';
    return `Assessment loaded · ${topicLabel} · ${plan.summary.estimatedMinutes}-minute conversation plan prepared${checklistLabel}${progressLabel}`;
  }

  function handleChecklistEvent(event) {
    if (workspaceDisposed) return;
    const startedAt = nowMs();
    const state = event?.detail?.state;
    if (!state || typeof state !== 'object') return;
    window.CoverageFitAgentWorkspaceChecklist = state;
    renderChecklist(state);
    renderConversationTimeline(state);
    const storage = state?.diagnostics?.storageHealth;
    const storageUnavailable = storage && (storage.enabled === false || ['blocked', 'unavailable', 'error'].includes(storage.status));
    const storageState = byId('checklistStorageState');
    if (storageState) storageState.hidden = !storageUnavailable;
    const checklistState = state?.checklist?.state;
    setChecklistShellState(checklistState === 'ready' ? 'ready' : checklistState === 'empty' ? 'empty' : 'error');
    const message = checklistStatusMessage(state, event.detail?.reason);
    if (message) setStatus(message, 'ready');
    const signature = `${state?.summary?.completed || 0}|${state?.summary?.active || 0}|${state?.currentPhase || ''}`;
    if (signature !== lastAnnouncedChecklistSignature) {
      lastAnnouncedChecklistSignature = signature;
      const total = state?.summary?.total || 0;
      const completed = state?.summary?.completed || 0;
      announce(`${completed} of ${total} consultation items complete. ${state?.remainingMinutes || 0} minutes remaining.`);
    }
    restoreInteractionFocus();
    performanceStats.lastEventDurationMs = Math.max(0, Math.round((nowMs() - startedAt) * 100) / 100);
  }

  function confirmReset(message) {
    return typeof window.confirm !== 'function' || window.confirm(message);
  }

  function handleChecklistAction(event) {
    const control = event.target.closest?.('[data-checklist-action]');
    if (!control || !checklistEngine) return;
    const action = control.dataset.checklistAction;
    const itemId = control.dataset.itemId;
    const phaseId = control.dataset.phaseId;
    const currentState = window.CoverageFitAgentWorkspaceChecklist;
    const item = currentState?.checklist?.items?.find(entry => entry.id === itemId);

    try {
      if (itemId) pendingFocusItemId = itemId;
      if (action === 'toggle-complete' && itemId) {
        if (item?.status === 'complete') {
          checklistEngine.reopen(itemId);
        } else {
          const orderedItems = Array.isArray(currentState?.checklist?.items)
            ? currentState.checklist.items.slice().sort((a, b) => Number(a.order || 0) - Number(b.order || 0))
            : [];
          const currentIndex = orderedItems.findIndex(entry => entry.id === itemId);
          const nextItem = orderedItems.slice(currentIndex + 1).find(entry => entry.status !== 'complete');
          checklistEngine.complete(itemId);
          if (nextItem) checklistEngine.activate(nextItem.id);
        }
      } else if (action === 'activate' && itemId && item?.status !== 'active') {
        checklistEngine.activate(itemId);
      } else if (action === 'reset-item' && itemId) {
        checklistEngine.resetItem(itemId);
      } else if (action === 'reset-phase' && phaseId) {
        pendingFocusItemId = '';
        if (confirmReset('Reset every checklist item in this phase?')) {
          checklistEngine.resetPhase(phaseId);
        } else {
          announce('Phase reset cancelled.');
          control.focus?.({ preventScroll: true });
        }
      } else if (action === 'reset-all') {
        pendingFocusItemId = '';
        if (confirmReset('Reset the entire consultation checklist?')) {
          checklistEngine.reset();
        } else {
          announce('Full checklist reset cancelled.');
          control.focus?.({ preventScroll: true });
        }
      }
    } catch (error) {
      console.error('[CoverageFit Agent Workspace] Checklist action failed.', error);
      setStatus('Checklist action could not be completed', 'warning');
    }
  }


  function handleTimelineKeydown(event) {
    const buttons = Array.from(byId('conversationTimeline')?.querySelectorAll('.conversation-timeline__button:not(:disabled)') || []);
    if (!buttons.length) return;
    const currentIndex = buttons.indexOf(document.activeElement);
    if (currentIndex < 0) return;
    let nextIndex = currentIndex;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = Math.min(buttons.length - 1, currentIndex + 1);
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = Math.max(0, currentIndex - 1);
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = buttons.length - 1;
    else return;
    event.preventDefault();
    buttons.forEach((button, index) => button.tabIndex = index === nextIndex ? 0 : -1);
    buttons[nextIndex].focus();
  }

  function handleSidebarKeydown(event) {
    if (event.key !== 'Escape') return;
    const sidebar = byId('checklistSidebar');
    if (!sidebar || sidebar.classList.contains('is-collapsed')) return;
    if (window.matchMedia?.('(max-width: 860px)').matches) {
      setChecklistSidebarCollapsed(true);
      byId('checklistSidebarToggle')?.focus();
      announce('Consultation checklist collapsed.');
    }
  }

  function handleWorkspaceShortcuts(event) {
    if (!event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || isTypingTarget(event.target)) return;
    const key = String(event.key || '').toLowerCase();
    if (key === 'r') {
      event.preventDefault();
      announce('Refreshing the Agent Workspace.');
      render();
    } else if (key === 'c') {
      event.preventDefault();
      const sidebar = byId('checklistSidebar');
      if (!sidebar || byId('workspaceLayout')?.hidden) return;
      const collapsed = !sidebar.classList.contains('is-collapsed');
      setChecklistSidebarCollapsed(collapsed, { remember: true });
      byId('checklistSidebarToggle')?.focus?.({ preventScroll: true });
      announce(`Consultation checklist ${collapsed ? 'collapsed' : 'expanded'}.`);
    }
  }

  function showEmpty(snapshot, reason) {
    setWorkspaceLoading(false);
    byId('workspaceLayout').hidden = true;
    setChecklistShellState('empty');
    byId('emptyState').hidden = false;
    const warning = snapshot?.diagnostics?.warnings?.[0] || 'No saved Home assessment found';
    if (reason === 'adapter') {
      configurePageState({
        tone: 'error',
        eyebrow: 'Workspace unavailable',
        title: 'The Workspace data service did not load.',
        message: 'Refresh the page to try again. If the problem continues, confirm that the Workspace JavaScript files were deployed correctly.',
        primaryLabel: 'Open Home assessment',
        primaryHref: '/assessment/'
      });
      setStatus('Workspace data adapter unavailable', 'warning');
      return;
    }
    configurePageState({
      tone: 'empty',
      eyebrow: 'No assessment loaded',
      title: 'Complete a Home assessment on this device first.',
      message: 'The Workspace reads the latest saved Home Protection Snapshot from this browser. Complete or reopen the assessment, then return here and try again.',
      primaryLabel: 'Open Home assessment',
      primaryHref: '/assessment/'
    });
    setStatus(warning, 'empty');
  }

  function render() {
    if (workspaceDisposed || workspaceRenderInProgress) return;
    workspaceRenderInProgress = true;
    setRefreshBusy(true);
    setWorkspaceLoading(true);
    lastChecklistStructureSignature = '';
    lastTimelineStructureSignature = '';
    byId('workspaceLayout').hidden = true;
    byId('emptyState').hidden = true;
    if (!data || typeof data.getSnapshot !== 'function') {
      showEmpty({ diagnostics: { warnings: ['Workspace data adapter could not be loaded.'] } }, 'adapter');
      workspaceRenderInProgress = false;
      setRefreshBusy(false);
      return;
    }
    const snapshot = data.getSnapshot();
    if (snapshot.state !== 'ready') {
      showEmpty(snapshot, 'assessment');
      workspaceRenderInProgress = false;
      setRefreshBusy(false);
      return;
    }

    setWorkspaceLoading(false);
    byId('emptyState').hidden = true;
    byId('workspaceLayout').hidden = false;
    animateWorkspaceSurfaces();
    setChecklistShellState('loading');
    const checklistList = byId('checklistPhaseList');
    if (checklistList) checklistList.innerHTML = '';
    const checklistOverview = byId('checklistOverviewText');
    if (checklistOverview) checklistOverview.textContent = 'Preparing consultation phases and discussion items.';
    const timeline = byId('conversationTimeline');
    if (timeline) timeline.innerHTML = '<div class="conversation-timeline__empty">Preparing conversation timeline.</div>';
    byId('scoreValue').textContent = snapshot.assessment.score == null ? '—' : Math.round(snapshot.assessment.score);
    byId('scoreBand').textContent = snapshot.assessment.status;
    byId('customerName').textContent = snapshot.customer.name;
    byId('assessmentDate').textContent = displayDate(snapshot.assessment.createdAt);
    byId('primaryPriority').textContent = snapshot.assessment.topPriority || 'No major priority identified';
    byId('primaryStrength').textContent = snapshot.assessment.strongest || 'Assessment completed';
    byId('executiveSummary').textContent = snapshot.executiveSummary;

    renderClientIntake(snapshot);
    renderProperty(snapshot.property);
    renderRecommendations(snapshot.recommendations);

    const plan = planner && typeof planner.getPlan === 'function' ? planner.getPlan(snapshot) : null;
    currentConversationPlan = plan;
    window.CoverageFitAgentWorkspacePlan = plan;
    if (plan?.state === 'ready') {
      window.dispatchEvent(new CustomEvent('coveragefit:conversation-plan-ready', { detail: plan }));
      if (checklistEngine && typeof checklistEngine.restoreFromPlan === 'function') {
        checklistEngine.restoreFromPlan(plan);
      } else {
        setStatus('Assessment loaded, but the consultation checklist engine could not be loaded', 'warning');
      }
    } else {
      currentConversationPlan = null;
      const timelineRegion = byId('conversationTimeline');
      if (timelineRegion) timelineRegion.innerHTML = '<div class="workspace-inline-state workspace-inline-state--error cf-state" role="alert"><strong>Conversation plan unavailable</strong><p>The saved assessment loaded, but the planner could not prepare an agenda. Refresh the Workspace or review the assessment manually.</p><button class="button button--secondary button--compact cf-button cf-button--secondary cf-button--compact" type="button" data-workspace-action="retry">Prepare again</button></div>';
      const timelineSummary = byId('conversationTimelineSummary');
      if (timelineSummary) timelineSummary.textContent = 'Planner unavailable';
      if (checklistEngine && typeof checklistEngine.restoreFromPlan === 'function') {
        checklistEngine.restoreFromPlan(plan);
      }
      window.CoverageFitAgentWorkspaceChecklist = null;
      setStatus('Assessment loaded, but the conversation planner could not prepare an agenda', 'warning');
    }
    workspaceRenderInProgress = false;
    setRefreshBusy(false);
  }

  function handleWorkspaceAction(event) {
    const control = event.target.closest?.('[data-workspace-action]');
    if (!control) return;
    const action = control.dataset.workspaceAction;
    if (action === 'retry') {
      announce('Refreshing the Agent Workspace.');
      render();
    }
  }

  function handleSidebarToggle() {
    const sidebar = byId('checklistSidebar');
    const collapsed = !sidebar?.classList.contains('is-collapsed');
    setChecklistSidebarCollapsed(collapsed, { remember: true });
    announce(`Consultation checklist ${collapsed ? 'collapsed' : 'expanded'}.`);
  }

  listen(document, 'click', handleWorkspaceAction);
  listen(window, 'coveragefit:consultation-checklist-ready', handleChecklistEvent);
  listen(window, 'coveragefit:consultation-checklist-change', handleChecklistEvent);
  listen(window, 'coveragefit:consultation-checklist-reset', handleChecklistEvent);
  listen(byId('refreshWorkspace'), 'click', render);
  listen(byId('checklistSidebar'), 'click', handleChecklistAction);
  listen(byId('conversationTimeline'), 'click', handleTimelineAction);
  listen(byId('conversationTimeline'), 'keydown', handleTimelineKeydown);
  listen(byId('checklistSidebar'), 'keydown', handleSidebarKeydown);
  listen(byId('checklistSidebarToggle'), 'click', handleSidebarToggle);
  listen(window, 'resize', syncChecklistSidebarForViewport);
  listen(window, 'scroll', syncStickyHeaderDepth, { passive: true });
  listen(document, 'keydown', handleWorkspaceShortcuts);
  listen(window, 'pagehide', () => teardownWorkspace('pagehide'), { once: true });
  syncChecklistSidebarForViewport();
  syncStickyHeaderDepth();
  const unsubscribeWorkspaceData = data?.subscribe?.(render);
  if (typeof unsubscribeWorkspaceData === 'function') registerCleanup(unsubscribeWorkspaceData, 'subscription');
  render();
})();
