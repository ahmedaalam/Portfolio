gsap.registerPlugin(ScrollTrigger);
const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

// ---------------- Lenis smooth scroll + ScrollTrigger sync ----------------
let lenisInstance = null;
if (!reduceMotion && window.Lenis) {
  lenisInstance = new Lenis({ duration: 1.1, smoothWheel: true });
  lenisInstance.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenisInstance.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

// smooth in-page nav links (logo + nav links + CTA + hero anchor)
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href");
    const target =
      href && href.length > 1 ? document.querySelector(href) : null;
    if (target) {
      e.preventDefault();
      closeMobileNav();
      if (lenisInstance) lenisInstance.scrollTo(target, { offset: -70 });
      else {
        const top = target.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }
  });
});

// ---------------- Mobile hamburger nav ----------------
const hamburger = document.getElementById("navHamburger");
const mobileNav = document.getElementById("mobileNav");
const mobileOverlay = document.getElementById("mobileNavOverlay");

function openMobileNav() {
  hamburger.classList.add("is-open");
  hamburger.setAttribute("aria-expanded", "true");
  mobileNav.classList.add("is-open");
  mobileNav.setAttribute("aria-hidden", "false");
  mobileOverlay.classList.add("is-open");
  document.body.style.overflow = "hidden";
}

function closeMobileNav() {
  hamburger.classList.remove("is-open");
  hamburger.setAttribute("aria-expanded", "false");
  mobileNav.classList.remove("is-open");
  mobileNav.setAttribute("aria-hidden", "true");
  mobileOverlay.classList.remove("is-open");
  document.body.style.overflow = "";
}

hamburger.addEventListener("click", () => {
  mobileNav.classList.contains("is-open") ? closeMobileNav() : openMobileNav();
});

document.getElementById("mobileNavClose").addEventListener("click", closeMobileNav);
mobileOverlay.addEventListener("click", closeMobileNav);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMobileNav();
});

// ---------------- fixed chrome: progress bar ----------------
gsap.to("#progressBar", {
  scaleX: 1,
  ease: "none",
  scrollTrigger: {
    trigger: document.documentElement,
    start: "top top",
    end: "bottom bottom",
    scrub: true,
  },
});

// ---------------- Active Navigation Link Tracking ----------------
const navLinks = document.querySelectorAll(".nav-links a");
const trackedSections = ["about", "tech", "projects", "contact"];

