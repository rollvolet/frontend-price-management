import Route from '@ember/routing/route';

export default class MainCategoriesIndexRoute extends Route {
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
    return this.store.query('product-category', {
      page: {
        number: params.page,
        size: params.size,
      },
      sort: params.sort,
      'filter[:has-no:broader]': true,
    });
  }
}
