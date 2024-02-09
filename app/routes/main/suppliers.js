import Route from '@ember/routing/route';

export default class MainSuppliersRoute extends Route {
  setupController(controller) {
    super.setupController(...arguments);
    controller.closeNewSupplierModal();
  }
}
