/* ============================================================
   PORTFOLIO — script.js
   Phase 4: Production-hardened JavaScript
   ============================================================ */

'use strict';

/* ============================================================
   1. REDUCED MOTION DETECTION
   ============================================================ */

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function prefersReducedMotion() {
    return reducedMotion.matches;
}

/* ============================================================
   2. DOM REFERENCES — queried once, checked before use
   ============================================================ */

const progressBar  = document.getElementById('progress-bar');
const header       = document.getElementById('header');
const menuBtn      = document.getElementById('menu-btn');
const navLinksEl   = document.getElementById('nav-links');
const typingEl     = document.getElementById('typing');
const contactForm  = document.getElementById('contact-form');
const canvas       = document.getElementById('particles');
const themeToggle  = document.getElementById('theme-toggle');
const backToTop    = document.getElementById('back-to-top');
const sections     = document.querySelectorAll('section[id]');
const navItems     = document.querySelectorAll('.nav-links a');
const revealEls    = document.querySelectorAll('.scroll-reveal');

/* ============================================================
   3. THEME — restore preference, no visible toggle this phase
   ============================================================ */

(function initTheme() {
    const saved = localStorage.getItem('theme');
    if (saved === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
    } else if (!saved && window.matchMedia('(prefers-color-scheme: light)').matches) {
        document.documentElement.setAttribute('data-theme', 'light');
    }
    // Sync toggle button state after DOM is ready
    syncThemeToggle();
})();

function syncThemeToggle() {
    if (!themeToggle) return;
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
    themeToggle.setAttribute('aria-pressed', String(isLight));
    const icon = themeToggle.querySelector('i');
    if (icon) {
        icon.className = isLight ? 'fas fa-moon' : 'fas fa-sun';
    }
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        if (isLight) {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
        syncThemeToggle();
    });
}

/* ============================================================
   4. SCROLL HANDLING — single merged, throttled via rAF
   ============================================================ */

let scrollTicking = false;

function onScroll() {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
        handleProgressBar();
        handleHeaderState();
        handleActiveNav();
        handleBackToTop();
        scrollTicking = false;
    });
}

function handleProgressBar() {
    if (!progressBar) return;
    const scrollable = document.body.scrollHeight - window.innerHeight;
    if (scrollable <= 0) { progressBar.style.width = '0%'; return; }
    const pct = (window.scrollY / scrollable) * 100;
    progressBar.style.width = Math.min(pct, 100) + '%';
}

function handleHeaderState() {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 50);
}

function handleActiveNav() {
    if (!sections.length || !navItems.length) return;
    let current = '';
    sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 130) {
            current = sec.getAttribute('id');
        }
    });
    navItems.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
}

function handleBackToTop() {
    if (!backToTop) return;
    const show = window.scrollY > 400;
    backToTop.classList.toggle('visible', show);
    // hidden attribute removed once first shown, visibility controlled by CSS class
    if (show) backToTop.removeAttribute('hidden');
}

window.addEventListener('scroll', onScroll, { passive: true });

/* Back-to-top click */
if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    });
}

/* ============================================================
   5. MOBILE NAVIGATION
   ============================================================ */

function setMenuState(open) {
    if (!navLinksEl || !menuBtn) return;
    const icon = menuBtn.querySelector('i');
    navLinksEl.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    if (icon) {
        icon.classList.toggle('fa-bars', !open);
        icon.classList.toggle('fa-times', open);
    }
}

if (menuBtn && navLinksEl) {
    menuBtn.addEventListener('click', () => {
        const isOpen = navLinksEl.classList.contains('open');
        setMenuState(!isOpen);
    });

    // Close on nav link click
    navLinksEl.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => setMenuState(false));
    });

    // Close on Escape key
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && navLinksEl.classList.contains('open')) {
            setMenuState(false);
            menuBtn.focus();
        }
    });

    // Close on outside click
    document.addEventListener('click', e => {
        if (
            navLinksEl.classList.contains('open') &&
            !navLinksEl.contains(e.target) &&
            !menuBtn.contains(e.target)
        ) {
            setMenuState(false);
        }
    });
}

/* ============================================================
   6. TYPING ANIMATION
   ============================================================ */

const TYPING_PHRASES = [
    'IT Administrator',
    'DevOps Intern',
    'Linux & Cloud Support',
    'Cybersecurity Learner',
    'IT Infrastructure'
];

