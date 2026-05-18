/* ═══════════════════════════════════════════════════════════════
   THE HERITAGE — APP.JS
   All animations & interactivity
   ═══════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);
  const $ = (s,c=document) => c.querySelector(s);
  const $$ = (s,c=document) => Array.from(c.querySelectorAll(s));

  // ══════════════ LOADER ══════════════
  setTimeout(() => {
    const l = $('#loader');
    l.style.transition = 'opacity .9s ease';
    l.style.opacity = '0';
    setTimeout(() => l.remove(), 900);
  }, 2600);

  // ══════════════ CURSOR ══════════════
  const cur = $('#cursor'), ring = $('#cursorRing');
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; cur.style.left = mx+'px'; cur.style.top = my+'px'; });
  (function tick() { rx += (mx-rx)*.13; ry += (my-ry)*.13; ring.style.left = rx+'px'; ring.style.top = ry+'px'; requestAnimationFrame(tick); })();
  $$('a,button,.am-card,.brand-cell,.tag,.pr-card,.road-card,.infra-card,.pillar').forEach(el => {
    el.addEventListener('mouseenter', () => { cur.style.transform = 'translate(-50%,-50%) scale(2.2)'; ring.style.transform = 'translate(-50%,-50%) scale(1.6)'; ring.style.opacity = '.9'; });
    el.addEventListener('mouseleave', () => { cur.style.transform = 'translate(-50%,-50%) scale(1)'; ring.style.transform = 'translate(-50%,-50%) scale(1)'; ring.style.opacity = '.55'; });
  });

  // ══════════════ HERO CANVAS ══════════════
  const cv = $('#hero-canvas'), ctx = cv.getContext('2d');
  function resize() { cv.width = innerWidth; cv.height = innerHeight; }
  resize(); window.addEventListener('resize', resize);
  class P {
    constructor() { this.reset(); }
    reset() { this.x = Math.random()*cv.width; this.y = cv.height+20; this.vx = (Math.random()-.5)*.4; this.vy = -(Math.random()*.6+.15); this.r = Math.random()*1.4+.3; this.op = Math.random()*.5+.1; this.life = 0; this.max = Math.random()*280+120; }
    step() { this.x += this.vx; this.y += this.vy; this.life++; if (this.life > this.max || this.y < -10) this.reset(); }
    draw() { const fi = Math.min(this.life/40,1), fo = Math.min((this.max-this.life)/40,1); ctx.beginPath(); ctx.arc(this.x,this.y,this.r,0,Math.PI*2); ctx.fillStyle = `rgba(201,168,76,${this.op*fi*fo})`; ctx.fill(); }
  }
  const pts = Array.from({length:130}, () => new P());
  let archT = 0;
  function drawArch() { archT+=.005; const pulse=.04+Math.sin(archT)*.015,cx2=cv.width/2,cy2=cv.height*.72,sc=Math.min(cv.width/900,1.3); ctx.save(); ctx.translate(cx2,cy2); ctx.scale(sc,sc); ctx.strokeStyle=`rgba(201,168,76,${pulse})`; ctx.lineWidth=1.5; ctx.strokeRect(-260,-220,64,220); ctx.strokeRect(196,-220,64,220); ctx.beginPath(); ctx.moveTo(-196,0); ctx.lineTo(-196,-150); ctx.bezierCurveTo(-196,-280,196,-280,196,-150); ctx.lineTo(196,0); ctx.stroke(); ctx.beginPath(); ctx.arc(0,-290,18,0,Math.PI*2); ctx.stroke(); ctx.restore(); }
  function heroLoop() { ctx.clearRect(0,0,cv.width,cv.height); const g=ctx.createRadialGradient(cv.width/2,cv.height*.6,0,cv.width/2,cv.height*.6,cv.height*.6); g.addColorStop(0,'rgba(201,168,76,.045)'); g.addColorStop(1,'transparent'); ctx.fillStyle=g; ctx.fillRect(0,0,cv.width,cv.height); drawArch(); pts.forEach(p=>{p.step();p.draw();}); requestAnimationFrame(heroLoop); }
  heroLoop();

  // ══════════════ HERO PARALLAX ══════════════
  window.addEventListener('scroll', () => {
    const el = $('.hero-content'); if (!el || scrollY > innerHeight) return;
    el.style.transform = `translateY(${scrollY*.28}px)`;
    el.style.opacity = Math.max(0, 1 - scrollY/(innerHeight*.75));
  });

  // ══════════════ NAV SCROLL ══════════════
  window.addEventListener('scroll', () => { $('#navbar').classList.toggle('scrolled', scrollY > 70); });

  // ══════════════ REVEAL ON SCROLL ══════════════
  const ro = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('on'); ro.unobserve(e.target); } }); }, { threshold: .08, rootMargin: '0px 0px -40px 0px' });
  $$('.rv').forEach(el => ro.observe(el));

  // ══════════════ GATEWAY ARCH DRAW ══════════════
  ScrollTrigger.create({ trigger: '#gateway-arch', start: 'top 80%', once: true, onEnter: () => {
    gsap.to($$('.arch-draw'), { strokeDashoffset: 0, duration: 1.4, stagger: .08, ease: 'power2.out' });
    gsap.to($$('.arch-fill'), { opacity: 1, duration: .5, delay: .9, stagger: .1 });
  }});

  // ══════════════ METRO ANIMATION ══════════════
  const stations = [{x:120},{x:260},{x:400},{x:540},{x:680},{x:820},{x:960},{x:1100},{x:1240}];
  const stNames = ['Kashmere Gate','Inderlok','Punjabi Bagh West','Nangloi','Mundka','Tikri Border','Brig. Hoshiar Singh','Pandit Shree Ram Sharma','Bahadurgarh City Park'];
  const train = $('#m-train'), headlight = $('#m-headlight'), trackActive = $('#m-track-active');
  const stEls = $$('.m-st'), trail = $('#m-trail'), trailDots = $$('.m-tdot');
  const pin = $('#m-pin'), badge = $('#m-badge'), mStatus = $('#m-status');
  let metroTL;

  function lightSt(g, isFinal) {
    const tl = gsap.timeline();
    const dot = g.querySelector('.mst-dot'), outer = g.querySelector('.mst-outer'), ring2 = g.querySelector('.mst-ring'), label = g.querySelector('.mst-label'), sub = g.querySelector('.mst-sub'), halo = g.querySelector('.mst-halo');
    tl.to(dot, { attr:{fill:'#c9a84c'}, duration:.18 }, 0)
      .to(outer, { attr:{stroke:'#c9a84c'}, duration:.18 }, 0)
      .fromTo(g, {scale:1,transformOrigin:'center'}, {scale:isFinal?1.5:1.35, duration:.3, ease:'back.out(2.5)', transformOrigin:'center'}, 0)
      .to(g, {scale:1, duration:.4, ease:'elastic.out(1,.55)', transformOrigin:'center'}, .3)
      .fromTo(ring2, {opacity:.7, attr:{r:12}}, {opacity:0, attr:{r:32}, duration:.9, ease:'power2.out'}, .05)
      .to(label, {opacity:1, duration:.3}, 0);
    if (sub) tl.to(sub, {opacity:1, duration:.3}, .1);
    if (isFinal && halo) tl.fromTo(halo, {opacity:0,attr:{r:18}}, {opacity:.5,attr:{r:32},duration:.5}, .1).to(halo, {opacity:.2,duration:.8,repeat:-1,yoyo:true}, .6);
    return tl;
  }

  function buildMetro() {
    if (metroTL) metroTL.kill();
    gsap.set(train, {x:0}); gsap.set(headlight, {opacity:0}); gsap.set(trackActive, {attr:{x2:80},opacity:0});
    stEls.forEach(s => {
      gsap.set(s.querySelector('.mst-dot'), {attr:{fill:'rgba(201,168,76,.35)'}});
      gsap.set(s.querySelector('.mst-outer'), {attr:{stroke:'rgba(201,168,76,.4)'}});
      gsap.set(s.querySelector('.mst-ring'), {opacity:0, attr:{r:14}});
      gsap.set(s.querySelector('.mst-label'), {opacity:.5});
      const sub = s.querySelector('.mst-sub'); if (sub) gsap.set(sub, {opacity:0});
      const halo = s.querySelector('.mst-halo'); if (halo) { gsap.killTweensOf(halo); gsap.set(halo, {opacity:0}); }
      gsap.set(s, {scale:1, transformOrigin:'center'});
    });
    gsap.set(trail, {opacity:0}); trailDots.forEach(d => gsap.set(d, {opacity:0, scale:0, transformOrigin:'center'}));
    gsap.set(pin, {opacity:0, y:20}); gsap.set(badge, {opacity:0, y:-20, scale:.7, transformOrigin:'center'});
    gsap.set('.mpin-halo,.mpin-mid', {opacity:0}); gsap.set('.mpin-emblem', {scale:0, transformOrigin:'center'});

    metroTL = gsap.timeline({onComplete: () => gsap.delayedCall(2.4, () => metroTL.restart())});
    metroTL.add(lightSt(stEls[0], false), 0).to(headlight, {opacity:.85, duration:.4}, .1);
    metroTL.call(() => { mStatus.textContent = 'Departing Kashmere Gate...'; mStatus.classList.add('active'); }, [], .1);

    let cum = .5; const segDur = .78;
    for (let i = 1; i < 9; i++) {
      const tx = stations[i].x - stations[0].x, isLast = i === 8;
      const dur = isLast ? segDur*1.4 : segDur;
      const ease = isLast ? 'power3.out' : (i === 1 ? 'power2.in' : 'none');
      metroTL.to(train, {x:tx, duration:dur, ease}, cum);
      metroTL.to(trackActive, {attr:{x2:stations[i].x}, duration:dur, ease, opacity:1}, cum);
      metroTL.call(() => { mStatus.textContent = isLast ? 'Arriving at Bahadurgarh City Park...' : 'En route to '+stNames[i]+'...'; }, [], cum+dur*.3);
      metroTL.add(lightSt(stEls[i], isLast), cum+dur-.1);
      cum += dur;
    }
    metroTL.to(headlight, {opacity:0, duration:.4}, cum);
    cum += .6;
    metroTL.set(trail, {opacity:1}, cum).call(() => { mStatus.textContent = 'Just 700 metres from your front gate...'; }, [], cum);
    trailDots.forEach((d, idx) => { metroTL.to(d, {opacity:1, scale:1, duration:.18, ease:'back.out(2)'}, cum+idx*.12); });
    cum += trailDots.length*.12 + .2;
    metroTL.to(pin, {opacity:1, y:0, duration:.5, ease:'power2.out'}, cum)
      .to('.mpin-emblem', {scale:1, duration:.7, ease:'back.out(1.6)'}, cum)
      .fromTo('.mpin-halo', {opacity:0, attr:{r:18}}, {opacity:.6, attr:{r:40}, duration:.8, ease:'power2.out'}, cum+.2)
      .to('.mpin-halo', {opacity:0, duration:.6}, cum+1)
      .fromTo('.mpin-mid', {opacity:0, attr:{r:14}}, {opacity:.4, attr:{r:28}, duration:1.4, ease:'sine.inOut', repeat:-1, yoyo:true}, cum+.3);
    cum += .9;
    metroTL.to(badge, {opacity:1, y:0, scale:1, duration:.6, ease:'back.out(2)'}, cum)
      .call(() => { mStatus.textContent = 'The Heritage · Sector 11, Bahadurgarh'; }, [], cum+.3);
    metroTL.to({}, {duration:2});
  }

  ScrollTrigger.create({trigger:'#connectivity', start:'top 70%', once:true, onEnter:buildMetro});

  let mPaused = false;
  $('#m-pause').addEventListener('click', () => {
    if (!metroTL) return;
    if (mPaused) { metroTL.resume(); $('#m-pause').textContent = '⏸ Pause'; }
    else { metroTL.pause(); $('#m-pause').textContent = '▶ Resume'; }
    mPaused = !mPaused;
  });
  $('#m-replay').addEventListener('click', () => { mPaused = false; $('#m-pause').textContent = '⏸ Pause'; buildMetro(); });

  const mio = new IntersectionObserver(entries => { entries.forEach(e => { if (!metroTL || mPaused) return; if (e.isIntersecting) metroTL.resume(); else metroTL.pause(); }); }, {threshold:.2});
  mio.observe($('#connectivity'));

  // ══════════════ INDUSTRIAL ══════════════
  ScrollTrigger.create({trigger:'#tag-cloud', start:'top 80%', once:true, onEnter: () => {
    $$('#tag-cloud .tag').forEach((t,i) => { setTimeout(() => t.classList.add('on'), i*70); });
  }});
  ScrollTrigger.create({trigger:'#brands-grid', start:'top 80%', once:true, onEnter: () => {
    $$('#brands-grid .brand-cell').forEach((c,i) => { setTimeout(() => c.classList.add('on'), i*110); });
  }});
  ScrollTrigger.create({trigger:'#cnt1', start:'top 85%', once:true, onEnter: () => {
    const el = $('#cnt1'), t = parseInt(el.dataset.target);
    gsap.to({v:0}, {v:t, duration:2.2, ease:'power2.out', onUpdate: function() { el.innerHTML = Math.floor(this.targets()[0].v).toLocaleString()+'<span class="bc-plus">+</span>'; }});
  }});

  // ══════════════ EDUCATION ══════════════
  ScrollTrigger.create({trigger:'#edu-counter', start:'top 85%', once:true, onEnter: () => {
    const el = $('#edu-counter'); let count = 0;
    const iv = setInterval(() => { count += Math.ceil(Math.random()*8); if (count >= 75) { count = 75; clearInterval(iv); } el.innerHTML = count+'<sup>+</sup>'; }, 50);
    setTimeout(() => { $$('#edu-pills .edu-pill').forEach((p,i) => { setTimeout(() => p.classList.add('ping'), i*200); }); }, 900);
  }});

  // ══════════════ PROJECT: PLOT GRID ══════════════
  ScrollTrigger.create({trigger:'#plot-grid', start:'top 80%', once:true, onEnter: () => {
    const cells = $$('#plot-grid .pc');
    const roads = cells.filter(c => c.classList.contains('road'));
    const plots = cells.filter(c => !c.classList.contains('road') && !c.classList.contains('club'));
    const club = cells.filter(c => c.classList.contains('club'));
    roads.forEach((r,i) => { setTimeout(() => r.classList.add('on'), i*40); });
    setTimeout(() => { plots.forEach((p,i) => { setTimeout(() => p.classList.add('on'), i*35); }); }, roads.length*40);
    setTimeout(() => { club.forEach(c => { c.classList.add('on'); gsap.fromTo(c, {boxShadow:'0 0 0 0 rgba(201,168,76,0)'}, {boxShadow:'0 0 20px 4px rgba(201,168,76,.5)', duration:.5, yoyo:true, repeat:1}); }); }, roads.length*40 + plots.length*35);
  }});

  // ══════════════ SIZE BARS ══════════════
  ScrollTrigger.create({trigger:'#sz-bars', start:'top 85%', once:true, onEnter: () => {
    $$('#sz-bars .sz-fill').forEach((b,i) => { setTimeout(() => { b.style.width = b.dataset.w+'%'; }, i*160); });
  }});

  // ══════════════ AMENITIES ══════════════
  ScrollTrigger.create({trigger:'#am-grid', start:'top 80%', once:true, onEnter: () => {
    $$('#am-grid .am-card').forEach((c,i) => { setTimeout(() => c.classList.add('on'), i*50); });
  }});

  // ══════════════ PRICING: 3D TILT ══════════════
  $$('.pr-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left)/r.width - .5;
      const y = (e.clientY - r.top)/r.height - .5;
      card.style.transform = `rotateY(${x*6}deg) rotateX(${-y*6}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  // ══════════════ FORM ══════════════
  $('#fsub-btn').addEventListener('click', () => {
    const n = $('#fname').value.trim(), p = $('#fphone').value.trim();
    if (!n || !p) { alert('Please enter your name and phone number.'); return; }
    $('#form-main').style.display = 'none';
    const fs = $('#form-success'); fs.classList.add('show'); fs.style.display = 'block';
  });
  $('.nav-cta').addEventListener('click', e => { e.preventDefault(); $('#lead-form').scrollIntoView({behavior:'smooth'}); });

  // ══════════════ NAV SMOOTH SCROLL ══════════════
  $$('.nav-links a').forEach(a => {
    a.addEventListener('click', e => { e.preventDefault(); const tgt = $(a.getAttribute('href')); if (tgt) tgt.scrollIntoView({behavior:'smooth'}); });
  });
  $$('.ft-links a').forEach(a => {
    a.addEventListener('click', e => { e.preventDefault(); const tgt = $(a.getAttribute('href')); if (tgt) tgt.scrollIntoView({behavior:'smooth'}); });
  });

  // ══════════════ PLOT TOOLTIPS ══════════════
  $$('.pc:not(.road)').forEach(pc => {
    pc.title = pc.classList.contains('club') ? 'Grand Clubhouse – 25,000 sq.ft.' : pc.classList.contains('green') ? 'Green / Park Zone' : 'Premium Residential Plot';
  });
});
