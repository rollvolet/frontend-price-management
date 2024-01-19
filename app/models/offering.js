import Model, { attr, belongsTo } from '@ember-data/model';
import constants from '../config/constants';

const { PRODUCT_AVAILABILITIES } = constants;

export default class OfferingModel extends Model {
  @attr name;
  @attr identifier;
  @attr availability;
  @attr('datetime') validFrom;
  @attr('datetime') validThrough;

  @belongsTo('product', { inverse: 'purchaseOffering' }) purchaseProduct;
  @belongsTo('product', { inverse: 'salesOffering' }) salesProduct;
  @belongsTo('unit-price-specification') unitPriceSpecification;
  @belongsTo('business-entity') businessEntity;

  get isAvailable() {
    return this.availability == PRODUCT_AVAILABILITIES.IN_STOCK;
  }
}
