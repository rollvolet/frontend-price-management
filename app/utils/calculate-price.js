import { isPresent } from '@ember/utils';
import roundDecimal from './round-decimal';

export function calculatePriceTaxIncluded(value, vatRate, isTaxIncluded) {
  if (isPresent(value)) {
    if (isTaxIncluded) {
      return value;
    } else {
      return roundDecimal(value * (1 + vatRate));
    }
  } else {
    return null;
  }
}

export function calculatePriceTaxExcluded(value, vatRate, isTaxIncluded) {
  if (isPresent(value)) {
    if (isTaxIncluded) {
      return roundDecimal(value / (1 + vatRate));
    } else {
      return value;
    }
  } else {
    return null;
  }
}
