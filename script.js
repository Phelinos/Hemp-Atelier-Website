const forms = document.querySelectorAll("[data-newsletter-form]");

forms.forEach((form) => {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = form.querySelector('input[name="email"]').value.trim();
    const consent = form.querySelector('input[name="consent"]').checked;
    const company =
      form.querySelector('input[name="company"]')?.value.trim() || "";

    const status = form.querySelector(".form-status");
    const button = form.querySelector('button[type="submit"]');

    if (!email || !consent) {
      if (status) {
        status.textContent = "Please enter your email and accept the signup.";
      }
      return;
    }

    button.disabled = true;
    button.textContent = "JOINING...";

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          consent,
          company
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Signup failed");
      }

      form.reset();

      if (status) {
        status.textContent = "You're on the list. See you at launch.";
      }
    } catch (error) {
      console.error(error);

      if (status) {
        status.textContent = "Something went wrong. Please try again.";
      }
    } finally {
      button.disabled = false;
      button.textContent = "SIGN UP";
    }
  });
});
