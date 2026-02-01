const USERNAME = "AndriiLebid";

const featured = [
  {
    title: "Time & Attendance (ASP.NET MVC + API + Android Kotlin)",
    url: "https://github.com/AndriiLebid/STAS",
    note: "MVC • API • Kotlin"
  },
  {
    title: "Time & Attendance (Spring Boot + Flutter)",
    url: "https://github.com/AndriiLebid/STAS_JAVA",
    note: "Spring Boot • Flutter"
  },
  {
    title: "AI RSS Rewriter (Ollama + Phi‑3)",
    url: "https://github.com/AndriiLebid/AI_project",
    note: "Local AI • Automation"
  },
  {
    title: "Java Interview Tasks",
    url: "https://github.com/AndriiLebid/JavaSmallTasks",
    note: "Practice • Algorithms"
  },
  {
    title: "PHP/MySQL Portfolio",
    url: "https://github.com/AndriiLebid/personal-portfolio-php",
    note: "PHP • MySQL"
  },
  {
    title: "Mobile App Recipe Book",
    url: "https://github.com/AndriiLebid/recipe_base",
    note: "Mobile • CRUD"
  }
];

const $ = (id) => document.getElementById(id);

function escapeHtml(str = "") {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function fmtDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}

function featuredCard(item) {
  return `
    <article class="panel repo">
      <div class="repo__top">
        <a class="repo__name link" href="${item.url}" target="_blank" rel="noreferrer">${escapeHtml(item.title)}</a>
        <span class="badge badge--matcha">${escapeHtml(item.note)}</span>
      </div>
      <p class="repo__desc">Featured repository</p>
      <div class="repo__meta">
        <span>↗ Open on GitHub</span>
      </div>
    </article>
  `;
}

function repoCard(r) {
  const lang = r.language ? `<span class="badge">${escapeHtml(r.language)}</span>` : "";
  const stars = `<span class="badge">★ ${r.stargazers_count ?? 0}</span>`;
  const updated = `<span class="badge badge--matcha">Updated ${fmtDate(r.pushed_at)}</span>`;

  return `
    <article class="panel repo">
      <div class="repo__top">
        <a class="repo__name link" href="${r.html_url}" target="_blank" rel="noreferrer">${escapeHtml(r.name)}</a>
        <div class="badges">${stars}${lang}${updated}</div>
      </div>
      <p class="repo__desc">${escapeHtml(r.description ?? "No description provided.")}</p>
      <div class="repo__meta">
        <span>${r.fork ? "Fork" : "Source"}</span>
        <span>${r.archived ? "Archived" : ""}</span>
      </div>
    </article>
  `;
}

function renderFeatured() {
  const grid = $("featuredGrid");
  grid.innerHTML = featured.map(featuredCard).join("");
}

let repos = [];

function sortRepos(list, mode) {
  const copy = [...list];
  if (mode === "stars") copy.sort((a, b) => (b.stargazers_count ?? 0) - (a.stargazers_count ?? 0));
  if (mode === "name") copy.sort((a, b) => a.name.localeCompare(b.name));
  if (mode === "updated") copy.sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));
  return copy;
}

function filterRepos(list) {
  const q = $("search").value.trim().toLowerCase();
  if (!q) return list;
  return list.filter(r => {
    const hay = `${r.name} ${r.description ?? ""} ${r.language ?? ""}`.toLowerCase();
    return hay.includes(q);
  });
}

function renderRepos() {
  const on = $("toggleLive").checked;
  const grid = $("repoGrid");
  const status = $("status");

  if (!on) {
    status.textContent = "Live repos hidden (toggle to show).";
    grid.innerHTML = "";
    return;
  }

  const filtered = filterRepos(repos);
  const sorted = sortRepos(filtered, $("sort").value);

  status.textContent = `Showing ${sorted.length} repositories loaded from GitHub.`;
  grid.innerHTML = sorted.map(repoCard).join("");
}

async function loadRepos() {
  const status = $("status");
  status.textContent = "Loading repositories from GitHub…";

  try {
    const url = `https://api.github.com/users/${USERNAME}/repos?per_page=100`;
    const res = await fetch(url, { headers: { "Accept": "application/vnd.github+json" } });

    if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
    repos = await res.json();

    // keep it tidy: hide forks + archived in the live list by default
    repos = repos.filter(r => !r.fork && !r.archived);

    status.textContent = "";
    renderRepos();
  } catch (e) {
    status.textContent = "Could not load live repositories right now. Featured section still works.";
  }
}

function init() {
  $("year").textContent = new Date().getFullYear();

  renderFeatured();
  loadRepos();

  ["search", "sort", "toggleLive"].forEach(id => $(id).addEventListener("input", renderRepos));
}

init();
