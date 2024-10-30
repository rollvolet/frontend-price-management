import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';

export default class SupplierListItemComponent extends Component {
  @tracked editMode = false;

  save = task(async (e) => {
    e.preventDefault();
    await this.args.model.save();
    this.editMode = false;
  });

  @action
  cancelEdit() {
    this.args.model.rollbackAttributes();
    this.editMode = false;
  }

  @action
  openEdit() {
    this.editMode = true;
  }
}