(function initTyping() {
    if (!typingEl) return;

    // Reduced motion: show a stable phrase, no animation
    if (prefersReducedMotion()) {
        typingEl.textContent = TYPING_PHRASES[0];
        return;
    }

    let pIdx = 0;
    let cIdx = 0;
    let deleting = false;
    let timeoutId = null;

    function type() {
        const current = TYPING_PHRASES[pIdx];
        typingEl.textContent = deleting
            ? current.slice(0, cIdx--)
            : current.slice(0, cIdx++);

        if (!deleting && cIdx > current.length) {
            deleting = true;
            timeoutId = setTimeout(type, 1600);
            return;
        }
        if (deleting && cIdx < 0) {
            deleting = false;
            pIdx = (pIdx + 1) % TYPING_PHRASES.length;
        }
        timeoutId = setTimeout(type, deleting ? 45 : 85);
    }

    type();

    // If reduced-motion preference changes mid-session, stop the loop
    reducedMotion.addEventListener('change', e => {
        if (e.matches) {
            clearTimeout(timeoutId);
            typingEl.textContent = TYPING_PHRASES[0];
        }
    });
})();

/* ============================================================
   7. SCROLL REVEAL — IntersectionObserver
   ============================================================ */

(function initScrollReveal() {
    if (!revealEls.length) return;

    // Reduced motion: reveal everything immediately
    if (prefersReducedMotion()) {
        revealEls.forEach(el => el.classList.add('visible'));
        return;
    }

    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));

    // Handle mid-session reduced-motion change
    reducedMotion.addEventListener('change', e => {
        if (e.matches) {
            revealEls.forEach(el => {
                el.classList.add('visible');
                revealObserver.unobserve(el);
            });
            revealObserver.disconnect();
        }
    });
})();

/* ============================================================
   8. RIPPLE EFFECT — event delegation, no memory leaks
   ============================================================ */

(function initRipple() {
    if (prefersReducedMotion()) return;

    document.addEventListener('click', function(e) {
        const btn = e.target.closest('.ripple');
        if (!btn) return;

        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const ripple = document.createElement('span');
        ripple.className = 'ripple-effect';
        ripple.style.cssText = [
            `width:${size}px`,
            `height:${size}px`,
            `left:${e.clientX - rect.left - size / 2}px`,
            `top:${e.clientY - rect.top - size / 2}px`
        ].join(';');
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
})();

/* ============================================================
   9. CONTACT FORM — honest static behavior, no fake delivery
   ============================================================ */

(function initContactForm() {
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const nameEl    = this.querySelector('#name');
        const emailEl   = this.querySelector('#email');
        const messageEl = this.querySelector('#message');
        const submitBtn = this.querySelector('button[type="submit"]');

        // Basic validation
        let valid = true;
        [nameEl, emailEl, messageEl].forEach(field => {
            if (!field) return;
            const empty = !field.value.trim();
            field.style.borderColor = empty ? 'var(--status-wip)' : '';
            if (empty) valid = false;
        });

        if (!valid) return;

        // Honest static-site message — does NOT claim delivery
        if (submitBtn) {
            const original = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-info-circle" aria-hidden="true"></i> Form not connected — please email directly';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.75';
            setTimeout(() => {
                submitBtn.innerHTML = original;
                submitBtn.disabled = false;
                submitBtn.style.opacity = '';
                // Reset border colors
                [nameEl, emailEl, messageEl].forEach(f => {
                    if (f) f.style.borderColor = '';
                });
            }, 4000);
        }
    });

    // Clear validation border on input
    contactForm.querySelectorAll('input, textarea').forEach(field => {
        field.addEventListener('input', function() {
            if (this.value.trim()) this.style.borderColor = '';
        });
    });
})();

/* ============================================================
   10. PARTICLE BACKGROUND — with visibility pause
   ============================================================ */

(function initParticles() {
    if (!canvas) return;

    // Disable entirely for reduced motion
    if (prefersReducedMotion()) {
        canvas.style.display = 'none';
        return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = null;
    let running = false;
    const PARTICLE_COUNT = 70;
    const LINE_DIST = 100;
    const particles = [];

    function resize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x       = Math.random() * canvas.width;
            this.y       = Math.random() * canvas.height;
            this.size    = Math.random() * 1.4 + 0.3;
            this.speedX  = (Math.random() - 0.5) * 0.35;
            this.speedY  = (Math.random() - 0.5) * 0.35;
            this.opacity = Math.random() * 0.4 + 0.08;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (
                this.x < 0 || this.x > canvas.width ||
                this.y < 0 || this.y > canvas.height
            ) this.reset();
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(14, 165, 201, ${this.opacity})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

    function drawLines() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx   = particles[i].x - particles[j].x;
                const dy   = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < LINE_DIST) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(14, 165, 201, ${0.07 * (1 - dist / LINE_DIST)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        drawLines();
        rafId = requestAnimationFrame(animate);
    }

    function startParticles() {
        if (running) return;
        running = true;
        animate();
    }

    function stopParticles() {
        if (!running) return;
        running = false;
        if (rafId !== null) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
    }

    // Pause when tab hidden, resume when visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopParticles();
        } else {
            startParticles();
        }
    });

    // Handle mid-session reduced-motion change
    reducedMotion.addEventListener('change', e => {
        if (e.matches) {
            stopParticles();
            canvas.style.display = 'none';
        }
    });

    startParticles();
})();
