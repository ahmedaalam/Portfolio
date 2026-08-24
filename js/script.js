// Projects data
const projects = [
  {
    title: "LoopChat",
    img: "./assets/images/loopchat.png",
    year: "2026",
    type: "Real-Time Chat App",
    url: "https://loopchat-web.vercel.app/",
  },
  {
    title: "Cineva",
    img: "./assets/images/cineva.png",
    year: "2025",
    type: "Movie Platform",
    url: "https://cineva-six.vercel.app/",
  },
  {
    title: "Minimalist Home Retreat",
    img: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/bw12.jpeg",
    year: "2025",
    type: "Interior",
    url: "#",
  },
  {
    title: "Urban Concrete House",
    img: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/tiny-home/erik-mclean-g3U7sqtdJ1w-unsplash.jpg",
    year: "2025",
    type: "Product Design",
    url: "#",
  },
];

document.addEventListener("DOMContentLoaded", () => {
  // Auto-fetch Real-time GitHub Stats
  const GITHUB_USERNAME = "ahmedaalam";

  // 1. Fetch Public Repositories
  const githubReposEl = document.getElementById("githubRepos");
  if (githubReposEl) {
    fetch(`https://api.github.com/users/${GITHUB_USERNAME}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.public_repos === "number") {
          githubReposEl.textContent = `${data.public_repos}+`;
        }
      })
      .catch((err) => console.warn("GitHub repos fetch error:", err));
  }

  // 2. Fetch Total Contributions
  const githubContribEl = document.getElementById("githubContributions");
  if (githubContribEl) {
    fetch(`https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.total) {
          const totalContributions = Object.values(data.total).reduce(
            (sum, val) => (typeof val === "number" ? sum + val : sum),
            0,
          );
          if (totalContributions > 0) {
            githubContribEl.textContent = `${totalContributions}+`;
          }
        }
      })
      .catch((err) => console.warn("GitHub contributions fetch error:", err));
  }

  // 3. Fetch Total Commits
  const githubCommitsEl = document.getElementById("githubCommits");
  if (githubCommitsEl) {
    fetch(`https://api.github.com/search/commits?q=author:${GITHUB_USERNAME}`, {
      headers: { Accept: "application/vnd.github.cloak-preview+json" },
    })
      .then((res) => res.json())
      .then((data) => {
        if (
          data &&
          typeof data.total_count === "number" &&
          data.total_count > 0
        ) {
          githubCommitsEl.textContent = `${data.total_count}+`;
        }
      })
      .catch((err) => console.warn("GitHub commits fetch error:", err));
  }

  // 4. Fetch Pull Requests
  const githubPRsEl = document.getElementById("githubPRs");
  if (githubPRsEl) {
    fetch(
      `https://api.github.com/search/issues?q=author:${GITHUB_USERNAME}+type:pr`,
    )
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.total_count === "number") {
          githubPRsEl.textContent = `${data.total_count}+`;
        }
      })
      .catch((err) => console.warn("GitHub PRs fetch error:", err));
  }

  // 1. Render Projects Grid
  const grid = document.getElementById("projectsGrid");
  if (grid) {
    grid.innerHTML = projects
      .map(
        (p, i) => `
      <div class="project-card" style="transition-delay:${i * 80}ms">
        <a href="${p.url}" target="_blank" rel="noopener noreferrer" class="project-card-link" aria-label="${p.title}">
          <img class="project-card-img" src="${p.img}" alt="${p.title}" loading="lazy">
        </a>
        <div class="project-card-body">
          <div>
            <a href="${p.url}" target="_blank" rel="noopener noreferrer" style="text-decoration:none;color:inherit;">
              <p class="project-card-title">${p.title}</p>
            </a>
            <p class="project-card-type">${p.type}</p>
          </div>
          <div class="project-card-year">${p.year}</div>
        </div>
      </div>
    `,
      )
      .join("");

    // Animate project cards on scroll
    const cards = grid.querySelectorAll(".project-card");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );

    cards.forEach((card) => observer.observe(card));
  }

  // 2. Navbar scroll effect
  const navbar = document.querySelector(".navbar");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 20) {
      navbar?.classList.add("scrolled");
    } else {
      navbar?.classList.remove("scrolled");
    }
  });

  // 3. Mobile Menu Toggle
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.toggle("open");
      const isOpen = navMenu.classList.contains("open");
      navToggle.setAttribute("aria-expanded", isOpen);
      navToggle.innerHTML = isOpen
        ? `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
        : `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
    });

    // Close menu when clicking links
    navMenu.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("open");
        navToggle.innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
      });
    });
  }

  // 4. Active link scrollspy
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  const scrollSpy = () => {
    const scrollY = window.pageYOffset;
    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 100;
      const sectionId = current.getAttribute("id");

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  };
  window.addEventListener("scroll", scrollSpy);

  // 5. Contact Form handling (Web3Forms live submission)
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");

  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector(".form-submit-btn");
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = `Sending...`;
      submitBtn.disabled = true;

      const formData = new FormData(contactForm);
      const accessKey = formData.get("access_key");

      try {
        if (accessKey && accessKey !== "YOUR_ACCESS_KEY_HERE") {
          const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData,
          });
          const result = await response.json();

          if (result.success) {
            contactForm.reset();
            if (formStatus) {
              formStatus.className = "form-status success";
              formStatus.textContent =
                "Thank you! Your message has been sent directly to Ahmed's inbox.";
            }
          } else {
            throw new Error(result.message || "Failed to send message");
          }
        } else {
          // Simulation fallback if key is not yet configured
          await new Promise((resolve) => setTimeout(resolve, 1000));
          contactForm.reset();
          if (formStatus) {
            formStatus.className = "form-status success";
            formStatus.textContent =
              "Thank you! Your message has been sent successfully.";
          }
        }
      } catch (err) {
        if (formStatus) {
          formStatus.className = "form-status error";
          formStatus.style.color = "#dc2626";
          formStatus.textContent =
            "Oops! Something went wrong. Please reach out directly to ahmedalam.dev@gmail.com";
        }
      } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        if (formStatus) {
          setTimeout(() => {
            formStatus.textContent = "";
            formStatus.className = "form-status";
          }, 6000);
        }
      }
    });
  }

  // 6. Availability Marquee dynamic speed on scroll
  const marqueeEl = document.getElementById("marquee");
  if (
    marqueeEl &&
    typeof gsap !== "undefined" &&
    typeof ScrollTrigger !== "undefined"
  ) {
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
        const targetSpeed =
          1 + Math.min(3, Math.abs(self.getVelocity()) / 1500);
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

  // 7. Dynamic Year in Footer
  const yearEl = document.getElementById("currentYear");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});
