import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class MainProductsDetailEditController extends Controller {
  @service router;

  @action
  goToDetailView() {
    this.router.transitionTo('main.products.detail.index');
  }

  @action
  goToListView() {
    this.router.transitionTo('main.products.index');
  }
}
