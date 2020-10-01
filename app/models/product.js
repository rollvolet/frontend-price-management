import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class ProductModel extends Model {
  @attr name;
  @attr description;
  @attr identifier;
  @attr('datetime') created;
  @attr('datetime') modified;

  @belongsTo('warehouse-location') warehouseLocation;
  @hasMany('offering') offerings;
  @hasMany('product-category') categories;
  @hasMany('file') attachments;
}
