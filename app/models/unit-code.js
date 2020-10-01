import Model, { attr } from '@ember-data/model';

export default class UnitCodeModel extends Model {
  @attr label;
  @attr notation;
  @attr conceptScheme;
}
