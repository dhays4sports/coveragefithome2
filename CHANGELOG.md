
## v3.19.8 — CF-INT-1G Consultation and Workspace Propagation
- Added unified client intake and 408FARMERS campaign context to the Agent Workspace.
- Propagated verified contact, property, review context, and integration metadata through the workspace adapter.
- Added a privacy-safe Client Intake card without displaying internal session identifiers.

## v3.19.6 — CF-INT-1E Contact Capture Prefill
- Prefilled the final editable name, email, phone, and property ZIP fields from the 408FARMERS prospect profile.
- Added a confirmation notice and privacy-safe readiness event.
- Preserved direct-visitor and manually entered values.
## 3.19.3 — P1.6.4 Professional Report Shell Certification

- Added immutable report-shell diagnostics with validity, certification, warnings, section IDs, and pagination mode.
- Propagated shell certification details through HTML renderer diagnostics.
- Certified the HTML renderer metadata for production use.
- Added end-to-end six-section report-shell certification coverage.
- Preserved partial-report rendering while preventing incomplete reports from being falsely marked certified.

## 3.19.2 — P1.6.3 Page Numbering and Print Pagination Controls

- Added CSS paged-media page counters to the shared running footer.
- Added page-numbering opt-out and immutable shell diagnostics.
- Prevented the last report section from forcing an unnecessary trailing blank page.
- Preserved the reusable report-shell and section-composer architecture.

## 3.19.1 — P1.6.2 Shared Header/Footer Content Integration

- Expanded the immutable report-shell context with report reference, producer title, license, phone, email, and agency address.
- Added model-driven contact and document-reference details to the cover page.
- Upgraded the running header/footer to include document type, client/property subject, agency/producer ownership, contact details, report reference, and confidentiality.
- Preserved cover opt-out, HTML escaping, section composition, and renderer architecture.
- Page numbering remains deferred to P1.6.3.

## 3.19.0 — P1.6.1 Professional Report Shell Foundation

- Added a reusable report-shell runtime service consumed by the HTML renderer.
- Added a model-driven CoverageFit cover page using real consultation metadata.
- Added shared running header and footer chrome for printed report pages.
- Added safe HTML escaping for shell-level client, property, agency, and date values.
- Preserved the section composer and renderer pipeline; individual sections remain independent.
- Page numbering and final cross-section print certification remain deferred to later P1.6/P1.7 sprints.

## 3.18.9 — P1.5.3 Professional Consultation Timeline Layout

- Added professional reviewed/current/upcoming timeline hierarchy.
- Added model-driven section state labels and topic-count metadata.
- Added a client-friendly status legend and a dedicated “Discussing now” marker.
- Added responsive refinements and print continuity for section headings, first items, timeline cards, reference panels, and the footer.
- Preserved unlimited timeline items, HTML escaping, immutable models, and the existing composer/renderer path.

## 3.18.8 — P1.5.2 Consultation Timeline Renderer

- Added semantic, model-driven consultation timeline HTML.
- Renders reviewed, current, and upcoming states with section progress, timing, prompts, producer notes, questions, and guardrails.
- Added responsive and US Letter print-safe styling.

## 3.18.6 — P1.4.3 Professional Checklist Layout

- Upgraded checklist phases into executive cards with current-phase emphasis.
- Added model-driven overall and phase progress meters.
- Improved active/completed item hierarchy, responsive behavior, and print continuity.

## 3.18.5 — P1.4.2 Checklist Renderer
- Added real semantic checklist HTML from the immutable AW-5 checklist model.
- Added dynamic phase, status, progress, timing, prompt, and note rendering.
- Added escaped responsive and print-safe checklist styles.

## 3.18.3 — P1.3.6 Recommendation Print Polish
- Improved multi-page recommendation pagination and section continuity.
- Added first-card group markers and group-count metadata.
- Added print break, widow, orphan, and footer continuity rules.
- Preserved recommendation content, ordering, grouping, and architecture.

## 3.18.1 — P1.3.4 Recommendation Ordering

- Deterministic model-level priority and category ordering is complete.
- Exact ties preserve source order; grouping remains deferred to P1.3.5.

## 3.18.0 — P1.3.3 Professional Recommendation Layout

