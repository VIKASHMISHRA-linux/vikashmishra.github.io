// ===== SCROLL PROGRESS BAR =====
const progressBar = document.getElementById('progress-bar');
window.addEventListener('scroll', () => {
    const scrolled = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    progressBar.style.width = scrolled + '%';
});

// ===== HEADER SCROLL EFFECT =====
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== MOBILE MENU =====
const menuBtn = document.getElementById('menu-btn');
const navLinks = document.getElementById('nav-links');
menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    menuBtn.querySelector('i').classList.toggle('fa-bars');
    menuBtn.querySelector('i').classList.toggle('fa-times');
});
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuBtn.querySelector('i').classList.add('fa-bars');
        menuBtn.querySelector('i').classList.remove('fa-times');
    });
});

// ===== ACTIVE NAV HIGHLIGHT =====
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 120) current = sec.getAttribute('id');
    });
    navItems.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
});

// ===== TYPING ANIMATION =====
const phrases = [
    'Aspiring Cybersecurity Analyst',
    'Software Developer',
    'Ethical Hacking Enthusiast',
    'CTF Player',
    'Problem Solver',
    'IT Support'
];
let pIdx = 0,
    cIdx = 0,
    deleting = false;
const typingEl = document.getElementById('typing');

function type() {
    const current = phrases[pIdx];
    typingEl.textContent = deleting ? current.slice(0, cIdx--) : current.slice(0, cIdx++);
    if (!deleting && cIdx > current.length) {
        deleting = true;
        setTimeout(type, 1500);
        return;
    }
    if (deleting && cIdx < 0) {
        deleting = false;
        pIdx = (pIdx + 1) % phrases.length;
    }
    setTimeout(type, deleting ? 50 : 90);
}
type();

// ===== SCROLL REVEAL =====
const revealEls = document.querySelectorAll('.scroll-reveal');
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Animate skill bars when about section is visible
            if (entry.target.classList.contains('skills-box')) {
                entry.target.querySelectorAll('.bar div').forEach(bar => {
                    bar.style.width = bar.style.width;
                });
            }
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });
revealEls.forEach(el => observer.observe(el));

// ===== RIPPLE EFFECT =====
document.querySelectorAll('.ripple').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const ripple = document.createElement('span');
        ripple.className = 'ripple-effect';
        ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size/2}px;top:${e.clientY - rect.top - size/2}px`;
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
});

// ===== CONTACT FORM =====
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = this.querySelector('button[type="submit"]');
    const original = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
    btn.style.background = '#00c853';
    setTimeout(() => {
        btn.innerHTML = original;
        btn.style.background = '';
        this.reset();
    }, 3000);
});

// ===== PARTICLE BACKGROUND =====
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

class Particle {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.3;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.5 + 0.1;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 240, 255, ${this.opacity})`;
        ctx.fill();
    }
}

// Create particles
for (let i = 0; i < 80; i++) particles.push(new Particle());

// Draw connecting lines between nearby particles
function drawLines() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(0, 240, 255, ${0.08 * (1 - dist / 100)})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    drawLines();
    requestAnimationFrame(animate);
}
animate();