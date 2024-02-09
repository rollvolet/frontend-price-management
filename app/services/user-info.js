import Service, { service } from '@ember/service';
import { keepLatestTask } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';

export default class UserInfoService extends Service {
  @service session;
  @service store;

  @tracked account;
  @tracked user;

  get isLoaded() {
    return this.fetchUserInfo.last && this.fetchUserInfo.last.isSuccessful;
  }

  @keepLatestTask
  *fetchUserInfo() {
    if (this.session.isAuthenticated) {
      const authenticatedData = this.session.data.authenticated;
      // TODO: response in msal-login service must be fixed. Relationships must be included in data object
      const sessionData = authenticatedData.relationships || authenticatedData.data.relationships;
      const accountId = sessionData.account?.data.id;
      this.account = yield this.store.findRecord('account', accountId, {
        include: 'user',
      });
      this.user = yield this.account.user;
    } else {
      this.account = null;
      this.user = null;
    }
  }

  clearUserInfo() {
    this.account = null;
    this.user = null;
  }
}
