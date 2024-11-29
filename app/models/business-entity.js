import Model, { attr, hasMany } from '@ember-data/model';

export default class BusinessEntityModel extends Model {
  @attr('string') uri;
  @attr('string') name;
  @attr('string') category;
  @attr('string') identifier;

  get rkbLink() {
    if (this.identifier) {
      return `https://rkb.rollvolet.be/customers/nb/${this.identifier}`;
    }
    return undefined;
  }

  @hasMany('offering', { inverse: 'businessEntity', async: true }) offerings;
}
