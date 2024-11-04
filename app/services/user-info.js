import Service, { service } from '@ember/service';
import { keepLatestTask } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import constants from '../config/constants';
const USER_GROUPS = constants.USER_GROUPS;
export default class UserInfoService extends Service {
  @service session;
  @service store;

  @tracked account;
  @tracked user;
  @tracked userGroups = [];

  get isLoaded() {
    return this.fetchUserInfo.last && this.fetchUserInfo.last.isSuccessful;
  }

  get isAdmin() {
    return this.userGroups.some((group) => group.uri == USER_GROUPS.ADMIN);
  }

  get isPriceAdmin() {
    return this.userGroups.some((group) => group.uri == USER_GROUPS.PRICE_ADMIN);
  }

  get isEmployee() {
    return this.userGroups.some((group) => group.uri == USER_GROUPS.EMPLOYEE);
  }

  fetchUserInfo = keepLatestTask(async () => {
    if (this.session.isAuthenticated) {
      const authenticatedData = this.session.data.authenticated;
      // TODO: response in msal-login service must be fixed. Relationships must be included in data object
      const sessionData = authenticatedData.relationships || authenticatedData.data.relationships;
      const accountId = sessionData.account?.data.id;
      this.account = await this.store.findRecord('account', accountId, {
        include: 'user',
      });
      this.user = await this.account.user;
      this.userGroups = await this.user.userGroups;
    } else {
      this.account = null;
      this.user = null;
    }
  });

  clearUserInfo() {
    this.account = null;
    this.user = null;
  }
}
