// Donate page: amount picker + PayPal Smart Buttons.
//
// Uses the same PayPal Business account / Live REST app as ridgeviewgolf.org.
// Each order carries custom_id "DONATION-RACC-…". The golf site's Apps Script
// webhook treats any custom_id starting with "DONATION" as a direct gift and logs
// it to the Donations tab of the golf Google Sheet (no coordinator alert), so the
// "RACC" in the ID is how to tell rvalumcc.org gifts apart from golf-site gifts.
// PayPal itself is the authoritative record of every donor and emails the receipt.
(function () {
  const $ = (s) => document.querySelector(s);
  const cfg = window.RACC || {};
  const MIN = 1;
  let amount = 50;
  let rendered = false;

  const money = (n) => "$" + Number(n).toLocaleString("en-US");

  function makeDonationId() {
    return "DONATION-RACC-" + Date.now().toString(36).toUpperCase() +
      "-" + Math.random().toString(36).slice(2, 7).toUpperCase();
  }

  function hint(text, isError) {
    const el = $("#donate-hint");
    if (!text) { el.hidden = true; return; }
    el.textContent = text;
    el.classList.toggle("error", !!isError);
    el.hidden = false;
  }

  function update() {
    $("#amount-display").textContent = amount >= MIN ? money(amount) : "$0";
    const ok = amount >= MIN;
    $("#paypal-container").style.display = ok ? "" : "none";
    if (!ok) hint("Choose or enter an amount of $1 or more to continue.");
    else if (rendered) hint("");
  }

  document.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".chip").forEach((c) => c.classList.toggle("active", c === chip));
      const isOther = chip.id === "other-chip";
      $("#custom-field").hidden = !isOther;
      if (isOther) {
        const input = $("#custom-amount");
        input.focus();
        amount = Math.max(0, Math.floor(Number(input.value) || 0));
      } else {
        amount = Number(chip.dataset.amount) || 0;
      }
      update();
    });
  });

  $("#custom-amount").addEventListener("input", (e) => {
    amount = Math.max(0, Math.floor(Number(e.target.value) || 0));
    update();
  });

  function loadPaypalSdk() {
    return new Promise((resolve, reject) => {
      if (window.paypal) return resolve(window.paypal);
      const s = document.createElement("script");
      s.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(cfg.PAYPAL_CLIENT_ID)}&currency=USD&intent=capture`;
      s.onload = () => (window.paypal ? resolve(window.paypal) : reject(new Error("PayPal SDK missing")));
      s.onerror = () => reject(new Error("PayPal SDK failed to load"));
      document.head.appendChild(s);
    });
  }

  const fallback = `Please try again shortly, or reach us at ${cfg.PHONE || "(888) 258-6463"} or ${cfg.CONTACT_EMAIL || "info@rvalumcc.org"}.`;

  async function init() {
    update();
    if (!cfg.PAYPAL_CLIENT_ID) {
      hint("Online giving is being set up. " + fallback, true);
      return;
    }
    let paypal;
    try {
      paypal = await loadPaypalSdk();
    } catch (err) {
      console.error(err);
      hint("Payment is temporarily unavailable. " + fallback, true);
      return;
    }

    rendered = true;
    paypal.Buttons({
      style: { layout: "vertical", color: "gold", shape: "pill", label: "pay" },
      onClick: (data, actions) => {
        if (amount < MIN) {
          hint("Please choose or enter an amount of $1 or more first.", true);
          return actions.reject();
        }
        return actions.resolve();
      },
      // createOrder reads the amount at click time, so the one rendered button
      // always charges whatever is currently selected.
      createOrder: (data, actions) => actions.order.create({
        purchase_units: [{
          description: "Donation to Ridgeview Alumni Charitable Corporation (rvalumcc.org)",
          custom_id: makeDonationId(),
          amount: { currency_code: "USD", value: String(amount) },
        }],
      }),
      onApprove: (data, actions) => actions.order.capture().then(() => {
        $("#thanks-amount").textContent = money(amount);
        $("#donate-form").hidden = true;
        $("#donate-success").classList.add("show");
        $("#donate-success").scrollIntoView({ behavior: "smooth", block: "center" });
      }),
      onError: (err) => {
        console.error("PayPal donation error", err);
        hint("Something went wrong with PayPal. " + fallback, true);
      },
    }).render("#paypal-container");
    update();
  }

  init();
})();
