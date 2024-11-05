import { get } from '@ember/object';
import { VAT_RATE } from '../config';
import constants from '../config/constants';
import roundDecimal from './round-decimal';
const { CALCULATION_BASIS } = constants;

// recalculate the sales price of a product and returns this adjusted salesPrice (a unitPriceSpecification)
export async function recalculateSalesPrice(product) {
  const purchaseOffering = await product.purchaseOffering;

  const purchasePrice = await purchaseOffering.unitPriceSpecification;
  purchasePrice.currencyValue = roundDecimal(purchasePrice.currencyValue);

  const salesOffering = await product.salesOffering;
  const salesPrice = await salesOffering.unitPriceSpecification;

  if (hasMarginCalculationBasis(salesPrice)) {
    salesPrice.margin = roundDecimal(salesPrice.margin);
    if (salesPrice.valueAddedTaxIncluded) {
      const value = purchasePrice.currencyValue * salesPrice.margin * (1 + VAT_RATE);
      salesPrice.currencyValue = roundDecimal(value);
    } else {
      const value = purchasePrice.currencyValue * salesPrice.margin;
      salesPrice.currencyValue = roundDecimal(value);
    }
  } else {
    salesPrice.currencyValue = roundDecimal(salesPrice.currencyValue);
    const margin = salesPrice.currencyValueTaxExcluded / purchasePrice.currencyValue;
    salesPrice.margin = roundDecimal(margin);
  }
  return salesPrice;
}

export async function recalculateSalesPriceAndSave(product) {
  const salesPrice = await recalculateSalesPrice(product);
  await salesPrice.save();
}

export function hasPriceOutCalculationBasis(unitPriceSpecification) {
  // eslint-disable-next-line ember/no-get
  return get(unitPriceSpecification, 'calculationBasis') == CALCULATION_BASIS.PRICE_OUT;
}

export function hasMarginCalculationBasis(unitPriceSpecification) {
  // eslint-disable-next-line ember/no-get
  return get(unitPriceSpecification, 'calculationBasis') == CALCULATION_BASIS.MARGIN;
}
