/** Multi-product landing — picker, render, state */
let currentProductId = null;

function icon(name) {
  return `<svg class="icon" aria-hidden="true"><use href="#${name}"></use></svg>`;
}

function iconLg(name) {
  return `<svg class="icon-lg" aria-hidden="true"><use href="#${name}"></use></svg>`;
}

function renderHero(product) {
  const h = product.hero;
  const stats = h.stats
    .map(
      (s) =>
        `<div class="stat-item"><strong>${s.value}</strong><span>${s.label}</span></div>`
    )
    .join("");
  const badges = HERO_TRUST_BADGES.map(
    (b) =>
      `<li class="badge-item reveal">${iconLg(b.icon)}<span>${b.text}</span></li>`
  ).join("");

  return `
    <section class="hero">
      <div class="hero-glow hero-glow-1" aria-hidden="true"></div>
      <div class="hero-glow hero-glow-2" aria-hidden="true"></div>
      <div class="container hero-grid">
        <div class="reveal">
          <span class="hero-badge"><span class="dot"></span>${h.badge}</span>
          <h1>${h.title}<span class="brand-text product-name-en">${h.titleBrand}</span></h1>
          <p class="hero-lead">${h.lead}</p>
          <div class="hero-ctas">
            <button type="button" class="btn btn-primary" data-open-form>
              درخواست مشاوره رایگان
              ${icon("i-arrow-left")}
            </button>
            <a class="btn btn-outline" href="tel:+982633107">
              ${icon("i-phone")} تماس با کارشناس فروش
            </a>
          </div>
          <ul class="badge-grid">${badges}</ul>
        </div>
        <div class="reveal">
          <div class="device-card">
            <img class="device-img" src="${product.image}" alt="${product.imageAlt}" width="1024" height="1024" />
            <div class="stat-grid">${stats}</div>
          </div>
        </div>
      </div>
    </section>`;
}

function renderPain(product) {
  if (product.template !== "full") return "";
  const cards = PAIN_POINTS.map(
    (p) => `
      <article class="card pain-card reveal">
        <div class="icon-box danger">${iconLg(p.icon)}</div>
        <h3>${p.title}</h3>
        <p>${p.text}</p>
      </article>`
  ).join("");

  return `
    <section id="pain" class="section bg-plain">
      <div class="container">
        <div class="section-head reveal">
          <span class="eyebrow">تشخیص وضعیت</span>
          <h2>چرا باید دستگاه‌های قدیمی را کنار گذاشت؟</h2>
          <p>نگه داشتن یک سل کانتر فرسوده، ارزان‌تر از جایگزینی آن نیست؛ هزینه پنهان آن در تعمیرات، توقف کار و بی‌اعتمادی به نتایج پرداخت می‌شود.</p>
        </div>
        <div class="pain-grid">${cards}</div>
        <div class="cta-banner reveal">
          ${iconLg("i-alert").replace('class="icon-lg"', 'class="icon-xl" style="color: var(--brand)"')}
          <p>${product.painBanner}</p>
          <button type="button" class="btn btn-primary btn-sm" data-open-form>
            درخواست مشاوره رایگان
            <svg class="icon-sm" aria-hidden="true"><use href="#i-arrow-left"></use></svg>
          </button>
        </div>
      </div>
    </section>`;
}

function renderFeatures(product) {
  const fh = product.featuresHead;
  const cards = product.features
    .map(
      (f) => `
      <article class="card feature-card reveal">
        <div class="icon-box accent">${icon(f.icon)}</div>
        <div><h3>${f.title}</h3><p>${f.text}</p></div>
      </article>`
    )
    .join("");

  return `
    <section id="features" class="section bg-soft">
      <div class="container">
        <div class="section-head reveal">
          <span class="eyebrow">${fh.eyebrow}</span>
          <h2>چرا <span class="product-name-en">${product.name}</span>؟</h2>
          <p>${fh.lead}</p>
        </div>
        <div class="feature-grid">${cards}</div>
      </div>
    </section>`;
}

