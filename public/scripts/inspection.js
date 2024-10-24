const dateRows = document.querySelectorAll(".date-row");

dateRows.forEach((row, index) => {
  const fromInput = row.querySelector(`[id^=from_date_${index + 1}]`);
  const toInput = row.querySelector(`[id^=to_date_${index + 1}]`);

  flatpickr(fromInput, {
    altInput: true,
    altFormat: "F j, Y",
    dateFormat: "Y-m-d",
    onChange: function (selectedDates, dateStr, instance) {
      toInput._flatpickr.set("minDate", dateStr);
    },
  });

  flatpickr(toInput, {
    altInput: true,
    allowInput: true,
    altFormat: "F j, Y",
    dateFormat: "Y-m-d",
    onChange: function (selectedDates, dateStr, instance) {
      fromInput._flatpickr.set("maxDate", dateStr);
    },
  });
});

document
  .getElementById("hoteldetails")
  .addEventListener("submit", function (e) {
    let valid = true;

    function validateField(field) {
      if (!field.value.trim()) {
        field.classList.add("is-invalid");
        valid = false;
      } else {
        field.classList.remove("is-invalid");
      }
    }

    validateField(document.getElementById("from_date_1_mandatory"));
    validateField(document.getElementById("to_date_1_mandatory"));
    validateField(document.getElementById("telephone"));
    validateField(document.getElementById("description"));

    if (!valid) {
      e.preventDefault();
    }
  });

const style = document.createElement("style");
style.innerHTML = `
  .is-invalid {
    border: 1px solid red !important;
  }
`;

document.head.appendChild(style);
