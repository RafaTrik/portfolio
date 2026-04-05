'use client';

import { useEffect, useRef } from 'react';

// ── Data ──────────────────────────────────────────────────────────────────────

const STACK: [string, string][] = [
  ['🐘', 'PHP'], ['⚛️', 'React'], ['🐍', 'Python'], ['🟨', 'JavaScript'],
  ['🔷', 'TypeScript'], ['🐬', 'MySQL'], ['🔴', 'Symfony'], ['🌿', 'Laravel'],
  ['🎸', 'Django'], ['⚡', 'WebSockets'], ['🐳', 'Docker'], ['🌐', 'REST APIs'],
  ['☁️', 'AWS'], ['🔵', 'Azure'], ['🐧', 'Linux'], ['📦', 'Git / SVN'],
  ['🎓', 'Moodle'], ['🌐', 'WordPress'],
];

const WEB_WORK: [string, string, string][] = [
  ['👩‍🎨', "Sister's Portfolio", 'WordPress · Custom Theme'],
  ['🛒', 'E-commerce Store', 'WooCommerce · PHP'],
  ['🎭', 'Pedagogical Theatre', 'WordPress · Custom Theme'],
];

const PROJECTS = [
  {
    icon: '📋',
    name: 'Real-Time Kanban Board',
    desc: 'Drag-and-drop project board with live multi-user sync via WebSockets. Includes full auth system and REST API backend.',
    tags: ['PHP', 'React', 'WebSockets', 'MySQL'],
    status: 'in-progress' as const,
    statusLabel: 'In progress',
  },
  {
    icon: '🤖',
    name: 'AI Document Q&A',
    desc: 'Upload any PDF and ask questions about it. RAG-based semantic search with local embeddings and Gemini as the LLM.',
    tags: ['Python', 'Gemini', 'React', 'FastAPI'],
    status: 'live' as const,
    statusLabel: 'Live',
  },
  {
    icon: '📄',
    name: 'CV Generator',
    desc: 'Web tool that generates professional CVs in HTML, PDF, DOCX and Markdown from a JSON profile with multiple visual templates.',
    tags: ['Python', 'Flask', 'Jinja2', 'python-docx'],
    status: 'live' as const,
    statusLabel: 'Live',
  },
];

const STATS: [string, string, string][] = [
  ['6', '+', 'Years in production'],
  ['50', '+', 'Platforms managed'],
  ['1k', '+', 'Daily active users'],
  ['10', '+', 'Client web projects'],
];

const CODE_HTML = `<span class="kw">class</span> <span class="ac">Developer</span> {
  <span class="fn">constructor</span>() {
    <span class="kw">this</span>.name  = <span class="str">"Rafael Pérez"</span>;
    <span class="kw">this</span>.stack = [<span class="str">"PHP"</span>,<span class="str">"React"</span>,<span class="str">"Python"</span>];
    <span class="kw">this</span>.years = <span class="nm">6</span>;
    <span class="kw">this</span>.eng   = <span class="str">"C1"</span>;
    <span class="kw">this</span>.open  = <span class="str">"remote"</span>;
  }

  <span class="fn">build</span>(problem) {
    <span class="cmt">// turns complexity</span>
    <span class="cmt">// into clean solutions</span>
    <span class="kw">return new</span> <span class="ac">Solution</span>(problem);
  }
}`;

// ── Component ─────────────────────────────────────────────────────────────────

