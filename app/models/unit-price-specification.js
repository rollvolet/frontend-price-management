import Model, { attr, belongsTo } from '@ember-data/model';
import roundDecimal from '../utils/round-decimal';
import constants from '../config/constants';

const { CALCULATION_BASIS } = constants;
const VAT_RATE = 0.21;

export default class UnitPriceSpecificationModel extends Model {
  @attr currency;
  @attr('number') currencyValue;
  @attr('number') margin;
  @attr calculationBasis;
  @attr('boolean') valueAddedTaxIncluded;

  @belongsTo('unit-code') unitCode;
  @belongsTo('offering') offering;

  get currencyValueTaxIncluded() {
    if (this.valueAddedTaxIncluded) {
      return this.currencyValue;
    } else {
      return roundDecimal(this.currencyValue * (1 + VAT_RATE));
    }
  }

  get currencyValueTaxExcluded() {
    if (this.valueAddedTaxIncluded) {
      return roundDecimal(this.currencyValue / (1 + VAT_RATE));
    } else {
      return this.currencyValue;
    }
  }

  get hasPriceOutCalculationBasis() {
    return this.calculationBasis == CALCULATION_BASIS.PRICE_OUT;
  }

  get hasMarginCalculationBasis() {
    return this.calculationBasis == CALCULATION_BASIS.MARGIN;
  }

  get marginPct() {
    return this.margin * 100;
  }
}

export { VAT_RATE };
