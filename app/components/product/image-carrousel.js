import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class ImageCarrouselProductComponent extends Component {
  @tracked imageToView;

  @action
  openViewModal(imageToView) {
    this.imageToView = imageToView;
  }

  @action
  closeViewModal() {
    this.imageToView = null;
  }

  get viewModalIsOpen() {
    return !!this.imageToView;
  }
}
