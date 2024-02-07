import roundDecimal from './round-decimal';

export function calculatePriceTaxIncluded(value, vatRate, isTaxIncluded) {
  if (isTaxIncluded) {
    return value;
  } else {
    return roundDecimal(value * (1 + vatRate));
  }
}

export function calculatePriceTaxExcluded(value, vatRate, isTaxIncluded) {
  if (isTaxIncluded) {
    return roundDecimal(value / (1 + vatRate));
  } else {
    return value;
  }
}
