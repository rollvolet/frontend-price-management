import Model, { attr, hasMany } from '@ember-data/model';

export default class DataContainerModel extends Model {
  @attr('string') uri;
  @attr('string-set') content;
  @hasMany('file', { async: true }) files;
}
