## P1.6 Professional Report Shell

- **P1.6.1 Professional Report Shell Foundation — Complete (3.19.0)**
  - Reusable report-shell service
  - Model-driven cover page
  - Shared running print header/footer
  - Renderer integration
- **P1.6.2 Shared Header/Footer Content Integration — Complete (3.19.1)**
  - Producer and agency details
  - Report reference and document label
  - Structured running header/footer content
- **P1.6.3 Page Numbering and Print Continuity — Complete (3.19.2)**
- **P1.6.4 Report Shell Certification — Complete (3.19.3)**

Next: **P1.7.1 Cross-Section Print Integration Foundation**

Current: P1.5.3 Professional Consultation Timeline Layout complete.

Next: P1.6 Professional Report Shell, beginning with report metadata and document-level header/footer composition.

Current: P1.5.2 Consultation Timeline Renderer complete.
Next: P1.5.3 Professional Consultation Timeline Layout.

## Current: P1.4.3 Professional Checklist Layout — Complete

Next: P1.5.1 Consultation Timeline Data Model.

## Completed: P1.3.6 Recommendation Print Polish
Multi-page recommendation sections now include category-heading continuity, protected cards, widow/orphan controls, and print-specific spacing.

## P1.3.4 Recommendation Ordering

- Deterministic model-level priority and category ordering is complete.
- Exact ties preserve source order; grouping remains deferred to P1.3.5.

## P1 Printable Consultation

- P1.1 Executive Summary: complete.
- P1.2 Property Summary: complete through professional layout (P1.2.3).
- Next: P1.3 Recommendations.

## Printable Consultation MVP
- P1.1.1 Executive Summary Data Model: Complete
- P1.1.2 Executive Summary Renderer: Next

## v3.16.6

AW-6A.5 completed. Automatic renderer selection, end-to-end pipeline, renderer QA, and public Print Engine APIs finalized.

## Completed

- 3.6.1: Sprint B.1.1 CoverageFit Attribution Receiver.

- 3.6.0: Fully registered shared recommendation pipeline for Home and Business.

# Roadmap
- v3.1 ✅ Report Engine Refinement
- v3.2 ✅ Dynamic Illustration Engine
- v3.3 ✅ Journey Timeline Engine
- v3.4 ✅ Trigger Library
- v3.5 ✅ Shared Recommendation Engine
- v4.0 Home 2.0

Next integration milestone: B.1.2 — 408-FARMERS Attribution Sender.

Product roadmap resumes with v4.0 Home 2.0 after the integration milestone.


## Phase B — Recommendation Intelligence
- [x] B.2A Recommendation Intelligence metadata and Home report enrichment
- [ ] B.2B Confidence calibration and rule-level overrides
- [ ] B.2C Recommendation categories and customer grouping
- [ ] B.2D Producer talking-point workspace
- [ ] B.2E Cross-product recommendation ordering

## Phase B — Property Intelligence
- [x] B.4A Property Intelligence framework and provider contract
- [x] B.4B Home assessment prefill and editable confirmation
- [ ] B.4C Score, recommendation, trigger, and report integration
- [ ] B.4D Provider resilience and end-to-end QA

- B.13A.1 complete

## Agent Workspace Rebuild

- [x] AW-1 Workspace Foundation
  - Internal `/agent/workspace/` route
  - Responsive workspace shell and header
  - Executive summary and Protection Score
  - Property snapshot
  - Top recommendation topics
  - Empty-state and refresh behavior
- [x] AW-2 Shared Data Layer
  - Versioned read-only workspace adapter
  - Normalized customer, assessment, recommendation, and property contract
  - Diagnostics and storage subscriptions
  - AW-1 renderer migrated to the shared adapter
- [x] AW-3 Conversation Planner Engine
  - Deterministic agenda generation from the AW-2 snapshot
  - Priority, confidence, and source-order topic sequencing
  - Opening, property context, review, connection, and close phases
  - Estimated timing, prompts, coaching notes, guardrails, and diagnostics
  - Workspace wiring for AW-4 timeline consumption