- Upgraded Recommendations into an executive consultation page with CoverageFit branding, a dynamic priority overview, numbered recommendation rails, stronger information hierarchy, responsive behavior, and print-safe pagination.
- Preserved unlimited model-driven recommendations, HTML escaping, and composer-based rendering.

## 3.17.9 — P1.3.2 Recommendation Renderer

- Added real semantic HTML output for unlimited recommendation items.
- Added priority/category labels, explanations, suggested review topics, and optional consultation questions.
- Added escaped, responsive, print-safe recommendation styling.

## 3.17.7 - P1.2.3 Professional Property Summary Layout

- Upgraded the Property Summary into a polished consultation page with overview strip, structured property details, coverage snapshot cards, numbered risk highlights, print-safe page controls, and confidential footer.
- Preserved model-driven rendering and HTML escaping.

## 3.17.2 — P1.1.1 Executive Summary Data Model
- Added the immutable Executive Summary model service.
- Mapped real print-model data into client, property, consultation, Protection Score, priorities, strengths, and next steps.
- Integrated the model with the Executive Summary section without adding presentation markup.

## 3.16.7 — AW-6B.1A Print Section Registry

- Added `CoverageFitPrintSectionRegistry` as a reusable UMD runtime service.
- Added validated section registration, lookup, removal, clearing, metadata, deterministic ordering, and diagnostics.
- Added duplicate registration protection with explicit replacement support.
- Wired the registry into the Agent Workspace and Print Engine dependency boundary.
- Added `AW6B1A_QA.js` and sprint documentation.
- Did not add section components, composition, or visible printable content.

## v3.16.6

AW-6A.5 completed. Automatic renderer selection, end-to-end pipeline, renderer QA, and public Print Engine APIs finalized.

## 3.16.4 — AW-6A.4 Print Data Adapters

- Added the working `CoverageFitPrintAdapterRegistry` runtime and registered Home print adapter.
- Routed Print Engine source resolution through adapters while preserving the legacy direct-source path.
- Added adapter identity/version metadata to immutable print models.
- Added custom adapter registration and discovery APIs plus regression coverage.
- Added no printable HTML, print CSS, browser-print controls, PDF generation, or customer-facing changes.

## 3.16.1 — AW-6A.2 Print Model Validation & Section Contracts

- Added immutable print-model section contracts and contract version 1.
- Added public section and whole-model validation APIs with structural errors and printable-content warnings.
- Added validation summaries to print-model diagnostics while preserving schema version 1 and all AW-6A.1 fields.
- Added compatibility-safe normalization, documentation, and regression coverage.
- Added no printable HTML, print CSS, browser-print controls, PDF generation, or customer-facing changes.

## 3.16.0 — AW-6A.1 Print Engine Skeleton

- Added the reusable `CoverageFitPrintEngine` and immutable print-model schema version 1.
- Wired the print-model layer to the Workspace Data, Conversation Planner, and Consultation Checklist contracts.
- Added explicit source injection, source-version metadata, diagnostics, engine documentation, and regression coverage.
- Added no printable HTML, print controls, print CSS, PDF behavior, or customer-facing changes.

## 3.15.9 — WR-1C.8 Final Production Certification

- Issued the final Workspace readiness score of 9.6 / 10.
- Certified the Home-focused Agent Workspace as the stable v3.15 production baseline for controlled production use.
- Closed WR-1 and documented remaining manual browser, assistive-technology, performance, soak, and live-deployment operational gates.
- Added final certification, readiness-score, sprint, test-report, and automated validation artifacts.
- No Workspace runtime, API, event, persistence, recommendation, report, or customer-facing behavior changes.

## 3.15.8 — WR-1C.7 Release Notes

- Added the official CoverageFit v3.15 release notes, executive highlights, and migration guide.
- Consolidated AW-1 through AW-5, WR-1A, WR-1B, and completed WR-1C milestones into one release narrative.
- Documented compatibility expectations for future Home, Business, Landlord, and Life Workspace development.
- Added automated release-documentation validation.
- No runtime application behavior changed.

## 3.15.7 — WR-1C.6 Regression Freeze & API Baseline

