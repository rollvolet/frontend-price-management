import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';

/**
 * @argument {Array} options: an array of options that contain at least id and given label-field
 * @argument {string} labelField: field to use in `options` as the label.
 * @argument {Array} selected: same values as options, but limited to the ones to set as selected
 * @argument {function} onSelectionChange: callback with argument the selected options
 * @argument {string} label: optional label
 * @argument {boolean} disabled
 */
export default class InputFieldCheckboxMultiSelectComponent extends Component {
  @service store;

  isSelected = (option) => this.selected.some(opt => opt.id === option.id);
  getLabel = (option) => option[this.args.labelField];

  get selected() {
    return this.args.selected || [];
  }

  @action
  updateValue(option, isChecked) {
    const values = this.selected;
    if (isChecked && !this.isSelected(option)) {
      values.push(option);
    } else if (!isChecked && this.isSelected(option)) {
      const i = values.indexOf(option);
      values.splice(i, 1);
    }
    this.args.onSelectionChange(values);
  }
}
