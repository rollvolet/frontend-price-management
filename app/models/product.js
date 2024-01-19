import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class ProductModel extends Model {
  @attr('string') name;
  @attr('string') description;
  @attr('number') identifier;
  @attr('boolean') includeInStockReport;
  @attr('datetime') created;
  @attr('datetime') modified;

  @belongsTo('warehouse-location', { inverse: 'products' }) warehouseLocation;
  @belongsTo('offering', { inverse: 'purchaseProduct' }) purchaseOffering;
  @belongsTo('offering', { inverse: 'salesProduct' }) salesOffering;
  @belongsTo('product-category', { inverse: null }) category;
  @hasMany('file', { inverse: null }) attachments;
}
