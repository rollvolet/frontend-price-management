import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class OfferingModel extends Model {
  @attr name;
  @attr('datetime') validFrom;
  @attr('datetime') validThrough;

  @hasMany('product') products;
  @hasMany('unit-price-specification') unitPriceSpecifications;
  @belongsTo('business-entity') businessEntity;
}
