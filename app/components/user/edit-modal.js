import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { trackedFunction } from 'reactiveweb/function';
import { tracked } from '@glimmer/tracking';

export default class UserEditModalComponent extends Component {
  @service store;

  @tracked newGroups;

  get selectedGroups() {
    return this.newGroups? this.newGroups: this.userGroups.value
  }

  userGroups = trackedFunction(this, async () =>  {
    if (this.args.model) {
      const userGroups = await this.args.model.userGroups;
      return userGroups.slice();
    } else {
      return [];
    }
  });

  @action
  setUserGroups(groups) {
    this.newGroups = groups;
  }

  @action
  cancel() {
    this.newGroups = null;
    this.args.model.rollbackAttributes();
    this.args.onClose();
  }

  @action
  async save(event) {
    event.preventDefault();
    this.args.model.userGroups = this.newGroups;
    await this.args.model.save();
    this.args.didSave();
  }
}
