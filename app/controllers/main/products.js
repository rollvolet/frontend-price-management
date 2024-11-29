import Controller from '@ember/controller';
import { task, timeout } from 'ember-concurrency';
import { service } from '@ember/service';
import { action } from '@ember/object';
import TaskModel from 'frontend-price-management/models/task';

export default class MainProductsController extends Controller {
  @service router;
  @service store;
  @service taskMonitor;

  get showCreateButton() {
    return this.router.currentRouteName == 'main.products.index';
  }

  async createExportTask(operation) {
    const now = new Date();
    const exportTask = this.store.createRecord('task', {
      operation: operation,
      created: now,
      modified: now,
      status: TaskModel.SCHEDULED,
    });
    return exportTask.save();
  }

  @task
  *createExport(operation) {
    const task = yield this.createExportTask(operation);
    yield this.taskMonitor.monitor.perform(task);
    if (!task.isSuccessful) {
      throw 'Exporttask failed executing';
    }
    const resultContainer = yield task.resultContainer;
    const files = yield resultContainer.files;
    const file = files[0];
    return file;
  }
}
