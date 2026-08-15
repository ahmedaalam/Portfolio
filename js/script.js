/**
 * Portfolio Modern Motion System & Interactive JavaScript
 * Modular, performance-optimized, and accessible motion system
 */

document.addEventListener("DOMContentLoaded", () => {
  // Check reduced motion setting
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  initYear();
  initLucideIcons();
  initNavbarScroll();
  initRevealAnimations();
  initActiveNavTracking();
  initMobileMenu();
  initCopyEmailWidget();
  initTypewriter();

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
        const totalScroll =
          window.scrollY || document.documentElement.scrollTop;
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
      },
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
      pillX += (mouseX - pillX) * 0.2;
      pillY += (mouseY - pillY) * 0.2;

      pill.style.transform = `translate3d(${pillX}px, ${pillY}px, 0) translate(-50%, -50%)`;
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

      pill.style.transform = `translate3d(${pillX}px, ${pillY}px, 0) translate(-50%, -50%)`;
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

/** 11. Two-Line Sequential Hero Typewriter Animation */
function initTypewriter() {
  const line1El = document.getElementById("typewriterLine1");
  const line2El = document.getElementById("typewriterLine2");
  const cursor = document.getElementById("typewriterCursor");
  const delayedElements = document.querySelectorAll(".hero-delayed-element");

  if (!line1El || !line2El) return;

  // Position cursor next to line 1 initially
  if (cursor && line1El.parentNode) {
    line1El.parentNode.appendChild(cursor);
  }

  const line1Text = "Crafting modern web experiences through clean code";
  const line2Text = "and thoughtful design.";

  let index1 = 0;
  let index2 = 0;
  const TYPE_SPEED = 28;

  function typeLine1() {
    if (index1 < line1Text.length) {
      index1++;
      line1El.textContent = line1Text.slice(0, index1);
      setTimeout(typeLine1, TYPE_SPEED);
    } else {
      // Move cursor to line 2 container and type line 2
      if (cursor && line2El.parentNode) {
        line2El.parentNode.appendChild(cursor);
      }
      setTimeout(typeLine2, 100);
    }
  }

  function typeLine2() {
    if (index2 < line2Text.length) {
      index2++;
      line2El.textContent = line2Text.slice(0, index2);
      setTimeout(typeLine2, TYPE_SPEED);
    } else {
      // Typing completed! Reveal delayed CTA buttons & scroll hint
      delayedElements.forEach((element) => {
        element.classList.add("active");
      });

      // Fade out cursor gracefully after 1s
      setTimeout(() => {
        if (cursor) {
          cursor.style.transition = "opacity 0.6s ease";
          cursor.style.opacity = "0";
        }
      }, 1000);
    }
  }

  // Start typing Line 1 after reveal animation (350ms)
  setTimeout(typeLine1, 350);
}
