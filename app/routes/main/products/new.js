import Route from '@ember/routing/route';
import { PRICE_OUT_CALCULATION_BASIS } from '../../../models/unit-price-specification';
import { IN_STOCK } from '../../../models/offering';
import { ROLLVOLET_URI } from '../../../models/business-entity';
import { next as nextNumber } from '../../../utils/sequence-number';

export default class MainProductsNewRoute extends Route {
  async model() {
    const now = new Date();

    const businessEntities = await this.store.query('business-entity', {
      page: { size: 1 },
      filter: { ':uri:': ROLLVOLET_URI },
    });
    const rollvolet = businessEntities.firstObject;

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
      calculationBasis: PRICE_OUT_CALCULATION_BASIS,
      valueAddedTaxIncluded: true,
      businessEntity: rollvolet,
      currencyValue: 0.0,
      margin: 0.0,
    });
    const salesOffering = this.store.createRecord('offering', {
      validFrom: now,
      availability: IN_STOCK,
      unitPriceSpecification: salesPrice,
    });
    const warehouseLocation = this.store.createRecord('warehouse-location', {});
    const product = this.store.createRecord('product', {
      created: now,
      modified: now,
      identifier: number,
      warehouseLocation,
      purchaseOffering,
      salesOffering,
    });

    return product;
  }
}
