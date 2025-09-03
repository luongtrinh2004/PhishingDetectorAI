// File này có thể để trống hoặc chứa logic chung nếu cần
// scripts.js

// ---------- tiny DOM helper ----------
window.$el = function (tag, attrs, ...children) {
  const el = document.createElement(tag);
  if (attrs && typeof attrs === "object") {
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "class") el.className = v;
      else if (k === "dataset")
        Object.entries(v || {}).forEach(([dk, dv]) => (el.dataset[dk] = dv));
      else if (k.startsWith("on") && typeof v === "function")
        el.addEventListener(k.slice(2), v);
      else if (v != null) el.setAttribute(k, v);
    }
  }
  children
    .flat()
    .forEach((c) =>
      el.appendChild(c instanceof Node ? c : document.createTextNode(String(c)))
    );
  return el;
};

window.formatTime = function (iso) {
  try {
    const d = new Date(iso);
    return `${String(d.getHours()).padStart(2, "0")}:${String(
      d.getMinutes()
    ).padStart(2, "0")} ${String(d.getDate()).padStart(2, "0")}/${String(
      d.getMonth() + 1
    ).padStart(2, "0")}/${d.getFullYear()}`;
  } catch {
    return iso;
  }
};

// ---------- theme toggle ----------
(function themeInit() {
  const LS_KEY = "pd_theme";
  const root = document.documentElement;
  const saved = localStorage.getItem(LS_KEY);
  if (saved) root.setAttribute("data-theme", saved);
  const btn = document.getElementById("themeToggle");
  if (btn) {
    const syncIcon = () => {
      btn.textContent =
        root.getAttribute("data-theme") === "dark" ? "🌞" : "🌙";
    };
    syncIcon();
    btn.addEventListener("click", () => {
      const cur = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", cur);
      localStorage.setItem(LS_KEY, cur);
      syncIcon();
    });
  }
})();

// ---------- toast ----------
window.toast = function (msg, type = "info", timeout = 2600) {
  const wrap = document.getElementById("toast");
  const el = $el(
    "div",
    { class: `toast ${type === "error" ? "error" : ""}` },
    msg
  );
  wrap.appendChild(el);
  setTimeout(() => {
    el.style.opacity = "0";
    el.style.transform = "translateY(6px)";
  }, timeout);
  setTimeout(() => wrap.removeChild(el), timeout + 400);
};

// ---------- URL heuristics (client-side explainability) ----------
window.analyzeUrl = function (urlStr) {
  const chips = [];
  let score = 0; // 0..100 (cao = rủi ro)

  try {
    const u = new URL(urlStr);
    const host = u.hostname;

    const hasIP = /^[0-9.]+$/.test(host) || /^[0-9a-f:.]+$/.test(host);
    if (hasIP) {
      chips.push(["Dùng địa chỉ IP", "bad"]);
      score += 18;
    }

    const subCount = host.split(".").length - 1; // dấu chấm
    if (subCount >= 3) {
      chips.push(["Nhiều subdomain", "warn"]);
      score += 12;
    }

    if (host.includes("-")) {
      chips.push(["Domain có dấu gạch", "warn"]);
      score += 6;
    }

    if (urlStr.length > 90) {
      chips.push(["URL quá dài", "warn"]);
      score += 8;
    }

    if (urlStr.includes("@")) {
      chips.push(["Có ký tự @", "bad"]);
      score += 20;
    }

    const suspicious = [
      "login",
      "verify",
      "secure",
      "update",
      "wallet",
      "gift",
      "free",
    ];
    if (suspicious.some((k) => urlStr.toLowerCase().includes(k))) {
      chips.push(["Từ khóa nhạy cảm", "warn"]);
      score += 10;
    }

    if (u.protocol !== "https:") {
      chips.push(["Không dùng HTTPS", "bad"]);
      score += 16;
    }

    if (score <= 0) chips.push(["Không thấy dấu hiệu rõ ràng", "good"]);
  } catch {
    chips.push(["URL không hợp lệ", "bad"]);
    score = 50;
  }

  // Clamp
  score = Math.max(0, Math.min(100, score));
  return { chips, score };
};

// ---------- gauge creator ----------
window.createGauge = function (value, label = "Tin cậy") {
  const g = $el(
    "div",
    { class: "gauge", style: `--val:${value}` },
    $el("div", { class: "label" }, `${value}%`),
    $el("div", { class: "sub" }, label)
  );
  return g;
};
