"use strict";


/* =========================================================
 *  NEWSLETTER
 *  ========================================================= */

const newsletterForms = document.querySelectorAll(
    "[data-newsletter-form]"
);


newsletterForms.forEach((form) => {

    form.addEventListener("submit", async (event) => {

        event.preventDefault();


        const emailInput =
        form.querySelector('input[name="email"]');

                          const consentInput =
                          form.querySelector('input[name="consent"]');

                          const honeypotInput =
                          form.querySelector('input[name="company"]');

                          const submitButton =
                          form.querySelector('button[type="submit"]');

                          const statusElement =
                          form.querySelector(".form-status");


                          const email =
                          emailInput.value.trim();

                          const consent =
                          consentInput.checked;

                          const company =
                          honeypotInput.value.trim();


                          statusElement.textContent = "";
                          statusElement.className = "form-status";


                          /* Basic frontend validation */

                          if (!email) {

                              showFormError(
                                  statusElement,
                                  "Please enter your email address."
                              );

                              emailInput.focus();

                              return;
                          }


                          if (!isValidEmail(email)) {

                              showFormError(
                                  statusElement,
                                  "Please enter a valid email address."
                              );

                              emailInput.focus();

                              return;
                          }


                          if (!consent) {

                              showFormError(
                                  statusElement,
                                  "Please confirm that you would like to join the mailing list."
                              );

                              consentInput.focus();

                              return;
                          }


                          /* Submit */

                          submitButton.disabled = true;

                          const originalButtonText =
                          submitButton.textContent;

                          submitButton.textContent =
                          "JOINING...";


    try {

        const response =
        await fetch("/api/subscribe", {

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


        const result =
        await response.json().catch(() => ({}));


        if (!response.ok) {

            throw new Error(
                result.message ||
                "Unable to subscribe."
            );

        }


        form.reset();

                          statusElement.textContent =
                          "You're on the list. See you at launch.";

        statusElement.classList.add("success");


    } catch (error) {

        console.error(
            "Newsletter signup failed:",
            error
        );


        showFormError(
            statusElement,
            "Something went wrong. Please try again."
        );

    } finally {

        submitButton.disabled = false;

        submitButton.textContent =
        originalButtonText;

    }

    });

});


function isValidEmail(email) {

    if (
        typeof email !== "string" ||
        email.length > 254
    ) {

        return false;

    }


    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
    );

}


function showFormError(
    element,
    message
) {

    element.textContent = message;

    element.classList.add("error");

}



/* =========================================================
 *  PRIVACY MODAL
 *  ========================================================= */

const privacyModal =
document.getElementById("privacy-modal");

const privacyOpen =
document.getElementById("privacy-open");

const privacyCloseButtons =
document.querySelectorAll(
    "[data-close-privacy]"
);


if (
    privacyModal &&
    privacyOpen
) {

    privacyOpen.addEventListener(
        "click",
        openPrivacy
    );


    privacyCloseButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                closePrivacy
            );

        }
    );


    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape" &&
                privacyModal.classList.contains("open")
            ) {

                closePrivacy();

            }

        }
    );

}


function openPrivacy() {

    privacyModal.classList.add("open");

    privacyModal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add(
        "modal-open"
    );

}


function closePrivacy() {

    privacyModal.classList.remove("open");

    privacyModal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.classList.remove(
        "modal-open"
    );

}



/* =========================================================
 *  COPYRIGHT YEAR
 *  ========================================================= */

const currentYear =
document.getElementById("current-year");


if (currentYear) {

    currentYear.textContent =
    new Date().getFullYear();

}
