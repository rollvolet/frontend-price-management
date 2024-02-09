import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class MainRoute extends Route {
  @service session;
  @service userInfo;

  async beforeModel(transition) {
    const isAuthenticated = this.session.requireAuthentication(transition, 'login');

    if (isAuthenticated) {
      // Blocking request
      await this.userInfo.fetchUserInfo.perform();
    }
  }
}
