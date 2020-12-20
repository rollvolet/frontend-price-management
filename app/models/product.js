import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class ProductModel extends Model {
  @attr name;
  @attr description;
  @attr identifier;
  @attr('boolean') includeInStockReport;
  @attr('datetime') created;
  @attr('datetime') modified;

  @belongsTo('warehouse-location') warehouseLocation;
  @belongsTo('offering', { inverse: 'purchaseProduct' }) purchaseOffering;
  @belongsTo('offering', { inverse: 'salesProduct' }) salesOffering;
  @belongsTo('product-category') category;
  @hasMany('file', { inverse: null }) attachments;
}
