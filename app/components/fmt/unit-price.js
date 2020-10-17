import Component from '@glimmer/component';

const VAT_RATE = 0.21;

export default class FmtUnitPriceComponent extends Component {
  get currencyValueTaxIncluded() {
    if (this.args.model.valueAddedTaxIncluded)
      return this.args.model.currencyValue;
    else
      return this.args.model.currencyValue * (1 + VAT_RATE);
  }
}