- [x] AW-4 Conversation Timeline UI
- [x] AW-5 Consultation Checklist
  - [x] AW-5A Checklist Engine
  - [x] AW-5B Checklist UI
    - [x] AW-5B.1 Consultation Checklist Sidebar Shell
    - [x] AW-5B.2 Checklist Rendering
    - [x] AW-5B.3 Checkbox Interaction
    - [x] AW-5B.4 Progress Display
    - [x] AW-5B.5 Timeline Synchronization
    - [x] AW-5B.6 Accessibility
    - [x] AW-5B.7 Mobile Optimization

## Workspace Production Readiness

- [x] WR-1 Workspace Production Readiness
  - [x] WR-1A Validation & Regression Hardening
  - [x] WR-1B UI, Accessibility & Performance Polish
    - [x] WR-1B.1 Design Tokens & Visual Consistency
    - [x] WR-1B.2 Loading Experience
    - [x] WR-1B.3 Empty & Error States
    - [x] WR-1B.4 Motion System
      - [x] WR-1B.4.1 Motion Foundation
      - [x] WR-1B.4.2 Checklist Motion
      - [x] WR-1B.4.3 Timeline & Progress Motion
      - [x] WR-1B.4.4 Workspace Polish Motion
      - [x] WR-1B.4.5 Motion Audit
    - [x] WR-1B.5 Component Cleanup
    - [x] WR-1B.6 Render Performance
    - [x] WR-1B.7 Memory & Event Audit
    - [x] WR-1B.8 Responsive Refinement
    - [x] WR-1B.9 Interaction Polish
    - [x] WR-1B.10 Production Candidate
  - [x] WR-1C Documentation, Production Audit & Release Candidate

WR-1B.1 completed in v3.14.1 with a semantic Workspace design-token layer and visual consistency normalization.

WR-1A completed in v3.14.0. The Workspace now has realistic complete, partial, and empty-data walkthroughs plus resilience coverage for repeated mutations, refresh restoration, storage failures, corrupt persistence, missing planner data, responsive transitions, keyboard safeguards, and event integration.

- [ ] AW-6 Printable Consultation Sheet
  - [x] AW-6A.1 Print Engine Skeleton
  - [x] AW-6A.2 Print Model Validation & Section Contracts
  - [ ] AW-6A.3 Print Model Snapshot & Serialization Boundary
  - [ ] AW-6B Printable Layout
  - [ ] AW-6C Print Styling
  - [ ] AW-6D Browser Print Integration
  - [ ] AW-6E Print QA
- [ ] AW-7 Workspace Notes
- [ ] AW-8 Workspace Polish and QA

AW-1 was rebuilt from the v3.10.0 B.4B production baseline. AW-2 now provides the active shared workspace data boundary. AW-3 provides the active conversation-plan contract. AW-5A.3 now provides persistent checklist state for the future checklist interface. Abandoned B.13A workspace experiments are not part of the active architecture.

- [x] AW-5A.1 Checklist Data Model
- [x] AW-5A.2 Planner-to-Checklist Generation
- [x] AW-5A.3 Persistent Checklist State
- [x] AW-5A.4 Progress, Reset, and Workspace Contract

AW-5A.4.1 Progress Engine implemented.


- AW-5A.4.2A: Added reset()/clear() skeleton APIs.

- AW-5A.4.2B: Added resetItem API.

AW-5A.4.2C Reset Phase implemented.

- AW-5A.4.2D Persistence Integration

- AW-5A.4.2E Planner Regeneration implemented.


## AW-5A.4.3A
- Added immutable getWorkspaceState() public contract skeleton exposing checklist, summary, diagnostics and version. No UI or persistence changes.


## AW-5A.4.3B
- [x] Expanded the immutable checklist workspace contract with progress, current phase, remaining minutes, and planner version.
- [x] AW-5A.4.3C Refactor `agent-workspace.js` to consume only `getWorkspaceState()`.

