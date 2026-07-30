(function(){
function ready(fn){if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',fn,{once:true});}else{fn();}}
function getTrigger(){const p=new URLSearchParams(location.search);return p.get('trigger')||sessionStorage.getItem('coveragefit_trigger')||'default';}
const copy={
homebuyer:{eyebrow:'Home Purchase Review',title:'Your new-home Protection Snapshot is ready.',intro:"Because you're a new homeowner, we emphasized the protection questions that often matter most during the first years of homeownership."},
renewal:{eyebrow:'Annual Protection Review',title:'Your annual Protection Snapshot is ready.',intro:'Throughout this review, we focused on topics that commonly become important during an annual policy review.'},
'premium-increase':{eyebrow:'Premium Increase Review',title:'Your Protection Snapshot is ready to review before making changes.',intro:'Because you came here after a premium increase, we focused on the questions most worth discussing before comparing options.'},
default:{eyebrow:'Protection Review',title:'Your Protection Snapshot is ready.',intro:'Your responses helped identify the strengths and discussion priorities most worth reviewing together.'}
};
function timeline(){if(window.JourneyTimeline&&typeof window.JourneyTimeline.setStep==='function'){window.JourneyTimeline.setStep(2);}}
function injectCover(c){
 if(document.querySelector('.cf-snapshot-cover'))return;
 const main=document.querySelector('main')||document.body;
 const src=window.CoverageFitTriggerVisuals?.data?.src||'/assets/illustrations/default.svg';
 const alt=window.CoverageFitTriggerVisuals?.data?.alt||'Protection review illustration';
 const s=document.createElement('section');s.className='cf-snapshot-cover';
 s.innerHTML=`<div class="cf-snapshot-cover__visual"><img src="${src}" alt="${alt}"></div>
 <div class="cf-snapshot-cover__copy"><div class="cf-snapshot-cover__eyebrow">${c.eyebrow}</div>
 <h1>${c.title}</h1><p>${c.intro}</p><div class="cf-snapshot-cover__ready"><span>✓</span><span>Prepared from the answers you provided</span></div></div>`;
 main.prepend(s);
}
function reveal(){
 const sels='main section,main article,main .card,main .panel,main [class*="section"],main [class*="summary"]';
 const arr=[...document.querySelectorAll(sels)].filter(e=>!e.closest('.cf-snapshot-cover')&&!e.closest('.cf-conversation-transition')&&(e.innerText||'').trim().length>35).slice(0,8);
 arr.forEach((e,i)=>{e.classList.add('cf-reveal-section');e.style.setProperty('--cf-reveal-delay',`${Math.min(i*130,780)}ms`);});
 requestAnimationFrame(()=>document.documentElement.classList.add('cf-snapshot-reveal-active'));
}
function transition(){
 if(document.querySelector('.cf-conversation-transition'))return;
 const main=document.querySelector('main')||document.body;const t=getTrigger();
 const s=document.createElement('section');s.className='cf-conversation-transition cf-reveal-section';s.style.setProperty('--cf-reveal-delay','900ms');
 s.innerHTML=`<div class="cf-conversation-transition__icon">✓</div><div class="cf-conversation-transition__content">
 <div class="cf-conversation-transition__eyebrow">Your next step</div><h2>Your Protection Snapshot is ready.</h2>
 <p>The next step isn't purchasing anything. It's reviewing these observations together and confirming how they apply to your current protection.</p>
 <a class="cf-conversation-transition__button" href="/book/?trigger=${encodeURIComponent(t)}">Continue to Review Together</a>
 <div class="cf-conversation-transition__note">About 15–20 minutes · No pressure · No obligation</div></div>`;
 main.appendChild(s);
}
ready(()=>{const c=copy[getTrigger()]||copy.default;timeline();injectCover(c);transition();reveal();setTimeout(()=>document.documentElement.classList.add('cf-snapshot-cover-ready'),80);});
})();