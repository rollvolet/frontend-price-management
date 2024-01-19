import Model, { attr } from '@ember-data/model';

export default class OrganizationTypeModel extends Model {
  @attr('string') label;
  @attr('string') notation;
  @attr('string') conceptScheme;
}
