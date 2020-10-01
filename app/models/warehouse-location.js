import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class WarehouseLocationModel extends Model {
  @attr rack;
  @attr side;
  @attr position;

  @belongsTo('warehouse-department') department;
  @hasMany('product') products;
}
