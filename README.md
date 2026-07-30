## Current release: 3.19.3

P1.6.4 certifies the Professional Report Shell as a production renderer boundary. Complete reports now expose immutable shell diagnostics, certification state, section traceability, warnings, and pagination mode through the HTML renderer.

## Current release: 3.19.1

P1.6.2 expands the Professional Report Shell with model-driven producer, agency, contact, document-reference, and confidentiality details across the cover and shared running header/footer. Page numbering remains deferred to P1.6.3.

## Current release: 3.19.0

P1.6.1 adds the Professional Report Shell Foundation. The HTML renderer now composes the existing section output inside a reusable report shell with a model-driven cover page and shared print header/footer chrome. Page numbering and final browser-print controls are intentionally deferred.

## Current release: 3.18.9

P1.5.3 upgrades the Consultation Timeline into a professional, state-aware, responsive, print-safe report section while preserving the immutable timeline model → section → composer → HTML renderer path.

## Current release: 3.18.8

P1.5.2 adds the real Consultation Timeline renderer while preserving the immutable model → section → composer → HTML renderer path.

## Current release: v3.18.6

P1.4.3 adds the professional Consultation Checklist layout while preserving the immutable checklist model and section-driven print pipeline.

## Current release: v3.18.5
P1.4.2 adds the model-driven printable Consultation Checklist renderer. Professional checklist layout refinement remains P1.4.3.

## Current release: v3.18.3
P1.3.6 improves recommendation print pagination for long, grouped consultation reports while preserving the immutable model and section-driven renderer pipeline.

## P1.3.4 Recommendation Ordering

- Deterministic model-level priority and category ordering is complete.
- Exact ties preserve source order; grouping remains deferred to P1.3.5.

## Printable Recommendations

P1.3.2 adds model-driven semantic HTML for consultation recommendations. The section supports unlimited recommendations and remains composed through the shared Print Engine pipeline.

## Current release: 3.17.7

P1.2.3 adds the professional Property Summary print layout.

## Current product sprint
P1.1.1 adds the production Executive Summary data model. The printable visual component remains intentionally deferred to P1.1.2.

## v3.16.7

AW-6B.1A adds the runtime Print Section Registry. It provides validated registration, deterministic ordering, immutable metadata, duplicate protection, dependency injection into the Print Engine, and regression coverage. No printable content or composer behavior is included in this micro sprint.

## v3.16.6

AW-6A.5 completed. Automatic renderer selection, end-to-end pipeline, renderer QA, and public Print Engine APIs finalized.


## CoverageFit v3.15 Agent Workspace Baseline

Version 3.15 establishes the first production-ready Agent Workspace baseline, including the Conversation Planner, synchronized timeline, persistent consultation checklist, progress tracking, accessibility, responsive behavior, render/lifecycle hardening, deployment controls, and frozen compatibility contracts.

Release documentation:

- `RELEASE_NOTES_v3.15.md`
- `RELEASE_HIGHLIGHTS.md`
- `MIGRATION_GUIDE_v3.15.md`
- `WR1C_API_BASELINE.md`

## CoverageFit v3.16 Print Engine Foundation

AW-6A.1 introduced `CoverageFitPrintEngine`. AW-6A.2 added section contracts and validation. AW-6A.3 established the serialization boundary. AW-6A.4 adds a working adapter registry and Home adapter so future Business, Landlord, and Life modules can plug into the same print pipeline. See `AW6_PRINT_ENGINE.md`, `AW6_PRINT_MODEL_CONTRACTS.md`, `AW6_PRINT_SERIALIZATION.md`, and `AW6_PRINT_ADAPTERS.md`.

# CoverageFit v1 Pilot

Deployment-ready pilot focused on one journey:

1. Landing page
2. 10-question guided assessment
3. Compact Protection Snapshot
4. Call/text booking page

## Configure
Edit `/producer.json`. The active Formspree endpoint is controlled by `formEndpoint`.

## Test routes
- `/`
- `/assessment/`
- `/home/report/` after assessment submission
- `/book/`
- `/triggers/homebuyer/`
- `/triggers/renewal/`
- `/triggers/premium-increase/`


## Meta Conversion Update
Added emotional trigger copy, risk-removing CTAs, early insight after question 2, human report introduction, and a reassuring booking page.


## CoverageFit Platform Update
- Root is now a platform chooser for Home, Business, Landlord, Auto, and Life journeys.
- `/home/` is a full Home landing page; existing assessment remains at `/assessment/`.
- `/business/` is a first-class CoverageFit Business landing page.
- `/landlord/` is a new landlord review landing page with direct contact CTA.
- Shared navigation, trust language, journey footer, and universal Coverage Review positioning were added.

