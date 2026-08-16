const screens = [...document.querySelectorAll(".screen")];
const hearts = document.getElementById("hearts");
const sparkles = document.getElementById("sparkles");
const musicBtn = document.getElementById("musicBtn");

let current = 0;
let audioCtx = null;
let gain = null;
let musicOn = false;

function show(id){
  screens.forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function floatHeart(){
  const h = document.createElement("div");
  h.className = "heart-float";
  h.textContent = Math.random() > .18 ? "♥" : "♡";
  h.style.left = Math.random()*100 + "%";
  h.style.bottom = "-30px";
  h.style.fontSize = (10 + Math.random()*18) + "px";
  h.style.animationDuration = (6 + Math.random()*6) + "s";
  hearts.appendChild(h);
  setTimeout(()=>h.remove(),13000);
}
setInterval(floatHeart, 750);

for(let i=0;i<45;i++){
  const s=document.createElement("div");
  s.className="spark";
  s.style.left=Math.random()*100+"%";
  s.style.top=Math.random()*100+"%";
  s.style.animationDelay=(Math.random()*3)+"s";
  s.style.animationDuration=(2+Math.random()*4)+"s";
  sparkles.appendChild(s);
}

document.getElementById("openBtn").addEventListener("click",()=>{
  show("intro");
  startAmbient();
});

document.querySelectorAll(".next-btn").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const active=document.querySelector(".screen.active");
    if(active.id==="intro") show("gallery");
    else if(active.id==="letter") show("final");
  });
});

const memories=[...document.querySelectorAll(".memory")];
const dots=document.getElementById("dots");
let photoIndex=0;

memories.forEach((_,i)=>{
  const d=document.createElement("div");
  d.className="dot"+(i===0?" active":"");
  dots.appendChild(d);
});

function renderMemory(){
  memories.forEach((m,i)=>m.classList.toggle("active",i===photoIndex));
  [...dots.children].forEach((d,i)=>d.classList.toggle("active",i===photoIndex));
}
document.getElementById("galleryNext").addEventListener("click",()=>{
  if(photoIndex < memories.length-1){
    photoIndex++;
    renderMemory();
  }else{
    show("letter");
    typeLetter();
  }
});

let typed=false;
const letter=`I don't know if words can ever explain how special you are to me.

But today, on your birthday, I just want you to know one simple thing — having you in my life is something I'll always be grateful for.

You have a way of making normal moments feel special, and somehow your smile can make a difficult day feel a little lighter.

I hope this new year of your life brings you everything your heart quietly wishes for.

Keep smiling. Keep being you.

And whenever you forget how special you are, remember that there is someone who will always see something beautiful in you.

Happy Birthday, Prachi. ❤️`;

function typeLetter(){
  if(typed) return;
  typed=true;
  const el=document.getElementById("typedLetter");
  let i=0;
  const timer=setInterval(()=>{
    el.textContent=letter.slice(0,i++);
    if(i>letter.length){clearInterval(timer);}
  },18);
}

function startAmbient(){
  if(audioCtx) return;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  gain = audioCtx.createGain();
  gain.gain.value = 0.0001;
  gain.connect(audioCtx.destination);

  // Very soft ambient chord. Browsers allow this after the user taps "Open".
  const notes=[261.63,329.63,392.00,523.25];
  notes.forEach((freq,idx)=>{
    const osc=audioCtx.createOscillator();
    const g=audioCtx.createGain();
    osc.type="sine";
    osc.frequency.value=freq;
    g.gain.value=.008;
    osc.connect(g); g.connect(gain);
    osc.start();
    const lfo=audioCtx.createOscillator();
    const lg=audioCtx.createGain();
    lfo.frequency.value=.08+idx*.02;
    lg.gain.value=2;
    lfo.connect(lg); lg.connect(osc.frequency);
    lfo.start();
  });
  gain.gain.exponentialRampToValueAtTime(.045,audioCtx.currentTime+1.2);
  musicOn=true;
  musicBtn.classList.add("playing");
}

musicBtn.addEventListener("click",()=>{
  if(!audioCtx) return;
  if(musicOn){
    gain.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+.5);
    musicOn=false;
    musicBtn.classList.remove("playing");
  }else{
    gain.gain.exponentialRampToValueAtTime(.045,audioCtx.currentTime+.7);
    musicOn=true;
    musicBtn.classList.add("playing");
  }
});
