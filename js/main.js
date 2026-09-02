/**
 * Ortanes BHA3000 landing — modals, form, scroll reveal
 *
 * آدرس وب‌هوک n8n را در ثابت زیر بگذارید.
 * نمونه: https://your-n8n.example.com/webhook/xxxx
 */
const N8N_WEBHOOK_URL =
  "https://n8n.alecasgari.com/webhook/83591aad-47e3-475b-99a9-2f3d6d408e00";

/** مقادیر پیش‌فرض وقتی لینک UTM نداشته باشد */
const TRACKING_DEFAULTS = {
  campaign: "Ortanes-CBC",
  source: "SMS",
  medium: "SMS Marketing",
  product: "GETEIN BHA3000",
  company: "Sana Shafabakhsh Raspina",
};

/**
 * campaign / source / medium از UTM خوانده می‌شوند.
 * اگر در URL نباشند، همان مقادیر پیش‌فرض (SMS) ارسال می‌شود.
 */
function getTrackingFields() {
  const params = new URLSearchParams(window.location.search);
  const pick = (keys, fallback) => {
    for (const key of keys) {
      const value = params.get(key);
      if (value && value.trim()) return value.trim();
    }
    return fallback;
  };

  const selected =
    typeof getSelectedProduct === "function" ? getSelectedProduct() : null;

  return {
    campaign: pick(
      ["utm_campaign", "campaign"],
      selected?.campaign || TRACKING_DEFAULTS.campaign
    ),
    source: pick(["utm_source", "source"], TRACKING_DEFAULTS.source),
    medium: pick(["utm_medium", "medium"], TRACKING_DEFAULTS.medium),
    content: pick(["utm_content", "content"], ""),
    term: pick(["utm_term", "term"], ""),
    product: selected?.name || TRACKING_DEFAULTS.product,
    company: TRACKING_DEFAULTS.company,
  };
}

function $(sel, root = document) {
  return root.querySelector(sel);
}

function openModal(modal) {
  if (!modal) return;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  if (!$(".modal.is-open")) {
    document.body.classList.remove("modal-open");
  }
}

function openFormModal() {
  const formModal = $("#form-modal");
  const thankModal = $("#thank-modal");
  closeModal(thankModal);
  if (typeof updateFormProductCards === "function" && typeof getSelectedProductId === "function") {
    const id = getSelectedProductId();
    if (id) updateFormProductCards(id);
  }
  openModal(formModal);
  const first = $("#fullName");
  if (first) setTimeout(() => first.focus(), 50);
}

function closeFormModal() {
  closeModal($("#form-modal"));
}

function openThankModal() {
  closeFormModal();
  openModal($("#thank-modal"));
  const closeBtn = $("#modal-close");
  if (closeBtn) setTimeout(() => closeBtn.focus(), 50);
}

function closeThankModal() {
  closeModal($("#thank-modal"));
}

function setLoading(btn, loading) {
  if (!btn) return;
  btn.disabled = loading;
  const spinner = btn.querySelector(".spinner");
  const label = btn.querySelector(".btn-label");
  if (spinner) spinner.hidden = !loading;
  if (label) label.textContent = loading ? "در حال ارسال..." : "درخواست مشاوره رایگان";
}

/**
 * فقط وقتی پاسخ وب‌هوک موفق باشد true برمی‌گرداند.
 * - HTTP باید 2xx باشد
 * - اگر بدنه JSON باشد و success/ok صریحاً false باشد → شکست
 */
async function submitLead(payload) {
  if (!N8N_WEBHOOK_URL || N8N_WEBHOOK_URL.includes("YOUR_")) {
    throw new Error("آدرس وب‌هوک n8n هنوز تنظیم نشده است.");
  }

  const res = await fetch(N8N_WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("ارسال درخواست با خطا روبه‌رو شد. لطفاً دوباره تلاش کنید.");
  }

  const text = (await res.text()).trim();
  if (!text) return true;

  try {
    const data = JSON.parse(text);
    if (data.success === false || data.ok === false || data.error) {
      const msg =
        typeof data.error === "string"
          ? data.error
          : data.message || "پاسخ وب‌هوک ناموفق بود.";
      throw new Error(msg);
    }
  } catch (err) {
    if (err instanceof SyntaxError) {
      // بدنه غیر JSON ولی HTTP موفق — برای n8n قابل قبول است
      return true;
    }
    throw err;
  }

  return true;
}

function containsPersianDigits(value) {
  return /[۰-۹٠-٩]/.test(String(value));
}

function sanitizeMobileInput(value) {
  return String(value).replace(/[^0-9]/g, "").slice(0, 11);
}

let mobileHintTimer = null;

function showMobileKeyboardHint(hintEl) {
  if (!hintEl) return;
  hintEl.hidden = false;
  clearTimeout(mobileHintTimer);
  mobileHintTimer = setTimeout(() => {
    hintEl.hidden = true;
  }, 5000);
}

