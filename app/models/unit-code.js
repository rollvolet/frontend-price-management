import Model, { attr, hasMany } from '@ember-data/model';

export default class UnitCodeModel extends Model {
  @attr('string') uri;
  @attr('string') label;
  @attr('string') notation;
  @attr('string') conceptScheme;

  @hasMany('unit-price-specification', { inverse: 'unitCode', async: true })
  unitPriceSpecifications;
}
