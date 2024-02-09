import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class MainProductsNewController extends Controller {
  @service router;

  @action
  cancel() {
    this.router.transitionTo('main.products.index');
  }

  @action
  save() {
    this.router.transitionTo('main.products.index');
  }
}
