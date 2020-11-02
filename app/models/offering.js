import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

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
}
