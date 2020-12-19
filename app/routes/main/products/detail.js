import Route from '@ember/routing/route';

export default class MainProductsDetailRoute extends Route {
  async model(params) {
    const products = await this.store.query('product', {
      filter: { ':id:': params.product_id },
      page: { size: 1 },
      include: [
        'category.broader',
        'purchase-offering.unit-price-specification',
        'purchase-offering.business-entity',
        'sales-offering.unit-price-specification'
      ].join(',')
    });
    return products.firstObject;
  }
}
