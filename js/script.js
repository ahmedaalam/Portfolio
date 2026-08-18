gsap.registerPlugin(ScrollTrigger);

const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;

// ============================================================
// SMOOTH SCROLL — Lenis drives scroll physics
// ============================================================
let smoothScroller = null;
if (!reduceMotion && typeof Lenis !== "undefined") {
  smoothScroller = new Lenis({ duration: 1.1, smoothWheel: true });
  smoothScroller.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => smoothScroller.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

function scrollToTarget(target) {
  if (!target) return;
  if (smoothScroller) {
    smoothScroller.scrollTo(target, { offset: -70, duration: 1.3 });
  } else {
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - 70,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }
}

// ============================================================
// THEME TOGGLE
// ============================================================
const themeToggle = document.getElementById("themeToggle");
function setTheme(theme) {
  if (theme === "light") {
    document.documentElement.setAttribute("data-theme", "light");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
  try {
    localStorage.setItem("portfolio-theme", theme);
  } catch (e) {}
}
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const isLight =
      document.documentElement.getAttribute("data-theme") === "light";
    setTheme(isLight ? "dark" : "light");
  });
}

// ============================================================
// MOBILE MENU
// ============================================================
const hamburgerBtn = document.getElementById("hamburgerBtn");
const mobileMenu = document.getElementById("mobileMenu");

function closeMobileMenu() {
  if (!hamburgerBtn || !mobileMenu) return;
  hamburgerBtn.classList.remove("open");
  mobileMenu.classList.remove("open");
  document.body.style.overflow = "";
  if (smoothScroller) smoothScroller.start();
}

if (hamburgerBtn && mobileMenu) {
  hamburgerBtn.addEventListener("click", () => {
    const opening = !mobileMenu.classList.contains("open");
    hamburgerBtn.classList.toggle("open", opening);
    mobileMenu.classList.toggle("open", opening);
    document.body.style.overflow = opening ? "hidden" : "";
    if (smoothScroller) {
      opening ? smoothScroller.stop() : smoothScroller.start();
    }
  });
}

// ============================================================
// NAVBAR — background on scroll
// ============================================================
const navbar = document.getElementById("navbar");
if (navbar) {
  ScrollTrigger.create({
    trigger: document.body,
    start: "top -80",
    onEnter: () => navbar.classList.add("scrolled"),
    onLeaveBack: () => navbar.classList.remove("scrolled"),
  });
}

// ============================================================
// ACTIVE NAV STATE & CLICK NAVIGATION
// ============================================================
const navAnchors = [
  ...document.querySelectorAll(".nav-links a"),
  ...document.querySelectorAll(".mobile-menu a"),
];

let isNavClicking = false;
let navClickTimeout = null;

function setActiveLink(id) {
  navAnchors.forEach((a) => {
    const href = a.getAttribute("href");
    if (id && href === "#" + id) {
      a.classList.add("active");
    } else {
      a.classList.remove("active");
    }
  });
}

// Handle click on any nav link or logo
document
  .querySelectorAll(".nav-logo, .nav-links a, .mobile-menu a")
  .forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) return;
      e.preventDefault();

      const targetId = href.substring(1);
      if (targetId && targetId !== "home") {
        isNavClicking = true;
        setActiveLink(targetId);
        if (navClickTimeout) clearTimeout(navClickTimeout);
        navClickTimeout = setTimeout(() => {
          isNavClicking = false;
        }, 1200);
      } else if (targetId === "home") {
        isNavClicking = true;
        setActiveLink("");
        if (navClickTimeout) clearTimeout(navClickTimeout);
        navClickTimeout = setTimeout(() => {
          isNavClicking = false;
        }, 1200);
      }

      const targetEl = document.querySelector(href);
      if (link.closest(".mobile-menu")) {
        closeMobileMenu();
        setTimeout(() => scrollToTarget(targetEl), 50);
      } else {
        scrollToTarget(targetEl);
      }
    });
  });

// Scroll-based Section Active State Tracker
const navSections = [
  { id: "about", el: document.getElementById("about") },
  { id: "toolkit", el: document.getElementById("toolkit") },
  { id: "work", el: document.getElementById("work") },
  { id: "contact", el: document.getElementById("contact") },
].filter((s) => s.el);

navSections.forEach((s) => {
  ScrollTrigger.create({
    trigger: s.el,
    start: s.id === "work" ? "top 50%" : "top 45%",
    end: s.id === "work" ? "bottom top" : "bottom 45%",
    onEnter: () => {
      if (!isNavClicking) setActiveLink(s.id);
    },
    onEnterBack: () => {
      if (!isNavClicking) setActiveLink(s.id);
    },
    onLeaveBack: () => {
      if (!isNavClicking && s.id === "about") setActiveLink("");
    },
  });
});

