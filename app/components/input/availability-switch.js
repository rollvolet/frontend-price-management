import Component from '@glimmer/component';
import { action } from '@ember/object';
import { IN_STOCK, OUT_OF_STOCK } from '../../models/offering';

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
