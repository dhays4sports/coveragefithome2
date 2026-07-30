(async()=>{
  await(window.COVERAGEFIT_PRODUCER_READY||Promise.resolve());
  const $=id=>document.getElementById(id), params=new URLSearchParams(location.search), cfg=window.COVERAGEFIT_REPORT_CONFIG||{};
  const storageKey=cfg.storageKey||'coveragefit_home_report';
  let r={}; try{r=JSON.parse(localStorage.getItem(storageKey)||'{}')}catch(e){}
  const name=r.consumer?.name||params.get('name')||cfg.defaultName||'Customer';
  const score=Number(r.score||0), priorities=Array.isArray(r.priorities)?r.priorities:[], answers=Array.isArray(r.answers)?r.answers:[];
  const strengths=Array.isArray(r.strengths)?r.strengths:answers.filter(a=>Number(a.points||0)>=0).slice(0,3).map(a=>a.insight||a.label);
  const sEl=$('strengths');
  (strengths.length?strengths:['You completed a structured review instead of waiting for a problem.']).slice(0,3).forEach(x=>{
    const d=document.createElement('div'); d.className='strength-item'; d.innerHTML=`<i>✓ Positive observation</i><span>${x}</span>`; sEl.appendChild(d);
  });
  const rawPriorityList=priorities.length?priorities:answers.filter(a=>Number(a.points||0)<0).sort((a,b)=>Number(a.points)-Number(b.points)).slice(0,3);
  const pList=window.CoverageFitRecommendationEngine
    ? window.CoverageFitRecommendationEngine.generate('home',{...r,priorities:rawPriorityList,answers})
    : rawPriorityList;
  const pEl=$('priorities'), aEl=$('actions'), actionMap=cfg.actionMap||{};
  const illustrationKey=pList[0]?.tag||pList[0]?.category||'default';
  if(window.CoverageFitIllustrations){
    const heroMap={'Water Damage':'water_damage','Umbrella':'umbrella','Personal Property':'personal_property','Ordinance and Law':'ordinance_law','Earthquake':'earthquake'};
    window.CoverageFitIllustrations.hero('home',heroMap[illustrationKey]||'default').then(data=>window.CoverageFitIllustrations.applyImage($('homeReportHero'),data));
  }
  const makeAction=p=>actionMap[p.tag]||actionMap[p.category]||(p.question?`Confirm this question during the review: ${p.question}`:`Confirm how ${String(p.tag||p.category||'this topic').toLowerCase()} is addressed by the issued policy.`);
  pList.slice(0,3).forEach((p,i)=>{
    const topic=p.name||p.tag||p.category||'Protection topic';
    const meta=window.CoverageFitTriggerLibrary?.enrich(p,topic)||p;
    const supporting=(p.supportingAnswers||p.evidence||[]).slice(0,3);
    const evidenceMarkup=supporting.length?`<div class="recommendation-evidence"><span>What informed this</span><ul>${supporting.map(item=>`<li>${item}</li>`).join('')}</ul></div>`:'';
    const d=document.createElement('article'); d.className='priority-card has-visual'; d.innerHTML=`<div class="priority-num">${i+1}</div><div class="priority-card-body"><div class="recommendation-intelligence-bar"><span class="recommendation-impact recommendation-impact-${p.impact||'informational'}">${p.impactLabel||'Informational'}</span><span class="recommendation-confidence">${Number(p.confidence||0)}% confidence</span></div><h3>${topic}</h3><p>${p.clientExplanation||p.insight||'Your answer made this topic worth confirming.'}</p>${evidenceMarkup}<div class="trigger-detail-grid"><div class="trigger-detail"><span>Why this matters</span><p>${meta.whyMatters||'Confirm how this topic affects your protection.'}</p></div><div class="trigger-detail"><span>Practical example</span><p>${meta.example||'The impact depends on the policy wording and your circumstances.'}</p></div><div class="trigger-detail trigger-question"><span>Question to bring into your review</span><p>${p.conversationStarter||meta.discussionQuestion||'Can we confirm how this protection works?'}</p></div></div></div><img class="priority-card-visual" src="/assets/illustrations/default.svg" alt="">`; pEl.appendChild(d);
    if(window.CoverageFitIllustrations)window.CoverageFitIllustrations.recommendation(topic).then(data=>window.CoverageFitIllustrations.applyImage(d.querySelector('img'),data));
    const a=document.createElement('div'); a.innerHTML=`<b>${i+1}</b><span>${makeAction(p)}</span>`; aEl.appendChild(a);
  });
  if(!pList.length){
    pEl.innerHTML='<div class="report-empty">No major answer-based concern was flagged. Use your review to confirm the positive foundation reflected in your answers.</div>';
    aEl.innerHTML='<div><b>1</b><span>Compare this Snapshot with the issued policy and confirm that limits, deductibles, endorsements, and household details are current.</span></div>';
  }
  const print=$('printReport'); if(print) print.onclick=()=>window.print();
  window.CoverageFitAnalytics?.track('report_viewed',{assessment:r.assessment||cfg.slug,score,name});
})();