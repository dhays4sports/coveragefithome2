(() => {
  const engine = window.CoverageFitRecommendationEngine;
  if (!engine) throw new Error('CoverageFitRecommendationEngine must load before home rules.');

  function generate(report = {}) {
    const priorities = Array.isArray(report.priorities) ? report.priorities : [];
    const answers = Array.isArray(report.answers) ? report.answers : [];
    const raw = priorities.length
      ? priorities
      : answers
          .filter(answer => Number(answer.points || 0) < 0)
          .sort((a, b) => Number(a.points || 0) - Number(b.points || 0))
          .slice(0, 3);

    const collector = engine.createCollector({ product: 'home' });
    raw.forEach((item, index) => collector.add({
      ...item,
      name: item.name || item.tag || item.category || 'Protection topic',
      priority: item.priority || 'high',
      why: item.why || item.insight || 'Your answer made this topic worth confirming.',
      trigger: item.trigger || item.label || 'Assessment response',
      ruleId: item.ruleId || `home-priority-${index + 1}`,
      product: 'home'
    }));
    return collector.values();
  }

  engine.registerProduct('home', { generate });
})();