- Froze the Agent Workspace public APIs, schemas, storage keys, lifecycle events, diagnostics, and immutable Workspace contract.
- Added machine-readable and human-readable API baseline documents.
- Added automated compatibility enforcement for future development.
- Defined semantic-version and deprecation rules for additive and breaking changes.
- No assessment, planner, checklist, persistence, recommendation, report, or customer-facing runtime behavior changes.

## 3.15.6 — WR-1C.3 Cross-Browser Certification

- Added automated browser-compatibility checks and a documented support matrix.
- Hardened UUID generation against unavailable browser crypto globals.
- Verified modern-browser fallbacks for motion, scrolling, viewport sizing, forced colors, and reduced motion.
- Attempted local headless Chromium execution; the container process timed out during environment initialization, so browser execution remains a manual gate. The complete source-level compatibility and regression baselines passed.
- Documented manual Safari, Firefox, Edge, iOS, and Android release gates without claiming unperformed tests.
- No assessment, planner, checklist, persistence, recommendation, report, or customer-facing workflow changes.

## 3.15.5 — WR-1C.2 Deployment Verification

- Added Netlify-compatible deployment configuration and static-host security headers.
- Added favicon, web manifest, robots, sitemap, and a dedicated 404 page.
- Normalized deployment metadata across all HTML routes, including the campaign redirect shim.
- Added automated deployment validation covering routes, metadata, assets, headers, and sitemap completeness.
- Verified clean extraction, local static serving, regression compatibility, and final package integrity.
- No assessment, planner, checklist, Workspace state, persistence, recommendation, or report behavior changes.

## 3.15.4 — WR-1B.10 Production Candidate

- Froze the polished Agent Workspace as the WR-1B production candidate.
- Added consolidated production-candidate, release-checklist, accessibility, performance, and regression reports.
- Revalidated the complete regression baseline, JavaScript syntax, static release integrity, and fresh-package extraction.
- Closed WR-1B while preserving WR-1C as the final manual production-audit and release-signoff gate.
- No Workspace runtime, planner, checklist, persistence, event-contract, recommendation, report, or customer-facing behavior changes.

## 3.15.3 — WR-1B.9 Interaction Polish

- Added reduced-motion-aware scrolling helpers and consistent sticky-header depth feedback.
- Added Alt+R Workspace refresh and Alt+C checklist visibility shortcuts with accessible shortcut metadata.
- Added refresh busy feedback, duplicate-refresh guarding, improved press/hover/disabled states, and safer touch behavior.
- Added explicit reset-cancellation announcements while preserving native confirmation dialogs.
- Added `WR1B9_QA.js` and sprint documentation.
- No planner, checklist-engine, persistence, event-contract, recommendation, or customer-facing behavior changes.

## 3.15.2 — WR-1B.8 Responsive Refinement

- Refined Workspace layouts for ultrawide desktops, compact laptops, tablets, foldables, landscape devices, and narrow phones.
- Added responsive content widths, grid adjustments, bounded checklist heights, safer header wrapping, and small-screen spacing refinements.
- Preserved all Workspace data, planner, checklist, persistence, event, motion, and performance behavior.
- Added `WR1B8_QA.js` and sprint documentation.

## 3.15.1 — WR-1B.7 Memory & Event Audit

- Added idempotent Workspace lifecycle teardown.
- Centralized listener and subscription cleanup.
- Cleared Workspace-owned timers on teardown and page exit.
- Added lifecycle diagnostics and duplicate-initialization protection.

## 3.15.0 — WR-1B.6 Render Performance

- Added stable render signatures for checklist, timeline, property, and recommendation surfaces.
- Skipped full DOM rebuilds when event payloads do not change a surface's rendered structure.
- Replaced unconditional progress writes with targeted DOM updates.
- Added immutable Workspace performance diagnostics for render counts, skipped renders, progress updates, and last event duration.
- Added `WR1B6_QA.js` and sprint documentation.
- No planner, checklist-engine, persistence, event-contract, motion, or customer-facing behavior changes.

## 3.14.9 — WR-1B.5 Component Cleanup

- Added a shared Workspace component vocabulary for cards, inset surfaces, buttons, badges, section headings, states, lists, and progress tracks.
- Applied shared component classes to static and JavaScript-generated Workspace markup while retaining all legacy class hooks.
- Centralized control heights, card padding, component gaps, and badge spacing in design tokens.
- Added `WR1B5_QA.js` and sprint documentation.
- No planner, checklist, persistence, event, motion, or customer-facing behavior changes.

