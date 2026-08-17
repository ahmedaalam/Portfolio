/**
 * Portfolio Motion System: GSAP + ScrollTrigger + Lenis Smooth Scroll
 * Retained: Custom Trailing Circle Cursor Animation System
 */

document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  initGSAPAndAnimations();

  if (!prefersReducedMotion) {
    initTrailingCircleCursor();
  }
});

function initGSAPAndAnimations() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // ============================================================
  // SMOOTH SCROLL — Lenis drives the scroll physics, GSAP ticker
  // drives the render loop so ScrollTrigger stays in sync with it.
  // ============================================================
  let smoothScroller = null;
  if (typeof Lenis !== "undefined") {
    smoothScroller = new Lenis({ duration: 1.1, smoothWheel: true });
    smoothScroller.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => smoothScroller.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  } else {
    console.warn(
      "Lenis failed to load — falling back to native scroll. ScrollTrigger animations still work.",
    );
  }

  // ============================================================
  // THEME TOGGLE — switches between dark (default) and light via
  // data-theme attribute on <html>.
  // ============================================================
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
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

    themeToggle.addEventListener("click", () => {
      const isLight =
        document.documentElement.getAttribute("data-theme") === "light";
      setTheme(isLight ? "dark" : "light");
    });
  }

  // ============================================================
  // NAVBAR — background fades in once scrolled, links smooth-scroll
  // ============================================================
  const navbar = document.getElementById("navbar");
  if (navbar) {
    ScrollTrigger.create({
      trigger: document.body,
      start: "top -80",
      onEnter: () => navbar.classList.add("scrolled"),
      onLeaveBack: () => navbar.classList.remove("scrolled"),
    });

    gsap.from(".navbar", {
      y: -30,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
      delay: 0.1,
    });

    document.querySelectorAll(".nav-logo, .nav-links a").forEach((link) => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        if (!href || !href.startsWith("#")) return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        if (smoothScroller) {
          smoothScroller.scrollTo(target, { offset: -70, duration: 1.3 });
        } else {
          const y = target.getBoundingClientRect().top + window.scrollY - 70;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      });
    });
  }

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
  // HERO: lines slide up on load, subhead fades in after
  // ============================================================
  gsap.to(".hero h1 .line span", {
    y: "0%",
    duration: 1,
    ease: "power4.out",
    stagger: 0.12,
    delay: 0.2,
  });
  gsap.to("#heroSub", { opacity: 1, duration: 0.8, delay: 1.0 });

  // ============================================================
  // PINNED SCALE-IN PANEL — the box scales up from small while
  // pinned, then releases once fully grown.
  // ============================================================
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

  // ============================================================
  // SPLIT TEXT LINE REVEALS — each line slides up as it enters
  // ============================================================
  document.querySelectorAll(".split-line span").forEach((el) => {
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
  });

  // ============================================================
  // HORIZONTAL SCROLL GALLERY — vertical scroll drives horizontal
  // translation while the section is pinned.
  // ============================================================
  const track = document.getElementById("hTrack");
  if (track) {
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
  }

  // ============================================================
  // MARQUEE — continuous horizontal loop with velocity speed-up
  // ============================================================
  const marqueeEl = document.getElementById("marquee");
  if (marqueeEl) {
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
  // ABOUT — timeline line draws down, each icon item pops in & SVG draws
  // ============================================================
  const infoLineFill = document.getElementById("infoLineFill");
  if (infoLineFill) {
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
  }

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
        { strokeDashoffset: 0, duration: 0.8, ease: "power2.out", stagger: 0.1 },
        "-=0.2",
      )
      .fromTo(
        text,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.6, ease: "power3.out" },
        "-=0.6",
      );
  });

  // ============================================================
  // SKILLS PILLS — fade the two marquee rows in as they arrive
  // ============================================================
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

  // ============================================================
  // CONTACT — email link scales in, link pills stagger up after
  // ============================================================
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
}

/**
 * Trailing Circle Cursor Animation System (Preserved)
 */
function initTrailingCircleCursor() {
  const circles = document.querySelectorAll(".circle");
  if (circles.length === 0) return;

  const isTouchDevice =
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia("(hover: none), (pointer: coarse)").matches;

  if (isTouchDevice) return;

  const coords = { x: -100, y: -100 };

  circles.forEach((circle) => {
    circle.x = -100;
    circle.y = -100;
  });

  window.addEventListener(
    "mousemove",
    (e) => {
      coords.x = e.clientX;
      coords.y = e.clientY;
    },
    { passive: true },
  );

  function animateCircles() {
    let x = coords.x;
    let y = coords.y;

    circles.forEach((circle, index) => {
      circle.style.left = x - 12 + "px";
      circle.style.top = y - 12 + "px";
      circle.style.transform = `scale(${(circles.length - index) / circles.length})`;

      circle.x = x;
      circle.y = y;

      const nextCircle = circles[index + 1] || circles[0];
      x += (nextCircle.x - x) * 0.3;
      y += (nextCircle.y - y) * 0.3;
    });

    requestAnimationFrame(animateCircles);
  }

  requestAnimationFrame(animateCircles);
}
