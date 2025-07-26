function formatPrice(price: number, shorten?: boolean) {
  if (isNaN(price)) return price;
  if (price != 0 && !price) {
    return "";
  }
  //if just shorten the price
  if (shorten) {
    // Check if the absolute value of price is greater than or equal to 1 billion
    if (Math.abs(price) >= 1e9) {
      return (price / 1e9).toFixed(1) + "B";
    }
    // Check if the absolute value of price is greater than or equal to 1 million
    if (Math.abs(price) >= 1e6) {
      return (price / 1e6).toFixed(1) + "M";
    }
    // Check if the absolute value of price is greater than or equal to 1 thousand
    if (Math.abs(price) >= 1e3) {
      return (price / 1e3).toFixed(1) + "K";
    }
  }

  //if no shorten and just seperate with cama:

  const priceStr = price?.toString();

  // Split the string into integer and decimal parts (if applicable)
  const parts = priceStr?.split(".");
  const integerPart = parts[0];
  const decimalPart = parts[1] || "";

  // Add thousands separator to the integer part
  let formattedIntegerPart = "";
  for (let i = integerPart?.length - 1, count = 0; i >= 0; i--, count++) {
    if (count !== 0 && count % 3 === 0) {
      formattedIntegerPart = "," + formattedIntegerPart;
    }
    formattedIntegerPart = integerPart[i] + formattedIntegerPart;
  }

  // Combine the formatted parts
  if (decimalPart) {
    return formattedIntegerPart + "." + decimalPart;
  } else {
    return formattedIntegerPart;
  }
}

export default formatPrice;
