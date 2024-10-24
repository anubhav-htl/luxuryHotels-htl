const form = document.getElementById("payment-form");
let paymentMethod = "";
const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
const stripeContainer = document.getElementById("stripe-button-container");
const paypalContainer = document.getElementById("paypal-button-container");
const coinbaseContainer = document.getElementById("coinbase-button-container");

const updatePaymentMethod = (value) => {
  console.log(`Selected Payment Method: ${value}`); // Debugging log

  switch (value) {
    case "stripe":
      form.action = "/hotels/process-stripe-payment";
      stripeContainer.style.display = "block";
      paypalContainer.style.display = "none";
      coinbaseContainer.style.display = "none";
      paymentMethod = value;
      break;
    case "paypal":
      paymentMethod = "paypal";
      form.action = "/hotels/process-paypal-payment";
      stripeContainer.style.display = "none";
      coinbaseContainer.style.display = "none";
      paypalContainer.style.display = "block";
      break;
    case "coinbase":
      paymentMethod = "coinbase";
      form.action = "/hotels/create-coinbase-payment";
      coinbaseContainer.style.display = "block";
      stripeContainer.style.display = "none";
      paypalContainer.style.display = "none";
      break;
  }

  console.log(`Form Action Set To: ${form.action}`); // Debugging log
};

paymentMethods.forEach((radio) => {
  if (radio.checked) {
    updatePaymentMethod(radio.value);
  }

  radio.addEventListener("change", function () {
    if (this.checked) {
      updatePaymentMethod(this.value);
    }
  });
});

paypal
  .Buttons({
    createOrder: async (data, actions) => {
      const transactionId = document.getElementById("transaction").value;

      const response = await fetch("/hotels/process-paypal-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "CSRF-TOKEN": document.getElementById("_csrfToken").value,
        },
        body: JSON.stringify({
          transaction: transactionId,
          cardholder_first_name: document.getElementById("firstName").value,
          cardholder_last_name: document.getElementById("lastName").value,
          cardholder_email: document.getElementById("email").value,
          cardholder_country: document.getElementById("country").value,
          cardholder_telephone: document.getElementById("telephone").value,
          paymentMethod: paymentMethod,
        }),
      });
      const orderData = await response.json();
      console.log(orderData);
      return orderData.id;
    },
    onApprove: async (data, actions) => {
      const response = await fetch("/hotels/capture-paypal-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "CSRF-TOKEN": document.getElementById("_csrfToken").value,
        },
        body: JSON.stringify({ orderID: data.orderID }),
      });
      const captureData = await response.json();
      if (captureData.status === "COMPLETED") {
        window.location.href = "/hotels/update-post-payment-tables";
      } else {
        window.location.href = "/hotels/cancel-payment";
      }
    },
  })
  .render("#paypal-button-container");
