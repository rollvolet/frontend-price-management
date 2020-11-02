import Model, { attr, belongsTo } from '@ember-data/model';

const VAT_RATE = 0.21;
const PRICE_OUT_CALCULATION_BASIS = 'http://data.rollvolet.be/calculation-basis/47c2570e-cc21-4496-ba76-7e89a3cf782d';
const MARGIN_CALCULATION_BASIS = 'http://data.rollvolet.be/calculation-basis/12c12fe4-9d88-4a63-9223-2c83d69da729';

export default class UnitPriceSpecificationModel extends Model {
  @attr currency;
  @attr('number') currencyValue;
  @attr('number') margin;
  @attr calculationBasis;
  @attr('boolean') valueAddedTaxIncluded;

  @belongsTo('unit-code') unitCode;
  @belongsTo('offering') offering;

  get currencyValueTaxIncluded() {
    if (this.valueAddedTaxIncluded)
      return this.currencyValue;
    else
      return this.currencyValue * (1 + VAT_RATE);
  }

  get currencyValueTaxExcluded() {
    if (this.valueAddedTaxIncluded)
      return this.currencyValue / (1 + VAT_RATE);
    else
      return this.currencyValue;
  }

  get hasPriceOutCalculationBasis() {
    return this.calculationBasis == PRICE_OUT_CALCULATION_BASIS;
  }

  get hasMarginCalculationBasis() {
    return this.calculationBasis == MARGIN_CALCULATION_BASIS;
  }
}

export {
  PRICE_OUT_CALCULATION_BASIS,
  MARGIN_CALCULATION_BASIS
}
