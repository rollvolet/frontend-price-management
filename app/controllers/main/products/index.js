import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class MainProductsIndexController extends Controller {
  page = 0;
  size = 10;

  @action
  previousPage() {
    this.selectPage(this.page - 1);
  }

  @action
  nextPage() {
    this.selectPage(this.page + 1);
  }

  @action
  selectPage(page) {
    this.set('page', page);
  }
}