## CoverageFit v2.2 — Business Profile + Industry Routing
- `/business/profile/` is now the first step for Business reviews.
- Supports ten industry routes and stores the profile in both sessionStorage and localStorage under `coveragefit_business_profile`.
- The existing shared Business assessment remains unchanged in question content for this phase, but receives the selected `industry` and `module` routing parameters.
- Business profile details are carried into the assessment context, Formspree submission, saved report payload, and consumer record.

## CoverageFit v2.3 — First Five Industry Modules

Business assessment modules are now active for Contractor, Restaurant, Professional Office, Retail, and Nonprofit. Each module includes industry-specific questions, conditional follow-up questions, category labels, profile context, and structured response storage. Healthcare, Technology, Property Management, Manufacturing, and Other continue to use the general business assessment until later phases.


## CoverageFit v2.4 — Shared Coverage Questions

The Business journey now merges every industry path into a shared Current Coverage section. It captures current carrier, renewal date, claims, locations, vehicles, general liability, property, business income, workers compensation, cyber, umbrella, professional liability, and certificate/contract requirements. A unified five-step progress system is displayed across Business Profile, Industry Review, Current Coverage, Snapshot, and Contact Review.

## CoverageFit v2.5 Business Snapshot
- Replaced the Business report with Business Profile, Operations, Current Coverage, Risk Areas, and transparent Preparedness Score sections.
- Score starts at 100, applies only predefined answer deductions, and deducts 2 points for missing carrier or renewal date.
- Score is explicitly educational and is not underwriting, eligibility, pricing, or a coverage determination.


## CoverageFit Business v2.6

Added dedicated industry modules for Healthcare, Technology, Property Management, Manufacturing, and Other. All ten Business Profile selections now route to a seven-question industry module before merging into the shared Current Coverage section.

Each new module includes industry-specific labels, conditional questions, structured response keys, Business Profile context, report storage, and lead payload integration.

## CoverageFit Business v2.7 Recommendation Engine
- Adds industry baseline recommendation rules for all ten business modules.
- Adds answer-triggered conditional recommendations and priority upgrades.
- Groups report recommendations into High Priority Review, Recommended Discussion, and Additional Consideration.
- Explains why each topic appears and identifies the response source that triggered it.
- Recommendations are educational discussion topics, not underwriting or coverage determinations.

## CoverageFit Business v2.9 Production UI
- Branded staged Snapshot generation overlay
- Redesigned Contact Review experience and completion checklist
- Polished submit/success transition into the final report
- Improved empty states and report motion
- Score count-up and staggered recommendation animation
- Keyboard focus, live-region announcements, touch-target, contrast, and reduced-motion improvements
- Presentation-only enhancement; assessment, scoring, storage, and recommendation rules remain unchanged

## Recommendation pipeline

Version 3.6.0 uses one registered recommendation engine with separate Home and Business rule modules. See `RECOMMENDATION_PIPELINE_V3_6.md`.


## Agent Workspace v3.15 Certification

CoverageFit v3.15.9 is the certified stable Home-focused Agent Workspace baseline. See `WR1C_FINAL_PRODUCTION_CERTIFICATION.md`, `WR1C_READINESS_SCORE.md`, and `RELEASE_NOTES_v3.15.md`.


## AW-6A.3
Implemented print snapshot & serialization boundary.

## Print document composition
`CoverageFitPrintDocumentComposer.compose()` converts an immutable print model and registered section definitions into an ordered, immutable document structure. It does not render HTML; renderer integration is intentionally deferred.

### Print visibility
`assets/js/print-visibility.js` evaluates registered section requirements and visibility rules before composition. The Document Composer exposes visible and hidden sections as immutable structured output; it does not render HTML.
## Printable document runtime
The HTML print renderer is now composer-driven. It receives an immutable print model, composes registered sections, invokes only visible section renderers, and returns immutable HTML-renderer output. Section-specific printable content is intentionally not implemented in this release.

## Property Summary print model
Version 3.17.5 adds an immutable Property Summary model consumed by the print section. Visual rendering remains scheduled for P1.2.2.

### Recommendation Print Model
The printable consultation uses `CoverageFitRecommendationModel` to convert Recommendation Engine output into immutable, renderer-ready consultation data.

## v3.18.0 — Professional Recommendation Layout
Recommendations now render as a polished, client-facing consultation section with a priority summary and print-safe executive cards. Ordering and category grouping remain separate future sprints.

### P1.3.5 Recommendation Groups
Recommendations are organized into client-friendly protection categories while retaining deterministic priority order within each group.

### Checklist print model

The print pipeline now includes `CoverageFitChecklistModel`, an immutable adapter over the AW-5 consultation checklist. The Checklist section consumes this model; visible checklist rendering is intentionally deferred to P1.4.2.