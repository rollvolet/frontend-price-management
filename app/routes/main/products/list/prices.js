
import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class MainProductsListIndexRoute extends Route {
  @service userInfo;
  @service router;

  beforeModel(transition) {
    if(!this.userInfo.isPriceAdmin) {
      // Only price admins can view this page
      this.router.transitionTo('main.products.list');
    }
  }
}
