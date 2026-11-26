(() => {
  const $ = s => document.querySelector(s), C = window.C, body = document.body;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ---- static text ---- */
  $('#nm').textContent = C.name; $('#tt').textContent = C.title; $('#quote').textContent = C.quote;
  $('#gh').href = C.links.github;

  /* ---- fluid background (glowing ribbons that follow the cursor) ---- */
  const cv = $('#fluid'), x = cv.getContext('2d'); let W, H, t = 0, lx = 0, ly = 0, m = null;
  function rs() { W = cv.width = innerWidth; H = cv.height = innerHeight; lx = W * .7; ly = H * .4; }
  rs(); addEventListener('resize', rs);
  addEventListener('pointermove', e => { m = { x: e.clientX, y: e.clientY }; });
  function blob(px, py, r, h) {
    const g = x.createRadialGradient(px, py, 0, px, py, r);
    g.addColorStop(0, `hsla(${h},95%,58%,.32)`); g.addColorStop(1, 'hsla(0,0%,0%,0)');
    x.fillStyle = g; x.fillRect(px - r, py - r, r * 2, r * 2);
  }
  (function loop() {
    t += .012;
    x.globalCompositeOperation = 'source-over'; x.fillStyle = 'rgba(0,0,0,.07)'; x.fillRect(0, 0, W, H);
    x.globalCompositeOperation = 'lighter';
    const ax = W / 2 + Math.sin(t * 1.3) * W * .32, ay = H / 2 + Math.cos(t * .9) * H * .3;
    blob(ax, ay, 150, 300 + Math.sin(t) * 40); blob(W - ax, H - ay, 120, 330 + Math.cos(t * 1.1) * 30);
    if (m) { lx += (m.x - lx) * .12; ly += (m.y - ly) * .12; blob(lx, ly, 120, 310 + Math.sin(t * 2) * 50); }
    if (!reduce) requestAnimationFrame(loop);
  })();

  /* ---- answer builders ---- */
  const dots = l => { const n = { Learning: 1, Comfortable: 2, Proficient: 3, Expert: 3 }[l] || 2; return `<span class="lv">${[1, 2, 3].map(i => `<i class="${i <= n ? 'on' : ''}"></i>`).join('')}</span>`; };
  const row = s => `<a class="sr" href="https://www.google.com/search?q=${encodeURIComponent(s[1])}" target="_blank" rel="noopener"><div class="ic">${esc(s[1][0])}</div><span>${esc(s[1])}<em>${s[2]}</em></span>${dots(s[2])}</a>`;
  function skillsCard(list, title) {
    const cats = [...new Set(list.map(s => s[0]))];
    return `<div class="sk"><h2>${title}</h2>${cats.map(c => `<h4>${esc(c)}</h4><div class="sg">${list.filter(s => s[0] === c).map(row).join('')}</div>`).join('')}</div>`;
  }
  // whole-word match, so the skill "R" doesn't match the letter r inside other words
  const named = q => C.skills.filter(s => new RegExp('(^|[^a-z0-9+#])' + s[1].toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '($|[^a-z0-9+#])').test(q));
  const A = {
    about: () => ({ html: `<div class="about"><img src="assets/photo.jpeg" onerror="this.onerror=null;this.src='assets/photo.svg'" alt=""><div><h2>${esc(C.name)}</h2><small>${esc(C.location)}</small><p class="b">${esc(C.bio)}</p>${C.tags.map(g => `<span class="chip">${esc(g)}</span>`).join('')}</div></div>`,
      text: `Hi, I’m ${C.name} from Mumbai. I build practical AI systems that combine LLMs, retrieval and automation to solve real business problems, with a focus on RAG-based solutions and AI agents.\n\nThis card shows my background and current work; would you like to explore my projects or get in touch?` }),
    skills: q => {
      const one = named(q);
      if (one.length && one.length < 4) return { html: skillsCard(one, one[0][1]), text: `${one.map(s => s[1]).join(' and ')}: I’m ${one[0][2].toLowerCase()} with it and use it in my AI projects. Want me to pull up a project that uses it?` };
      return { html: skillsCard(C.skills, 'My Skills'), text: `Here’s a snapshot of my tech stack and how I map to each. I’m proficient with ${C.skills.filter(s => s[2] === 'Proficient').map(s => s[1]).join(', ')}, and comfortable with the rest.\n\nWould you like me to show details for a specific technology or area?` };
    },
    experience: () => ({ html: C.experience.map(e => `<div class="card"><h3>${esc(e.role)}</h3><small>${esc(e.org)} · ${esc(e.when)}</small><p>${esc(e.text)}</p></div>`).join(''), text: 'That’s where I’m working right now. Want to see the projects I’ve built?' }),
    education: () => ({ html: C.education.map(e => `<div class="card"><h3>${esc(e.what)}</h3><small>${esc(e.where)} · ${esc(e.when)}</small></div>`).join(''), text: 'Happy to share more about what I studied or the projects that came out of it.' }),
    projects: () => ({ html: C.projects.map(p => `<div class="card"><h3>${esc(p.name)}</h3><small>${esc(p.tech)}</small><p>${esc(p.text)}</p></div>`).join(''), text: 'Which one should I go deeper on?' }),
    resume: () => ({ html: `<div class="card"><h3>Resume</h3><p><a href="${esc(C.links.resume)}" target="_blank" rel="noopener">Open my resume (PDF)</a></p></div>`, text: 'Anything on the resume you’d like me to expand on?' }),
    social: () => ({ html: `<div class="card"><h3>Follow me</h3><p><a href="${esc(C.links.social)}" target="_blank" rel="noopener">LinkedIn</a> · <a href="${esc(C.links.github)}" target="_blank" rel="noopener">GitHub</a></p></div>`, text: 'Say hi on either, I reply to everyone.' }),
    contact: () => ({ html: `<div class="card"><h3>Talk with me</h3><p><a href="mailto:${esc(C.links.email)}">${esc(C.links.email)}</a></p></div>`, text: 'I usually reply within one business day.' }),
    location: () => ({ html: `<div class="card"><h3>${esc(C.location)}</h3></div>`, text: 'I’m based in Mumbai and happy to work remotely.' }),
    none: () => ({ html: '', text: 'I can only answer from what’s on this portfolio. Try asking about my experience, education, tech stack, projects or how to reach me.' })
  };
  const rules = [[/resume|cv/, 'resume'], [/follow|social|linkedin/, 'social'], [/reach|contact|email|say hi|hire|talk/, 'contact'],
    [/where.*(based|live|from)|location|city/, 'location'], [/worked|work history|experience|job|role|company/, 'experience'],
    [/study|educat|college|degree|mba|school|universit/, 'education'], [/project|working on|coding|building|built|side/, 'projects'],
    [/stack|skill|tech|tool|language|framework|proficient/, 'skills'], [/who|about|what do you do|yourself|intro/, 'about']];
  function route(q) {
    q = q.toLowerCase();
    if (named(q).length) return 'skills';
    const r = rules.find(([re]) => re.test(q)); return r ? r[1] : 'none';
  }

  /* ---- views & chat ---- */
  let used = 0, busy = false; const history = [];
  // Ask the Netlify function; returns null on any failure so the built-in answers take over.
  async function fetchAnswer(q) {
    try {
      const ctl = new AbortController(), to = setTimeout(() => ctl.abort(), 15000);
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: q, history }), signal: ctl.signal });
      clearTimeout(to); if (!res.ok) return null;
      const d = await res.json(); return A[d.card] ? d : null;
    } catch (e) { return null; }
  }
  const thread = $('#thread');
  function view(chat) { $('#home').hidden = chat; $('#chat').hidden = !chat; body.classList.toggle('chatting', chat); $('#more').hidden = true; scrollTo(0, 0); }
  function ask(q) {
    q = q.trim(); if (!q || busy) return;
    if (used >= C.limit) { $('#sheet').hidden = false; return; }
    used++; busy = true; view(true); body.classList.add('loading');
    thread.innerHTML = ''; const b = document.createElement('div'); b.className = 'bubble'; b.textContent = q;
    const d = document.createElement('div'); d.className = 'dots'; d.textContent = '•••'; thread.append(b, d);
    const wait = new Promise(r => setTimeout(r, reduce ? 0 : 700));
    Promise.all([fetchAnswer(q), wait]).then(([srv]) => {
      d.remove(); body.classList.remove('loading');
      const key = srv ? srv.card : route(q);
      let a = A[key](srv ? srv.skills.join(' ').toLowerCase() : q.toLowerCase());
      if (srv && srv.text) { a = { html: a.html, text: srv.text }; history.push({ q, a: srv.text }); if (history.length > 4) history.shift(); }
      const r = document.createElement('div'); r.className = 'reply'; r.innerHTML = a.html;
      const p = document.createElement('p'); r.append(p); thread.append(r);
      let i = 0; const iv = setInterval(() => { i += 3; p.textContent = a.text.slice(0, i); if (i >= a.text.length) { clearInterval(iv); busy = false; } }, 16);
      if (reduce) { clearInterval(iv); p.textContent = a.text; busy = false; }
    });
  }
  document.querySelectorAll('[data-q]').forEach(el => el.addEventListener('click', () => ask(el.dataset.q)));
  [['#f1', '#q1'], ['#f2', '#q2']].forEach(([f, i]) => $(f).addEventListener('submit', e => { e.preventDefault(); const v = $(i).value; $(i).value = ''; ask(v); }));
  $('#back').addEventListener('click', () => view(false));
  $('#sx').addEventListener('click', () => { $('#sheet').hidden = true; });
  const more = $('#more'); more.innerHTML = C.suggestions.map(s => `<button>${esc(s)}<span>›</span></button>`).join('');
  more.querySelectorAll('button').forEach((b, i) => b.addEventListener('click', () => { more.hidden = true; ask(C.suggestions[i]); }));
  $('#mb').addEventListener('click', () => { more.hidden = !more.hidden; });
})();
