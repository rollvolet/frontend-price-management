import Component from '@glimmer/component';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { keepLatestTask } from 'ember-concurrency';

export default class UtilUpdatedOnComponent extends Component {
  @service store;

  @tracked by;

  constructor() {
    super(...arguments);
    if (this.args.by) {
      this.by = this.args.by;
    } else if (this.args.user) {
      this.loadUser.perform();
    }
  }

  loadUser = keepLatestTask(async () => {
    const user = await this.store.findRecordByUri('user', this.args.user);
    this.by = user?.firstName;
  });
}