function applyMobileInput(mobileInput, hintEl, rawValue) {
  if (containsPersianDigits(rawValue)) {
    showMobileKeyboardHint(hintEl);
  }
  const cleaned = sanitizeMobileInput(rawValue);
  if (mobileInput.value !== cleaned) mobileInput.value = cleaned;
}

function initForm() {
  const form = $("#lead-form-el");
  if (!form) return;

  const errorEl = $("#form-error");
  const submitBtn = $("#form-submit");
  const mobileInput = $("#mobile");
  const mobileHint = $("#mobile-keyboard-hint");

  if (mobileInput) {
    mobileInput.addEventListener("beforeinput", (e) => {
      if (e.inputType === "insertText" && e.data && !/^[0-9]*$/.test(e.data)) {
        e.preventDefault();
        if (containsPersianDigits(e.data)) showMobileKeyboardHint(mobileHint);
      }
    });

    mobileInput.addEventListener("input", () => {
      applyMobileInput(mobileInput, mobileHint, mobileInput.value);
    });

    mobileInput.addEventListener("keypress", (e) => {
      if (e.ctrlKey || e.metaKey || e.key.length !== 1) return;
      if (!/[0-9]/.test(e.key)) {
        e.preventDefault();
        if (containsPersianDigits(e.key)) showMobileKeyboardHint(mobileHint);
      }
    });

    mobileInput.addEventListener("compositionend", () => {
      applyMobileInput(mobileInput, mobileHint, mobileInput.value);
    });

    mobileInput.addEventListener("paste", (e) => {
      e.preventDefault();
      const text = (e.clipboardData || window.clipboardData).getData("text");
      const start = mobileInput.selectionStart ?? mobileInput.value.length;
      const end = mobileInput.selectionEnd ?? mobileInput.value.length;
      const merged = mobileInput.value.slice(0, start) + text + mobileInput.value.slice(end);
      applyMobileInput(mobileInput, mobileHint, merged);
    });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (errorEl) errorEl.textContent = "";

    const data = new FormData(form);
    const fullName = String(data.get("fullName") || "").trim();
    const labName = String(data.get("labName") || "").trim();
    const mobile = sanitizeMobileInput(data.get("mobile") || "");

    if (mobileInput) mobileInput.value = mobile;

    if (!fullName) {
      if (errorEl) errorEl.textContent = "نام و نام خانوادگی الزامی است.";
      return;
    }
    if (!labName) {
      if (errorEl) errorEl.textContent = "نام آزمایشگاه الزامی است.";
      return;
    }
    if (!/^09\d{9}$/.test(mobile)) {
      if (errorEl) {
        errorEl.textContent =
          "شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود. مثال: 09123456789";
      }
      return;
    }

    const selectedProduct =
      typeof getSelectedProduct === "function" ? getSelectedProduct() : null;
    if (!selectedProduct) {
      if (errorEl) errorEl.textContent = "لطفاً محصول مورد نظر را انتخاب کنید.";
      return;
    }

    const payload = {
      fullName,
      labName,
      mobile,
      ...getTrackingFields(),
      submittedAt: new Date().toISOString(),
      pageUrl: window.location.href,
    };

    setLoading(submitBtn, true);

    try {
      await submitLead(payload);
      form.reset();
      openThankModal();
    } catch (err) {
      if (errorEl) {
        errorEl.textContent =
          err instanceof Error ? err.message : "خطای ناشناخته در ارسال فرم.";
      }
    } finally {
      setLoading(submitBtn, false);
    }
  });
}

function initModals() {
  document.querySelectorAll("[data-open-form]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const errorEl = $("#form-error");
      if (errorEl) errorEl.textContent = "";
      if ($("#mobile-keyboard-hint")) $("#mobile-keyboard-hint").hidden = true;
      openFormModal();
    });
  });

  document.querySelectorAll("[data-close-form]").forEach((el) => {
    el.addEventListener("click", closeFormModal);
  });

  document.querySelectorAll("[data-close-thank]").forEach((el) => {
    el.addEventListener("click", closeThankModal);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    const picker = $("#picker-modal");
    const thank = $("#thank-modal");
    const formModal = $("#form-modal");
    if (thank && thank.classList.contains("is-open")) {
      closeThankModal();
    } else if (formModal && formModal.classList.contains("is-open")) {
      closeFormModal();
    } else if (
      picker &&
      picker.classList.contains("is-open") &&
      typeof getSelectedProductId === "function" &&
      getSelectedProductId()
    ) {
      if (typeof closePickerModal === "function") closePickerModal();
    }
  });
}

function initReveal(root = document) {
  const items = root.querySelectorAll(".reveal");
  if (!items.length) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  items.forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i % 6, 5) * 40}ms`;
    io.observe(el);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initForm();
  initModals();
  initReveal();
});
