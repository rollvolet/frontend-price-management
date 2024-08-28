import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { next as nextNumber } from '../../../utils/sequence-number';
import constants from '../../../config/constants';

const { BUSINESS_ENTITIES, PRODUCT_AVAILABILITIES, CALCULATION_BASIS } = constants;

export default class MainProductsNewRoute extends Route {
  @service store;

  async model() {
    const now = new Date();
    const rollvolet = await this.store.findRecordByUri(
      'business-entity',
      BUSINESS_ENTITIES.ROLLVOLET
    );
    const number = await nextNumber();

    const purchasePrice = this.store.createRecord('unit-price-specification', {
      currency: 'EUR',
      valueAddedTaxIncluded: false,
      currencyValue: 0.0,
    });
    const purchaseOffering = this.store.createRecord('offering', {
      validFrom: now,
      unitPriceSpecification: purchasePrice,
    });
    const salesPrice = this.store.createRecord('unit-price-specification', {
      currency: 'EUR',
      calculationBasis: CALCULATION_BASIS.PRICE_OUT,
      valueAddedTaxIncluded: true,
      businessEntity: rollvolet,
      currencyValue: 0.0,
      margin: 0.0,
    });
    const salesOffering = this.store.createRecord('offering', {
      validFrom: now,
      availability: PRODUCT_AVAILABILITIES.IN_STOCK,
      unitPriceSpecification: salesPrice,
    });
    const warehouseLocation = this.store.createRecord('warehouse-location', {});
    const product = this.store.createRecord('product', {
      identifier: number,
      warehouseLocation,
      purchaseOffering,
      salesOffering,
    });

    return product;
  }
}
