import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class InputSwitchComponent extends Component {
  get isOn() {
    return this.args.value == true;
  }

  get isOff() {
    return !this.isOn;
  }

  @action
  toggleValue() {
    const newValue = this.isOn ? false : true;
    this.args.onChange(newValue);
  }
}
