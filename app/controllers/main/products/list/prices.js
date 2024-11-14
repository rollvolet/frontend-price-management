import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { recalculateSalesPriceAndSave } from '../../../../utils/product-price';
import { trackedFunction } from 'reactiveweb/function';

export default class MainProductsListPricesController extends Controller {
  @service store;

  products = trackedFunction(this, async () => {
    const productObjects = await this.model;
    await Promise.resolve();
    const productsED = await this.store.query('product', {
      filter: { ':id:': productObjects.map((p) => p.id).join(',') },
      include: [
        'category',
        'category.broader',
        'purchase-offering.unit-price-specification',
        'purchase-offering.business-entity',
        'sales-offering.unit-price-specification',
        'sales-offering.unit-price-specification.unit-code',
      ].join(','),
    });
    return productObjects.map((p) => productsED.find((pED) => p.id == pED.id));
  });

  // the edit actions might receive ES object or ED
  // But editing/saving is only possible via ED, so always try to fetch ED object.
  async getProductById(productId) {
    await this.products.promise;
    return this.products.value.find((p) => p.id == productId);
  }

  @action
  async setCalculationBasis(product, calculationBasis) {
    const productED = await this.getProductById(product.id);
    const offering = await productED.salesOffering;
    const price = await offering.unitPriceSpecification;
    price.calculationBasis = calculationBasis;
    await price.save();
  }

  @action
  async setPriceIn(product, value) {
    const productED = await this.getProductById(product.id);
    const offering = await productED.purchaseOffering;
    const price = await offering.unitPriceSpecification;
    price.currencyValue = value;
    await price.save();
    await recalculateSalesPriceAndSave(productED);
  }

  @action
  async setPriceOut(product, value) {
    const productED = await this.getProductById(product.id);
    const offering = await productED.salesOffering;
    const price = await offering.unitPriceSpecification;
    price.currencyValue = value;
    await recalculateSalesPriceAndSave(productED);
  }

  @action
  async setMargin(product, value) {
    const productED = await this.getProductById(product.id);
    const offering = await productED.salesOffering;
    const price = await offering.unitPriceSpecification;
    price.margin = value;
    await recalculateSalesPriceAndSave(productED);
  }
}
