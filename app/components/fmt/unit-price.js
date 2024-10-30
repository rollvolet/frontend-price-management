import Component from '@glimmer/component';
import { cached } from '@glimmer/tracking';
import { TrackedAsyncData } from 'ember-async-data';
import { VAT_RATE } from '../../config';
import { calculatePriceTaxIncluded, calculatePriceTaxExcluded } from '../../utils/calculate-price';

export default class FmtUnitPriceComponent extends Component {
  // Note:
  // this.args.model maybe a Proxy object coming from ember-data
  // or a plain javascript object coming as nested object from mu-search.

  @cached
  get currencyValueLoader() {
    if (this.args.showTaxIncluded) {
      const loadData = async () => {
        const model = await this.args.model;
        return calculatePriceTaxIncluded(
          model.currencyValue,
          VAT_RATE,
          `${model.valueAddedTaxIncluded}` === 'true', // cover for mu-search where 'true' is a string
        );
      };
      return new TrackedAsyncData(loadData());
    } else {
      const loadData = async () => {
        const model = await this.args.model;
        return calculatePriceTaxExcluded(
          model.currencyValue,
          VAT_RATE,
          `${model.valueAddedTaxIncluded}` === 'true', // cover for mu-search where 'true' is a string
        );
      };
      return new TrackedAsyncData(loadData());
    }
  }
}
