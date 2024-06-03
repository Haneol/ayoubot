const fetch = require("node-fetch");

function formatCurrency(price) {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "원";
}

async function getExchangeRate() {
  const response = await fetch(
    "https://api.exchangerate-api.com/v4/latest/USD"
  );
  const data = await response.json();
  return data.rates.KRW;
}

module.exports = {
  formatCurrency,
  getExchangeRate,
};
