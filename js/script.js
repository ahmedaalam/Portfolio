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
    initProjectCursorPill();
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

/** 10. Project Card Mouse-Follow "View Project" Pill & Click Handler */
function initProjectCursorPill() {
  const pill = document.getElementById("projectCursorPill");
  const cards = document.querySelectorAll(".project-split-card");

  if (cards.length === 0) return;

  // Add click navigation listener to each project card
  cards.forEach((card) => {
    card.addEventListener("click", (e) => {
      // If user clicked the top-right Repository link, let the link handle itself
      if (e.target.closest(".project-repo-link")) {
        return;
      }

      const url = card.getAttribute("data-url");
      if (url) {
        window.open(url, "_blank", "noopener,noreferrer");
      }
    });
  });

  if (!pill) return;

  const isTouchDevice =
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia("(hover: none)").matches;

  if (isTouchDevice) return;

  let mouseX = -100;
  let mouseY = -100;
  let pillX = -100;
  let pillY = -100;
  let activeCard = null;
  let rafId = null;

  function resetPill() {
    if (activeCard) {
      activeCard.classList.remove("has-custom-cursor");
      activeCard = null;
    }
    pill.classList.remove("visible");
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  function updatePillPosition() {
    if (activeCard) {
      pillX += (mouseX - pillX) * 0.16;
      pillY += (mouseY - pillY) * 0.16;

      pill.style.transform = `translate3d(${pillX}px, ${pillY}px, 0) translate(-50%, -50%) scale(1)`;
      rafId = requestAnimationFrame(updatePillPosition);
    }
  }

  function checkScrollBounds() {
    if (!activeCard) return;
    const rect = activeCard.getBoundingClientRect();
    if (
      mouseX < rect.left ||
      mouseX > rect.right ||
      mouseY < rect.top ||
      mouseY > rect.bottom
    ) {
      resetPill();
    }
  }

  // Recalculate pointer position relative to active card during page scroll
  window.addEventListener("scroll", checkScrollBounds, { passive: true });

  cards.forEach((card) => {
    card.addEventListener("mouseenter", (e) => {
      activeCard = card;
      card.classList.add("has-custom-cursor");

      mouseX = e.clientX;
      mouseY = e.clientY;
      pillX = mouseX;
      pillY = mouseY;

      pill.style.transform = `translate3d(${pillX}px, ${pillY}px, 0) translate(-50%, -50%) scale(1)`;
      pill.classList.add("visible");

      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updatePillPosition);
    });

    card.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (activeCard === card) {
        const rect = card.getBoundingClientRect();
        if (
          mouseX < rect.left ||
          mouseX > rect.right ||
          mouseY < rect.top ||
          mouseY > rect.bottom
        ) {
          resetPill();
        }
      }
    });

    card.addEventListener("mouseleave", () => {
      if (activeCard === card) {
        resetPill();
      }
    });
  });

  document.addEventListener("mouseleave", resetPill);
}