function renderOffer() {
  return `
    <section id="offer" class="section bg-plain">
      <div class="container">
        <div class="section-head reveal">
          <span class="eyebrow">طرح ویژه</span>
          <h2>طرح ویژه واگذاری دستگاه</h2>
        </div>
        <div class="offer-box reveal">
          <div class="offer-intro">
            <div class="offer-icon"><svg class="icon-xl" aria-hidden="true"><use href="#i-gift"></use></svg></div>
            <p>در این طرح، آزمایشگاه می‌تواند دستگاه GETEIN BHA3000 را دریافت کند و معادل ارزش دستگاه، اعتبار خرید لوازم مصرفی آزمایشگاه دریافت نماید. هیچ هزینه‌ای برای بهای دستگاه پرداخت نمی‌کنید.</p>
          </div>
          <div class="steps-grid">
            <article class="step-card reveal"><span class="step-num">۱</span><h3>ثبت درخواست مشاوره</h3><p>فرم کوتاه را تکمیل می‌کنید؛ کارشناس محصول در اسرع وقت با شما تماس می‌گیرد.</p></article>
            <article class="step-card reveal"><span class="step-num">۲</span><h3>بررسی نیاز آزمایشگاه</h3><p>حجم تست روزانه و مصرف ماهانه لوازم آزمایشگاه شما بررسی و ارزیابی می‌شود.</p></article>
            <article class="step-card reveal"><span class="step-num">۳</span><h3>تعیین اعتبار خرید مصرفی</h3><p>معادل ارزش دستگاه، سقف اعتبار خرید لوازم مصرفی به‌صورت شفاف تعیین می‌شود.</p></article>
            <article class="step-card reveal"><span class="step-num">۴</span><h3>تحویل، نصب و آموزش</h3><p>دستگاه واگذار، نصب و راه‌اندازی می‌شود و پرسنل شما آموزش کامل می‌بینند.</p></article>
          </div>
          <button type="button" class="btn btn-primary offer-cta" data-open-form>
            بررسی شرایط طرح برای آزمایشگاه من
            ${icon("i-arrow-left")}
          </button>
        </div>
      </div>
    </section>`;
}

function renderSpecs(product) {
  if (!product.specs) return "";
  const rows = product.specs
    .map(
      (s) =>
        `<div class="spec-row reveal"><dt>${s.label}</dt><dd>${s.value}</dd></div>`
    )
    .join("");

  return `
    <section id="specs" class="section bg-plain">
      <div class="container">
        <div class="section-head reveal">
          <span class="eyebrow">مشخصات فنی</span>
          <h2>مشخصات <span class="product-name-en">${product.name}</span></h2>
          <p>خلاصه مشخصات فنی بر اساس کاتالوگ رسمی محصول GETEIN.</p>
        </div>
        <dl class="spec-grid">${rows}</dl>
      </div>
    </section>`;
}

function renderWhyUs() {
  return `
    <section id="why-us" class="section bg-soft">
      <div class="container">
        <div class="section-head reveal">
          <span class="eyebrow">اعتماد و پشتیبانی</span>
          <h2>چرا سانا شفابخش راسپینا؟</h2>
          <p>تامین تجهیزات، تنها آغاز همکاری است؛ ماندگاری آزمایشگاه شما به خدمات پس از فروش، قطعات و پشتیبانی فنی وابسته است.</p>
        </div>
        <div class="why-grid">
          <img class="why-photo reveal" src="assets/engineer.jpg" alt="کارشناس فنی پشتیبانی تجهیزات پزشکی" width="1200" height="900" loading="lazy" />
          <div class="trust-grid">
            <article class="card trust-card card-static reveal"><div class="icon-box secondary">${icon("i-shield")}</div><div><h3>۱ سال گارانتی بی‌قید و شرط</h3><p>یک سال گارانتی بی‌قید و شرط دستگاه با تعهد کتبی در قرارداد.</p></div></article>
            <article class="card trust-card card-static reveal"><div class="icon-box secondary">${icon("i-badge")}</div><div><h3>مجوز رسمی IRC</h3><p>کالای دارای کد IRC و مجوزهای رسمی اداره کل تجهیزات پزشکی.</p></div></article>
            <article class="card trust-card card-static reveal"><div class="icon-box secondary">${icon("i-users")}</div><div><h3>تیم متخصص</h3><p>کارشناسان علوم آزمایشگاهی و مهندسی پزشکی در کنار تیم فروش.</p></div></article>
            <article class="card trust-card card-static reveal"><div class="icon-box secondary">${icon("i-ship")}</div><div><h3>تامین مستقیم تجهیزات</h3><p>واردات مستقیم بدون واسطه و مسیر تامین شفاف.</p></div></article>
            <article class="card trust-card card-static reveal"><div class="icon-box secondary">${icon("i-wrench")}</div><div><h3>خدمات پس از فروش</h3><p>سرویس دوره‌ای، کالیبراسیون و رفع اشکال توسط تیم فنی.</p></div></article>
            <article class="card trust-card card-static reveal"><div class="icon-box secondary">${icon("i-grad")}</div><div><h3>آموزش کاربران</h3><p>آموزش حضوری اپراتورها تا رسیدن به تسلط کامل.</p></div></article>
          </div>
        </div>
      </div>
    </section>`;
}

