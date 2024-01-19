import Model, { attr, belongsTo } from '@ember-data/model';
import roundDecimal from '../utils/round-decimal';
import constants from '../config/constants';
import { VAT_RATE } from '../config';

const { CALCULATION_BASIS } = constants;

export default class UnitPriceSpecificationModel extends Model {
  @attr('string') currency;
  @attr('number') currencyValue;
  @attr('number') margin;
  @attr('string') calculationBasis;
  @attr('boolean') valueAddedTaxIncluded;

  @belongsTo('unit-code', { inverse: 'unitPriceSpecifications', async: true }) unitCode;
  @belongsTo('offering', { inverse: 'unitPriceSpecification', async: true }) offering;

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
