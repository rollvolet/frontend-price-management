import Service from '@ember/service';
import { A } from '@ember/array';
import { task, timeout } from 'ember-concurrency';

export default class TaskMonitorService extends Service {
  tasks = A([]);

  @task
  *monitor(task) {
    this.tasks.pushObject(task);
    while (!task.hasEnded) {
      yield timeout(1000);
      yield task.reload();
    }
    this.tasks.removeObject(task);
    return task;
  }
}
