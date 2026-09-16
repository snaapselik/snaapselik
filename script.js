
const data = window.SNAAPSE || { releases: [], shows: [], links: {} };

document.querySelectorAll("[data-link]").forEach(el => {
  const href = data.links[el.dataset.link];
  if (href) el.href = href;
});

const releaseGrid = document.getElementById("release-grid");
if (releaseGrid) {
  releaseGrid.innerHTML = data.releases.map((r, i) => `
    <article class="release-card reveal">
      <div class="cover-wrap">
        <img src="${r.cover}" alt="${r.title} cover artwork" loading="${i === 0 ? "eager" : "lazy"}">
      </div>
      <div class="release-info">
        <div>
          <h3>${r.title}</h3>
          <p>SINGLE / ${r.date}</p>
        </div>
        <div class="release-links">
          <a href="${r.spotify}" target="_blank" rel="noopener" aria-label="${r.title} op Spotify">SP</a>
          <a href="${r.apple}" target="_blank" rel="noopener" aria-label="${r.title} op Apple Music">AM</a>
        </div>
      </div>
    </article>
  `).join("");
}

const showList = document.getElementById("show-list");
if (showList) {
  showList.innerHTML = data.shows.map(s => `
    <div class="show-row reveal">
      <time>${s.date}</time>
      <strong>${s.venue}</strong>
      <span class="city">${s.city}</span>
      <span class="status">${s.status}</span>
    </div>
  `).join("");
}

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: .1, rootMargin: "0px 0px -30px" });

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav, .dark-nav");

menuButton?.addEventListener("click", () => {
  const navEl = document.getElementById("main-nav");
  const open = navEl.classList.toggle("open");
  menuButton.classList.toggle("open", open);
  menuButton.setAttribute("aria-expanded", String(open));
  document.body.style.overflow = open ? "hidden" : "";
});

document.querySelectorAll("#main-nav a").forEach(a => {
  a.addEventListener("click", () => {
    const navEl = document.getElementById("main-nav");
    navEl.classList.remove("open");
    menuButton?.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  });
});

const yearNode = document.getElementById("year");
if (yearNode) yearNode.textContent = new Date().getFullYear();
