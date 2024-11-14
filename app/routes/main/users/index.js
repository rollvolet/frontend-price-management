import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class MainUsersIndexRoute extends Route {
  @service userInfo;
  @service router;
  @service store;

  queryParams = {
    page: { refreshModel: true },
    size: { refreshModel: true },
    sort: { refreshModel: true },
  };

  beforeModel() {
    if(!this.userInfo.isAdmin) {
      // Only admins can edit users
      this.router.transitionTo('main.forbidden');
    }
  }


  model(params) {
    return this.store.query('user', {
      page: {
        size: params.size,
        number: params.page,
      },
      sort: params.sort,
      include: "user-groups,account"
    });
  }
}
