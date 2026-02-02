// ======== Data you can edit ========
const STACK = [
  'HTML','CSS','JavaScript','Java', 'Python','Git','C', 'C++'
];

const SERVICES = [
  { title: 'One‑page portfolio websites', blurb: 'Modern, responsive, SEO‑friendly sites delivered fast.', bullets: ['Responsive Tailwind design','Contact form setup','Basic SEO'], price: '$50+' },
  { title: 'Small business sites', blurb: 'Pages for restaurants, student orgs, barbers, gyms, etc.', bullets: ['3–5 pages','Deployed on Vercel/Netlify', 'Baisc SEO'], price: '$100+' },
];

const PROJECTS = [
  { title: 'Stardew‑style Pomodoro', year: 2025, tags: ['Web','JS','UI'], blurb: 'A cute productivity timer with pixel art, audio loops, and GIF triggers.', tech: ['HTML','CSS','JavaScript'], links: { live: '#', repo: '#' } },
  { title: 'Simple Shell (sish)', year: 2025, tags: ['Systems','C'], blurb: 'Unix‑style shell with built‑ins (cd, history) and pipes.', tech: ['C','UNIX','Make'], links: { live: null, repo: '#' } },
  { title: 'Multithreaded Hash Tree', year: 2025, tags: ['Systems','C','Threads'], blurb: 'Binary tree of threads computing file hash; measured speedup up to 256 threads.', tech: ['C','pthread'], links: { live: null, repo: '#' } },
  { title: 'Workout Tracker (WIP)', year: 2025, tags: ['Web','Full‑stack'], blurb: 'Login, set tracking, and progress charts; built as a personal project.', tech: ['React','Node','Chart.js'], links: { live: '#', repo: '#' } },
  { title: 'MIPS ASCII Board Game', year: 2024, tags: ['Assembly','MIPS'], blurb: '6×6 board with cursor movement and game state in MIPS.', tech: ['MIPS'], links: { live: null, repo: '#' } },
  { title: 'dbserver.c', year: 2025, tags: ['Networking','C'], blurb: 'Multi‑threaded key‑value store over sockets for class project.', tech: ['C','Sockets','pthread'], links: { live: null, repo: '#' } },
  // Added project: The Coop Chicken Fingers website
  { title: 'The Coop Chicken Fingers Website', year: 2025, tags: ['Web','Client','Business'], blurb: 'Website for The Coop Chicken Fingers restaurant, featuring menu, hours, and contact info. Built for a real business client.', tech: ['HTML','CSS','JavaScript'], links: { live: 'https://www.thecoopchickenfingers.com/', repo: null } },
];

const TESTIMONIALS = [
  { name: 'Classmate (CS3377)', quote: 'Super reliable partner — our multithreaded project hit the speed goals thanks to his profiling & fixes.' },
];

// ======== DOM helpers ========
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

function badge(text){
  const span = document.createElement('span');
  span.className = 'px-2 py-1 text-xs rounded-full border';
  span.textContent = text; return span;
}

// ======== Render functions ========
function renderStack(){
  const box = $('#stack');
  STACK.forEach(s => box.appendChild(badge(s)));
}

function renderServices(){
  const grid = $('#servicesGrid');
  SERVICES.forEach(s => {
    const card = document.createElement('div');
    card.className = 'rounded-2xl bg-white p-6 shadow';
    card.innerHTML = `
      <h3 class="font-semibold text-lg leading-tight">${s.title}</h3>
      <p class="text-sm text-zinc-600 mt-1">${s.blurb}</p>
      <ul class="mt-3 space-y-1 text-sm list-disc pl-5">${s.bullets.map(b=>`<li>${b}</li>`).join('')}</ul>
      <div class="mt-4 font-semibold">Starting ${s.price}</div>
    `;
    grid.appendChild(card);
  });
}

// Search + filter state
let state = { query: '', tag: null };

function getTags(){
  return Array.from(new Set(PROJECTS.flatMap(p => p.tags))).sort();
}

