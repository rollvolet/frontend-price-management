import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

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

  @belongsTo('data-container', { async: true, inverse: 'inputFromTasks' }) inputContainer;
  @belongsTo('data-container', { async: true, inverse: 'resultFromTasks' }) resultContainer;

  get hasEnded() {
    return [TaskModel.SUCCESS, TaskModel.FAILED, TaskModel.CANCELED].includes(this.status);
  }

  get isSuccessful() {
    return this.status === TaskModel.SUCCESS;
  }
}
