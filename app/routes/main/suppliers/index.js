import Route from '@ember/routing/route';
import { service } from '@ember/service';
import constants from '../../../config/constants';

const { BUSINESS_CATEGORIES } = constants;

export default class MainSuppliersIndexRoute extends Route {
  @service store;

  queryParams = {
    page: {
      refreshModel: true,
    },
    size: {
      refreshModel: true,
    },
    sort: {
      refreshModel: true,
    },
  };

  model(params) {
    return this.store.query('business-entity', {
      page: {
        size: params.size,
        number: params.page,
      },
      sort: params.sort,
      filter: {
        category: BUSINESS_CATEGORIES.SUPPLIER,
      },
    });
  }
}
