import Model, { attr, hasMany } from '@ember-data/model';

export default class UnitCodeModel extends Model {
  @attr uri;
  @attr label;
  @attr notation;
  @attr conceptScheme;

  @hasMany('unit-price-specification') unitPriceSpecifications;
}
