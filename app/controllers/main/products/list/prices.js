import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import {
  hasMarginCalculationBasis,
  hasPriceOutCalculationBasis,
  recalculateSalesPriceAndSave,
} from '../../../../utils/product-price';
import { trackedFunction } from 'reactiveweb/function';
import { timeout } from 'ember-concurrency';

export default class MainProductsListPricesController extends Controller {
  @service store;

  isMarginPriceBasis = (priceSpecification) => hasMarginCalculationBasis(priceSpecification);
  isPriceOutBasis = (priceSpecification) => hasPriceOutCalculationBasis(priceSpecification);

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

  // the edit actions receive the product id, as it might be ES or ED in the template
  // But editing/saving is only possible via ED
  async getProductById(productId) {
    await this.products.promise;
    return this.products.value.find((p) => p.id == productId);
  }

  @action
  async setCalculationBasis(productId, event) {
    const product = await this.getProductById(productId);
    const calculationBasis = event.target.value;
    const offering = await product.salesOffering;
    const price = await offering.unitPriceSpecification;
    price.calculationBasis = calculationBasis;
    await price.save();
  }

  @action
  async setPriceIn(productId, value) {
    const product = await this.getProductById(productId);
    const offering = await product.purchaseOffering;
    const price = await offering.unitPriceSpecification;
    price.currencyValue = value;
    await price.save();
    await recalculateSalesPriceAndSave(product);
  }

  @action
  async setPriceOut(productId, value) {
    const product = await this.getProductById(productId);
    const offering = await product.salesOffering;
    const price = await offering.unitPriceSpecification;
    price.currencyValue = value;
    await recalculateSalesPriceAndSave(product);
  }

  @action
  async setMargin(productId, value) {
    const product = await this.getProductById(productId);
    const offering = await product.salesOffering;
    const price = await offering.unitPriceSpecification;
    price.margin = value;
    await recalculateSalesPriceAndSave(product);
  }
}
