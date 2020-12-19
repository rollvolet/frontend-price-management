import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class MainProductsDetailEditController extends Controller {
  @action
  cancel() {
    this.transitionToRoute('main.products.detail.index');
  }
}
