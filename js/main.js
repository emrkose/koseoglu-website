/* ============================================================
   KÖSEOĞLU MOBİL JENERATÖR — Etkileşim & Animasyon
   ============================================================ */

// Firmanın WhatsApp numarası (ülke kodu ile, + olmadan)
const WHATSAPP_NUMBER = "905519449355";

/* ---------- Preloader ---------- */
window.addEventListener("load", () => {
  document.getElementById("preloader")?.classList.add("done");
});
// Güvenlik ağı: her durumda 2.5 sn sonra kaldır
setTimeout(() => document.getElementById("preloader")?.classList.add("done"), 2500);

/* ---------- Navbar ---------- */
const nav = document.getElementById("nav");
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

function updateNavState() {
  nav.classList.toggle("scrolled", window.scrollY > 40);
  document.getElementById("toTop")?.classList.toggle("show", window.scrollY > 600);
}
window.addEventListener("scroll", updateNavState, { passive: true });
updateNavState();

navToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  navToggle.classList.toggle("open", open);
  navToggle.setAttribute("aria-expanded", String(open));
});
// Mobil menüde linke tıklanınca menüyü kapat
navLinks.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  })
);

/* ---------- Scroll reveal ---------- */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        revealObserver.unobserve(e.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
);
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

/* ---------- Sayaç animasyonu ---------- */
function animateCount(el) {
  const target = parseInt(el.dataset.count, 10);
  const duration = 1600;
  const start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
    el.textContent = Math.round(target * eased).toString();
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        animateCount(e.target);
        countObserver.unobserve(e.target);
      }
    });
  },
  { threshold: 0.6 }
);
document.querySelectorAll("[data-count]").forEach((el) => countObserver.observe(el));

/* ---------- Hero: fare ile hareket eden ışık ---------- */
const heroGlow = document.getElementById("heroGlow");
const hero = document.querySelector(".hero");
if (hero && heroGlow && matchMedia("(pointer: fine)").matches) {
  hero.addEventListener("mousemove", (e) => {
    const r = hero.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    heroGlow.style.transform = `translate(${x * 60}px, ${y * 60}px)`;
  });
}

/* ---------- Kartlarda fareyi izleyen parlama ---------- */
document.querySelectorAll(".card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - r.left}px`);
    card.style.setProperty("--my", `${e.clientY - r.top}px`);
  });
});

/* ---------- Referans slider ---------- */
const testimonials = document.querySelectorAll(".testimonial");
const dotsWrap = document.getElementById("testimonialDots");
let tIndex = 0;
let tTimer;

if (testimonials.length && dotsWrap) {
  testimonials.forEach((_, i) => {
    const b = document.createElement("button");
    b.setAttribute("aria-label", `Referans ${i + 1}`);
    b.addEventListener("click", () => {
      showTestimonial(i);
      restartTimer();
    });
    dotsWrap.appendChild(b);
  });

  function showTestimonial(i) {
    tIndex = i;
    testimonials.forEach((t, j) => t.classList.toggle("active", j === i));
    dotsWrap.querySelectorAll("button").forEach((d, j) => d.classList.toggle("active", j === i));
  }
  function restartTimer() {
    clearInterval(tTimer);
    tTimer = setInterval(() => showTestimonial((tIndex + 1) % testimonials.length), 5500);
  }
  showTestimonial(0);
  restartTimer();
}

/* ---------- Randevu formu → WhatsApp ---------- */
const bookingForm = document.getElementById("bookingForm");
const formStatus = document.getElementById("formStatus");

// Geçmiş tarih seçilmesin
const dateInput = document.getElementById("fDate");
if (dateInput) dateInput.min = new Date().toISOString().split("T")[0];

bookingForm?.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!bookingForm.checkValidity()) {
    bookingForm.reportValidity();
    formStatus.textContent = "Lütfen zorunlu (*) alanları doldurun.";
    return;
  }

  const data = new FormData(bookingForm);
  const lines = [
    "🔶 *RANDEVU TALEBİ — Köseoğlu Mobil Jeneratör*",
    "",
    `👤 *Ad Soyad:* ${data.get("name")}`,
    `📞 *Telefon:* ${data.get("phone")}`,
    `⚡ *Hizmet:* ${data.get("service")}`,
    `📅 *Tarih:* ${data.get("date")}${data.get("time") ? " — Saat: " + data.get("time") : ""}`,
    `📍 *Konum:* ${data.get("location")}`,
  ];
  if (data.get("note")) lines.push(`📝 *Not:* ${data.get("note")}`);

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
  window.open(url, "_blank", "noopener");

  formStatus.textContent = "Talebiniz WhatsApp'a yönlendirildi — en geç 15 dakika içinde dönüş yapacağız.";
  bookingForm.reset();
});

/* ---------- Yumuşak kaydırma (özel süre + easing) ---------- */
let scrollAnim = null;

function smoothScrollTo(targetY) {
  const startY = window.scrollY;
  const dist = targetY - startY;
  if (Math.abs(dist) < 2) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.scrollTo(0, targetY);
    return;
  }
  // Mesafeye göre 600ms–1400ms arası süre
  const duration = Math.min(1400, Math.max(600, Math.abs(dist) * 0.45));
  const start = performance.now();
  cancelAnimationFrame(scrollAnim);
  function step(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; // easeInOutCubic
    window.scrollTo(0, startY + dist * eased);
    if (p < 1) scrollAnim = requestAnimationFrame(step);
  }
  scrollAnim = requestAnimationFrame(step);
}

// Kullanıcı tekerlek/dokunuşla araya girerse animasyonu bırak
["wheel", "touchstart"].forEach((ev) =>
  window.addEventListener(ev, () => cancelAnimationFrame(scrollAnim), { passive: true })
);

// Tüm sayfa içi bağlantıları özel kaydırmaya bağla
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    if (id.length <= 1) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    smoothScrollTo(target.getBoundingClientRect().top + window.scrollY);
    history.pushState(null, "", id);
  });
});

/* ---------- Yukarı dön ---------- */
document.getElementById("toTop")?.addEventListener("click", () => smoothScrollTo(0));

/* ---------- Yıl ---------- */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear().toString();