function renderFaq(product) {
  const items = product.faq
    .map(
      (f) => `
      <details class="faq-item reveal">
        <summary>${f.q}</summary>
        <div class="faq-a">${f.a}</div>
      </details>`
    )
    .join("");

  return `
    <section id="faq" class="section bg-plain">
      <div class="container">
        <div class="section-head reveal">
          <span class="eyebrow">سوالات متداول</span>
          <h2>${product.faqHead}</h2>
        </div>
        <div class="faq-list">${items}</div>
      </div>
    </section>`;
}

function renderFooter(product) {
  const links = product.footerLinks
    .map((l) => {
      const label = l.label.replace(
        product.name,
        `<span class="product-name-en">${product.name}</span>`
      );
      return `<li><a href="${l.href}">${label}</a></li>`;
    })
    .join("");

  return `
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div>
            <img class="logo logo-invert" src="assets/ortanes-logo.png" alt="سانا شفابخش راسپینا (اورتانیس)" width="640" height="200" loading="lazy" />
            <p>تامین‌کننده تجهیزات آزمایشگاهی و محصولات تشخیص پزشکی با مجوزهای رسمی، خدمات پس از فروش و پشتیبانی فنی تخصصی.</p>
          </div>
          <div>
            <h4>اطلاعات تماس</h4>
            <ul>
              <li>${icon("i-map").replace('class="icon"', 'class="icon-sm"')} استان البرز، شهرک صنعتی بهارستان، فاز سه، نبش بهار دوم</li>
              <li><a href="tel:+982633107">${icon("i-phone").replace('class="icon"', 'class="icon-sm"')}<span dir="ltr">۰۲۶ ۳۳۱۰۷</span></a></li>
              <li><a href="mailto:info@ortanes.com">${icon("i-mail").replace('class="icon"', 'class="icon-sm"')} info@ortanes.com</a></li>
              <li><a href="https://ortanes.com" target="_blank" rel="noopener noreferrer">${icon("i-globe").replace('class="icon"', 'class="icon-sm"')} ortanes.com</a></li>
            </ul>
          </div>
          <div>
            <h4>دسترسی سریع</h4>
            <ul>${links}<li><button type="button" class="footer-form-btn" data-open-form>درخواست مشاوره رایگان</button></li></ul>
          </div>
        </div>
        <div class="footer-copy">© تمامی حقوق این وب‌سایت برای شرکت سانا شفابخش راسپینا محفوظ است.</div>
      </div>
    </footer>`;
}

function renderProductView(productId) {
  const product = PRODUCTS[productId];
  if (!product) return "";

  let html = renderHero(product);
  html += renderPain(product);
  html += renderFeatures(product);
  if (product.template === "full") html += renderOffer();
  html += renderSpecs(product);
  html += renderWhyUs();
  html += renderFaq(product);
  html += renderFooter(product);
  return html;
}