## Completed — AW-5A.4.3C Workspace Contract Integration

The Agent Workspace now reads checklist data exclusively through the immutable `getWorkspaceState()` contract. Checklist lifecycle initialization remains internal to the engine boundary.

### Completed — AW-5A.4.4A Event System Skeleton

The checklist engine now owns ready, change, and reset lifecycle events. No Workspace listeners were added.

### Completed — AW-5A.4.4B Workspace Event Integration

The Agent Workspace now consumes checklist state exclusively through ready, change, and reset event payloads. Direct checklist-state refresh reads have been removed.

### Completed — AW-5A.4.5A Diagnostics Expansion

Checklist diagnostics now expose engine and planner identity, a deterministic checklist fingerprint, storage health, generation timestamp, and integrity status through the immutable Workspace contract.

### Completed — AW-5A.4.5B Regression Suite

The Consultation Checklist engine now has end-to-end behavioral coverage for progress, resets, planner regeneration, persistence compatibility, diagnostics, and Workspace contract integrity. AW-5A engine work is complete.

### Completed — AW-5A.4.6 Release Stabilization

The AW-5A release baseline now includes portable tests, one-command regression execution, static route and asset validation, and normalized release documentation.

### Completed — AW-5B.1 Consultation Checklist Sidebar Shell

The Agent Workspace now includes a responsive, state-aware checklist sidebar shell with loading, empty, error, progress-placeholder, and phase-placeholder regions. Checklist content and mutations remain deferred.

### Completed — AW-5B.2 Checklist Rendering

The checklist sidebar now renders real phases and discussion items from the immutable Workspace contract. Rendering remains read-only and includes current, active, completed, required, optional, and estimated-time states.

### Next
### Completed — AW-5B.5 Timeline Synchronization

- Restored a visible planner-backed conversation timeline in the Agent Workspace.
- Synchronized timeline states and activation with the event-driven checklist.
- Preserved the checklist engine as the only consultation state authority.

AW-5B.6 — Accessibility. Complete in v3.13.6.


### Completed — AW-5B.3 Checklist Interaction

Added engine-backed completion, reopening, active-item selection, item reset, phase reset, and full reset controls. All rendered updates continue to arrive through checklist lifecycle events.


### Completed — AW-5B.4 Progress Display
Live percentage, counts, remaining minutes, current phase, and consultation-complete state are rendered from the workspace contract.


### Completed — AW-5B.7 Mobile Optimization
Completed in v3.13.7. AW-5B Consultation Checklist UI milestone is complete.

WR-1B.2 completed in v3.14.2 with intentional Workspace and checklist skeleton loading states.

WR-1B.4.1 completed in v3.14.4 with shared motion tokens, reusable CSS utilities, a reduced-motion-aware JavaScript helper, and no component-specific animation changes.

WR-1B.4.2 completed in v3.14.5 with reduced-motion-aware checklist state transitions.

WR-1B.4.3 completed in v3.14.6 with timeline state transitions, progress feedback, and smooth current-topic positioning.

WR-1B.5 completed in v3.14.9 with shared component classes and additive compatibility hooks across static and generated Workspace surfaces.

WR-1B.6 completed in v3.15.0 with stable render signatures, targeted progress updates, and lightweight Workspace performance diagnostics.

WR-1B.9 completed in v3.15.3 with refined control feedback, reduced-motion-safe positioning, accessible keyboard shortcuts, refresh guarding, and reset-cancellation feedback.

WR-1B.10 completed in v3.15.4 with a frozen production-candidate baseline and consolidated accessibility, performance, regression, and release-readiness documentation. WR-1B is complete; WR-1C remains the final manual production gate.


### Completed — WR-1C.2 Deployment Verification

Completed in v3.15.5. Added and validated Netlify-compatible deployment controls, route metadata, security/cache headers, web manifest, robots, sitemap, 404 handling, and automated deployment QA. Live production deployment and cross-browser certification remain separate manual gates.


