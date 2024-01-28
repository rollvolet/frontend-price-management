import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class MainSuppliersRoute extends Route {
  setupController(controller) {
    super.setupController(...arguments);
    controller.closeNewSupplierModal();
  }
}
