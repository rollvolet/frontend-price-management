import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class DesignProductsNewController extends Controller {
  @tracked showImage = false;

  @action
  openImage() {
    this.showImage = true;
  }

  @action
  closeImage() {
    this.showImage = false;
  }
}
