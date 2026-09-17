// ── PAGE LOADER ────────────────────────────────
window.addEventListener('load',()=>{
  const l=document.getElementById('pageLoad');
  if(l){ setTimeout(()=>l.classList.add('hide'),350); }
});

// ── CURSOR ─────────────────────────────────────
const C=document.getElementById('cur'),R=document.getElementById('cur-ring');
if(C&&R){
  let mx=0,my=0,rx=0,ry=0;
  document.addEventListener('mousemove',e=>{
    mx=e.clientX;my=e.clientY;
    C.style.left=mx+'px';C.style.top=my+'px';
  });
  (function lag(){
    rx+=(mx-rx)*.11;ry+=(my-ry)*.11;
    R.style.left=Math.round(rx)+'px';R.style.top=Math.round(ry)+'px';
    requestAnimationFrame(lag);
  })();
  document.querySelectorAll('a,button,.stat-strip,.sk-block,.tl-item,.proj-card,.edu-block,.cert-item,.c-link,.more-card,.faq-item').forEach(el=>{
    el.addEventListener('mouseenter',()=>document.body.classList.add('hovering'));
    el.addEventListener('mouseleave',()=>document.body.classList.remove('hovering'));
  });
}

// ── PARTICLE CANVAS ────────────────────────────
const cv=document.getElementById('bgCanvas');
if(cv){
  const cx=cv.getContext('2d');
  let W,H,pts=[];
  const PCOL=['139,92,246','34,211,238']; // violet / cyan
  const resize=()=>{W=cv.width=innerWidth;H=cv.height=innerHeight};
  resize();window.addEventListener('resize',()=>{resize();init()});
  const init=()=>{
    pts=[];
    const n=Math.floor(W*H/20000);
    for(let i=0;i<n;i++)pts.push({
      x:Math.random()*W,y:Math.random()*H,
      vx:(Math.random()-.5)*.18,vy:(Math.random()-.5)*.18,
      r:Math.random()*.9+.2,op:Math.random()*.4+.15,
      c:PCOL[i%2]
    });
  };
  init();
  let pmx=W/2,pmy=H/2;
  document.addEventListener('mousemove',e=>{pmx=e.clientX;pmy=e.clientY});
  const draw=()=>{
    cx.clearRect(0,0,W,H);
    pts.forEach(p=>{
      p.x+=p.vx;p.y+=p.vy;
      if(p.x<0)p.x=W;if(p.x>W)p.x=0;
      if(p.y<0)p.y=H;if(p.y>H)p.y=0;
      cx.beginPath();cx.arc(p.x,p.y,p.r,0,Math.PI*2);
      cx.fillStyle=`rgba(${p.c},${p.op})`;cx.fill();
      const dx=pmx-p.x,dy=pmy-p.y,d=dx*dx+dy*dy;
      if(d<28000){const f=.00012*(1-d/28000);p.vx+=dx*f;p.vy+=dy*f}
      const s=p.vx*p.vx+p.vy*p.vy;if(s>.3){p.vx*=.94;p.vy*=.94}
    });
    for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++){
      const dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y,d=dx*dx+dy*dy;
      if(d<9000){
        cx.beginPath();cx.moveTo(pts[i].x,pts[i].y);cx.lineTo(pts[j].x,pts[j].y);
        cx.strokeStyle=`rgba(139,92,246,${.08*(1-d/9000)})`;
        cx.lineWidth=.4;cx.stroke();
      }
    }
    requestAnimationFrame(draw);
  };
  draw();
}

// ── 3D TILT ON CARDS ───────────────────────────
(function(){
  const sel = '.proj-card,.sk-block,.stat-strip,.edu-block,.more-card';
  const max = 7, scale = 1.015;
  document.querySelectorAll(sel).forEach(el=>{
    el.addEventListener('mousemove', e=>{
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left)/r.width - 0.5;
      const py = (e.clientY - r.top)/r.height - 0.5;
      el.style.transform = `perspective(900px) rotateX(${(-py*max).toFixed(2)}deg) rotateY(${(px*max).toFixed(2)}deg) scale(${scale})`;
    });
    el.addEventListener('mouseleave', ()=>{ el.style.transform = ''; });
  });
})();

// ── NAV ────────────────────────────────────────
const nav=document.getElementById('mainNav');
if(nav){
  window.addEventListener('scroll',()=>{
    nav.classList.toggle('compact',scrollY>60);
  },{passive:true});
  const secs=document.querySelectorAll('section[id]');
  const nls=document.querySelectorAll('.nav-links a');
  if(secs.length){
    window.addEventListener('scroll',()=>{
      let cur='';
      secs.forEach(s=>{if(scrollY>=s.offsetTop-160)cur=s.id});
      nls.forEach(a=>{
        const href=a.getAttribute('href')||'';
        if(href.startsWith('#')) a.classList.toggle('active',href==='#'+cur);
      });
    },{passive:true});
  }
  const toggle=document.getElementById('navToggle');
  const links=document.getElementById('navLinks');
  if(toggle&&links){
    toggle.addEventListener('click',()=>links.classList.toggle('open'));
    links.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>links.classList.remove('open')));
  }
}

// ── MARQUEE ────────────────────────────────────
const mTrack=document.getElementById('mTrack');
if(mTrack){
  const tags=['LangChain','LangGraph','RAG Architecture','Model Context Protocol','LLM Integration','GenAI Solutions','Python','FAISS','TensorFlow','Hugging Face','Apache Kafka','Docker','AWS','Voice AI','Solution Architecture','Prompt Engineering'];
  const t2=[...tags,...tags];
  mTrack.innerHTML=t2.map(t=>`<div class="m-item"><span class="dot">◆</span>${t}</div>`).join('');
}

// ── ROTATING ROLE TEXT ─────────────────────────
const roleEl=document.getElementById('roleText');
if(roleEl){
  const roles=['AI Engineer','Solution Architect','Backend Tech Lead','GenAI Specialist'];
  let ri=0,ci=0,deleting=false;
  const tick=()=>{
    const word=roles[ri];
    if(!deleting){
      ci++;
      roleEl.textContent=word.slice(0,ci);
      if(ci===word.length){ deleting=true; setTimeout(tick,1500); return; }
    }else{
      ci--;
      roleEl.textContent=word.slice(0,ci);
      if(ci===0){ deleting=false; ri=(ri+1)%roles.length; }
    }
    setTimeout(tick, deleting?35:70);
  };
  setTimeout(tick,1200);
}

// ── SCROLL REVEAL ──────────────────────────────
const ob=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in')}),{threshold:.1});
document.querySelectorAll('.rv,.rvl,.rvr').forEach(el=>ob.observe(el));

// ── GMAIL ──────────────────────────────────────
function sendGmail(){
  const n=document.getElementById('cn').value.trim();
  const e=document.getElementById('ce').value.trim();
  const s=document.getElementById('cs').value.trim();
  const m=document.getElementById('cm').value.trim();
  if(!n||!e||!m){alert('Please fill in your name, email, and message.');return;}
  const sub=s||`Message from ${n} via bhupendrarajput.in`;
  const body=`Hi Bhupendra,\n\n${m}\n\n———\nFrom: ${n}\nEmail: ${e}`;
  window.open(`https://mail.google.com/mail/?view=cm&to=bhupendra360i%40gmail.com&su=${encodeURIComponent(sub)}&body=${encodeURIComponent(body)}`,'_blank');
}
window.sendGmail = sendGmail;
