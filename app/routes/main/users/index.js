import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class MainUsersIndexRoute extends Route {
  @service store;

  queryParams = {
    page: { refreshModel: true },
    size: { refreshModel: true },
    sort: { refreshModel: true },
  };

  model(params) {
    return this.store.query('user', {
      page: {
        size: params.size,
        number: params.page,
      },
      sort: params.sort,
      include: 'user-groups,account'
    });
  }
}
