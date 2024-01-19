import Model, { attr, belongsTo } from '@ember-data/model';

export default class UserClass extends Model {
  @attr('string') uri;
  @attr('string') identifier;
  @attr('string') name;

  @belongsTo('account', { inverse: 'user' }) account;

  get firstName() {
    // TODO this is only a best guess. Get correct first name from DB.
    return this.name.split(' ')[0];
  }
}
