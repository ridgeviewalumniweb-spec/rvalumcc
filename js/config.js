// ============================================================================
// SITE DATA — the things that change year to year live here, in one place.
// Edit, save, push. Every page that shows these values updates automatically.
// ============================================================================
window.RACC = {
  // DRAFT MODE: true while the site is being reviewed. Shows the draft banner on
  // every page and turns OFF online donations (PayPal never loads).
  // Set to false at launch (and remove the noindex tags + restore CNAME; see CLAUDE.md).
  DRAFT: true,

  // Same PayPal Business account (Live REST app) as ridgeviewgolf.org.
  // Donations are tagged custom_id "DONATION-RACC-…" so the golf site's existing
  // PayPal webhook logs them to the Donations tab of the golf Google Sheet.
  PAYPAL_CLIENT_ID: "BAArkJGh33VS3VJ3J8VLO728XB-QDiIm5Zl0XL1TIwMtu1FIyjf5KyHpMgHZLxa8ICUmu4EikLzHLn2lyw",

  // Google Apps Script Web App URL for the contact form (see apps-script/Contact.gs).
  // Leave "" until deployed — the form then falls back to opening the visitor's email app.
  CONTACT_ENDPOINT: "",

  CONTACT_EMAIL: "info@rvalumcc.org",
  PHONE: "(888) 258-6463",
  EIN: "84-5172028",

  // Scholarship totals shown on Home and Donate.
  scholarships: {
    period: "January 1 – May 31, 2026",
    items: [
      { amount: 43500, label: "for PHP, IOP, and housing assistance" },
      { amount: 2200, label: "for medication assistance" },
      { amount: 2050, label: "for sober living expenses" },
    ],
  },

  // Upcoming events. `date` is YYYY-MM-DD; once it has passed the site automatically
  // switches to "Next date coming soon" so it never shows a stale date.
  // Leave date "" when the next date isn't set yet.
  events: {
    golf: {
      date: "2026-10-16",
      when: "Friday, October 16, 2026 · 7:30 AM registration, 9:00 AM shotgun start",
      where: "City Club Marietta, 510 Powder Springs St SE, Marietta, GA",
      link: "https://ridgeviewgolf.org",
    },
    walk: {
      date: "",
      when: "",
      where: "Boundary Waters Park, Douglasville, GA",
      link: "",
    },
    fling: {
      date: "",
      when: "",
      where: "Ridgeview Institute campus, Smyrna, GA",
      link: "",
    },
  },
};
