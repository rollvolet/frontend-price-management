import Route from '@ember/routing/route';
import search from '../../../utils/mu-search';
import Snapshot from '../../../utils/snapshot';

export default class MainProductsIndexRoute extends Route {
  queryParams = {
    page: {
      refreshModel: true
    },
    size: {
      refreshModel: true
    },
    sort: {
      refreshModel: true
    }
  }

  constructor() {
    super(...arguments);
    this.lastParams = new Snapshot();
  }

  model(params) {
    this.lastParams.stageLive(params);

    if (this.lastParams.anyFieldChanged(Object.keys(params).filter((key) => key !== 'page'))) {
      params.page = 0;
    }

    const filter = { ':sqs:name': '*' };

    this.lastParams.commit();

    return search('products', params.page, params.size, params.sort, filter, (product) => {
      const entry = product.attributes;
      entry.id = product.id;
      return entry;
    });

  }
}
