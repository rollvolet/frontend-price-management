import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { keepLatestTask, task } from 'ember-concurrency';
import { inject as service } from '@ember/service';

export default class SupplierListItemComponent extends Component {
  @tracked editMode = false;

  @task
  *save(e) {
    e.preventDefault();
    yield this.args.model.save();
    this.editMode = false;
  }

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
