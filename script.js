/* =============================
   VOID STUDIO — script.js
============================= */

// ========================
// Custom Cursor
// ========================
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mouseX = 0, mouseY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
  setTimeout(() => {
    follower.style.left = mouseX + 'px';
    follower.style.top = mouseY + 'px';
  }, 60);
});

document.querySelectorAll('a, button, .service-item, .project-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('expanded');
    follower.classList.add('expanded');
  });
  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('expanded');
    follower.classList.remove('expanded');
  });
});

// ========================
// Navbar Scroll Effect
// ========================
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

// ========================
// Mobile Menu
// ========================
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobile-menu');
let menuOpen = false;

burger.addEventListener('click', () => {
  menuOpen = !menuOpen;
  mobileMenu.classList.toggle('open', menuOpen);
  burger.style.gap = menuOpen ? '0' : '5px';
  // Animate burger to X
  const spans = burger.querySelectorAll('span');
  if (menuOpen) {
    spans[0].style.transform = 'rotate(45deg) translate(3px, 4px)';
    spans[1].style.transform = 'rotate(-45deg) translate(3px, -4px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.transform = '';
  }
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    menuOpen = false;
    mobileMenu.classList.remove('open');
    const spans = burger.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.transform = '';
  });
});

// ========================
// Scroll Reveal (IntersectionObserver)
// ========================
const revealElements = document.querySelectorAll(
  '.stat-item, .project-card, .service-item, .about-content, .about-visual, .testimonial-card, .contact-inner, .footer-top'
);

revealElements.forEach((el, i) => {
  el.classList.add('reveal');
  if (i % 3 === 1) el.classList.add('reveal-delay-1');
  if (i % 3 === 2) el.classList.add('reveal-delay-2');
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ========================
// Animated Counters
// ========================
function animateCounter(el, target, duration = 1600) {
  let start = 0;
  const startTime = performance.now();
  const easeOut = t => 1 - Math.pow(1 - t, 3);

  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const value = Math.floor(easeOut(progress) * target);
    el.textContent = value;
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  }

  requestAnimationFrame(update);
}

const statsSection = document.querySelector('.stats');
let countersStarted = false;

const statsObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !countersStarted) {
    countersStarted = true;
    document.querySelectorAll('.stat-num').forEach(el => {
      const target = parseInt(el.dataset.target);
      animateCounter(el, target);
    });
  }
}, { threshold: 0.5 });

if (statsSection) statsObserver.observe(statsSection);

// ========================
// Testimonials Slider
// ========================
const cards = document.querySelectorAll('.testimonial-card');
const dots = document.querySelectorAll('.dot-btn');
let currentSlide = 0;

function goToSlide(index) {
  cards[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  currentSlide = (index + cards.length) % cards.length;
  cards[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
}

// init
if (cards.length) cards[0].classList.add('active');

document.getElementById('testi-prev')?.addEventListener('click', () => goToSlide(currentSlide - 1));
document.getElementById('testi-next')?.addEventListener('click', () => goToSlide(currentSlide + 1));

dots.forEach(dot => {
  dot.addEventListener('click', () => goToSlide(parseInt(dot.dataset.index)));
});

// Auto-advance every 5 seconds
let autoSlide = setInterval(() => goToSlide(currentSlide + 1), 5000);

document.querySelector('.testimonials')?.addEventListener('mouseenter', () => clearInterval(autoSlide));
document.querySelector('.testimonials')?.addEventListener('mouseleave', () => {
  autoSlide = setInterval(() => goToSlide(currentSlide + 1), 5000);
});

// ========================
// Contact Form
// ========================
const form = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');

form?.addEventListener('submit', async (e) => {
  e.preventDefault();

  submitBtn.disabled = true;
  submitBtn.querySelector('span').textContent = 'Sending...';

  await new Promise(r => setTimeout(r, 1600));

  submitBtn.style.background = '#22c55e';
  submitBtn.style.boxShadow = '0 8px 24px rgba(34,197,94,0.25)';
  submitBtn.querySelector('span').textContent = '✓ Message Sent!';
  submitBtn.querySelector('svg').style.display = 'none';

  setTimeout(() => {
    submitBtn.disabled = false;
    submitBtn.style.background = '';
    submitBtn.style.boxShadow = '';
    submitBtn.querySelector('span').textContent = 'Send Message';
    submitBtn.querySelector('svg').style.display = '';
    form.reset();
  }, 3000);
});

// ========================
// Smooth Scroll for anchor links
// ========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ========================
// Subtle parallax on hero
// ========================
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const heroContent = document.querySelector('.hero-content');
  if (heroContent && scrollY < window.innerHeight) {
    heroContent.style.transform = `translateY(${scrollY * 0.08}px)`;
    heroContent.style.opacity = 1 - (scrollY / (window.innerHeight * 0.7));
  }
});
