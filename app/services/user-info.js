import Service, { inject as service } from '@ember/service';
import { keepLatestTask } from 'ember-concurrency-decorators';
import { tracked } from '@glimmer/tracking';

export default class UserInfoService extends Service {
  @service session;

  @tracked name;
  @tracked email;

  get isLoaded() {
    return this.fetchUserInfo.last && this.fetchUserInfo.last.isSuccessful;
  }

  @keepLatestTask
  *fetchUserInfo() {
    this.name = 'Erika';
    this.email = 'erika.pauwels@rollvolet.be';
  }

  clearUserInfo() {
    this.name = null;
    this.email = null;
  }
}
