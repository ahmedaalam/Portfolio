/**
 * Portfolio Modern Motion System & Interactive JavaScript
 * Modular, performance-optimized, and accessible motion system
 */

document.addEventListener("DOMContentLoaded", () => {
  // Check reduced motion setting
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  initYear();
  initLucideIcons();
  initNavbarScroll();
  initRevealAnimations();
  initActiveNavTracking();
  initMobileMenu();
  initCopyEmailWidget();

  if (!prefersReducedMotion) {
    initCustomCursor();
    initParallaxProjectCards();
  }
});

/** 1. Dynamic Footer Year */
function initYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/** 2. Safeguard Refresh Lucide Icons */
function initLucideIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

/** 3. Navbar Scroll & Progress Bar Indicator */
function initNavbarScroll() {
  const header = document.getElementById("header");
  const scrollProgress = document.getElementById("scrollProgress");

  let ticking = false;

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const totalScroll = window.scrollY || document.documentElement.scrollTop;
        const windowHeight =
          document.documentElement.scrollHeight -
          document.documentElement.clientHeight;

        // Monochrome Top Scroll Progress Indicator
        if (scrollProgress && windowHeight > 0) {
          const scrollPercentage = (totalScroll / windowHeight) * 100;
          scrollProgress.style.width = `${scrollPercentage}%`;
        }

        // Header Scrolled Compact State
        if (header) {
          if (totalScroll > 30) {
            header.classList.add("scrolled");
          } else {
            header.classList.remove("scrolled");
          }
        }

        ticking = false;
      });

      ticking = true;
    }
  });
}

/** 4. Global Viewport Reveal System via IntersectionObserver */
function initRevealAnimations() {
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            // Trigger once cleanly to prevent re-layout shifts
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver is unsupported
    revealElements.forEach((el) => el.classList.add("active"));
  }
}

/** 5. Navigation Link Active Tracking */
function initActiveNavTracking() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  let ticking = false;

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        let currentSectionId = "home";
        const scrollPosition = window.scrollY + 140;

        sections.forEach((section) => {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.offsetHeight;

          if (
            scrollPosition >= sectionTop &&
            scrollPosition < sectionTop + sectionHeight
          ) {
            currentSectionId = section.getAttribute("id");
          }
        });

        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${currentSectionId}`) {
            link.classList.add("active");
          }
        });

        ticking = false;
      });

      ticking = true;
    }
  });
}

/** 6. Mobile Navigation Drawer Toggle */
function initMobileMenu() {
  const mobileToggle = document.getElementById("mobileToggle");
  const navLinksContainer = document.getElementById("navLinks");
  const menuIcon = document.getElementById("menuIcon");

  if (mobileToggle && navLinksContainer) {
    mobileToggle.addEventListener("click", () => {
      const isOpen = navLinksContainer.classList.toggle("open");

      if (menuIcon && window.lucide) {
        menuIcon.setAttribute("data-lucide", isOpen ? "x" : "menu");
        window.lucide.createIcons();
      }
    });

    const links = navLinksContainer.querySelectorAll("a");
    links.forEach((link) => {
      link.addEventListener("click", () => {
        navLinksContainer.classList.remove("open");
        if (menuIcon && window.lucide) {
          menuIcon.setAttribute("data-lucide", "menu");
          window.lucide.createIcons();
        }
      });
    });
  }
}

/** 7. Copy Email Widget & Toast Notification */
function initCopyEmailWidget() {
  const copyEmailBtn = document.getElementById("copyEmailBtn");
  const toast = document.getElementById("toast");

  if (copyEmailBtn && toast) {
    copyEmailBtn.addEventListener("click", () => {
      const email =
        copyEmailBtn.getAttribute("data-email") || "ahmedaalam.dev@gmail.com";

      navigator.clipboard
        .writeText(email)
        .then(() => {
          toast.classList.add("show");
          setTimeout(() => {
            toast.classList.remove("show");
          }, 2800);
        })
        .catch((err) => {
          console.error("Failed to copy email:", err);
        });
    });
  }
}

/** 8. Subtle Accessible Custom Cursor (Desktop Only) */
function initCustomCursor() {
  const cursorDot = document.getElementById("cursorDot");
  const cursorRing = document.getElementById("cursorRing");

  if (!cursorDot || !cursorRing) return;

  const isTouchDevice =
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia("(hover: none)").matches;

  if (isTouchDevice) return;

  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;
  let isVisible = false;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isVisible) {
      cursorDot.style.opacity = "1";
      cursorRing.style.opacity = "1";
      isVisible = true;
    }

    cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
  });

  function renderCursor() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;

    cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;

    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  const interactiveTargets = document.querySelectorAll(
    "a, button, .project-split-card, .marquee-pill, .social-pill, .timeline-item"
  );

  interactiveTargets.forEach((target) => {
    target.addEventListener("mouseenter", () => {
      cursorRing.classList.add("active");
    });
    target.addEventListener("mouseleave", () => {
      cursorRing.classList.remove("active");
    });
  });

  document.addEventListener("mouseleave", () => {
    cursorDot.style.opacity = "0";
    cursorRing.style.opacity = "0";
    isVisible = false;
  });
}

/** 9. Subtle 3D Tilt Parallax on Project Cards (60fps RAF) */
function initParallaxProjectCards() {
  const cards = document.querySelectorAll(".project-split-card");

  const isTouchDevice =
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia("(hover: none)").matches;

  if (isTouchDevice) return;

  cards.forEach((card) => {
    let rafId = null;

    card.addEventListener("mousemove", (e) => {
      if (rafId) cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const cardWidth = rect.width;
        const cardHeight = rect.height;

        const centerX = rect.left + cardWidth / 2;
        const centerY = rect.top + cardHeight / 2;

        const percentX = (e.clientX - centerX) / (cardWidth / 2);
        const percentY = (e.clientY - centerY) / (cardHeight / 2);

        const rotateY = percentX * 1.5;
        const rotateX = -percentY * 1.5;
        const translateY = -5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(${translateY}px)`;
      });
    });

    card.addEventListener("mouseleave", () => {
      if (rafId) cancelAnimationFrame(rafId);
      card.style.transform = "";
    });
  });
}
