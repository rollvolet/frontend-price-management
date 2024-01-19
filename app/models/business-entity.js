import Model, { attr, hasMany } from '@ember-data/model';

export default class BusinessEntityModel extends Model {
  @attr('string') uri;
  @attr('string') name;
  @attr('string') description;
  @attr('string') legalname;
  @attr('string') vatNumber;
  @attr('string') homepage;
  @attr('string') comment;
  @attr('string') category;
  @attr('datetime') created;
  @attr('datetime') modified;

  @hasMany('offering', { inverse: 'businessEntity', async: true }) offerings;
}
