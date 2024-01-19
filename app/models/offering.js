import Model, { attr, belongsTo } from '@ember-data/model';

export default class OfferingModel extends Model {
  @attr('string') name;
  @attr('string') identifier;
  @attr('string') availability;
  @attr('datetime') validFrom;
  @attr('datetime') validThrough;

  @belongsTo('product', { inverse: 'purchaseOffering' }) purchaseProduct;
  @belongsTo('product', { inverse: 'salesOffering' }) salesProduct;
  @belongsTo('unit-price-specification', { inverse: 'offering' }) unitPriceSpecification;
  @belongsTo('business-entity', { inverse: 'offerings' }) businessEntity;
}
