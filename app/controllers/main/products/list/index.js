import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { trackedFunction } from 'reactiveweb/function';
import { service } from '@ember/service';
export default class MainProductsListIndexController extends Controller {
  @tracked previewProduct;
  @service store;

  @action
  showPreview(product) {
    this.previewProduct = product;
  }

  @action
  closePreview() {
    this.previewProduct = undefined;
  }

  hasPreview = (product) => {
    return this.productIdsWithImages.value?.some(pId => pId === product.id);
  }

  productIdsWithImages = trackedFunction(this, async () => {
    const searchProductIds = this.model.map((p) => p.id);
    console.log(searchProductIds);
    const productsWithImage = await this.store.query('product', {
      'filter[:id:]': searchProductIds.join(','),
      'filter[attachments][format]': 'image/',
    });
    return productsWithImage.map(p => p.id);
  });
}
