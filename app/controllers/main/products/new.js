import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class MainProductsNewController extends Controller {
  @action
  cancel() {
    this.transitionToRoute('main.products.index');
  }

  @action
  save() {
    this.transitionToRoute('main.products.index');
  }
}