## 3.14.8 — WR-1B.4.5 Motion Audit

- Audited Workspace motion for duplicate timers, cleanup reliability, reduced-motion compliance, focus stability, layout-shift risk, and interaction safety.
- Upgraded `CoverageFitWorkspaceMotion` to 0.2.0 with centralized class cleanup and replacement of overlapping timers.
- Routed checklist, timeline, progress, phase-refresh, and sidebar motion cleanup through the shared motion utility.
- Added `WR1B4_5_QA.js` and `WR1B4_5_MOTION_AUDIT.md`.
- No planner, checklist state, persistence, event-contract, or customer-facing behavior changes.

## 3.14.7 — WR-1B.4.4 Workspace Polish Motion

- Added a loading-to-ready exit transition and staggered Workspace surface entrance.
- Added subtle entrance motion for empty, error, property, recommendation, planner, and checklist recovery states.
- Added smooth mobile checklist sidebar expand/collapse behavior.
- Preserved native reset confirmations and all Workspace data, planner, checklist, persistence, and event behavior.
- Added WR1B4_4_QA.js and sprint documentation.

## 3.14.6 — WR-1B.4.3 Timeline & Progress Motion

- Added subtle current, completed, and updated timeline-topic transitions.
- Added motion feedback for percentage, completed-count, remaining-time, phase, and consultation-complete updates.
- Added smooth current-topic positioning while preserving reduced-motion behavior.
- Routed all timing through the shared Workspace motion foundation.
- Added WR1B4_3_QA.js and sprint documentation.

## 3.14.5 — WR-1B.4.2 Checklist Motion

- Added subtle checklist completion, reopen, and active-item transitions.
- Added phase refresh transitions after checklist events and resets.
- Routed animation timing through the shared Workspace motion foundation.
- Preserved reduced-motion behavior and checklist event-driven rendering.
- Added WR1B4_2_QA.js and sprint documentation.

# Changelog

## 3.14.4 — WR-1B.4.1 Motion Foundation

- Added shared Workspace motion duration and easing tokens.
- Added reusable fade, slide, scale, collapse, and surface-transition CSS utilities.
- Added a frozen `CoverageFitWorkspaceMotion` helper for reduced-motion detection, duration resolution, frame scheduling, preference subscriptions, and timing waits.
- Added global reduced-motion safeguards without opting existing components into new animation behavior.
- Added dedicated motion-foundation regression coverage.

## 3.14.3 — WR-1B.3 Empty & Error States

- Added intentional page-level empty and deployment-error states with clear recovery actions.
- Added dedicated missing-property and missing-recommendation states.
- Added planner and checklist recovery controls without changing engine behavior.
- Added a visible warning when checklist progress cannot be persisted.
- Added responsive, accessible, high-contrast-compatible state components.

# CoverageFit Changelog

## 3.14.2 — WR-1B.2 Loading Experience
- Added an intentional Agent Workspace loading surface with summary, property, timeline, recommendation, and checklist skeletons.
- Replaced the checklist spinner with a structured loading preview that better matches the final sidebar layout.
- Added responsive skeleton layouts for desktop, tablet, and narrow mobile screens.
- Added reduced-motion support and screen-reader loading semantics.
- Kept Workspace data, planner, checklist, persistence, event, and customer-facing behavior unchanged.
- Added dedicated loading-experience regression coverage.

## 3.14.1 — WR-1B.1 Design Tokens & Visual Consistency
- Added a semantic Workspace design-token system for brand, surface, text, border, status, focus, typography, spacing, radius, elevation, and motion values.
- Added compatibility aliases so existing Agent Workspace components retain their behavior while moving onto the shared token layer.
- Normalized card, button, sidebar, timeline, checklist, progress, empty-state, and responsive spacing styles.
- Reduced visual drift caused by hard-coded values without changing Workspace data, checklist, timeline, persistence, or customer-facing behavior.
- Added dedicated design-token regression coverage.

