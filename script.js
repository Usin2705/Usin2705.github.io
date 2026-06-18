const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const yearTarget = document.querySelector("[data-year]");
const filterButtons = document.querySelectorAll("[data-filter]");
const publicationItems = document.querySelectorAll("[data-topic]");
const navLinks = document.querySelectorAll(".site-nav a[href^='#']");
const sections = Array.from(navLinks)
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const syncHeaderState = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 8);
};

const closeNav = () => {
  nav?.classList.remove("is-open");
  header?.classList.remove("is-open");
  navToggle?.setAttribute("aria-expanded", "false");
  navToggle?.setAttribute("aria-label", "Open menu");
};

navToggle?.addEventListener("click", () => {
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Open menu" : "Close menu");
  nav?.classList.toggle("is-open", !isOpen);
  header?.classList.toggle("is-open", !isOpen);
});

nav?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    closeNav();
  }
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter ?? "all";

    filterButtons.forEach((candidate) => {
      const isActive = candidate === button;
      candidate.classList.toggle("is-active", isActive);
      candidate.setAttribute("aria-pressed", String(isActive));
    });

    publicationItems.forEach((item) => {
      const topics = item.dataset.topic ?? "";
      item.hidden = filter !== "all" && !topics.includes(filter);
    });
  });
});

const syncActiveNav = () => {
  let current = null;
  sections.forEach((section) => {
    if (section.getBoundingClientRect().top <= 120) {
      current = section;
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle("is-active", current && link.getAttribute("href") === `#${current.id}`);
  });
};

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

if (yearTarget) {
  yearTarget.textContent = new Date().getFullYear().toString();
}

syncHeaderState();
syncActiveNav();
window.addEventListener("scroll", () => {
  syncHeaderState();
  syncActiveNav();
}, { passive: true });
