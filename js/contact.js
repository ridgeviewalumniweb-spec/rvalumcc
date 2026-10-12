// Contact form. Posts to the Google Apps Script in apps-script/Contact.gs, which
// emails the message to info@rvalumcc.org. Until CONTACT_ENDPOINT is set in
// config.js, it falls back to opening the visitor's own email app instead.
(function () {
  const form = document.getElementById("contact-form");
  if (!form) return;
  const status = document.getElementById("form-status");
  const cfg = window.RACC || {};
  const to = cfg.CONTACT_EMAIL || "info@rvalumcc.org";

  function say(text, ok) {
    status.textContent = text;
    status.className = "form-status " + (ok ? "ok" : "err");
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(form).entries());
    Object.keys(f).forEach((k) => (f[k] = String(f[k]).trim()));

    if (f.website) return; // honeypot: bots fill hidden fields
    if (!f.first || !f.last || !f.email || !f.message) {
      say("Please fill in your name, email, and message.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) {
      say("Please enter a valid email address.");
      form.email.focus();
      return;
    }

    if (!cfg.CONTACT_ENDPOINT) {
      const body = `${f.message}\n\n${f.first} ${f.last}\n${f.email}${f.phone ? "\n" + f.phone : ""}`;
      window.location.href = `mailto:${to}?subject=${encodeURIComponent("Message from rvalumcc.org")}&body=${encodeURIComponent(body)}`;
      say(`Opening your email app… If nothing happens, email us at ${to}.`, true);
      return;
    }

    const btn = form.querySelector("button[type=submit]");
    btn.disabled = true;
    say("Sending…", true);
    try {
      // Apps Script web apps don't return CORS headers, so this is sent as a
      // "simple" no-cors POST: it is delivered, but the response can't be read.
      await fetch(cfg.CONTACT_ENDPOINT, { method: "POST", mode: "no-cors", body: new URLSearchParams(f) });
      form.reset();
      say("Thank you! Your message has been sent. We'll be in touch soon.", true);
    } catch (err) {
      console.error(err);
      say(`Sorry, your message couldn't be sent. Please email us at ${to} or call (888) 258-6463.`);
    } finally {
      btn.disabled = false;
    }
  });
})();
