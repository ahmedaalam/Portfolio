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
  initProjectsCarousel();

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

/** 5. Navigation Link Active Tracking & Smooth Scroll Handling */
function initActiveNavTracking() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  if (sections.length === 0 || navLinks.length === 0) return;

  let isManualNavClick = false;
  let clickTimeout = null;

  function setActiveLink(sectionId) {
    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (href === `#${sectionId}`) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  // Handle all nav link clicks for instant active feedback & perfect scroll offset
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const href = anchor.getAttribute("href");
      if (!href || href === "#" || !href.startsWith("#")) return;

      const targetSection = document.querySelector(href);
      if (targetSection) {
        e.preventDefault();

        // Lock scroll tracking observer temporarily during smooth scroll
        isManualNavClick = true;
        if (clickTimeout) clearTimeout(clickTimeout);

        // Update active UI immediately if it's a nav link
        const sectionId = href.replace("#", "");
        setActiveLink(sectionId);

        // Close mobile nav drawer if open
        const navLinksContainer = document.getElementById("navLinks");
        const menuIcon = document.getElementById("menuIcon");
        if (navLinksContainer && navLinksContainer.classList.contains("open")) {
          navLinksContainer.classList.remove("open");
          if (menuIcon && window.lucide) {
            menuIcon.setAttribute("data-lucide", "menu");
            window.lucide.createIcons();
          }
        }

        // Smooth scroll to section with perfect 85px header offset
        const targetTop =
          targetSection.getBoundingClientRect().top + window.scrollY - 85;

        window.scrollTo({
          top: Math.max(0, targetTop),
          behavior: "smooth",
        });

        // Release scroll lock after smooth scroll finishes
        clickTimeout = setTimeout(() => {
          isManualNavClick = false;
        }, 800);
      }
    });
  });

  // Track active section on manual user scroll
  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (isManualNavClick) return;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollPosition = window.scrollY;
          const windowHeight = window.innerHeight;
          const fullHeight = document.documentElement.scrollHeight;

          // At bottom of page -> activate contact
          if (scrollPosition + windowHeight >= fullHeight - 50) {
            setActiveLink("contact");
            ticking = false;
            return;
          }

          let currentSectionId = "home";
          let maxVisibleHeight = 0;

          sections.forEach((section) => {
            const rect = section.getBoundingClientRect();
            const visibleTop = Math.max(0, rect.top);
            const visibleBottom = Math.min(windowHeight, rect.bottom);
            const visibleHeight = Math.max(0, visibleBottom - visibleTop);

            if (visibleHeight > maxVisibleHeight) {
              maxVisibleHeight = visibleHeight;
              currentSectionId = section.getAttribute("id");
            }
          });

          setActiveLink(currentSectionId);
          ticking = false;
        });

        ticking = true;
      }
    },
    { passive: true }
  );
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

/** 7. Copy Email Widget — Spring Micro-Animation State Machine */
function initCopyEmailWidget() {
  const copyEmailBtn = document.getElementById("copyEmailBtn");
  const toast = document.getElementById("toast");

  if (!copyEmailBtn) return;

  // Re-render Lucide icons inside the button after DOM update
  let resetTimer = null;

  copyEmailBtn.addEventListener("click", () => {
    // Prevent re-triggering during animation
    if (copyEmailBtn.classList.contains("copied")) return;

    const email =
      copyEmailBtn.getAttribute("data-email") || "ahmedalam.dev@gmail.com";

    navigator.clipboard
      .writeText(email)
      .then(() => {
        // Trigger copied state — CSS handles all the spring animations
        copyEmailBtn.classList.add("copied");

        // Reset after 2.5s with a smooth spring-back transition
        if (resetTimer) clearTimeout(resetTimer);
        resetTimer = setTimeout(() => {
          copyEmailBtn.classList.add("resetting");
          copyEmailBtn.classList.remove("copied");

          // Clean up resetting class after transition completes
          setTimeout(() => {
            copyEmailBtn.classList.remove("resetting");
          }, 500);
        }, 2500);
      })
      .catch((err) => {
        console.error("Failed to copy email:", err);
      });
  });
}

