// Snaapse Lik — tiny interactions

const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

menuButton?.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
  document.body.style.overflow = isOpen ? "hidden" : "";
});

nav?.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  });
});

// Reveal-on-scroll
const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

// Current year
document.getElementById("year").textContent = new Date().getFullYear();

// Slight poster motion on desktop
const art = document.querySelector(".hero-art");
const poster = document.querySelector(".poster-main");

if (art && poster && window.matchMedia("(pointer:fine)").matches) {
  art.addEventListener("mousemove", e => {
    const rect = art.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    poster.style.transform =
      `rotate(${3 + x * 2}deg) translate(${x * 8}px, ${y * 8}px)`;
  });

  art.addEventListener("mouseleave", () => {
    poster.style.transform = "rotate(3deg)";
  });
}