### Completed — WR-1C.3 Cross-Browser Certification

Completed in v3.15.6. Added a browser support baseline, automated compatibility checks, guarded browser API fallbacks, Chromium route smoke validation, and explicit manual browser/device sign-off boundaries.

### Completed — WR-1C.6 Regression Freeze & API Baseline

Completed in v3.15.7. Froze public Workspace APIs, events, persistence schemas, diagnostics, and immutable contract fields with machine-readable documentation and automated compatibility enforcement.

### Next

### Completed — WR-1C.7 Release Notes

Completed in v3.15.8 with official release notes, release highlights, migration guidance, and automated documentation validation.

### Completed — WR-1C.8 Workspace Readiness Score & Final Production Certification

Completed in v3.15.9. WR-1 is closed and the Home-focused Agent Workspace is certified as the stable v3.15 production baseline.

### Active — AW-6 Printable Consultation Sheet

AW-6A.1 completed in v3.16.0. AW-6A.2 completed in v3.16.1 with immutable section contracts and validation. The next sprint is AW-6A.3 Print Model Snapshot & Serialization Boundary.


## AW-6A.3
Implemented print snapshot & serialization boundary.


### Completed — AW-6A.4 Print Data Adapters

Completed in v3.16.4 with a working adapter registry, registered Home adapter, Print Engine delegation, immutable adapter diagnostics, and backward-compatible direct-source fallback.

### Next

AW-6B.1 — Printable Layout Shell.
## AW-6B Printable Consultation Architecture

- **AW-6B.1A — Print Section Registry: Complete in v3.16.7.** Runtime registry, validation, ordering, metadata, diagnostics, and dependency wiring are implemented.
- AW-6B.1B — Section Definitions: Next. Register reusable section contracts without changing visible output.
- AW-6B.1C — Document Composer: Planned.
- AW-6B.1D — Visibility and Empty States: Planned.
- AW-6B.1E — Renderer Integration: Planned.
- AW-6B.1F — Composition Diagnostics: Planned.
- AW-6B.1G — Architecture Certification: Planned.


## AW-6 Printable Consultation
- [x] AW-6B.1A Section Registry
- [x] AW-6B.1B Section Definitions
- [x] AW-6B.1C Document Composer
- [ ] AW-6B.1D Visibility Engine
- [ ] AW-6B.1E Renderer Integration
- [ ] AW-6B.1F Diagnostics
- [ ] AW-6B.1G Certification

### AW-6B.1D — Visibility Engine — Complete
Runtime section visibility, missing-data handling, empty-state decisions, and composer integration are implemented. HTML renderer integration remains deferred.
## AW-6B.1E — Renderer Integration — Complete
The HTML renderer now consumes the Document Composer and invokes registered visible section renderers in deterministic order. Printable content remains deferred to AW-6B.2 and later component sprints.

### P1.1.3 — Executive Summary Professional Layout — Complete
Professional first-page composition, responsive layout, and print styling implemented.

- P1.2.2 Property Summary Renderer: Complete.
- Next: P1.2.3 Professional Property Layout.

- [x] P1.3.1 Recommendation Data Model
- [ ] P1.3.2 Recommendation Renderer
- [ ] P1.3.3 Professional Recommendation Layout

- [x] P1.3.3 Professional Recommendation Layout — completed in v3.18.0.
- [ ] P1.3.4 Recommendation Ordering.
- [ ] P1.3.5 Recommendation Groups.

- [x] P1.3.5 Recommendation Groups
- [ ] P1.3.6 Recommendation Print Polish

## P1.4 Checklist

- **P1.4.1 Checklist Data Model — Complete**
- **P1.4.2 Checklist Renderer — Complete**
- P1.4.3 Professional Checklist Layout — Next

### Completed: CF-INT-1F
Unified assessment payload is now available for Consultation and Agent Workspace propagation.
