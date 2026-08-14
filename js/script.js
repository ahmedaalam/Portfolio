/**
 * Portfolio Interactive JavaScript
 * Smooth animations, scroll reveal, active navigation tracking, and micro-interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Dynamic Year in Footer
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 2. Refresh Lucide Icons (safeguard)
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 3. Header & Scroll Progress Bar Tracker
  const header = document.getElementById('header');
  const scrollProgress = document.getElementById('scrollProgress');

  window.addEventListener('scroll', () => {
    const totalScroll = document.documentElement.scrollTop;
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    // Update scroll progress bar width percentage
    if (scrollProgress && windowHeight > 0) {
      const scrollPercentage = (totalScroll / windowHeight) * 100;
      scrollProgress.style.width = `${scrollPercentage}%`;
    }

    // Toggle header shadow/scrolled class
    if (header) {
      if (totalScroll > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  });

  // 4. Scroll Reveal Animations with IntersectionObserver
  const revealElements = document.querySelectorAll('.reveal');
  
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Once revealed, unobserve to keep lightweight
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver is not supported
    revealElements.forEach(el => el.classList.add('active'));
  }

  // 5. Active Section Navigation Link Highlight on Scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let currentSectionId = 'home';
    const scrollPosition = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  // 6. Mobile Navigation Drawer Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinksContainer = document.getElementById('navLinks');
  const menuIcon = document.getElementById('menuIcon');

  if (mobileToggle && navLinksContainer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navLinksContainer.classList.toggle('open');
      
      // Toggle menu icon between menu & x if lucide is available
      if (menuIcon && window.lucide) {
        menuIcon.setAttribute('data-lucide', isOpen ? 'x' : 'menu');
        window.lucide.createIcons();
      }
    });

    // Close menu when clicking link on mobile
    const links = navLinksContainer.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinksContainer.classList.remove('open');
        if (menuIcon && window.lucide) {
          menuIcon.setAttribute('data-lucide', 'menu');
          window.lucide.createIcons();
        }
      });
    });
  }

  // 7. Copy Email to Clipboard Widget
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const toast = document.getElementById('toast');

  if (copyEmailBtn && toast) {
    copyEmailBtn.addEventListener('click', () => {
      const email = copyEmailBtn.getAttribute('data-email') || 'ahmed@email.com';
      
      navigator.clipboard.writeText(email).then(() => {
        // Show toast notification
        toast.classList.add('show');
        
        setTimeout(() => {
          toast.classList.remove('show');
        }, 2800);
      }).catch(err => {
        console.error('Failed to copy email:', err);
      });
    });
  }
});
