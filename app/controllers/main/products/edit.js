import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class MainProductsEditController extends Controller {
  @action
  cancel() {
    this.transitionToRoute('main.products.index');
  }
}
