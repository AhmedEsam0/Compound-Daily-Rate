"use strict";

var triggerUL = document.getElementById("trigger-ul");
var menu = document.getElementById("menu");
var fromAmountEl = document.getElementById("from-amount");
var fromCurrencyEl = document.getElementById("from-currency");
var toAmountEl = document.getElementById("to-amount");
var toCurrencyEl = document.getElementById("to-currency");
var swapButtonEl = document.querySelector(".swap");
var rateContainerEl = document.querySelector(".rate-container");
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

var conversionRates = {};

function fetchRates(fromCurr) {
  var response, data;
  return regeneratorRuntime.async(function fetchRates$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(fetch("https://v6.exchangerate-api.com/v6/1469b81e4f01a05326bfe467/latest/".concat(fromCurr)));

        case 2:
          response = _context.sent;
          _context.next = 5;
          return regeneratorRuntime.awrap(response.json());

        case 5:
          data = _context.sent;
          conversionRates[fromCurr] = data.conversion_rates;

        case 7:
        case "end":
          return _context.stop();
      }
    }
  });
}

function calculate() {
  var fromCurr, toCurr, rate;
  return regeneratorRuntime.async(function calculate$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          fromCurr = fromCurrencyEl.value;
          toCurr = toCurrencyEl.value;

          if (conversionRates[fromCurr]) {
            _context2.next = 5;
            break;
          }

          _context2.next = 5;
          return regeneratorRuntime.awrap(fetchRates(fromCurr));

        case 5:
          rate = conversionRates[fromCurr][toCurr];

          if (fromAmountEl.value) {
            toAmountEl.value = (fromAmountEl.value * rate).toFixed(2);
          }

          rateContainerEl.innerHTML = "\n    <p>1 ".concat(fromCurr, " = ").concat(rate.toFixed(5), " ").concat(toCurr, "</p>\n    <p>1 ").concat(toCurr, " = ").concat((1 / rate).toFixed(5), " ").concat(fromCurr, "</p>\n    <h2>").concat(fromAmountEl.value, " ").concat(fromCurr, " = ").concat(toAmountEl.value, " ").concat(toCurr, "</h2>\n    ");

        case 8:
        case "end":
          return _context2.stop();
      }
    }
  });
}

function reverseCalculate() {
  var fromCurr, toCurr, rate;
  return regeneratorRuntime.async(function reverseCalculate$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          fromCurr = fromCurrencyEl.value;
          toCurr = toCurrencyEl.value;

          if (conversionRates[fromCurr]) {
            _context3.next = 5;
            break;
          }

          _context3.next = 5;
          return regeneratorRuntime.awrap(fetchRates(fromCurr));

        case 5:
          rate = conversionRates[fromCurr][toCurr];

          if (toAmountEl.value) {
            fromAmountEl.value = (toAmountEl.value / rate).toFixed(2);
          }

          rateContainerEl.innerHTML = "\n    <p>1 ".concat(fromCurr, " = ").concat(rate.toFixed(5), " ").concat(toCurr, "</p>\n    <p>1 ").concat(toCurr, " = ").concat((1 / rate).toFixed(5), " ").concat(fromCurr, "</p>\n    <h2>").concat(toAmountEl.value, " ").concat(toCurr, " = ").concat(fromAmountEl.value, " ").concat(fromCurr, "</h2>\n    ");

        case 8:
        case "end":
          return _context3.stop();
      }
    }
  });
}

function swapCurrencies() {
  var tempValue = fromCurrencyEl.value;
  fromCurrencyEl.value = toCurrencyEl.value;
  toCurrencyEl.value = tempValue;
  calculate();
} // Store the full names of the currencies


fromAmountEl.addEventListener("input", calculate);
fromCurrencyEl.addEventListener("change", calculate);
toAmountEl.addEventListener("input", reverseCalculate);
toCurrencyEl.addEventListener("change", calculate);
swapButtonEl.addEventListener("click", swapCurrencies);
calculate();