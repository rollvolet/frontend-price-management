import roundDecimal from './round-decimal';
import { VAT_RATE } from '../config';
import constants from '../config/constants';

const { CALCULATION_BASIS } = constants;

export default async function recalculateSalesPrice(product) {
  const purchaseOffering = await product.purchaseOffering;
  const purchasePrice = await purchaseOffering.unitPriceSpecification;
  purchasePrice.currencyValue = roundDecimal(purchasePrice.currencyValue);

  const salesOffering = await product.salesOffering;
  const salesPrice = await salesOffering.unitPriceSpecification;

  if (salesPrice.calculationBasis == CALCULATION_BASIS.MARGIN) {
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
}
