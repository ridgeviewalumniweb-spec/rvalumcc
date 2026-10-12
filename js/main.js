// Shared behavior for every page: mobile nav, footer year, and filling in the
// values from config.js (scholarship totals, event dates).
(function () {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const data = window.RACC || {};

  // ---- Mobile nav ----
  const toggle = $(".nav-toggle");
  const nav = $("#main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("open")) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

  // ---- Draft banner (config.js DRAFT: true) ----
  if (data.DRAFT) {
    const bar = document.createElement("div");
    bar.className = "draft-banner";
    bar.setAttribute("role", "note");
    bar.innerHTML =
      "<strong>DRAFT for review.</strong> This is a preview of the new website. Some information is out of date, " +
      "and online donations are turned off. Please send corrections to the person who shared this link with you.";
    document.body.prepend(bar);
  }

  // ---- Scholarship stats ----
  const money = (n) => "$" + Number(n).toLocaleString("en-US");
  const s = data.scholarships;
  if (s) {
    $$("[data-stats]").forEach((el) => {
      el.innerHTML = s.items
        .map((i) => `<div class="stat"><div class="stat-value">${money(i.amount)}</div><div class="stat-label">${i.label}</div></div>`)
        .join("");
    });
    $$("[data-stats-period]").forEach((el) => (el.textContent = s.period));
    const total = s.items.reduce((a, i) => a + Number(i.amount), 0);
    $$("[data-stats-total]").forEach((el) => (el.textContent = money(total)));
  }

  // ---- Event dates ----
  // An event shows its date only while that date is today or later; afterwards
  // (or when no date is set) it falls back to "coming soon" so nothing goes stale.
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  $$("[data-event]").forEach((el) => {
    const ev = (data.events || {})[el.dataset.event];
    if (!ev) return;
    const upcoming = ev.date && new Date(ev.date + "T23:59:59") >= today;
    const when = $("[data-when]", el);
    const where = $("[data-where]", el);
    const link = $("[data-link]", el);
    if (when) when.textContent = upcoming ? ev.when : "Next date coming soon";
    if (where) where.textContent = ev.where || "";
    if (link) {
      if (ev.link) link.href = ev.link;
      else link.remove();
    }
    el.classList.toggle("is-upcoming", !!upcoming);
  });
})();
