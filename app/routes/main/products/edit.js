import Route from '@ember/routing/route';

export default class MainProductsEditRoute extends Route {
  async model(params) {
    const products = await this.store.query('product', {
      filter: { ':id:': params.product_id },
      page: { size: 1 }
    });
    return products.firstObject;
  }

  async afterModel(model) {
    const category = await model.category;
    if (category)
      this.broaderCategory = await category.broader;
    else
      this.broaderCategory = null;
  }

  setupController(controller) {
    super.setupController(...arguments);
    controller.broaderCategory = this.broaderCategory;
  }
}
