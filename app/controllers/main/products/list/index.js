import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class MainProductsListIndexController extends Controller {
  @action
  showPreview(product) {
    this.previewProduct = product;
  }

  @action
  closePreview() {
    this.previewProduct = undefined;
  }
}
