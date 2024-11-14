import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { cached } from '@glimmer/tracking';
import { TrackedAsyncData } from 'ember-async-data';
import { trackedFunction } from 'reactiveweb/function';
import { tracked } from '@glimmer/tracking';

export default class UserEditModalComponent extends Component {
  @service store;

  @tracked _newGroups;

  @cached
  get user() {
    return new TrackedAsyncData(this.args.model);
  }

  get selectedGroups() {
    return this._newGroups? this._newGroups: this.userGroups.value
  }

  userGroups = trackedFunction(this, async () =>  {
    if (this.user.isResolved && this.user.value) {
      const userGroups = await this.user.value.userGroups;
      return userGroups.slice();
    } else {
      return [];
    }
  });

  allUserGroups = trackedFunction(this, async () => {
    await Promise.resolve();
    return this.store.queryAll('user-group', {
      sort: 'name'
    })
  });

  async rollback() {
    const user = await this.args.model;
    if (user) {
      user.rollbackAttributes();
    }
  }

  @action
  async setUserGroups(groups) {
    this._newGroups = groups;
  }

  @action
  async cancel() {
    await this.rollback();
    this.args.onClose();
  }

  @action
  async save(event) {
    event.preventDefault();
    this.args.model.userGroups = this._newGroups;
    await this.args.model.save();
    this.args.didSave();
  }
}
