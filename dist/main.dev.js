"use strict";

var triggerUL = document.getElementById("trigger-ul");
var menu = document.getElementById("menu");
var Btn = document.getElementById("btn");
var BtnClicked = false;
var inputFields = document.querySelectorAll("input:not(.cc-input)");
var div = document.getElementById("div");
var outputContainer = document.getElementById("output-container");
var goToBottomBtn = document.getElementById("go-to-bottom");
var backToTopBtn = document.getElementById("back-to-top");
menu.style.color = "rgb(99, 129, 249)";

menu.onclick = function () {
  if (menu.style.color == "rgb(99, 129, 249)") {
    menu.style.color = "rgb(0,0,0)";
    triggerUL.style.display = "block";
  } else {
    menu.style.color = "rgb(99, 129, 249)";
    triggerUL.style.display = "none";
  }
};

function calculateInterest(startingBalance, annualRate, numberOfDays) {
  var initialStartingBalance = parseFormattedNumber(document.getElementById("starting-balance").value);
  var dailyRate = annualRate / (100 * 365);
  var totalInterest = 0;
  outputContainer.innerHTML = ""; // Clear existing content

  var _loop = function _loop(i) {
    var dailyInterest = startingBalance * dailyRate;
    totalInterest += dailyInterest;
    var paragraph = document.createElement("p");
    paragraph.textContent = "Day ".concat(i, " return : ").concat(dailyInterest.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    paragraph.style.color = "red";
    paragraph.style.margin = "10px 0";
    var paragraph2 = document.createElement("p");
    paragraph2.innerHTML = "Total return after day ".concat(i, " :<br>").concat(totalInterest.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    paragraph2.style.color = "darkgreen";
    paragraph2.style.margin = "5px 0";
    var paragraph3 = document.createElement("p");
    paragraph3.innerHTML = "Total Account Balance :<br>".concat((initialStartingBalance + totalInterest).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    paragraph3.style.color = "black";
    outputContainer.appendChild(paragraph);
    outputContainer.appendChild(paragraph2);
    outputContainer.appendChild(paragraph3);
    var hr = document.createElement("hr");
    hr.style.margin = "5px auto";
    hr.style.border = "1px solid rgb(0 206 185)";

    function adjustHrWidth() {
      // Check if viewport width is less than or equal to 767px
      if (window.innerWidth <= 767) {
        // Set the width of <hr> element to 80%
        hr.style.width = "80%";
      } else {
        // For viewport widths greater than 767px, set the width to auto or any other value you prefer
        hr.style.width = "60%";
      }
    }

    adjustHrWidth();
    window.addEventListener("resize", adjustHrWidth);
    outputContainer.appendChild(hr);
    startingBalance += dailyInterest;
  };

  for (var i = 1; i <= numberOfDays; i++) {
    _loop(i);
  }

  outputContainer.style.display = "block";
  outputContainer.style.margin = "auto";
  var firstChild = outputContainer.firstElementChild;

  if (firstChild) {
    firstChild.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }
}

function formatNumberWithCommas(value) {
  if (!isNaN(value) && value !== "") {
    var parts = value.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }

  return value;
}

function parseFormattedNumber(value) {
  return parseFloat(value.replace(/,/g, ""));
}

inputFields.forEach(function (input) {
  input.oninput = function () {
    // Allow only numbers and a single dot
    var cursorPosition = this.selectionStart;
    var originalValue = this.value; // Remove all non-numeric characters except for the first dot

    var newValue = originalValue.replace(/[^0-9.]/g, "");
    var parts = newValue.split(".");

    if (parts.length > 2) {
      newValue = parts[0] + "." + parts.slice(1).join("");
    }

    this.value = formatNumberWithCommas(newValue); // Correct cursor position

    var newLength = this.value.length;
    cursorPosition += newLength - originalValue.length;
    this.setSelectionRange(cursorPosition, cursorPosition); // Remove error state if input is corrected

    this.classList.remove("error");
    var errorMessage = this.nextElementSibling;

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
  var startingBalance = parseFormattedNumber(document.getElementById("starting-balance").value);
  var annualRate = parseFormattedNumber(document.getElementById("rate-percentage").value);
  var numberOfDays = parseFormattedNumber(document.getElementById("number-of-days").value);
  var isValid = true;
  var firstInvalidInput = null; // Validation

  inputFields.forEach(function (input) {
    var value = parseFormattedNumber(input.value);

    if (isNaN(value) || value <= 0) {
      input.classList.add("error");
      isValid = false; // Focus on the first invalid input field

      if (!firstInvalidInput) {
        firstInvalidInput = input;
      } // Show error message


      var errorMessage = input.nextElementSibling;

      if (!errorMessage || !errorMessage.classList.contains("error-message")) {
        errorMessage = document.createElement("div");
        errorMessage.classList.add("error-message");
        input.parentNode.insertBefore(errorMessage, input.nextSibling);
      }

      errorMessage.style.display = "block";
      outputContainer.innerHTML = "";
      outputContainer.style.display = "none";
    } else {
      input.classList.remove("error");
      var _errorMessage = input.nextElementSibling;

      if (_errorMessage && _errorMessage.classList.contains("error-message")) {
        _errorMessage.style.display = "none";
      }
    }
  });

  if (!isValid) {
    // Focus on the first invalid input field
    if (firstInvalidInput) {
      firstInvalidInput.focus();
    }

    goToBottomBtn.style.display = "none";
    backToTopBtn.style.display = "none";
    div.style.display = "none";
    return;
  }

  sessionStorage.setItem("Starting_Balance", startingBalance);
  sessionStorage.setItem("Annual_Rate", annualRate);
  sessionStorage.setItem("Number_Of_Days", numberOfDays);
  calculateInterest(startingBalance, annualRate, numberOfDays); // Show the div

  div.style.display = "block"; // Show the footer

  document.getElementById("footer").style.display = "block";
};

window.onload = function () {
  var startingBalance = sessionStorage.getItem("Starting_Balance");
  var annualRate = sessionStorage.getItem("Annual_Rate");
  var numberOfDays = sessionStorage.getItem("Number_Of_Days");

  if (startingBalance) {
    document.getElementById("starting-balance").value = formatNumberWithCommas(startingBalance);
  }

  if (annualRate) {
    document.getElementById("rate-percentage").value = formatNumberWithCommas(annualRate);
  }

  if (numberOfDays) {
    document.getElementById("number-of-days").value = formatNumberWithCommas(numberOfDays);
  }
}; // Scroll event listener to hide/show the back-to-top button


window.onscroll = function () {
  if (BtnClicked) {
    var startingBalance = parseFormattedNumber(document.getElementById("starting-balance").value);
    var annualRate = parseFormattedNumber(document.getElementById("rate-percentage").value);
    var numberOfDays = parseFormattedNumber(document.getElementById("number-of-days").value);
    var isValid = !(isNaN(startingBalance) || startingBalance <= 0 || isNaN(annualRate) || annualRate <= 0 || isNaN(numberOfDays) || numberOfDays <= 0);

    if (!isValid) {
      backToTopBtn.style.display = "none";
      goToBottomBtn.style.display = "none";
      div.style.display = "none";
      return;
    }

    if (window.scrollY > 200) {
      backToTopBtn.style.display = "block";
      div.style.display = "none"; // Hide the div when scrolling beyond 300 pixels
    } else {
      backToTopBtn.style.display = "none";
      div.style.display = "block"; // Show the div when scrolling back up
    }

    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50) {
      goToBottomBtn.style.display = "none";
    } else {
      goToBottomBtn.style.display = "block";
    }
  }
};

div.onclick = function () {
  outputContainer.scrollIntoView({
    behavior: "smooth"
  });
  div.style.display = "none";
};

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

backToTopBtn.addEventListener("click", scrollToTop);

function scrollToBottom() {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: "smooth"
  });
}

goToBottomBtn.addEventListener("click", scrollToBottom);
window.addEventListener("scroll", function () {
  // Check if user has scrolled to the bottom of the page and the window width is under 520px
  if (window.innerWidth <= 520 && window.innerHeight + window.scrollY >= document.body.offsetHeight - 35) {
    // User has scrolled to the bottom and the window width is under 520px, reduce opacity of the background
    backToTopBtn.style.backgroundColor = "rgba(99, 129, 249, 0.6)"; // Adjust the rgba values as needed

    backToTopBtn.style.color = "rgba(255,255,255,0.4)";
  } else {
    // User is not at the bottom or the window width is over 520px, reset background color to original
    backToTopBtn.style.backgroundColor = "#6381f9"; // Original background color

    backToTopBtn.style.color = "rgba(255,255,255,1)";
  }
});