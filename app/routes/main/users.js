import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class MainUsersRoute extends Route {
  @service userInfo;
  @service router;

  beforeModel() {
    if (!this.userInfo.isAdmin) {
      this.router.transitionTo('forbidden');
    }
  }
}
