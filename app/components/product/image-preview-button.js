import Component from '@glimmer/component';
import { service } from '@ember/service';
import { trackedFunction }  from 'reactiveweb/function';

export default class ProductImagePreviewButtonComponent extends Component {
  @service store;

  imageCount = trackedFunction(this, async () => {
    const count = await this.store.count('product', {
      'filter[:id:]': this.args.productId,
      'filter[attachments][format]': 'image/'
    });
    return count;
  })

  get hasImage() {
    return this.imageCount?.value > 0;
  }
}
