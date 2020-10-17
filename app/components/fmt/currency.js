import Component from '@glimmer/component';

export default class FmtCurrencyComponent extends Component {
  get sign() {
    if (!this.args.currency || this.args.currency == 'EUR')
      return "€";
    else
      return this.args.currency;
  }
}
