import Component from '@glimmer/component';
import { get } from '@ember/object';

const VAT_RATE = 0.21;

export default class FmtUnitPriceComponent extends Component {

  // Note:
  // this.args.model maybe a Proxy object coming from ember-data
  // or a plain javascript object coming as nested object from mu-search.
  // By using 'get' from @ember/object to retrieve a property we cover both cases

  get currencyValue() {
    if (this.args.showTaxIncluded)
      return this.currencyValueTaxIncluded;
    else
      return this.currencyValueTaxExcluded;
  }

  get currencyValueTaxIncluded() {
    if (get(this.args.model, 'valueAddedTaxIncluded'))
      return get(this.args.model, 'currencyValue');
    else
      return get(this.args.model, 'currencyValue') * (1 + VAT_RATE);
  }

  get currencyValueTaxExcluded() {
    if (get(this.args.model, 'valueAddedTaxIncluded'))
      return get(this.args.model, 'currencyValue') / (1 + VAT_RATE);
    else
      return get(this.args.model, 'currencyValue');
  }
}
