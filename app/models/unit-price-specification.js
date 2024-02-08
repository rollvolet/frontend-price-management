import Model, { attr, belongsTo } from '@ember-data/model';
import { calculatePriceTaxIncluded, calculatePriceTaxExcluded } from '../utils/calculate-price';
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
    return calculatePriceTaxIncluded(this.currencyValue, VAT_RATE, this.valueAddedTaxIncluded);
  }

  get currencyValueTaxExcluded() {
    return calculatePriceTaxExcluded(this.currencyValue, VAT_RATE, this.valueAddedTaxIncluded);
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