function setActiveNav(id) {
  navLinks.forEach((link) => {
    if (link.getAttribute("href") === `#${id}`) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

function clearActiveNav() {
  navLinks.forEach((link) => link.classList.remove("active"));
}

trackedSections.forEach((id) => {
  const sectionEl = document.getElementById(id);
  if (sectionEl) {
    ScrollTrigger.create({
      trigger: sectionEl,
      start: "top 45%",
      end: "bottom 45%",
      onEnter: () => setActiveNav(id),
      onEnterBack: () => setActiveNav(id),
    });
  }
});

const heroSection = document.getElementById("hero");
if (heroSection) {
  ScrollTrigger.create({
    trigger: heroSection,
    start: "top top",
    end: "bottom 45%",
    onEnter: () => clearActiveNav(),
    onEnterBack: () => clearActiveNav(),
  });
}

// ---------------- subtle per-section background shift ----------------
const bgBySection = {
  hero: "#ffffff",
  about: "#fbfbfa",
  tech: "#f6f6f5",
  projects: "#ffffff",
  contact: "#fbfbfa",
};
Object.entries(bgBySection).forEach(([id, color]) => {
  ScrollTrigger.create({
    trigger: `#${id}`,
    start: "top 60%",
    end: "bottom 40%",
    onEnter: () =>
      gsap.to("body", {
        backgroundColor: color,
        duration: 0.9,
        ease: "power2.out",
      }),
    onEnterBack: () =>
      gsap.to("body", {
        backgroundColor: color,
        duration: 0.9,
        ease: "power2.out",
      }),
  });
});

// ---------------- HERO: on-load wipe (not scroll-tied) ----------------
const heroTl = gsap.timeline({ delay: 0.2 });
heroTl
  .to(
    "#heroHeading",
    { clipPath: "inset(0 0% 0 0)", duration: 1.1, ease: "power3.inOut" },
    0,
  )
  .to(
    "#heroCaption",
    { opacity: 1, duration: 0.6, ease: "power2.out" },
    "-=0.4",
  );

// ============================================================
// SPLIT TEXT LINE REVEALS
// ============================================================
document.querySelectorAll(".split-line span").forEach((el) => {
  if (reduceMotion) {
    gsap.set(el, { y: "0%" });
  } else {
    gsap.to(el, {
      y: "0%",
      duration: 0.9,
      ease: "power4.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    });
  }
});

// ============================================================
// ABOUT — timeline draw-on
// ============================================================
const infoLineFill = document.getElementById("infoLineFill");
if (infoLineFill && !reduceMotion) {
  gsap.to(infoLineFill, {
    scaleY: 1,
    ease: "none",
    scrollTrigger: {
      trigger: "#aboutInfo",
      start: "top 70%",
      end: "bottom 60%",
      scrub: 0.6,
    },
  });

  document.querySelectorAll(".info-item").forEach((item) => {
    const icon = item.querySelector(".info-icon");
    const text = item.querySelector(".info-text");
    const shapes = item.querySelectorAll(
      ".info-icon svg path, .info-icon svg circle, .info-icon svg rect",
    );
    shapes.forEach((shape) => {
      let length = 40;
      try {
        if (typeof shape.getTotalLength === "function") {
          length = shape.getTotalLength() || 40;
        }
      } catch (e) {
        length = 40;
      }
      shape.style.strokeDasharray = length;
      shape.style.strokeDashoffset = length;
    });
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: item,
        start: "top 82%",
        toggleActions: "play none none reverse",
      },
    });
    tl.fromTo(
      icon,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(2.2)" },
    )
      .to(
        shapes,
        {
          strokeDashoffset: 0,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.1,
        },
        "-=0.2",
      )
      .fromTo(
        text,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.6, ease: "power3.out" },
        "-=0.6",
      );
  });
} else if (infoLineFill) {
  gsap.set(infoLineFill, { scaleY: 1 });
  gsap.set(".info-icon, .info-text", { opacity: 1, scale: 1, x: 0 });
}

// ---------------- TECH STACK: build infinite marquee rows ----------------
const techStackRow1 = [
  { name: "React.js", file: "assets/icons/react.svg" },
  { name: "Next.js", file: "assets/icons/nextjs.svg" },
  { name: "JavaScript", file: "assets/icons/javascript.svg" },
  { name: "Tailwind CSS", file: "assets/icons/tailwind.svg" },
  { name: "HTML", file: "assets/icons/html5.svg" },
  { name: "CSS", file: "assets/icons/css3.svg" },
  { name: "Redux", file: "assets/icons/redux.svg" },
  { name: "Figma", file: "assets/icons/figma.svg" },
  { name: "VS Code", file: "assets/icons/vscode.svg" },
];

const techStackRow2 = [
  { name: "Node.js", file: "assets/icons/nodejs.svg" },
  { name: "Express.js", file: "assets/icons/express.svg" },
  { name: "MongoDB", file: "assets/icons/mongodb.svg" },
  { name: "Python", file: "assets/icons/python.svg" },
  { name: "Postman", file: "assets/icons/postman.svg" },
  { name: "Git", file: "assets/icons/git.svg" },
  { name: "GitHub", file: "assets/icons/github.svg" },
  { name: "Vercel", file: "assets/icons/vercel.svg" },
  { name: "Render", file: "assets/icons/render.svg" },
];

function techItemHTML(t) {
  return `
    <div class="tech-pill">
      <span class="tech-icon">
        <img src="${t.file}" alt="${t.name}" loading="lazy" />
      </span>
      <span class="name">${t.name}</span>
    </div>`;
}

// each row gets its distinct list duplicated twice for seamless loop
const techRow1 = document.getElementById("techRow1");
const techRow2 = document.getElementById("techRow2");
techRow1.innerHTML =
  techStackRow1.map(techItemHTML).join("") +
  techStackRow1.map(techItemHTML).join("");
techRow2.innerHTML =
  techStackRow2.map(techItemHTML).join("") +
  techStackRow2.map(techItemHTML).join("");

gsap.set(techRow2, { xPercent: -50 });

const marqueeTween1 = gsap.to(techRow1, {
  xPercent: -50,
  duration: 22,
  ease: "none",
  repeat: -1,
});

const marqueeTween2 = gsap.to(techRow2, {
  xPercent: 0,
  duration: 20,
  ease: "none",
  repeat: -1,
});

if (reduceMotion) {
  marqueeTween1.pause();
  marqueeTween2.pause();
} else {
  [
    [techRow1, marqueeTween1],
    [techRow2, marqueeTween2],
  ].forEach(([row, tween]) => {
    row.addEventListener("mouseenter", () => tween.timeScale(0.15));
    row.addEventListener("mouseleave", () => tween.timeScale(1));
  });
}

gsap
  .timeline({
    scrollTrigger: {
      trigger: "#tech",
      start: "top 70%",
      toggleActions: "play none none reverse",
    },
  })
  .to(".tech-head .eyebrow", {
    opacity: 1,
    y: 0,
    duration: 0.7,
    ease: "power2.out",
  })
  .to(
    ".tech-head h2",
    { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
    "-=0.5",
  );

// ---------------- PROJECTS: intro fade-up ----------------
gsap
  .timeline({
    scrollTrigger: {
      trigger: "#projects",
      start: "top 80%",
      toggleActions: "play none none reverse",
    },
  })
  .to(".projects-intro .eyebrow", {
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: "power2.out",
  })
  .to(
    ".projects-intro h2",
    { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
    "-=0.4",
  );

// ---------------- PROJECTS: vertical scroll drives horizontal track ----------------
const track = document.getElementById("track");

function getScrollDistance() {
  return Math.max(0, track.scrollWidth - window.innerWidth);
}

const horizontalTween = gsap.to(track, {
  x: () => -getScrollDistance(),
  ease: "none",
  scrollTrigger: {
    trigger: "#projects",
    start: "top top",
    end: () => `+=${getScrollDistance()}`,
    scrub: 1,
    pin: true,
    invalidateOnRefresh: true,
  },
});

document.querySelectorAll(".project-card").forEach((card) => {
  gsap.fromTo(
    card,
    { opacity: 0, scale: 0.94 },
    {
      opacity: 1,
      scale: 1,
      ease: "none",
      scrollTrigger: {
        trigger: card,
        containerAnimation: horizontalTween,
        start: "left 88%",
        end: "left 55%",
        scrub: true,
      },
    },
  );
});

// ---------------- AVAILABILITY MARQUEE ----------------
const marqueeEl = document.getElementById("marquee");
if (marqueeEl && !reduceMotion) {
  const marqueeTween = gsap.to(marqueeEl, {
    xPercent: -50,
    duration: 12,
    ease: "none",
    repeat: -1,
  });

  ScrollTrigger.create({
    trigger: ".marquee-wrap",
    start: "top bottom",
    end: "bottom top",
    onUpdate: (self) => {
      const targetSpeed = 1 + Math.min(3, Math.abs(self.getVelocity()) / 1500);
      gsap.to(marqueeTween, {
        timeScale: targetSpeed,
        duration: 0.35,
        ease: "power2.out",
        overwrite: "auto",
        onComplete: () => {
          gsap.to(marqueeTween, {
            timeScale: 1,
            duration: 0.8,
            ease: "power2.out",
          });
        },
      });
    },
  });
}

// ---------------- CONTACT: wipe + rule + cta ----------------
gsap
  .timeline({
    scrollTrigger: {
      trigger: "#contact",
      start: "top 65%",
      toggleActions: "play none none reverse",
    },
  })
  .to("#contactEyebrow", {
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: "power2.out",
  })
  .to(
    "#contactHeading",
    { clipPath: "inset(0 0% 0 0)", duration: 1, ease: "power3.inOut" },
    "-=0.2",
  )
  .to(
    "#contactRuleFill",
    { width: "100%", duration: 1, ease: "power3.inOut" },
    "-=0.9",
  )
  .to(
    "#contactCta",
    { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
    "-=0.4",
  );

if (reduceMotion) {
  gsap.set(["#heroHeading", "#contactHeading"], {
    clipPath: "inset(0 0% 0 0)",
  });
  gsap.set(["#contactRuleFill"], {
    width: "100%",
  });
  gsap.set(
    [
      ".hero-caption, .about-text h2, .about-text p, .info-icon, .info-text, .tech-head .eyebrow, .tech-head h2, .projects-intro .eyebrow, .projects-intro h2, .project-card, #contactEyebrow, #contactCta",
    ],
    { opacity: 1, y: 0, x: 0, scale: 1 },
  );
}



window.addEventListener("load", () => {
  ScrollTrigger.refresh();
});

let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    ScrollTrigger.refresh();
  }, 150);
});
