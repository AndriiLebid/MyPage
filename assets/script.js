// Theme toggle with persistence + prefers-color-scheme fallback
(function () {
  const root = document.documentElement;
  const btn = document.getElementById("themeToggle");
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  const stored = localStorage.getItem("theme");
  const prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;

  function setTheme(mode) {
    root.setAttribute("data-theme", mode);
    localStorage.setItem("theme", mode);
  }

  // init
  if (stored) {
    setTheme(stored);
  } else {
    setTheme(prefersLight ? "light" : "dark");
  }

  if (btn) {
    btn.addEventListener("click", () => {
      const current = root.getAttribute("data-theme") || "dark";
      setTheme(current === "dark" ? "light" : "dark");
    });
  }
})();