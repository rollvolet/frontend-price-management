import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class CategorySubcategoryEditComponent extends Component {
  @tracked isEnabledInput = false;

  @action
  enableEdit() {
    this.isEnabledInput = true;
  }

  @action
  save() {
    if (this.isEnabledInput) {
      this.args.onSave(this.args.model);
      this.isEnabledInput = false;
    } // else input wasn't enabled. Just ignore
  }

  @action
  cancel() {
    this.args.onCancel(this.args.model);
    this.isEnabledInput = false;
  }
}