## 3.14.0 — WR-1A Validation & Regression Hardening
- Added realistic end-to-end Workspace scenarios for complete, partial, and empty Home assessment data.
- Added consultation walkthrough coverage across planner generation, checklist interaction, persistence restoration, refresh, and reset behavior.
- Added hardening coverage for repeated reset cycles, rapid status changes, blocked storage, corrupt and incompatible records, missing planner data, responsive behavior, keyboard safeguards, and checklist lifecycle listeners.
- Added a consolidated WR-1A production-readiness test report and documented known validation boundaries.
- Marked the AW-5 Consultation Checklist milestone complete and opened the WR-1 production-readiness milestone.
- No customer-facing assessment, recommendation, report, or pricing behavior changed.

## 3.13.7 — AW-5B.7 Mobile Optimization
- Added bounded, independently scrollable checklist behavior for tablet and phone layouts.
- Added sticky mobile checklist header, progress summary, and phase controls.
- Added dynamic viewport-height and safe-area support for modern mobile browsers.
- Improved compact card spacing, narrow-screen action layouts, text wrapping, and timeline ergonomics.
- Added automatic first-load collapse on mobile while preserving the user’s manual sidebar preference during the session.
- Added dedicated mobile optimization regression coverage.

## 3.13.6 — AW-5B.6 Accessibility
- Added screen-reader instructions and a polite atomic live announcement region.
- Added roving-tabindex keyboard navigation for the conversation timeline with arrow, Home, and End keys.
- Preserved keyboard focus across event-driven checklist and timeline rerenders.
- Added Escape-key collapse and focus return for the mobile checklist sidebar.
- Expanded semantic labels, current-step states, focus-visible treatment, touch targets, forced-colors support, and reduced-motion compatibility.
- Added dedicated accessibility regression coverage.

## 3.13.5 — AW-5B.5 Timeline Synchronization
- Restored the Agent Workspace conversation timeline UI from the existing conversation planner contract.
- Synchronized timeline current, upcoming, and reviewed states with the consultation checklist event payload.
- Added timeline-to-checklist activation so selecting a timeline topic activates the matching checklist item.
- Advanced the active consultation topic after completing an item when another pending topic remains.
- Kept the checklist engine and immutable workspace contract as the only source of consultation state.
- Added dedicated timeline synchronization regression coverage.

## 3.13.4 — AW-5B.4 Progress Display
- Added live checklist completion percentage and an accessible progress bar.
- Added completed-item count, remaining consultation minutes, and current-phase display.
- Added a consultation-complete state when every checklist item is complete.
- Kept all progress values sourced from the immutable Workspace contract and existing checklist events.
- Preserved checklist calculations, persistence, timeline behavior, and customer-facing applications.
- Added dedicated progress-display regression coverage.

## 3.13.3 — AW-5B.3 Checklist Interaction
- Added event-driven checklist completion, reopening, active-item selection, item reset, phase reset, and full reset controls.
- Routed every mutation through the Consultation Checklist engine so rendered state remains event-driven and persistence-compatible.
- Added confirmation prompts for phase and full-checklist resets.
- Added keyboard-focus, hover, disabled, and mobile interaction styling.
- Preserved checklist generation, planner logic, diagnostics, timeline behavior, and customer-facing applications.
- Added dedicated checklist-interaction regression coverage.

## 3.13.2 — AW-5B.2 Read-only Checklist Rendering
- Rendered consultation phases and checklist items from the immutable Workspace contract.
- Added current, upcoming, active, and completed visual states without introducing mutations.
- Added phase and item estimated-time metadata plus required and optional labels.
- Replaced AW-5B.1 content placeholders with a real read-only checklist region.
- Preserved checklist engine, persistence, event, timeline, and customer-facing behavior.
- Added dedicated checklist-rendering regression coverage.

## 3.13.1 — AW-5B.1 Consultation Checklist Sidebar Shell
- Added the structural Agent Workspace consultation-checklist sidebar.
- Added loading, empty, error, and ready shell states without rendering checklist items.
- Added a progress placeholder and phase-region placeholder for later AW-5B sprints.
- Added sticky desktop positioning and responsive mobile collapse behavior.
- Preserved checklist engine, persistence, event, diagnostics, and customer-facing behavior.
- Added dedicated sidebar-shell regression coverage.

