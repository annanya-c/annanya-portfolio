// Stars
(function(){
  const sf=document.getElementById('starfield');
  if(!sf)return;
  for(let i=0;i<80;i++){
    const s=document.createElement('div');s.className='star';
    const sz=[2,2,2,4,4,6][Math.floor(Math.random()*6)];
    s.style.cssText=`width:${sz}px;height:${sz}px;left:${Math.random()*100}%;top:${Math.random()*100}%;animation-delay:${Math.random()*4}s;animation-duration:${1.5+Math.random()*3}s`;
    sf.appendChild(s);
  }
})();

// Cursor
(function(){
  const cur=document.getElementById('px-cursor');
  if(!cur)return;
  document.addEventListener('mousemove',e=>{
    cur.style.left=e.clientX+'px';
    cur.style.top=e.clientY+'px';
  });
  document.querySelectorAll('a,button,.px-card,.book,.movie-poster,.album-card,.gallery-frame').forEach(el=>{
    el.addEventListener('mouseenter',()=>cur.querySelector('.px-cur-inner').style.background='var(--lilac)');
    el.addEventListener('mouseleave',()=>cur.querySelector('.px-cur-inner').style.background='var(--pink)');
  });
})();

// Click sparkles
document.addEventListener('click',e=>{
  const sparks=['✦','✧','★','✿','♡','🌸'];
  for(let i=0;i<5;i++){
    const sp=document.createElement('div');
    sp.className='px-sparkle';
    sp.textContent=sparks[Math.floor(Math.random()*sparks.length)];
    const angle=Math.random()*Math.PI*2;
    const dist=30+Math.random()*50;
    sp.style.cssText=`left:${e.clientX}px;top:${e.clientY}px;--dx:${Math.cos(angle)*dist}px;--dy:${Math.sin(angle)*dist}px;color:${['var(--pink)','var(--lilac)','var(--mint)','var(--yellow)'][Math.floor(Math.random()*4)]};animation-delay:${i*0.05}s`;
    document.body.appendChild(sp);
    setTimeout(()=>sp.remove(),800);
  }
});

// Scroll reveal
(function(){
  const ro=new IntersectionObserver(e=>e.forEach(en=>{if(en.isIntersecting)en.target.classList.add('shown')}),{threshold:0.1});
  document.querySelectorAll('.reveal').forEach(el=>ro.observe(el));
})();

// Nav active page highlight
(function(){
  const path=window.location.pathname.split('/').pop()||'index.html';
  document.querySelectorAll('.nav-links a').forEach(a=>{
    const href=a.getAttribute('href');
    if(href===path||href===('./'+path))a.classList.add('active');
  });
})();