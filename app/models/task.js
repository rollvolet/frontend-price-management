import Model, { attr, belongsTo } from '@ember-data/model';

export default class TaskModel extends Model {
  static BUSY = 'http://redpencil.data.gift/id/concept/JobStatus/busy';
  static SCHEDULED = 'http://redpencil.data.gift/id/concept/JobStatus/scheduled';
  static SUCCESS = 'http://redpencil.data.gift/id/concept/JobStatus/success';
  static FAILED = 'http://redpencil.data.gift/id/concept/JobStatus/failed';
  static CANCELED = 'http://redpencil.data.gift/id/concept/JobStatus/canceled';

  @attr('string') uri;
  @attr('string') status;
  @attr('datetime') created;
  @attr('datetime') modified;
  @attr('string') operation;
  @attr('string') index;

  // @belongsTo('job-error', { async: true, inverse: null }) error;
  // @belongsTo('job', { async: true, inverse: 'tasks' }) job;

  // @hasMany('task', { async: true, inverse: null }) parentTasks;

  @belongsTo('data-container', { async: true, inverse: null }) resultContainer;
  @belongsTo('data-container', { async: true, inverse: null }) inputContainer;

  get hasEnded() {
    return [
      TaskModel.SUCCESS,
      TaskModel.FAILED,
      TaskModel.CANCELED,
    ].includes(this.status);
  }

  get isSuccessful() {
    return this.status === TaskModel.SUCCESS;
  }
}
