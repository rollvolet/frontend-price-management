import Component from '@glimmer/component';

const VAT_RATE = 0.21;

export default class FmtUnitPriceComponent extends Component {
  get currencyValue() {
    if (this.args.showTaxIncluded)
      return this.currencyValueTaxIncluded;
    else
      return this.currencyValueTaxExcluded;
  }

  get currencyValueTaxIncluded() {
    if (this.args.model.valueAddedTaxIncluded)
      return this.args.model.currencyValue;
    else
      return this.args.model.currencyValue * (1 + VAT_RATE);
  }

  get currencyValueTaxExcluded() {
    if (this.args.model.valueAddedTaxIncluded)
      return this.args.model.currencyValue / (1 + VAT_RATE);
    else
      return this.args.model.currencyValue;
  }
}
