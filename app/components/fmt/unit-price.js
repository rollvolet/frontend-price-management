import Component from '@glimmer/component';
import { VAT_RATE } from '../../config';
import { calculatePriceTaxIncluded, calculatePriceTaxExcluded } from '../../utils/calculate-price';
import { get } from '@ember/object';
export default class FmtUnitPriceComponent extends Component {
  // Note:
  // this.args.model may be a unit-price-specification Proxy object coming from ember-data
  // or a plain javascript object coming as nested object from mu-search.

  get currencyValue() {
    // eslint-disable-next-line ember/no-get
    return get(this.args.model, 'currencyValue');
  }

  get isTaxIncluded() {
    // eslint-disable-next-line ember/no-get
    return `${get(this.args.model, 'valueAddedTaxIncluded')}` === 'true'; // cover for mu-search where 'true' is a string
  }

  get calculatedCurrencyValue() {
    if (this.args.showTaxIncluded) {
      return calculatePriceTaxIncluded(this.currencyValue, VAT_RATE, this.isTaxIncluded);
    } else {
      return calculatePriceTaxExcluded(this.currencyValue, VAT_RATE, this.isTaxIncluded);
    }
  }
}
