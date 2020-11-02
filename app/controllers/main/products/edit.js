import Controller from '@ember/controller';
import { action } from '@ember/object';
import { A } from '@ember/array';
import { tracked } from '@glimmer/tracking';

export default class MainProductsEditController extends Controller {
  @tracked broaderCategory;

  @action
  setBroaderCategory(category) {
    if (this.broaderCategory != category)
      this.model.category = null; // new top-level has been selected, hence reset category
    this.broaderCategory = category;
  }

  @action
  setCategory(category) {
    this.model.category = category;
  }
}
