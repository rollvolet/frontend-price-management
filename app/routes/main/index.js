import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class MainIndexRoute extends Route {
  @service router;

  beforeModel() {
    this.router.transitionTo('main.products.index');
  }
}