export default function HomePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotRef    = useRef<HTMLDivElement>(null);
  const ringRef   = useRef<HTMLDivElement>(null);
  const navRef    = useRef<HTMLElement>(null);
  const heroSubRef = useRef<HTMLParagraphElement>(null);

  // ── Particle canvas ──────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const mouse = { x: -999, y: -999 };
    let animId: number;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMouseMove = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    document.addEventListener('mousemove', onMouseMove);

    class P {
      x = 0; y = 0; vx = 0; vy = 0; r = 0; a = 0;
      constructor() { this.reset(true); }
      reset(rand: boolean) {
        this.x  = Math.random() * canvas.width;
        this.y  = rand ? Math.random() * canvas.height : canvas.height + 8;
        this.vx = (Math.random() - .5) * .45;
        this.vy = -(Math.random() * .55 + .15);
        this.r  = Math.random() * 1.4 + .3;
        this.a  = Math.random() * .35 + .06;
      }
      tick() {
        const dx = this.x - mouse.x, dy = this.y - mouse.y;
        const d  = Math.hypot(dx, dy);
        if (d < 110) { const f = (110 - d) / 110; this.vx += dx / d * f * .35; this.vy += dy / d * f * .35; }
        this.vx *= .97; this.vy *= .97;
        this.x  += this.vx; this.y += this.vy;
        if (this.y < -8 || this.x < -8 || this.x > canvas.width + 8) this.reset(false);
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,229,160,${this.a})`;
        ctx.fill();
      }
    }

    const particles = Array.from({ length: 90 }, () => new P());

    const frame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].tick();
        particles[i].draw();
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d  = Math.hypot(dx, dy);
          if (d < 95) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0,229,160,${.07 * (1 - d / 95)})`;
            ctx.lineWidth = .5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(frame);
    };
    frame();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      document.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  // ── Custom cursor ────────────────────────────────────────────────────────────
  useEffect(() => {
    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mx = 0, my = 0, rx = 0, ry = 0, animId: number;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top  = my + 'px';
    };
    document.addEventListener('mousemove', onMove);

    const loop = () => {
      rx += (mx - rx) * .12;
      ry += (my - ry) * .12;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);

    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  // ── Nav scroll + scroll reveals ──────────────────────────────────────────────
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });

    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: .1 }
    );
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

    return () => {
      window.removeEventListener('scroll', onScroll);
      obs.disconnect();
    };
  }, []);

  // ── Typing effect ────────────────────────────────────────────────────────────
  useEffect(() => {
    const el = heroSubRef.current;
    if (!el) return;

    const phrases = [
      'Building systems at scale.',
      'PHP · React · Python.',
      '6 years in production.',
      'Open to new opportunities.',
    ];
    let pi = 0, ci = 0, del = false;
    let t: ReturnType<typeof setTimeout>;

    const tick = () => {
      const p = phrases[pi];
      el.textContent = del ? p.slice(0, --ci) : p.slice(0, ++ci);
      if (!del && ci === p.length)  { del = true;  t = setTimeout(tick, 2400); return; }
      if (del  && ci === 0)         { del = false; pi = (pi + 1) % phrases.length; }
      t = setTimeout(tick, del ? 42 : 85);
    };
    t = setTimeout(tick, 1100);

    return () => clearTimeout(t);
  }, []);

  const year = new Date().getFullYear();

  return (
    <>
      {/* Cursor */}
      <div ref={dotRef}  id="cursor-dot" />
      <div ref={ringRef} id="cursor-ring" />

      {/* Ambient background glows */}
      <div className="bg-glow-tr" />
      <div className="bg-glow-bl" />

      {/* ── Nav ── */}
      <nav ref={navRef} id="nav">
        <a href="#hero" className="nav-logo">rpp<span>._</span></a>
        <ul className="nav-links">
          <li><a href="#about-section">About</a></li>
          <li><a href="#stack-section">Stack</a></li>
          <li><a href="#projects-section">Projects</a></li>
          <li><a href="#webwork-section">Web Work</a></li>
          <li><a href="#contact-section">Contact</a></li>
        </ul>
      </nav>

      {/* ── Hero ── */}
      <section id="hero">
        <canvas ref={canvasRef} id="hero-canvas" />
        <div className="hero-content">
          <div className="hero-tag">Full-Stack Developer</div>
          <div className="hero-name-wrap">
            <h1 className="hero-name">
              Rafael Pérez<span className="dot">.</span><span className="blink" />
            </h1>
          </div>
          <p ref={heroSubRef} className="hero-sub">&nbsp;</p>
          <div className="hero-ctas">
            <a href="#projects-section" className="btn btn-primary">View Projects</a>
            <a href="#contact-section"  className="btn btn-outline">Get In Touch</a>
          </div>
        </div>
        <div className="scroll-hint">
          <span>Scroll</span>
          <div className="scroll-line" />
        </div>
      </section>

      {/* ── About ── */}
      <div className="sec-div"><hr /></div>
      <div className="sec-wrap" id="about-section">
        <div className="inner">
          <div className="about-text reveal">
            <div className="sec-label">About me</div>
            <h2 className="sec-title">Building systems<br />that scale.</h2>
            <p>
              Full-stack developer with <strong>6 years of production experience</strong> building
              systems that real users depend on daily. At Westcon Europe I was a core developer of
              a corporate intranet used by thousands of users across multiple global brands.
            </p>
            <p>
              Previously built <strong>AI-powered biometric plugins</strong> (facial recognition,
              keystroke detection) for 50+ e-learning platforms. I also take on freelance web
              projects, managing clients and deployments end-to-end.
            </p>
            <div className="facts">
              <div className="fact"><div className="fact-dot" /><span>6 years in production environments</span></div>
              <div className="fact"><div className="fact-dot" /><span>English C1 · international client experience</span></div>
              <div className="fact"><div className="fact-dot" /><span>Las Palmas de Gran Canaria · Open to remote</span></div>
              <div className="fact"><div className="fact-dot" /><span>B.Sc. Computer Science — UOC (expected 2026)</span></div>
            </div>
          </div>
          <div className="about-visual reveal d2">
            <div className="code-card">
              <div className="code-bar">
                <div className="cd" /><div className="cd" /><div className="cd" />
              </div>
              <div
                className="code-body"
                dangerouslySetInnerHTML={{ __html: CODE_HTML }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="sec-div"><hr /></div>
      <div className="sec-wrap" id="stats-section" style={{ paddingTop: 60, paddingBottom: 60 }}>
        <div className="stats-grid">
          {STATS.map(([num, suf, label], i) => (
            <div key={i} className={`stat-item reveal${i > 0 ? ` d${i}` : ''}`}>
              <div className="stat-num">{num}<span>{suf}</span></div>
              <div className="stat-label">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Stack ── */}
      <div className="sec-div"><hr /></div>
      <div className="sec-wrap" id="stack-section" style={{ textAlign: 'center' }}>
        <div className="sec-label reveal" style={{ justifyContent: 'center' }}>Tech Stack</div>
        <h2 className="sec-title reveal">Tools of the trade.</h2>
        <div className="stack-grid">
          {STACK.map(([icon, name], i) => (
            <div key={i} className="stack-item reveal" style={{ transitionDelay: `${i * .038}s` }}>
              <span className="si">{icon}</span>
              <span className="sn">{name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Projects ── */}
      <div className="sec-div"><hr /></div>
      <div className="sec-wrap" id="projects-section">
        <div className="sec-label reveal">Projects</div>
        <h2 className="sec-title reveal">Things I&apos;ve built.</h2>
        <div className="projects-grid">
          {PROJECTS.map((p, i) => (
            <div key={i} className={`project-card reveal${i > 0 ? ` d${i}` : ''}`}>
              <div className="project-top">
                <div className="project-icon">{p.icon}</div>
                <div className="project-links">
                  <a href="#" className="project-link">GitHub</a>
                  <a href="#" className="project-link">Live ↗</a>
                </div>
              </div>
              <div className="project-name">{p.name}</div>
              <div className="project-desc">{p.desc}</div>
              <div className="project-tags">
                {p.tags.map(t => <span key={t} className="project-tag">{t}</span>)}
              </div>
              <div className="project-status">
                <div className={`status-dot${p.status === 'live' ? ' live' : ''}`} />
                {p.statusLabel}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Web Work ── */}
      <div className="sec-div"><hr /></div>
      <div className="sec-wrap" id="webwork-section">
        <div className="sec-label reveal">Web Work</div>
        <h2 className="sec-title reveal">Client projects.</h2>
        <div className="webwork-grid">
          {WEB_WORK.map(([icon, title, tech], i) => (
            <div key={i} className="webwork-card reveal" style={{ transitionDelay: `${i * .1}s` }}>
              <div className="ww-bg">
                <div className="ww-grid" />
                <span className="ww-icon">{icon}</span>
              </div>
              <div className="ww-overlay">
                <div className="ww-title">{title}</div>
                <div className="ww-tech">{tech}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Contact ── */}
      <div className="sec-div"><hr /></div>
      <div className="sec-wrap" id="contact-section" style={{ textAlign: 'center' }}>
        <div className="sec-label reveal" style={{ justifyContent: 'center' }}>Contact</div>
        <h2 className="sec-title reveal">Let&apos;s work together.</h2>
        <p className="contact-lead reveal">
          Open to full-time roles, contract work, and freelance projects.<br />
          Remote preferred — Spain-based positions also welcome.
        </p>
        <a href="mailto:rafatrik@gmail.com" className="contact-email reveal">
          rafatrik@gmail.com
        </a>
        <div className="socials reveal">
          <a href="https://linkedin.com/in/rafatrik" target="_blank" rel="noopener noreferrer" className="social-link">
            in&nbsp; LinkedIn
          </a>
          <a href="https://github.com/rafatrik" target="_blank" rel="noopener noreferrer" className="social-link">
            ⌥&nbsp; GitHub
          </a>
        </div>
      </div>

      <footer>
        Rafael Pérez Pérez · Las Palmas de Gran Canaria, Spain · {year}
      </footer>
    </>
  );
}