## 3.13.0 — AW-5A.4.6 Release Stabilization
- Added a one-command regression runner covering every included JavaScript QA suite.
- Added static release checks for required routes, local HTML references, and release-version consistency.
- Replaced stale checklist-engine version assertions with forward-compatible semantic-version checks.
- Converted legacy QA file paths to project-relative paths so tests run from any extracted location.
- Normalized Agent Workspace roadmap status and restored newest-first changelog ordering.
- No production runtime behavior or customer-facing files changed.

## 3.12.9 — AW-5A.4.5B Regression Suite
- Added a 65-check end-to-end regression suite for the Consultation Checklist engine.
- Covered progress calculations, reset behavior, planner regeneration, persistence restoration and recovery, diagnostics, and Workspace contract integrity.
- Confirmed all prior AW-5A.4 contract, event, and diagnostics regressions remain green.
- No production behavior or customer-facing files changed.

## 3.12.8 — AW-5A.4.5A Diagnostics Expansion
- Added engine version, planner fingerprint, checklist fingerprint, storage health, generation timestamp, and integrity status to checklist diagnostics.
- Added deterministic checklist-state fingerprinting without changing planner or persistence behavior.
- Preserved the existing event-driven immutable Workspace contract and customer-facing behavior.
- Added executable diagnostics regression coverage.

## 3.12.7 — AW-5A.4.4B Workspace Event Integration
- Added Agent Workspace listeners for checklist ready, change, and reset lifecycle events.
- Removed direct checklist workspace-state reads from `agent-workspace.js`.
- Workspace checklist state and progress status now update exclusively from immutable event payloads.
- Preserved planner generation, checklist restoration, persistence, manual refresh, and customer-facing behavior.
- Added executable event-integration regression coverage.

## 3.12.6 — AW-5A.4.4A Event System Skeleton
- Added centralized checklist lifecycle event names for ready, change, and reset.
- Checklist events now carry an immutable workspace-state contract plus reason, engine version, and timestamp.
- Moved checklist-ready dispatch ownership from the Agent Workspace into the checklist engine.
- Added engine-native reset, resetItem, and resetPhase methods so reset events and persistence execute through the stable frozen API.
- Added regression coverage for event names, immutable payloads, status-change events, reset events, and the absence of Workspace event listeners.

## v3.12.5 — AW-5A.4.3C Workspace Contract Integration

- Refactored Agent Workspace checklist reads to use only `getWorkspaceState()`.
- Removed direct consumption of checklist snapshots returned by lifecycle methods.
- Updated checklist-ready event detail and workspace global to expose the immutable contract.
- Preserved planner generation, checklist restoration, persistence, and visible UI behavior.

## 3.12.4 — Sprint AW-5A.4.3B Expanded Workspace Contract
- Expanded `CoverageFitConsultationChecklist.getWorkspaceState()` with progress, current phase, remaining minutes, and planner version.
- Reused existing checklist progress and remaining-time getters without introducing new calculations.
- Deep-froze the complete workspace contract, including nested snapshots, to enforce read-only consumption.
- Preserved Workspace, planner, persistence, event, UI, and customer-facing behavior.

## 3.11.6 — Sprint AW-5A.3 Persistent Checklist State
- Upgraded the Consultation Checklist engine to version 0.3.0.
- Added versioned, per-consultation local persistence and automatic restoration.
- Added status mutation APIs for activating, completing, and reopening checklist items.
- Added safe recovery for corrupt, incompatible, expired, unavailable, and unwritable storage.
- Updated Agent Workspace initialization to restore the current checklist from the AW-3 plan without adding UI.
- Added executable persistence and recovery tests while preserving customer-facing engines.

## 3.11.5 — Sprint AW-5A.2 Planner-to-Checklist Generation
- Upgraded the Consultation Checklist engine to version 0.2.0.
- Added deterministic checklist generation from the AW-3 Conversation Planner contract.
- Preserved phases, source agenda items, recommendation IDs, timing, priority, confidence, prompts, coaching notes, and evidence.
- Added stable item IDs, checklist fingerprints, duplicate recovery, validation, and diagnostics.
- Wired checklist generation into the Agent Workspace and exposed a stable checklist contract without adding UI or persistence.
- Added executable engine tests while preserving all customer-facing engines.

