import Component from '@glimmer/component';
import { service } from '@ember/service';
import { keepLatestTask } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';

export default class QuickviewModalProductComponent extends Component {
  @service store;
  @tracked image;

  constructor() {
    super(...arguments);
    this.loadImage.perform();
  }

  @keepLatestTask
  *loadImage() {
    const product = yield this.store.queryOne('product', {
      filter: { ':id:': this.args.product.id },
      include: 'attachments',
    });
    const attachments = yield product.attachments;
    const imageFile = attachments.find((a) => {
      return a.format.startsWith('image/');
    });
    this.image = imageFile;
  }

  get imageLink() {
    if (this.image) {
      return `/files/${this.image.id}/download`;
    }
    return undefined;
  }
}
