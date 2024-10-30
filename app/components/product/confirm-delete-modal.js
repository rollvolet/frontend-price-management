import Component from '@glimmer/component';
import { task } from 'ember-concurrency';

export default class ProductConfirmDeleteModalComponent extends Component {
  confirmDelete = task(async () => {
    await this.args.onConfirm();
  });
}
