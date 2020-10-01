import Model, { attr, belongsTo } from '@ember-data/model';

const VAT_RATE = 0.21;
export default class UnitPriceSpecificationModel extends Model {
  @attr currency;
  @attr('number') currencyValue;
  @attr('number') margin;
  @attr calculationBasis;
  @attr('boolean') valueAddedTaxIncluded;

  @belongsTo('unit-code') unitCode;

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
}
