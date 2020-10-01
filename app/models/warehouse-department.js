import Model, { attr, hasMany } from '@ember-data/model';

export default class WarehouseDepartmentModel extends Model {
  @attr name;
  @attr code;

  @hasMany('warehouse-location') warehouseLocations;
}
