import Component from '@glimmer/component';
import { action } from '@ember/object';

const IN_STOCK = 'http://schema.org/InStock';
const OUT_OF_STOCK = 'http://schema.org/OutOfStock';

export default class InputAvailabilitySwitchComponent extends Component {
  get isOn() {
    return this.args.value == IN_STOCK;
  }

  get isOff() {
    return !this.isOn;
  }

  @action
  toggleValue() {
    if (this.isOn) {
      this.args.onChange(OUT_OF_STOCK);
    } else {
      this.args.onChange(IN_STOCK);
    }
  }
}
