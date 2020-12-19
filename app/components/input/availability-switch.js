import SwitchComponent from './switch';
import { IN_STOCK, OUT_OF_STOCK } from '../../models/offering';

export default class InputAvailabilitySwitchComponent extends SwitchComponent {
  get onValue() {
    return IN_STOCK;
  }

  get offValue() {
    return OUT_OF_STOCK;
  }
}
