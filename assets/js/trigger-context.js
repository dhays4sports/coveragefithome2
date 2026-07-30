(() => {
  const STORAGE_KEY = 'coveragefit_trigger';
  const allowed = new Set(['renewal', 'premium-increase', 'homebuyer', 'remodel', 'new-family', 'landlord']);
  const params = new URLSearchParams(window.location.search);
  const requested = (params.get('trigger') || '').trim().toLowerCase();
  const stored = (sessionStorage.getItem(STORAGE_KEY) || '').trim().toLowerCase();
  const trigger = allowed.has(requested) ? requested : (allowed.has(stored) ? stored : '');

  if (trigger) sessionStorage.setItem(STORAGE_KEY, trigger);
  else sessionStorage.removeItem(STORAGE_KEY);

  window.CoverageFitTrigger = trigger;
  window.CoverageFitTriggerContext = {
    value: trigger,
    labels: {
      renewal: 'Annual renewal',
      'premium-increase': 'Premium increase',
      homebuyer: 'New home purchase',
      remodel: 'Recent remodel',
      'new-family': 'Growing family',
      landlord: 'Rental property'
    },
    assessment: {
      renewal: {
        title: "Let's make your renewal more useful.",
        copy: "Throughout this review, we'll look for topics that commonly become important during an annual policy review."
      },
      'premium-increase': {
        title: "Let's understand the protection behind the price.",
        copy: "Because you came here after a premium increase, we'll focus on the questions most worth discussing before making changes."
      },
      homebuyer: {
        title: "Let's build a stronger start for your new home.",
        copy: "Because you're a new homeowner, we'll emphasize topics that often matter most during the first years of homeownership."
      }
    },
    report: {
      renewal: {
        headline: 'A more informed renewal conversation.',
        narrative: 'Throughout this review, we looked for topics that commonly become important during an annual policy review.'
      },
      'premium-increase': {
        headline: 'Understand value before comparing price.',
        narrative: 'Because you came here after a premium increase, we focused on identifying the questions most worth discussing before making changes.'
      },
      homebuyer: {
        headline: 'A stronger start for your new home.',
        narrative: "Because you're a new homeowner, we emphasized topics that often matter most during the first years of homeownership."
      }
    }
  };

  document.querySelectorAll('input[name="trigger"]').forEach((el) => { el.value = trigger; });

  const intro = window.CoverageFitTriggerContext.assessment[trigger];
  if (intro) {
    const title = document.querySelector('[data-trigger-assessment-title]');
    const copy = document.querySelector('[data-trigger-assessment-copy]');
    if (title) title.textContent = intro.title;
    if (copy) copy.textContent = intro.copy;
  }
})();
