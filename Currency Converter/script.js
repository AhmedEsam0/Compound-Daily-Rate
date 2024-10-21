let triggerUL = document.getElementById("trigger-ul");
let menu = document.getElementById("menu");
const fromAmountEl = document.getElementById("from-amount");
const fromCurrencyEl = document.getElementById("from-currency");
const toAmountEl = document.getElementById("to-amount");
const toCurrencyEl = document.getElementById("to-currency");
const swapButtonEl = document.querySelector(".swap");
const rateContainerEl = document.querySelector(".rate-container");

menu.style.color = "rgb(99, 129, 249)";
menu.onclick = () => {
  if (menu.style.color == "rgb(99, 129, 249)") {
    menu.style.color = "rgb(0,0,0)";
    triggerUL.style.display = "block";
  } else {
    menu.style.color = "rgb(99, 129, 249)";
    triggerUL.style.display = "none";
  }
};
let conversionRates = {};

async function fetchRates(fromCurr) {
  const response = await fetch(
    `https://v6.exchangerate-api.com/v6/1469b81e4f01a05326bfe467/latest/${fromCurr}`
  );
  const data = await response.json();
  conversionRates[fromCurr] = data.conversion_rates;
}

async function calculate() {
  let fromCurr = fromCurrencyEl.value;
  let toCurr = toCurrencyEl.value;

  if (!conversionRates[fromCurr]) {
    await fetchRates(fromCurr);
  }

  const rate = conversionRates[fromCurr][toCurr];
  if (fromAmountEl.value) {
    toAmountEl.value = (fromAmountEl.value * rate).toFixed(2);
  }

  rateContainerEl.innerHTML = `
    <p>1 ${fromCurr} = ${rate.toFixed(5)} ${toCurr}</p>
    <p>1 ${toCurr} = ${(1 / rate).toFixed(5)} ${fromCurr}</p>
    <h2>${fromAmountEl.value} ${fromCurr} = ${toAmountEl.value} ${toCurr}</h2>
    `;
}

async function reverseCalculate() {
  let fromCurr = fromCurrencyEl.value;
  let toCurr = toCurrencyEl.value;

  if (!conversionRates[fromCurr]) {
    await fetchRates(fromCurr);
  }

  const rate = conversionRates[fromCurr][toCurr];
  if (toAmountEl.value) {
    fromAmountEl.value = (toAmountEl.value / rate).toFixed(2);
  }

  rateContainerEl.innerHTML = `
    <p>1 ${fromCurr} = ${rate.toFixed(5)} ${toCurr}</p>
    <p>1 ${toCurr} = ${(1 / rate).toFixed(5)} ${fromCurr}</p>
    <h2>${toAmountEl.value} ${toCurr} = ${fromAmountEl.value} ${fromCurr}</h2>
    `;
}

function swapCurrencies() {
  const tempValue = fromCurrencyEl.value;
  fromCurrencyEl.value = toCurrencyEl.value;
  toCurrencyEl.value = tempValue;
  calculate();
}
// Store the full names of the currencies


fromAmountEl.addEventListener("input", calculate);
fromCurrencyEl.addEventListener("change", calculate);
toAmountEl.addEventListener("input", reverseCalculate);
toCurrencyEl.addEventListener("change", calculate);
swapButtonEl.addEventListener("click", swapCurrencies);

calculate();
