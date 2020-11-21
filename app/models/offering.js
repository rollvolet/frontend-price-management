import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

const IN_STOCK = 'http://schema.org/InStock';
const OUT_OF_STOCK = 'http://schema.org/OutOfStock';

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
};

export {
  IN_STOCK,
  OUT_OF_STOCK
}
