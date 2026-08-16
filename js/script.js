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
  init3DCardDeck();

  if (!prefersReducedMotion) {
    initTrailingCircleCursor();
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
    { passive: true },
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

/** 11. Two-Line Sequential Hero Typewriter Animation */
function initTypewriter() {
  const line1El = document.getElementById("typewriterLine1");
  const line2El = document.getElementById("typewriterLine2");
  const cursor = document.getElementById("typewriterCursor");
  const delayedElements = document.querySelectorAll(".hero-delayed-element");

  if (!line1El || !line2El) return;

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
      delayedElements.forEach((element) => {
        element.classList.add("active");
      });

      if (cursor) {
        cursor.remove();
      }
    }
  }

  setTimeout(typeLine1, 350);
}

/** 12. Self-Contained 3D Project Card Deck Component */
function init3DCardDeck() {
  const container = document.getElementById("deckContainer");
  const dotsContainer = document.getElementById("deckDotsContainer");

  if (!container) return;

  // Data-driven projects array
  const projectsData = [
    {
      indexTag: "01 / 2025",
      kicker: "Full Stack MERN",
      title: "LoopChat",
      description:
        "Real-time chat application featuring direct messaging, voice/video calls, and a sleek modern UI built using the MERN stack and Socket.IO.",
      tags: ["React", "Node.js", "Express", "MongoDB", "Socket.IO"],
      href: "https://loopchat-web.vercel.app/",
      repoHref: "https://github.com/ahmedaalam/loopchat",
    },
    {
      indexTag: "02 / 2025",
      kicker: "Frontend & API",
      title: "Cineva",
      description:
        "Movie browsing and discovery platform integrated with TMDB API, featuring responsive layouts, filtering, and fluid micro-animations.",
      tags: ["React", "TMDB API", "CSS3", "JavaScript"],
      href: "https://cineva-six.vercel.app/",
      repoHref: "https://github.com/ahmedaalam/cineva",
    },
    {
      indexTag: "03 / 2024",
      kicker: "Full Stack Web",
      title: "DevFlow",
      description:
        "Developer Q&A and knowledge sharing platform featuring rich text editing, upvoting, tag filtering, and user reputation analytics.",
      tags: ["React", "Node.js", "Express", "MongoDB", "Tailwind"],
      href: "https://github.com/ahmedaalam",
      repoHref: "https://github.com/ahmedaalam/devflow",
    },
    {
      indexTag: "04 / 2024",
      kicker: "Frontend & AI",
      title: "AI Canvas",
      description:
        "Interactive AI-powered graphics studio for generating, editing, and transforming images with custom prompt presets and canvas export tools.",
      tags: ["React", "OpenAI API", "Canvas API", "Zustand"],
      href: "https://github.com/ahmedaalam",
      repoHref: "https://github.com/ahmedaalam/ai-canvas",
    },
  ];

  let activeIndex = 0;
  const numCards = projectsData.length;

  // 1. Render Cards
  container.innerHTML = "";
  const cardElements = [];

  projectsData.forEach((project, index) => {
    const card = document.createElement("div");
    card.className = "deck-card";
    card.setAttribute("role", "group");
    card.setAttribute(
      "aria-label",
      `Project ${index + 1} of ${numCards}: ${project.title}`,
    );

    const tagsHTML = project.tags
      .map((tag) => `<span class="deck-card-tag">${tag}</span>`)
      .join("");

    card.innerHTML = `
      <div class="deck-card-top">
        <span class="deck-card-kicker">${project.kicker}</span>
      </div>
      <div class="deck-card-body">
        <h3 class="deck-card-title">${project.title}</h3>
        <p class="deck-card-desc">${project.description}</p>
        <div class="deck-card-tags">${tagsHTML}</div>
      </div>
      <div class="deck-card-footer">
        <a
          href="${project.href}"
          target="_blank"
          rel="noopener noreferrer"
          class="deck-card-link deck-card-link-demo"
          aria-label="View ${project.title} live demo"
        >
          <span>View project</span>
          <i data-lucide="arrow-up-right"></i>
        </a>
        <a
          href="${project.repoHref}"
          target="_blank"
          rel="noopener noreferrer"
          class="deck-card-link deck-card-link-repo"
          aria-label="View ${project.title} repository"
        >
          <span>Repository</span>
          <img src="assets/icons/github.svg" alt="" class="deck-card-repo-icon" />
        </a>
      </div>
    `;

    // Click on side card makes it active
    card.addEventListener("click", (e) => {
      if (index !== activeIndex) {
        e.preventDefault();
        setActive(index);
      }
    });

    // Keyboard activate on Enter or Space for side cards
    card.addEventListener("keydown", (e) => {
      if (index !== activeIndex && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        setActive(index);
      }
    });

    container.appendChild(card);
    cardElements.push(card);
  });

  // Re-render Lucide icons inside cards
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 2. Render Indicator Dots
  const dotElements = [];
  if (dotsContainer) {
    dotsContainer.innerHTML = "";
    projectsData.forEach((project, index) => {
      const dot = document.createElement("button");
      dot.className = "deck-dot";
      dot.setAttribute(
        "aria-label",
        `Go to project ${index + 1}: ${project.title}`,
      );
      dot.addEventListener("click", () => setActive(index));
      dotsContainer.appendChild(dot);
      dotElements.push(dot);
    });
  }

  // 3. Update 3D Positions & States
  // Layout: [ LEFT ] ... [ ACTIVE ] ... [ RIGHT ]
  // Side cards are flat (no rotation), just offset, dimmed & scaled down
  function updateDeckState() {
    const isMobile = window.innerWidth <= 640;

    cardElements.forEach((card, index) => {
      // Calculate circular distance offset from activeIndex
      let diff = (((index - activeIndex) % numCards) + numCards) % numCards;
      if (diff > numCards / 2) diff -= numCards;

      const isActive = diff === 0;
      const isLeft = diff === -1;
      const isRight = diff === 1;

      let translateX, translateZ, rotateY, scale, opacity, brightness, zIndex;

      if (isActive) {
        translateX = 0;
        translateZ = 0;
        rotateY = 0;
        scale = 1;
        opacity = 1;
        brightness = 1;
        zIndex = 100;
      } else if (isLeft) {
        translateX = isMobile ? -220 : -290;
        translateZ = -80; // pushed behind active card
        rotateY = 12; // gentle inward bend (faces right toward center)
        scale = 0.86;
        opacity = 0.65;
        zIndex = 80;
      } else if (isRight) {
        translateX = isMobile ? 220 : 290;
        translateZ = -80; // pushed behind active card
        rotateY = -12; // gentle inward bend (faces left toward center)
        scale = 0.86;
        opacity = 0.65;
        zIndex = 80;
      } else {
        // All other cards: hidden but ready to transition in
        translateX = diff > 0 ? 520 : -520;
        translateZ = -120;
        rotateY = diff > 0 ? -20 : 20;
        scale = 0.75;
        opacity = 0;
        zIndex = 10;
      }

      card.style.transform = `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;
      card.style.opacity = opacity;
      card.style.zIndex = zIndex;

      if (isActive) {
        card.classList.add("is-active");
        card.style.cursor = "default";
        card.setAttribute("tabindex", "0");
        card.removeAttribute("aria-hidden");
      } else {
        card.classList.remove("is-active");
        card.style.cursor = "pointer";
        const isVisible = isLeft || isRight;
        card.setAttribute("tabindex", isVisible ? "0" : "-1");
        card.setAttribute("aria-hidden", isVisible ? "false" : "true");
      }
    });

    // Update Dots
    dotElements.forEach((dot, index) => {
      if (index === activeIndex) {
        dot.classList.add("active");
        dot.setAttribute("aria-current", "true");
      } else {
        dot.classList.remove("active");
        dot.removeAttribute("aria-current");
      }
    });
  }

  function setActive(newIndex) {
    activeIndex = ((newIndex % numCards) + numCards) % numCards;
    updateDeckState();
  }

  // Keyboard navigation (ArrowLeft / ArrowRight) when Projects section is visible
  window.addEventListener("keydown", (e) => {
    if (
      e.target.tagName === "INPUT" ||
      e.target.tagName === "TEXTAREA" ||
      e.target.isContentEditable
    )
      return;

    const projectsSection = document.getElementById("projects");
    if (!projectsSection) return;

    const rect = projectsSection.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

    if (isVisible) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setActive(activeIndex - 1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setActive(activeIndex + 1);
      }
    }
  });

  // Touch Swipe Gesture Support
  let touchStartX = 0;
  let touchEndX = 0;

  container.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
    },
    { passive: true },
  );

  container.addEventListener(
    "touchend",
    (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const deltaX = touchEndX - touchStartX;
      if (deltaX < -40) {
        setActive(activeIndex + 1);
      } else if (deltaX > 40) {
        setActive(activeIndex - 1);
      }
    },
    { passive: true },
  );

  window.addEventListener("resize", updateDeckState, { passive: true });

  // Initial state setup
  updateDeckState();
}

/** 13. Trailing Circle Cursor Animation System */
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