## 3.11.2 — Sprint AW-3 Conversation Planner Engine
- Added a versioned, deterministic `CoverageFitConversationPlanner` engine that consumes the AW-2 workspace snapshot contract.
- Generates a structured consultation agenda with opening, property context, prioritized review topics, whole-picture connections, and next steps.
- Orders recommendation topics by priority, confidence, and original engine order without changing recommendation logic.
- Added estimated timing, discussion prompts, coaching notes, source recommendation IDs, educational guardrails, and diagnostics.
- Wired the planner into the Agent Workspace and exposed the current plan for AW-4 without rendering the timeline UI early.
- Added executable planner fixture tests while preserving all customer-facing engines.

## 3.11.1 — Sprint AW-2 Shared Workspace Data Layer
- Added a versioned, read-only `CoverageFitWorkspaceData` adapter as the single data boundary for the Agent Workspace.
- Normalized customer, assessment, score, strengths, recommendations, property, attribution, and diagnostic data into a stable schema.
- Added safe ready and empty states, malformed-data diagnostics, and report/property storage subscriptions.
- Refactored the AW-1 renderer to consume the adapter instead of reading raw local storage or report shapes directly.
- Added executable adapter fixture tests without changing any customer-facing engine.

## 3.11.0 — Sprint AW-1 Agent Workspace Foundation
- Rebuilt `/agent/workspace/` from the v3.10.0 B.4B production baseline.
- Added a responsive internal workspace shell with an internal-only header and explicit customer-report link.
- Added executive summary, Protection Score, customer, priority, and positive-foundation presentation.
- Added a property snapshot that reads the existing Property Intelligence profile without changing it.
- Added top recommendation-topic cards sourced from the existing Home report payload.
- Added safe empty-state handling when no Home assessment exists on the device.
- Removed abandoned B.13A workspace adapter and planner files so later workspace experiments cannot affect the clean rebuild.
- Preserved all customer assessment, scoring, recommendation, attribution, report, and Property Intelligence engines.

## 3.10.0 — Sprint B.4B
- Added an editable Property Profile confirmation step before the Home assessment.
- Prefills saved or provider-supplied property data and clearly asks the homeowner to confirm or correct it.
- Saves user-verified address and property facts into the shared Property Intelligence profile.
- Carries confirmed ZIP and property profile data into the existing contact, assessment, and report payloads.
- Added profile completeness feedback, mobile layouts, reduced-motion support, and partial-profile continuation.

## 3.7.0 — Sprint B.2A
- Added deterministic confidence, impact, client explanation, conversation starter, producer notes, and supporting-answer metadata to normalized recommendations.
- Improved recommendation ordering using priority, confidence, evidence, and rule support.
- Enriched Home report cards with impact, confidence, evidence, and conversation prompts.

## 3.6.1 — Sprint B.1.1 Attribution Receiver

- Added cross-site campaign attribution receiving and persistence.
- Added attribution to assessment, report, lead, and analytics payloads.
- Added `INTEGRATION-ATTRIBUTION.md` and `SPRINT-B.1.1.md`.

## 3.6.0
- Consolidated Home and Business into one registered recommendation pipeline.
- Added product-specific Home and Business rule modules.
- Reduced the legacy Business recommendation file to a compatibility adapter.
- Centralized generation, merging, priority upgrades, enrichment, sorting, diagnostics, and product registration.
- Added a documented extension path for Landlord, Auto, and Life.


## 3.5.0 — Sprint 4: Shared Recommendation Engine
- Added a shared recommendation collector for Home and Business reports.
- Centralized priority normalization, de-duplication, priority upgrades, evidence merging, rule identifiers, and sorting.
- Migrated Business recommendations onto the shared collector without changing existing industry or conditional rules.
- Routed Home priority topics through the same shared normalization layer without changing Home scoring or topic selection.
- Preserved Trigger Library enrichment and Dynamic Illustration behavior.
- Removed the duplicate Volunteer Accident trigger definition identified during Sprint 3 QA.

## 3.4.0 — Sprint 3: Trigger Library
- Added shared trigger library for Home and Business reports.
- Added why-it-matters, practical-example, and question-to-discuss content.
- Wired all current Business recommendation topics to the shared library.
- Wired Home priority cards to the shared library.
- Added responsive and print-safe trigger detail cards.
- Preserved assessment, scoring, priority, and recommendation calculations.

