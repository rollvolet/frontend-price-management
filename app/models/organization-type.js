import Model, { attr } from '@ember-data/model';

export default class OrganizationTypeModel extends Model {
  @attr label;
  @attr notation;
  @attr conceptScheme;
}
