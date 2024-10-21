let Btn = document.getElementById("btn");
let BtnClicked = false;
let inputFields = document.querySelectorAll("input"); //:not(.cc-input)
let outputContainer = document.getElementById("output-container");
function calculateStartingBalance(firstDayReturn, annualRate) {
  outputContainer.innerHTML = ""; // Clear existing content
  firstDayReturn = parseFormattedNumber(
    document.getElementById("first-day-return").value
  );
  annualRate = parseFormattedNumber(
    document.getElementById("rate-percentage").value
  );
  // Calculate the daily rate from the annual rate
  let dailyRate = annualRate / (100 * 365);

  // Calculate the starting balance using the reversed formula
  let startingBalance = firstDayReturn / dailyRate;

  //   return startingBalance;
  let paragraph = document.createElement("p");
  paragraph.textContent = `Your Starting balance must be : ${startingBalance
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  paragraph.style.color = "rgb(99, 129, 249)";
  outputContainer.appendChild(paragraph);
  outputContainer.style.display = "block";
  outputContainer.style.margin = "20px auto";
  let firstChild = outputContainer.firstElementChild;
  if (firstChild) {
    firstChild.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

function formatNumberWithCommas(value) {
  if (!isNaN(value) && value !== "") {
    let parts = value.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }
  return value;
}

function parseFormattedNumber(value) {
  return parseFloat(value.replace(/,/g, ""));
}

inputFields.forEach((input) => {
  input.oninput = function () {
    // Allow only numbers and a single dot
    let cursorPosition = this.selectionStart;
    let originalValue = this.value;

    // Remove all non-numeric characters except for the first dot
    let newValue = originalValue.replace(/[^0-9.]/g, "");
    let parts = newValue.split(".");
    if (parts.length > 2) {
      newValue = parts[0] + "." + parts.slice(1).join("");
    }

    this.value = formatNumberWithCommas(newValue);

    // Correct cursor position
    let newLength = this.value.length;
    cursorPosition += newLength - originalValue.length;
    this.setSelectionRange(cursorPosition, cursorPosition);

    // Remove error state if input is corrected
    this.classList.remove("error");
    let errorMessage = this.nextElementSibling;
    if (errorMessage && errorMessage.classList.contains("error-message")) {
      errorMessage.style.display = "none";
    }
  };
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault(); // Prevent form submission or other default actions
    Btn.click();
  }
});

Btn.onclick = function () {
  BtnClicked = true;

  let firstDayReturn = parseFormattedNumber(
    document.getElementById("first-day-return").value
  );
  let annualRate = parseFormattedNumber(
    document.getElementById("rate-percentage").value
  );

  let isValid = true;
  let firstInvalidInput = null;

  // Validation
  inputFields.forEach((input) => {
    let value = parseFormattedNumber(input.value);
    if (isNaN(value) || value <= 0) {
      input.classList.add("error");
      isValid = false;

      if (!firstInvalidInput) {
        firstInvalidInput = input;
      }

      let errorMessage = input.nextElementSibling;
      if (!errorMessage || !errorMessage.classList.contains("error-message")) {
        errorMessage = document.createElement("div");
        errorMessage.classList.add("error-message");
        input.parentNode.insertBefore(errorMessage, input.nextSibling);
      }
      errorMessage.style.display = "block";
    } else {
      input.classList.remove("error");
      let errorMessage = input.nextElementSibling;
      if (errorMessage && errorMessage.classList.contains("error-message")) {
        errorMessage.style.display = "none";
      }
    }
  });
  if (!isValid && firstInvalidInput) {
    firstInvalidInput.focus();
  } else {
    calculateStartingBalance(firstDayReturn, annualRate);
  }
};
