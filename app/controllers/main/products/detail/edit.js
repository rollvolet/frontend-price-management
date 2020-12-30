import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class MainProductsDetailEditController extends Controller {
  @action
  goToDetailView() {
    this.transitionToRoute('main.products.detail.index');
  }

  @action
  goToListView() {
    this.transitionToRoute('main.products.index');
  }
}