## 3.3.0 — Sprint 2: Journey Timeline Engine
- Added shared report journey timelines.
- Removed inherited duplicate Business executive sections.

- v3.5.1: Removed duplicate Volunteer Accident trigger reference and prepared recommendation engine consolidation.

## 3.8.0 — Sprint B.3 Interactive Coverage Snapshot
- Added an interactive Home Coverage Snapshot dashboard to the report.
- Added animated score ring, category breakdown, priority/strength tabs, and next-conversation CTA.
- Reused the existing score, categories, strengths, and B.2A recommendation intelligence payload.

## 3.9.0 — Sprint B.4A Property Intelligence Framework
- Added a provider-neutral property intelligence service and profile schema.
- Added normalized address handling, provider adapters, field confidence, caching, persistence, and manual fallback.
- Added optional property profile data to the Home assessment payload.



- AW-5A.1 Checklist engine foundation added.

AW-5A.4.1 Progress Engine implemented.


- AW-5A.4.2A: Added reset()/clear() skeleton APIs.

- AW-5A.4.2B: Added resetItem API.

AW-5A.4.2C Reset Phase implemented.

- AW-5A.4.2D Persistence Integration

- AW-5A.4.2E Planner Regeneration implemented.


## AW-5A.4.3A
- Added immutable getWorkspaceState() public contract skeleton exposing checklist, summary, diagnostics and version. No UI or persistence changes.


## AW-6A.3
Implemented print snapshot & serialization boundary.

## 3.16.9 — AW-6B.1C Document Composer
- Added the runtime Document Composer for immutable print models.
- Added deterministic registry-to-document section composition without HTML rendering.
- Corrected AW-6B.1B section registration and loaded section modules in the workspace runtime.
- Added composer regression coverage.

## 3.17.0 — AW-6B.1D Visibility Engine
- Added the standalone print visibility runtime service.
- Added required-data checks, conditional section visibility, immutable empty-state decisions, and fail-closed diagnostics.
- Integrated visibility decisions into the Document Composer without adding HTML rendering.
## v3.17.1 — AW-6B.1E Renderer Integration
- Integrated the HTML renderer with the immutable Document Composer.
- Visible sections are rendered dynamically in registry/composer order.
- Added section-output validation and renderer diagnostics.
- Added browser runtime loading for the renderer registry before Print Engine initialization.
- No printable section content or hard-coded section ordering was introduced.

## 3.17.4 — P1.1.3 Executive Summary Professional Layout
- Added a professional, print-ready Executive Summary page.
- Added secure HTML escaping for model-derived content.
- Added responsive and US Letter print styling to the composed HTML document.

## 3.17.5 — P1.2.1 Property Summary Data Model
- Added the immutable Property Summary model and integrated it with the Property Summary print section.
- Added tolerant mapping, validation diagnostics, and regression coverage without introducing presentation markup.

## 3.17.6 — P1.2.2 Property Summary Renderer
- Added real semantic Property Summary HTML rendering from the immutable model.
- Added safe formatting, HTML escaping, partial-data states, and print-safe base styles.

## 3.17.8 — P1.3.1 Recommendation Data Model
- Added the immutable Recommendation print model and integrated it with the Recommendations section.

## 3.18.2 — P1.3.5 Recommendation Groups
- Added immutable category grouping and grouped recommendation rendering.

## 3.18.4 — P1.4.1 Checklist Data Model

- Added the immutable Checklist print data model.
- Normalized AW-5 checklist phases, items, statuses, priorities, progress, timing, and traceability.
- Wired the Checklist section to the dedicated model without adding presentation markup.
- Added P1.4.1 regression coverage.

## v3.19.4 — CF-INT-1C
- Added CoverageFit prospect-prefill intake for 408FARMERS handoffs.
- Added dual browser storage and immediate URL privacy cleanup.
- Preserved non-PII attribution and direct-visitor behavior.

## v3.19.7 — CF-INT-1F Unified Assessment Payload
- Unified verified consumer, property, review-context, and 408FARMERS integration data in the saved assessment payload.
- Preserved backward compatibility with existing report and submission contracts.
