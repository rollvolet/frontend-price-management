import Service, { inject as service } from '@ember/service';
import { keepLatestTask } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';

export default class UserInfoService extends Service {
  @service session;

  @tracked name;
  @tracked username;

  get isLoaded() {
    return this.fetchUserInfo.last && this.fetchUserInfo.last.isSuccessful;
  }

  @keepLatestTask
  *fetchUserInfo() {
    if (this.session.isAuthenticated) {
      const sessionData = this.session.data.authenticated.data;
      this.name = sessionData.attributes.name;
      this.username = sessionData.attributes.username;
    } else {
      this.name = null;
      this.username = null;
    }
  }

  clearUserInfo() {
    this.name = null;
    this.username = null;
  }
}
