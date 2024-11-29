import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class DataContainerModel extends Model {
  @attr('string') uri;
  @attr('string-set') content;

  @belongsTo('task', { async: true, inverse: 'inputContainer' }) inputFromTasks;
  @belongsTo('task', { async: true, inverse: 'resultContainer' }) resultFromTasks;
  @hasMany('file', { async: true, inverse: 'dataContainers' }) files;
}
