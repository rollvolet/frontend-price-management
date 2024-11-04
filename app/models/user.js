import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class UserClass extends Model {
  @attr('string') uri;
  @attr('string') identifier;
  @attr('string') name;

  @belongsTo('account', { inverse: 'user', async: true }) account;
  @hasMany('user-group', { inverse: 'users', async: true }) userGroups;

  get firstName() {
    // TODO this is only a best guess. Get correct first name from DB.
    return this.name.split(' ')[0];
  }
}
