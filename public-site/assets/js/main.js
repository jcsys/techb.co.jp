document.addEventListener("DOMContentLoaded", () => {
  const t = document.querySelector(".nav-toggle");
  const n = document.querySelector(".site-nav");

  if (t && n) {
    t.addEventListener("click", () => {
      const o = n.classList.toggle("is-open");
      t.setAttribute("aria-expanded", String(o));
    });
  }

  document.querySelectorAll(".contact-form").forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const button = form.querySelector('button[type="submit"]');
      if (button.disabled) return;

      const formData = new FormData(form);

      const name = String(formData.get("name") || "").trim();
      const email = String(formData.get("email") || "").trim();
      const message = String(formData.get("message") || "").trim();
      const token = String(formData.get("cf-turnstile-response") || "");

      if (
        !name || name.length > 100 ||
        !/^[^\s@]+@[^\s@]+[.][^\s@]+$/.test(email) ||
        email.length > 254 ||
        !message || message.length > 5000
      ) {
        alert("入力内容をご確認ください。");
        return;
      }

      if (!token) {
        alert("認証を完了してください。");
        return;
      }

      const originalText = button.textContent;
      button.disabled = true;
      button.textContent = "送信中...";

      try {
        const response = await fetch(
          "https://techb-contact.zhanglt.workers.dev/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              name,
              email,
              message,
              token
            })
          }
        );

        const result = await response.json();

        if (response.ok && result.success) {
          alert("お問い合わせを受け付けました。ありがとうございます。");
          form.reset();
        } else {
          alert(result.message || "送信に失敗しました。");
        }

      } catch (error) {
        alert("通信エラーが発生しました。再度お試しください。");

      } finally {
        button.disabled = false;
        button.textContent = originalText;

        const widget = form.querySelector(".cf-turnstile");

        if (widget && window.turnstile) {
          window.turnstile.reset(widget);
        }
      }
    });
  });
});
