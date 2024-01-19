import Model, { attr, hasMany } from '@ember-data/model';

export default class WarehouseDepartmentModel extends Model {
  @attr('string') uri;
  @attr('string') name;
  @attr('string') code;

  @hasMany('warehouse-location', { inverse: 'department', async: true }) warehouseLocations;
}