function renderPickerCards() {
  return PRODUCT_LIST.map((id) => {
    const p = PRODUCTS[id];
    return `
      <button type="button" class="picker-card" data-select-product="${id}">
        <span class="picker-card-check" aria-hidden="true">${icon("i-check")}</span>
        <img class="picker-card-img" src="${p.image}" alt="" width="200" height="200" loading="lazy" />
        <span class="picker-card-body">
          <strong class="picker-card-name product-name-en">${p.name}</strong>
          <span class="picker-card-tag product-name-en">${p.tagline}</span>
        </span>
      </button>`;
  }).join("");
}

function renderFormProductCards(selectedId) {
  return PRODUCT_LIST.map((id) => {
    const p = PRODUCTS[id];
    const checked = selectedId && id === selectedId ? " checked" : "";
    return `
      <label class="product-radio-card${checked ? " is-selected" : ""}">
        <input type="radio" name="productId" value="${id}"${checked} />
        <span class="product-radio-check" aria-hidden="true">${icon("i-check")}</span>
        <img class="product-radio-img" src="${p.image}" alt="" width="120" height="120" loading="lazy" />
        <span class="product-radio-body">
          <strong class="product-name-en">${p.name}</strong>
          <span class="product-name-en">${p.tagline}</span>
        </span>
      </label>`;
  }).join("");
}

function updatePageMeta(product) {
  document.title = product.meta.title;
  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute("content", product.meta.description);
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute("content", product.meta.title);
  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute("content", product.meta.description);
}

function bindProductActions() {
  document.querySelectorAll("[data-open-form]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const errorEl = document.getElementById("form-error");
      if (errorEl) errorEl.textContent = "";
      if (typeof openFormModal === "function") openFormModal();
    });
  });
}

function selectProduct(productId) {
  const product = PRODUCTS[productId];
  if (!product) return;

  currentProductId = productId;
  window.__currentProductId = productId;

  const view = document.getElementById("product-view");
  if (view) {
    view.innerHTML = renderProductView(productId);
    bindProductActions();
    if (typeof initReveal === "function") initReveal();
  }

  updatePageMeta(product);
  updateFormProductCards(productId);
  document.body.classList.add("product-selected");

  const headerName = document.getElementById("header-product-name");
  if (headerName) headerName.textContent = product.name;
}

function updateFormProductCards(selectedId) {
  const container = document.getElementById("form-product-cards");
  if (!container) return;
  container.innerHTML = renderFormProductCards(selectedId);
  bindFormProductCards();
}

function bindFormProductCards() {
  const container = document.getElementById("form-product-cards");
  if (!container) return;

  container.querySelectorAll('input[name="productId"]').forEach((input) => {
    input.addEventListener("change", () => {
      container.querySelectorAll(".product-radio-card").forEach((card) => {
        card.classList.toggle("is-selected", card.querySelector("input")?.checked);
      });
    });
  });
}

function openPickerModal() {
  const modal = document.getElementById("picker-modal");
  if (!modal || typeof openModal !== "function") return;
  openModal(modal);
}

function closePickerModal() {
  const modal = document.getElementById("picker-modal");
  if (modal && typeof closeModal === "function") closeModal(modal);
}

function initPicker() {
  const modal = document.getElementById("picker-modal");
  if (!modal) return;

  modal.querySelectorAll("[data-select-product]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-select-product");
      selectProduct(id);
      closePickerModal();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  document.querySelectorAll("[data-open-picker]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      openPickerModal();
    });
  });

  openPickerModal();
}

function getSelectedProductId() {
  const checked = document.querySelector('input[name="productId"]:checked');
  if (checked) return checked.value;
  return currentProductId || null;
}

function getSelectedProduct() {
  const id = getSelectedProductId();
  return id ? PRODUCTS[id] : null;
}

document.addEventListener("DOMContentLoaded", () => {
  const formCards = document.getElementById("form-product-cards");
  if (formCards) {
    formCards.innerHTML = renderFormProductCards(null);
    bindFormProductCards();
  }

  const pickerGrid = document.getElementById("picker-grid");
  if (pickerGrid) pickerGrid.innerHTML = renderPickerCards();

  initPicker();
});
