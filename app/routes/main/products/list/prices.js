
import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class MainProductsListPricesRoute extends Route {
  @service userInfo;
  @service router;

  beforeModel() {
    if(!this.userInfo.isPriceAdmin) {
      // Only price admins can view this page
      this.router.transitionTo('forbidden');
    }
  }
}
