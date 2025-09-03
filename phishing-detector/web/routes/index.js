// routes/index.js
const express = require("express");
const axios = require("axios");
const router = express.Router();

let history = [];

/* ---------------- Trang chính ---------------- */
router.get("/", (_req, res) => {
  res.send(`<!doctype html>
<html lang="vi" data-theme="light">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="light dark">
  <title>Phishing Detector · AI</title>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <header class="topbar">
    <div class="container row-between">
      <div class="brand">
        <svg viewBox="0 0 24 24" aria-hidden="true" class="brand-icon"><path d="M12 2l8 4v6c0 5-3.4 9.7-8 10-4.6-.3-8-5-8-10V6l8-4z" fill="currentColor"/></svg>
        <span class="brand-name">PhishingDetector<span class="dot">·AI</span></span>
      </div>
      <nav class="actions">
        <a class="btn ghost" href="/history">Lịch sử</a>
        <button id="themeToggle" class="btn ghost" aria-label="Đổi giao diện">🌙</button>
      </nav>
    </div>
  </header>

  <main class="container">
    <section class="hero">
      <h1>Kiểm tra đường link nghi ngờ</h1>
      <p class="sub">Phát hiện dấu hiệu giả mạo, đánh giá rủi ro bằng AI & heuristic thông minh.</p>
    </section>

    <div id="app"></div>
  </main>

  <footer class="footer">
    <div class="container">BTL Bảo Mật Ứng Dụng – Demo phát hiện phishing bằng AI</div>
  </footer>

  <div id="toast"></div>

  <script src="/js/scripts.js"></script>
  <script src="/js/index.js"></script>
</body>
</html>`);
});

/* ---------------- Trang lịch sử ---------------- */
router.get("/history", (_req, res) => {
  res.send(`<!doctype html>
<html lang="vi" data-theme="light">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="light dark">
  <title>Lịch sử kiểm tra · AI</title>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <header class="topbar">
    <div class="container row-between">
      <div class="brand">
        <svg viewBox="0 0 24 24" aria-hidden="true" class="brand-icon"><path d="M12 2l8 4v6c0 5-3.4 9.7-8 10-4.6-.3-8-5-8-10V6l8-4z" fill="currentColor"/></svg>
        <span class="brand-name">PhishingDetector<span class="dot">·AI</span></span>
      </div>
      <nav class="actions">
        <a class="btn ghost" href="/">Trang chủ</a>
        <button id="themeToggle" class="btn ghost" aria-label="Đổi giao diện">🌙</button>
      </nav>
    </div>
  </header>

  <main class="container">
    <section class="hero compact">
      <h1>Lịch sử kiểm tra</h1>
      <p class="sub">Lưu tạm trong bộ nhớ server (reset khi restart).</p>
    </section>

    <div id="history-root"></div>
  </main>

  <footer class="footer">
    <div class="container">BTL Bảo Mật Ứng Dụng – Demo phát hiện phishing bằng AI</div>
  </footer>

  <div id="toast"></div>

  <script src="/js/scripts.js"></script>
  <script src="/js/history.js"></script>
</body>
</html>`);
});

/* ---------------- API JSON ---------------- */
router.get("/api/history", (_req, res) => {
  res.json(history);
});

router.post("/check-phishing", async (req, res) => {
  const url = (req.body && req.body.url) || "";
  try {
    const ai = await axios.post("http://localhost:5000/predict", { url });
    const result = {
      url,
      isPhishing: Boolean(ai?.data?.isPhishing),
      confidence: Number(ai?.data?.confidence ?? 0),
      timestamp: new Date().toISOString(),
    };
    history.push(result);
    res.json(result);
  } catch (err) {
    console.error("AI error:", err?.message || err);
    res.status(500).json({ error: "Lỗi khi kiểm tra URL với AI backend" });
  }
});

module.exports = router;