// Clear active link when at top Hero section
ScrollTrigger.create({
  trigger: document.body,
  start: "top top",
  end: "top 400px",
  onEnter: () => {
    if (!isNavClicking) setActiveLink("");
  },
  onEnterBack: () => {
    if (!isNavClicking) setActiveLink("");
  },
});

// ============================================================
// PROJECT CARD CLICK HANDLER
// ============================================================
document.querySelectorAll(".h-card, .project-card").forEach((card) => {
  const go = () => {
    const href = card.dataset.href;
    if (href && href !== "#") {
      window.open(href, "_blank", "noopener,noreferrer");
    }
  };
  card.addEventListener("click", (e) => {
    if (e.target.closest("a, button")) return;
    go();
  });
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      go();
    }
  });
});

// ============================================================
// EMAIL — click to copy
// ============================================================
const contactEmail = document.getElementById("contactEmail");
const copyTooltip = document.getElementById("copyTooltip");
if (contactEmail && copyTooltip) {
  contactEmail.addEventListener("click", (e) => {
    e.preventDefault();
    const email = contactEmail.dataset.email;
    const done = () => {
      copyTooltip.classList.add("show");
      setTimeout(() => copyTooltip.classList.remove("show"), 1400);
    };
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(email)
        .then(done)
        .catch(() => {
          window.location.href = "mailto:" + email;
        });
    } else {
      window.location.href = "mailto:" + email;
    }
  });
}

// ============================================================
// CONTACT GLOW
// ============================================================
if (!isTouch && !reduceMotion) {
  const glow = document.getElementById("contactGlow");
  const contactSection = document.getElementById("contact");
  if (glow && contactSection) {
    const gx = gsap.quickTo(glow, "x", { duration: 0.6, ease: "power3" });
    const gy = gsap.quickTo(glow, "y", { duration: 0.6, ease: "power3" });
    contactSection.addEventListener("mousemove", (e) => {
      const r = contactSection.getBoundingClientRect();
      gx(e.clientX - r.left - r.width / 2);
      gy(e.clientY - r.top - r.height / 2);
    });
  }
}

// ============================================================
// PRELOADER
// ============================================================
function runEntranceAnimations() {
  gsap.from(".navbar", {
    y: -30,
    opacity: 0,
    duration: 0.8,
    ease: "power3.out",
  });
  gsap.to(".hero h1 .line span", {
    y: "0%",
    duration: 1,
    ease: "power4.out",
    stagger: 0.12,
    delay: 0.1,
  });
  gsap.to("#heroSub", { opacity: 1, duration: 0.8, delay: 0.9 });
}

function hidePreloader() {
  const preloader = document.getElementById("preloader");
  if (!preloader || preloader.dataset.done) return;
  preloader.dataset.done = "1";
  if (reduceMotion) {
    preloader.style.display = "none";
  } else {
    gsap.to(preloader, {
      opacity: 0,
      duration: 0.5,
      ease: "power2.out",
      onComplete: () => {
        preloader.style.display = "none";
      },
    });
  }
  runEntranceAnimations();
}
window.addEventListener("load", hidePreloader);
setTimeout(hidePreloader, 2500);

// ============================================================
// TOP PROGRESS BAR
// ============================================================
gsap.to("#progressBar", {
  scaleX: 1,
  ease: "none",
  scrollTrigger: {
    trigger: document.body,
    start: "top top",
    end: "bottom bottom",
    scrub: 0.3,
  },
});

// ============================================================
// PINNED SCALE-IN PANEL
// ============================================================
if (!reduceMotion) {
  gsap.fromTo(
    ".pin-media",
    { scale: 0.6, borderRadius: "40px" },
    {
      scale: 1,
      borderRadius: "24px",
      ease: "none",
      scrollTrigger: {
        trigger: ".pin-section",
        start: "top top",
        end: "+=100%",
        scrub: true,
        pin: true,
      },
    },
  );
  gsap.fromTo(
    "#pinText",
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      scrollTrigger: {
        trigger: ".pin-section",
        start: "top center",
        end: "top top",
        scrub: true,
      },
    },
  );
} else {
  gsap.set(".pin-media", { scale: 1, borderRadius: "24px" });
  gsap.set("#pinText", { opacity: 1, y: 0 });
}

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
// HORIZONTAL SCROLL GALLERY
// ============================================================
const track = document.getElementById("hTrack");
if (track) {
  if (!reduceMotion) {
    gsap.to(track, {
      x: () => -(track.scrollWidth - window.innerWidth),
      ease: "none",
      scrollTrigger: {
        trigger: ".pin-wrap",
        start: "top top",
        end: () => "+=" + (track.scrollWidth - window.innerWidth),
        scrub: true,
        pin: true,
      },
    });
  } else {
    const pinWrap = document.querySelector(".pin-wrap");
    if (pinWrap) {
      pinWrap.style.overflowX = "auto";
      pinWrap.style.height = "auto";
    }
    track.style.height = "auto";
    track.style.padding = "2rem 0";
  }
}

