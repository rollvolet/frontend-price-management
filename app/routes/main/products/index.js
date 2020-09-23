import Route from '@ember/routing/route';

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

  model(params) {
    return this.store.query('product', {
      page: {
        number: params.page,
        size: params.size
      }
    });
  }
}
