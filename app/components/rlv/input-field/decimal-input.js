import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import formatDecimalInput from '../../../utils/format-decimal-input';
import deformatDecimalInput from '../../../utils/deformat-decimal-input';

export default class RlvInputFieldDecimalInputComponent extends Component {
  @tracked formattedValue;

  class = 'default';
  isRequired = false;

  constructor() {
    super(...arguments);
    this.formattedValue = formatDecimalInput(this.args.value);
  }

  get fieldId() {
    return `decimal-input-${guidFor(this)}`;
  }

  @action
  formatValue() {
    this.formattedValue = formatDecimalInput(this.args.value);
  }

  @action
  updateValue(value) {
    const deformattedValue = deformatDecimalInput(value);
    this.formattedValue = formatDecimalInput(deformattedValue);
    this.args.onChange(deformattedValue);
  }
}
