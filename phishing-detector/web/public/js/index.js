// index.js – Trang chính

(function () {
  const root = document.getElementById("app");

  // ---------- Form card ----------
  const card = $el(
    "div",
    { class: "card" },
    $el(
      "div",
      { class: "card-body grid" },
      $el(
        "div",
        null,
        $el(
          "label",
          { for: "url", class: "muted" },
          "Dán đường link cần kiểm tra"
        ),
        $el(
          "div",
          {
            class: "grid",
            style:
              "grid-template-columns: 1fr auto; gap: 10px; margin-top:8px;",
          },
          $el("input", {
            id: "url",
            class: "input",
            type: "url",
            placeholder: "https://example.com/login",
            autocomplete: "off",
            spellcheck: "false",
          }),
          $el(
            "button",
            {
              id: "pasteBtn",
              class: "btn ghost",
              type: "button",
              onclick: onPaste,
            },
            "Dán"
          )
        ),
        $el("div", { id: "chips", class: "chips", style: "margin-top:10px;" })
      ),
      $el(
        "div",
        null,
        $el(
          "div",
          {
            class: "grid",
            style: "grid-template-columns: 160px 1fr; gap: 12px;",
          },
          $el("div", {
            id: "gaugeBox",
            class: "skeleton",
            style: "width:180px; height:180px; border-radius:50%;",
          }),
          $el(
            "div",
            null,
            $el("div", { id: "aiResult", class: "grid", style: "gap:8px;" }),
            $el(
              "div",
              {
                class: "grid",
                style:
                  "grid-template-columns:auto auto; gap:10px; margin-top:8px;",
              },
              $el(
                "button",
                {
                  id: "checkBtn",
                  class: "btn primary",
                  type: "button",
                  onclick: onCheck,
                },
                "Kiểm tra bằng AI"
              ),
              $el("a", { class: "btn", href: "/history" }, "Xem lịch sử")
            )
          )
        )
      )
    )
  );

  root.appendChild(card);

  // init gauge placeholder
  setGauge(0, "Tin cậy");

  // live heuristic on input
  const urlInput = document.getElementById("url");
  urlInput.addEventListener("input", updateHeuristics);
  updateHeuristics();

  // ---------- functions ----------
  async function onPaste() {
    if (!navigator.clipboard) {
      toast("Trình duyệt không hỗ trợ dán.", "error");
      return;
    }
    try {
      const text = await navigator.clipboard.readText();
      urlInput.value = text.trim();
      updateHeuristics();
    } catch {
      toast("Không thể đọc clipboard.", "error");
    }
  }

  function updateHeuristics() {
    const { chips, score } = analyzeUrl(urlInput.value.trim());
    const wrap = document.getElementById("chips");
    wrap.replaceChildren(
      ...chips.map(([label, type]) =>
        $el("span", { class: `chip ${type}` }, label)
      )
    );

    // Khi chưa có AI: gauge hiển thị “ước tính rủi ro” từ heuristic đảo chiều → tin cậy
    const trust = Math.max(0, 100 - score);
    setGauge(trust, "Tin cậy (ước tính)");
  }

  async function onCheck() {
    const url = urlInput.value.trim();
    if (!url) {
      toast("Vui lòng nhập URL.", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/check-phishing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      if (!res.ok) throw new Error("API lỗi");
      const data = await res.json();

      const trust = Math.max(
        0,
        Math.min(100, Math.round(100 - Number(data.confidence || 0)))
      );
      setGauge(100 - trust, data.isPhishing ? "Rủi ro (AI)" : "Tin cậy (AI)");

      const aiBox = document.getElementById("aiResult");
      aiBox.replaceChildren(
        $el("div", null, "URL: ", $el("code", null, data.url || url)),
        $el(
          "div",
          null,
          "Kết luận: ",
          data.isPhishing
            ? $el("span", { class: "badge danger" }, "Phishing")
            : $el("span", { class: "badge success" }, "Hợp lệ")
        ),
        $el(
          "div",
          { class: "muted" },
          "Độ tin cậy AI: ",
          isFinite(data.confidence) ? `${data.confidence}%` : "N/A"
        ),
        $el(
          "div",
          { class: "muted" },
          "Thời điểm: ",
          formatTime(data.timestamp)
        )
      );
    } catch (e) {
      toast("Không gọi được AI backend.", "error");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function setGauge(value, label) {
    const box = document.getElementById("gaugeBox");
    const gauge = createGauge(Math.round(value), label);
    box.classList.remove("skeleton");
    box.replaceChildren(gauge);
  }

  function setLoading(state) {
    const btn = document.getElementById("checkBtn");
    btn.disabled = state;
    btn.textContent = state ? "Đang kiểm tra..." : "Kiểm tra bằng AI";
  }
})();
