import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
export default class MainProductsListIndexController extends Controller {

  @tracked previewProduct;
  
  @action
  showPreview(product) {
    this.previewProduct = product;
  }

  @action
  closePreview() {
    this.previewProduct = undefined;
  }
}
