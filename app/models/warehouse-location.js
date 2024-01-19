import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class WarehouseLocationModel extends Model {
  @attr('string') rack;
  @attr('string') side;
  @attr('number') position;

  @belongsTo('warehouse-department', { inverse: 'warehouseLocations', async: true }) department;
  @hasMany('product', { inverse: 'warehouseLocation', async: true }) products;
}
