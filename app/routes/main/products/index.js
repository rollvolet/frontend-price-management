import Route from '@ember/routing/route';
import { service } from '@ember/service';
export default class MainProductsRoute extends Route {
  @service router;

  beforeModel() {
    // index route does not exist, the `.list` route is the main route for the user.
    this.router.transitionTo('main.products.list');
  }
}
