(function(){
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const clamp=n=>Math.max(0,Math.min(100,Number(n)||0));
  function read(){try{return JSON.parse(localStorage.getItem('coveragefit_home_report')||'{}')}catch(e){return {}}}
  function band(score){return score>=85?'Well Prepared':score>=70?'Strong Foundation':score>=50?'Review Recommended':'Several Areas to Review'}
  function render(){
    const root=document.querySelector('[data-cf-interactive-snapshot]'); if(!root)return;
    const data=read(); const score=clamp(data.score); const cats=Array.isArray(data.categories)?data.categories:[];
    const answers=Array.isArray(data.answers)?data.answers:[];
    const raw=Array.isArray(data.priorities)?data.priorities:[];
    const recs=window.CoverageFitRecommendationEngine?window.CoverageFitRecommendationEngine.generate('home',{...data,priorities:raw,answers}):raw;
    const strengths=(Array.isArray(data.strengths)?data.strengths:[]).slice(0,5);
    const topRecs=recs.slice(0,5);
    root.innerHTML=`
      <div class="cf-snapshot-dashboard__head">
        <div><span class="cf-snapshot-dashboard__kicker">Interactive Coverage Snapshot</span><h2>Your protection picture at a glance</h2><p>Explore the score, category results, strengths, and review priorities generated from your answers.</p></div>
        <button type="button" class="cf-snapshot-dashboard__print" data-cf-print>Save or Print</button>
      </div>
      <div class="cf-snapshot-dashboard__grid">
        <section class="cf-snapshot-score-panel" aria-label="Protection score">
          <div class="cf-snapshot-score-ring" style="--cf-score:${score}"><div><strong data-cf-score>${score}</strong><span>/ 100</span></div></div>
          <div class="cf-snapshot-score-copy"><span>Protection Preparedness Score</span><h3>${esc(data.status||band(score))}</h3><p>This is a planning measure based on the answers you provided, not an underwriting or coverage determination.</p></div>
        </section>
        <section class="cf-snapshot-category-panel"><h3>Category breakdown</h3><div class="cf-snapshot-category-list">${(cats.length?cats:[{name:'Overall review',score}]).map(c=>`<button type="button" class="cf-snapshot-category" data-category="${esc(c.name)}"><span><b>${esc(c.name)}</b><em>${clamp(c.score)}%</em></span><i><u style="width:${clamp(c.score)}%"></u></i></button>`).join('')}</div></section>
      </div>
      <div class="cf-snapshot-tabs" role="tablist" aria-label="Snapshot views">
        <button role="tab" aria-selected="true" data-snapshot-tab="priorities">Review priorities <span>${topRecs.length}</span></button>
        <button role="tab" aria-selected="false" data-snapshot-tab="strengths">Strengths <span>${strengths.length}</span></button>
        <button role="tab" aria-selected="false" data-snapshot-tab="next">Next conversation</button>
      </div>
      <div class="cf-snapshot-tabpanels">
        <section data-snapshot-panel="priorities">${topRecs.length?topRecs.map((r,i)=>`<article class="cf-snapshot-mini-card"><div class="cf-snapshot-mini-card__num">${i+1}</div><div><div class="cf-snapshot-mini-card__meta"><span>${esc(r.impactLabel||'Review topic')}</span><em>${clamp(r.confidence)}% confidence</em></div><h3>${esc(r.name||r.tag||r.category||'Protection topic')}</h3><p>${esc(r.clientExplanation||r.insight||'This topic is worth confirming during your review.')}</p></div></article>`).join(''):'<p class="cf-snapshot-empty">No major answer-based priority was flagged.</p>'}</section>
        <section data-snapshot-panel="strengths" hidden>${strengths.length?strengths.map(s=>`<article class="cf-snapshot-strength-card"><span>✓</span><p>${esc(typeof s==='string'?s:(s.insight||s.label||'Positive observation'))}</p></article>`).join(''):'<p class="cf-snapshot-empty">Completing the review is a positive first step.</p>'}</section>
        <section data-snapshot-panel="next" hidden><div class="cf-snapshot-next"><h3>Use this Snapshot to guide a focused review</h3><p>Bring the top questions into a 15–20 minute conversation with Dylan. Together, you can confirm policy details, identify any gaps, and decide whether any changes are actually needed.</p><a href="/book/?product=home" class="btn primary">Schedule My Protection Review</a></div></section>
      </div>`;
    root.querySelectorAll('[data-snapshot-tab]').forEach(btn=>btn.addEventListener('click',()=>{
      root.querySelectorAll('[data-snapshot-tab]').forEach(b=>b.setAttribute('aria-selected',String(b===btn)));
      root.querySelectorAll('[data-snapshot-panel]').forEach(p=>p.hidden=p.dataset.snapshotPanel!==btn.dataset.snapshotTab);
    }));
    root.querySelector('[data-cf-print]')?.addEventListener('click',()=>window.print());
    requestAnimationFrame(()=>root.classList.add('is-ready'));
    window.CoverageFitAnalytics?.track('interactive_snapshot_viewed',{assessment:'home',score,categoryCount:cats.length,recommendationCount:topRecs.length});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',render,{once:true});else render();
})();