/** 10. Project Card Mouse-Follow "View Project" Pill & Click Handler */
function initProjectCursorPill() {
  const pill = document.getElementById("projectCursorPill");
  const container = document.getElementById("projectsContainer");
  const cards = document.querySelectorAll(".project-split-card");

  if (cards.length === 0) return;

  // Add click navigation listener to each project card
  cards.forEach((card) => {
    card.addEventListener("click", () => {
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
    window.matchMedia("(hover: none), (pointer: coarse)").matches;

  if (isTouchDevice) return;

  let mouseX = -100;
  let mouseY = -100;
  let pillX = -100;
  let pillY = -100;
  let activeCard = null;
  let rafId = null;

  function resetPill() {
    cards.forEach((c) => c.classList.remove("has-custom-cursor"));
    activeCard = null;
    pill.classList.remove("visible");
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  function updatePillPosition() {
    if (activeCard && pill.classList.contains("visible")) {
      pillX += (mouseX - pillX) * 0.22;
      pillY += (mouseY - pillY) * 0.22;

      pill.style.transform = `translate3d(${pillX}px, ${pillY}px, 0) translate(-50%, -50%)`;
      rafId = requestAnimationFrame(updatePillPosition);
    }
  }

  function evaluateMouseTarget(x, y) {
    if (x < 0 || y < 0 || x > window.innerWidth || y > window.innerHeight) {
      resetPill();
      return;
    }

    const elementUnderMouse = document.elementFromPoint(x, y);
    if (!elementUnderMouse) {
      resetPill();
      return;
    }

    // Check if mouse is hovering over a project card
    const cardUnderMouse = elementUnderMouse.closest(".project-split-card");

    if (cardUnderMouse) {
      if (activeCard !== cardUnderMouse) {
        cards.forEach((c) => c.classList.remove("has-custom-cursor"));
        activeCard = cardUnderMouse;
        activeCard.classList.add("has-custom-cursor");

        if (!pill.classList.contains("visible")) {
          pillX = x;
          pillY = y;
          pill.style.transform = `translate3d(${pillX}px, ${pillY}px, 0) translate(-50%, -50%)`;
          pill.classList.add("visible");
        }

        if (!rafId) {
          rafId = requestAnimationFrame(updatePillPosition);
        }
      }
    } else {
      resetPill();
    }
  }

  // Update mouse coordinates and re-evaluate hover state
  window.addEventListener(
    "mousemove",
    (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      evaluateMouseTarget(mouseX, mouseY);
    },
    { passive: true }
  );

  // Re-evaluate hover target during page or carousel scroll (arrow keys / drag / wheel)
  window.addEventListener(
    "scroll",
    () => {
      evaluateMouseTarget(mouseX, mouseY);
    },
    { passive: true }
  );

  if (container) {
    container.addEventListener(
      "scroll",
      () => {
        evaluateMouseTarget(mouseX, mouseY);
      },
      { passive: true }
    );
  }

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

      // Remove cursor caret immediately after typing completes
      if (cursor) {
        cursor.remove();
      }
    }
  }

  // Start typing Line 1 after reveal animation (350ms)
  setTimeout(typeLine1, 350);
}

/** 12. Horizontally Scrollable Projects Carousel & Keyboard Controller */
function initProjectsCarousel() {
  const container = document.getElementById("projectsContainer");
  const prevBtn = document.getElementById("prevProjectBtn");
  const nextBtn = document.getElementById("nextProjectBtn");

  if (!container || !prevBtn || !nextBtn) return;

  const cards = container.querySelectorAll(".project-split-card");
  if (cards.length === 0) return;

  function updateButtonState() {
    const scrollLeft = container.scrollLeft;
    const maxScroll = container.scrollWidth - container.clientWidth;
    prevBtn.disabled = scrollLeft <= 4;
    nextBtn.disabled = scrollLeft >= maxScroll - 4;
  }

  function scrollByCard(direction) {
    const cardWidth = cards[0].offsetWidth + 24;
    const targetScroll = container.scrollLeft + direction * cardWidth;

    // Fast instant JS scroll (no CSS smooth — much faster response)
    const start = container.scrollLeft;
    const distance = targetScroll - start;
    const duration = 280; // ms — fast but not jarring
    let startTime = null;

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      container.scrollLeft = start + distance * easeOutCubic(progress);
      if (progress < 1) requestAnimationFrame(step);
      else updateButtonState();
    }

    requestAnimationFrame(step);
  }

  prevBtn.addEventListener("click", () => scrollByCard(-1));
  nextBtn.addEventListener("click", () => scrollByCard(1));

  container.addEventListener("scroll", updateButtonState, { passive: true });
  window.addEventListener("resize", updateButtonState, { passive: true });

  // Keyboard navigation — ArrowLeft / ArrowRight when Projects section is visible
  window.addEventListener("keydown", (e) => {
    if (
      e.target.tagName === "INPUT" ||
      e.target.tagName === "TEXTAREA" ||
      e.target.isContentEditable
    ) return;

    const projectsSection = document.getElementById("projects");
    if (!projectsSection) return;

    const rect = projectsSection.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

    if (isVisible) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        scrollByCard(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        scrollByCard(1);
      }
    }
  });

  updateButtonState();
}
