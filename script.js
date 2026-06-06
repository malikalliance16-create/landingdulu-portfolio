const navbar = document.getElementById("navbar");
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
const navItems = Array.from(document.querySelectorAll(".nav-links a[href^='#']"));
const scrollSections = navItems
  .map(function (link) {
    return document.querySelector(link.getAttribute("href"));
  })
  .filter(Boolean);

let ticking = false;
let pointerTicking = false;
const canUseDesktopNavState = window.matchMedia("(min-width: 769px)").matches;
const canUseScrollEffects = window.matchMedia("(min-width: 769px)").matches &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function updateScrollState() {
  if (window.scrollY > 80) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }

  if (canUseScrollEffects) {
    const scrollValue = Math.min(window.scrollY, 1000);
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;

    document.documentElement.style.setProperty("--scroll", scrollValue);
    document.documentElement.style.setProperty("--scroll-progress", scrollProgress);
  }

  if (canUseDesktopNavState) {
    const activeSection = scrollSections
      .filter(function (section) {
        return section.offsetTop <= window.scrollY + 180;
      })
      .pop();

    navItems.forEach(function (link) {
      const isActive = activeSection && link.getAttribute("href") === `#${activeSection.id}`;
      link.classList.toggle("active", Boolean(isActive));
    });
  }

  ticking = false;
}

window.addEventListener("scroll", function () {
  if (!ticking) {
    window.requestAnimationFrame(updateScrollState);
    ticking = true;
  }
}, { passive: true });

updateScrollState();

const canUsePointerGlow = window.matchMedia("(pointer: fine)").matches &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (canUsePointerGlow) {
  window.addEventListener("pointermove", function (event) {
    if (!pointerTicking) {
      window.requestAnimationFrame(function () {
        const x = `${Math.round((event.clientX / window.innerWidth) * 100)}%`;
        const y = `${Math.round((event.clientY / window.innerHeight) * 100)}%`;

        document.documentElement.style.setProperty("--mouse-x", x);
        document.documentElement.style.setProperty("--mouse-y", y);
        pointerTicking = false;
      });

      pointerTicking = true;
    }
  });

  document.querySelectorAll(".btn, .nav-cta").forEach(function (button) {
    button.addEventListener("pointermove", function (event) {
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;

      button.style.setProperty("--magnet-x", `${Math.round(x * 0.18)}px`);
      button.style.setProperty("--magnet-y", `${Math.round(y * 0.18)}px`);
    });

    button.addEventListener("pointerleave", function () {
      button.style.setProperty("--magnet-x", "0px");
      button.style.setProperty("--magnet-y", "0px");
    });
  });

  document.querySelectorAll(".glass-card, .process-card, .work-card, .proof-card, .contact-card").forEach(function (card) {
    card.addEventListener("pointermove", function (event) {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateY = ((x / rect.width) - 0.5) * 7;
      const rotateX = ((y / rect.height) - 0.5) * -7;

      card.style.setProperty("--spotlight-x", `${Math.round((x / rect.width) * 100)}%`);
      card.style.setProperty("--spotlight-y", `${Math.round((y / rect.height) * 100)}%`);
      card.style.setProperty("--tilt-x", `${rotateX.toFixed(2)}deg`);
      card.style.setProperty("--tilt-y", `${rotateY.toFixed(2)}deg`);
    });

    card.addEventListener("pointerleave", function () {
      card.style.setProperty("--spotlight-x", "50%");
      card.style.setProperty("--spotlight-y", "0%");
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
    });
  });
}

menuBtn.addEventListener("click", function () {
  navLinks.classList.toggle("active");
});

document.querySelectorAll(".nav-links a").forEach(function (link) {
  link.addEventListener("click", function () {
    navLinks.classList.remove("active");
  });
});

const revealItems = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.16,
    rootMargin: "0px 0px -8% 0px"
  }
);

const revealGroups = new Map();

revealItems.forEach(function (item) {
  const group = item.closest("section, footer, .hero-grid") || document.body;
  const index = revealGroups.get(group) || 0;

  item.style.transitionDelay = `${Math.min(index * 90, 360)}ms`;
  revealGroups.set(group, index + 1);
  observer.observe(item);
});

const marqueeTrack = document.querySelector('.marquee-track');
const canAnimateMarquee = window.matchMedia("(min-width: 769px)").matches &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (marqueeTrack && canAnimateMarquee) {
  const speed = 45; // pixels per second
  let lastTime = null;
  let offset = 0;

  const clone = marqueeTrack.innerHTML;
  marqueeTrack.insertAdjacentHTML('beforeend', clone);

  function animateMarquee(timestamp) {
    if (lastTime !== null) {
      const delta = (timestamp - lastTime) / 1000;
      offset -= speed * delta;
      const trackWidth = marqueeTrack.scrollWidth / 2;
      if (Math.abs(offset) >= trackWidth) {
        offset += trackWidth;
      }
      marqueeTrack.style.transform = `translate3d(${offset}px, 0, 0)`;
    }
    lastTime = timestamp;
    requestAnimationFrame(animateMarquee);
  }

  requestAnimationFrame(animateMarquee);
}