function renderTagButtons(){
  const wrap = $('#tagBtns');
  wrap.innerHTML = '';
  const btnAll = document.createElement('button');
  btnAll.className = 'px-3 py-1.5 rounded-2xl border ' + (state.tag===null ? 'bg-indigo-600 text-white' : 'bg-white');
  btnAll.textContent = 'All';
  btnAll.onclick = ()=>{ state.tag=null; renderProjects(); renderTagButtons(); };
  wrap.appendChild(btnAll);
  getTags().forEach(t => {
    const b = document.createElement('button');
    b.className = 'px-3 py-1.5 rounded-2xl border ' + (state.tag===t ? 'bg-indigo-600 text-white' : 'bg-white');
    b.textContent = t;
    b.onclick = ()=>{ state.tag=t; renderProjects(); renderTagButtons(); };
    wrap.appendChild(b);
  });
}

function filterProjects(){
  const q = state.query.toLowerCase();
  return PROJECTS.filter(p => {
    const matchesTag = state.tag ? p.tags.includes(state.tag) : true;
    const hay = [p.title, p.blurb, ...(p.tech||[]), ...(p.tags||[])].join(' ').toLowerCase();
    const matchesQuery = q ? hay.includes(q) : true;
    return matchesTag && matchesQuery;
  }).sort((a,b)=> b.year - a.year);
}

function renderProjects(){
  const grid = $('#grid');
  grid.innerHTML = '';
  filterProjects().forEach(p => {
    const card = document.createElement('div');
    card.className = 'reveal rounded-2xl bg-white p-5 shadow flex flex-col';
    card.innerHTML = `
      <div class="mb-2 flex items-center justify-between">
        <h3 class="font-semibold tracking-tight leading-snug">${p.title}</h3>
        <span class="text-xs text-zinc-500">${p.year}</span>
      </div>
      <p class="text-sm text-zinc-600 mb-3">${p.blurb}</p>
      <div class="flex flex-wrap gap-2 mb-4">${(p.tech||[]).map(t=>`<span class='px-2 py-1 text-xs rounded-full border'>${t}</span>`).join('')}</div>
      <div class="mt-auto flex items-center gap-3">
        ${p.links.live ? `<a class='px-3 py-1.5 rounded-2xl border inline-flex items-center gap-2' target='_blank' rel='noreferrer noopener' href='${p.links.live}'>🔗 Live</a>` : ''}
        ${p.links.repo ? `<a class='px-3 py-1.5 rounded-2xl border inline-flex items-center gap-2' target='_blank' rel='noreferrer noopener' href='${p.links.repo}'>📦 Code</a>` : ''}
      </div>
    `;
    grid.appendChild(card);
  });
  revealOnScroll();
}

function renderTestimonials(){
  const box = document.querySelector('#testimonials');
  TESTIMONIALS.forEach(t => {
    const card = document.createElement('div');
    card.className = 'rounded-2xl bg-white p-6 shadow';
    card.innerHTML = `
      <p class="italic text-sm">“${t.quote}”</p>
      <div class="mt-2 text-sm font-medium">— ${t.name}</div>
    `;
    box.appendChild(card);
  });
}

function wireSearch(){
  const input = document.querySelector('#search');
  input.addEventListener('input', e => { state.query = e.target.value; renderProjects(); });
}

function wireContact(){
  const form = document.querySelector('#contactForm');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const subject = encodeURIComponent('Freelance inquiry – ' + (data.get('name')||''));
    const body = encodeURIComponent(`Name: ${data.get('name')}\nEmail: ${data.get('email')}\nBudget: ${data.get('budget')}\n\n${data.get('details')}`);
    window.location.href = `mailto:you@example.com?subject=${subject}&body=${body}`;
  });
}

function revealOnScroll(){
  const els = $$('.reveal');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(en => { if(en.isIntersecting){ en.target.classList.add('revealed'); io.unobserve(en.target); } });
  }, { threshold: 0.1 });
  els.forEach(el => io.observe(el));
}

// ======== Init ========
document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#year').textContent = new Date().getFullYear();
  renderStack();
  renderServices();
  renderTagButtons();
  renderProjects();
  renderTestimonials();
  wireSearch();
  wireContact();
  revealOnScroll();
});
