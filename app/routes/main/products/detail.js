import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class MainProductsDetailRoute extends Route {
  @service store;

  model(params) {
    return this.store.queryOne('product', {
      filter: { ':id:': params.product_id },
      include: [
        'category.broader',
        'purchase-offering.unit-price-specification',
        'purchase-offering.business-entity',
        'sales-offering.unit-price-specification',
      ].join(','),
    });
  }
}
