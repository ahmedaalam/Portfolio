/**
 * Portfolio Motion System: GSAP + ScrollTrigger + Lenis Smooth Scroll
 * Retained: Custom Trailing Circle Cursor Animation System
 */

document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  initGSAPAndAnimations(reduceMotion);

  if (!reduceMotion) {
    initTrailingCircleCursor();
  }
});

function initGSAPAndAnimations(reduceMotion) {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;

  // ============================================================
  // SMOOTH SCROLL — Lenis drives scroll physics (skipped for reduced motion)
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
  // PAGE TRANSITION FLASH — quick pulse on nav click
  // ============================================================
  function flashTransition() {
    if (reduceMotion) return;
    const flash = document.getElementById("pageTransition");
    if (!flash) return;
    gsap
      .timeline()
      .to(flash, { opacity: 0.22, duration: 0.15, ease: "power2.out" })
      .to(flash, { opacity: 0, duration: 0.35, ease: "power2.in" });
  }

  // ============================================================
  // THEME TOGGLE
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

    document.querySelectorAll(".mobile-menu a").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        flashTransition();
        const target = document.querySelector(link.getAttribute("href"));
        closeMobileMenu();
        setTimeout(() => scrollToTarget(target), 50);
      });
    });
  }

  // ============================================================
  // NAVBAR — background on scroll + smooth-scroll nav links
  // ============================================================
  const navbar = document.getElementById("navbar");
  if (navbar) {
    ScrollTrigger.create({
      trigger: document.body,
      start: "top -80",
      onEnter: () => navbar.classList.add("scrolled"),
      onLeaveBack: () => navbar.classList.remove("scrolled"),
    });

    document.querySelectorAll(".nav-logo, .nav-links a").forEach((link) => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        if (!href || !href.startsWith("#")) return;
        e.preventDefault();
        flashTransition();
        scrollToTarget(document.querySelector(href));
      });
    });
  }

  // ============================================================
  // ACTIVE NAV STATE — highlights currently visible section link
  // ============================================================
  const navAnchors = [
    ...document.querySelectorAll(".nav-links a"),
    ...document.querySelectorAll(".mobile-menu a"),
  ];

  function setActiveLink(id) {
    navAnchors.forEach((a) =>
      a.classList.toggle("active", a.getAttribute("href") === "#" + id),
    );
  }

  document
    .querySelectorAll("section[id], .horizontal-section[id]")
    .forEach((sec) => {
      ScrollTrigger.create({
        trigger: sec,
        start: "top center",
        end: "bottom center",
        onEnter: () => setActiveLink(sec.id),
        onEnterBack: () => setActiveLink(sec.id),
      });
    });

  // ============================================================
  // MAGNETIC HOVER — buttons/links nudge toward cursor
  // ============================================================
  if (!isTouch && !reduceMotion) {
    document
      .querySelectorAll(".theme-toggle, .contact-links a, #contactEmail")
      .forEach((el) => {
        const moveX = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3" });
        const moveY = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3" });
        el.addEventListener("mousemove", (e) => {
          const r = el.getBoundingClientRect();
          moveX((e.clientX - r.left - r.width / 2) * 0.3);
          moveY((e.clientY - r.top - r.height / 2) * 0.3);
        });
        el.addEventListener("mouseleave", () => {
          moveX(0);
          moveY(0);
        });
      });
  }

  // ============================================================
  // EMAIL — click to copy with tooltip
  // ============================================================
  const contactEmail = document.getElementById("contactEmail");
  const copyTooltip = document.getElementById("copyTooltip");
  if (contactEmail && copyTooltip) {
    contactEmail.addEventListener("click", (e) => {
      e.preventDefault();
      const email = contactEmail.dataset.email || "ahmedaalam.dev@gmail.com";
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
  // CONTACT GLOW — soft radial highlight follows cursor in section
  // ============================================================
  const glow = document.getElementById("contactGlow");
  const contactSection = document.getElementById("contact");
  if (glow && contactSection && !isTouch && !reduceMotion) {
    const gx = gsap.quickTo(glow, "x", { duration: 0.6, ease: "power3" });
    const gy = gsap.quickTo(glow, "y", { duration: 0.6, ease: "power3" });
    contactSection.addEventListener("mousemove", (e) => {
      const r = contactSection.getBoundingClientRect();
      gx(e.clientX - r.left - r.width / 2);
      gy(e.clientY - r.top - r.height / 2);
    });
  }

  // ============================================================
  // PRELOADER & ENTRANCE ANIMATIONS
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

  if (document.readyState === "complete") {
    hidePreloader();
  } else {
    window.addEventListener("load", hidePreloader);
    setTimeout(hidePreloader, 2500);
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
  // CONTACT
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
    gsap.set("#contactEmail, .contact-links a", { opacity: 1, y: 0, scale: 1 });
  }
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
