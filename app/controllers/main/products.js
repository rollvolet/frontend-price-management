import Controller from '@ember/controller';
import { service } from '@ember/service';

export default class MainProductsController extends Controller {
  @service router;

  get showCreateButton() {
    return this.router.currentRouteName == 'main.products.index';
  }
}
