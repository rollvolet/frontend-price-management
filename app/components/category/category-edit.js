import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class CategoryCategoryEditComponent extends Component {
  @tracked isEnabledInput = false;

  @action
  enableEdit(e) {
    this.isEnabledInput = true;
    e.stopPropagation(); // make sure item isn't collapsed again
  }

  @action
  save() {
    this.args.onSave(this.args.model);
    this.isEnabledInput = false;
  }

  @action
  cancel() {
    this.args.onCancel(this.args.model);
    this.isEnabledInput = false;
  }
}
