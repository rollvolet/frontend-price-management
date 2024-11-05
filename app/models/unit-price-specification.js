import { attr, belongsTo } from '@ember-data/model';
import ProvenanceModel from './provenance-model';
import { calculatePriceTaxIncluded, calculatePriceTaxExcluded } from '../utils/calculate-price';
import { VAT_RATE } from '../config';
import { hasMarginCalculationBasis, hasPriceOutCalculationBasis } from '../utils/product-price';

export default class UnitPriceSpecificationModel extends ProvenanceModel {
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
    return hasPriceOutCalculationBasis(this);
  }

  get hasMarginCalculationBasis() {
    return hasMarginCalculationBasis(this);
  }

  get marginPct() {
    return this.margin * 100;
  }
}