// ============================================================
// MARQUEE
// ============================================================
const marqueeEl = document.getElementById("marquee");
if (marqueeEl && !reduceMotion) {
  let marqueeTween = gsap.to(marqueeEl, {
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
      marqueeTween.timeScale(1 + Math.abs(self.getVelocity()) / 3000);
    },
  });
}

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
      const length = shape.getTotalLength ? shape.getTotalLength() : 40;
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

// ============================================================
// SKILLS PILLS
// ============================================================
if (!reduceMotion) {
  gsap.fromTo(
    ["#skillsTrackA", "#skillsTrackB"],
    { opacity: 0 },
    {
      opacity: 1,
      duration: 0.8,
      stagger: 0.15,
      scrollTrigger: { trigger: ".skills-section", start: "top 80%" },
    },
  );
} else {
  gsap.set(["#skillsTrackA", "#skillsTrackB"], { opacity: 1 });
}

// ============================================================
// CONTACT — email + link pills reveal
// ============================================================
if (!reduceMotion) {
  gsap.fromTo(
    "#contactEmail",
    { opacity: 0, scale: 0.9 },
    {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: "back.out(1.6)",
      scrollTrigger: { trigger: ".contact-section", start: "top 75%" },
    },
  );
  gsap.fromTo(
    ".contact-links a",
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.08,
      scrollTrigger: { trigger: ".contact-links", start: "top 85%" },
    },
  );
} else {
  gsap.set("#contactEmail, .contact-links a", {
    opacity: 1,
    y: 0,
    scale: 1,
  });
}

// ============================================================
// DYNAMIC UNIFIED CURSOR SYSTEM (Trailing Circles + Project Card Morphing)
// ============================================================
(function initUnifiedCursorSystem() {
  if (isTouch || reduceMotion) return;

  const cardCursor = document.getElementById("cardCursor");
  const circles = document.querySelectorAll(".circle");
  if (!cardCursor && !circles.length) return;

  document.body.classList.add("custom-cursor-enabled");

  const mouse = { x: -100, y: -100, isOverWindow: true };
  const cardPos = { x: -100, y: -100 };
  let isHoveringCard = false;

  circles.forEach((c) => {
    c.x = -100;
    c.y = -100;
  });

  // Mouse tracking
  window.addEventListener(
    "mousemove",
    (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.isOverWindow = true;
      checkCardHover(e.target);
    },
    { passive: true },
  );

  document.addEventListener("mouseleave", () => {
    mouse.isOverWindow = false;
    setHoverState(false);
    circles.forEach((c) => (c.style.opacity = "0"));
  });

  document.addEventListener("mouseenter", () => {
    mouse.isOverWindow = true;
    circles.forEach((c) => (c.style.opacity = "1"));
  });

  // Detect card hover even during scroll or static mouse
  function checkCardHover(target) {
    if (!mouse.isOverWindow) {
      setHoverState(false);
      return;
    }

    if (!target && mouse.x >= 0 && mouse.y >= 0) {
      target = document.elementFromPoint(mouse.x, mouse.y);
    }

    const card = target ? target.closest(".h-card, .project-card") : null;
    setHoverState(!!card);
  }

  function setHoverState(hovering) {
    if (isHoveringCard === hovering) return;
    isHoveringCard = hovering;

    if (isHoveringCard) {
      document.body.classList.add("card-hovered");
      if (cardCursor) cardCursor.classList.add("visible");
    } else {
      document.body.classList.remove("card-hovered");
      if (cardCursor) cardCursor.classList.remove("visible");
    }
  }

  // Scroll listener to update hover state dynamically while scrolling
  window.addEventListener(
    "scroll",
    () => {
      checkCardHover(null);
    },
    { passive: true },
  );

  if (typeof smoothScroller !== "undefined" && smoothScroller) {
    smoothScroller.on("scroll", () => {
      checkCardHover(null);
    });
  }

  // Smooth Animation Loop
  function animateCursors() {
    if (mouse.isOverWindow) {
      // Card cursor smooth lerp
      cardPos.x += (mouse.x - cardPos.x) * 0.25;
      cardPos.y += (mouse.y - cardPos.y) * 0.25;
      if (cardCursor) {
        cardCursor.style.left = cardPos.x.toFixed(2) + "px";
        cardCursor.style.top = cardPos.y.toFixed(2) + "px";
      }

      // Trailing circles smooth lerp
      let x = mouse.x;
      let y = mouse.y;
      circles.forEach((circle, index) => {
        circle.style.left = (x - 12).toFixed(2) + "px";
        circle.style.top = (y - 12).toFixed(2) + "px";
        circle.style.transform = `scale(${(circles.length - index) / circles.length})`;
        circle.x = x;
        circle.y = y;
        const next = circles[index + 1] || circles[0];
        x += (next.x - x) * 0.3;
        y += (next.y - y) * 0.3;
      });
    }

    requestAnimationFrame(animateCursors);
  }

  requestAnimationFrame(animateCursors);
})();
