import Component from '@glimmer/component';
import { task } from 'ember-concurrency-decorators';

export default class ProductConfirmDeleteModalComponent extends Component {
  @task
  *confirmDelete() {
    yield this.args.onConfirm();
  }
}
