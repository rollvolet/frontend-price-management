import SwitchComponent from './switch';

export default class InputDateSwitchComponent extends SwitchComponent {
  get onValue() {
    return null;
  }

  get offValue() {
    return new Date();
  }

  get isOn() {
    return this.args.value == null;
  }
}
