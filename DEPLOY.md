# CoverageFit v1 Pilot Deployment

## Deploy
Upload the contents of this folder (not the containing folder) to Netlify Drop.

## Primary test routes
- `/`
- `/assessment/`
- `/home/report/` (generated after submitting the assessment)
- `/book/`
- `/how-it-works/`
- `/about/`

## Optional trigger routes
- `/triggers/homebuyer/`
- `/triggers/renewal/`
- `/triggers/premium-increase/`

## Producer setup
Edit `/producer.json` to change producer identity, contact details, or Formspree endpoint.

The immediate Dylan deployment is configured for:
- Dylan Haysbert
- Virginia Tam Insurance Agency
- (408) 327-6377
- dylan@dylanhaysbert.com
- Formspree endpoint already present

The booking page currently offers direct call and text actions. A calendar can be added later without blocking the pilot.

## Pilot limitation
The detailed report is stored in the homeowner's browser. It works immediately after submission on the same device. The submitted JSON payload is also sent through Formspree for producer follow-up.
