import Controller from '@ember/controller';
import { task } from 'ember-concurrency';
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

  @task
  *createExport(operation) {
    const now = new Date();
    const exportTask = this.store.createRecord('task', {
      operation: operation,
      created: now,
      modified: now,
      status: TaskModel.SCHEDULED,
    });
    yield exportTask.save();

    yield this.taskMonitor.monitor.perform(exportTask);
    if (exportTask.isSuccessful) {
      const resultContainer = yield exportTask.resultContainer;
      const files = yield resultContainer.files;
      const file = files[0];
      return file;
    } else {
      throw 'Export task failed';
    }
  }

  @action
  openExportFile() {
    window.open(this.createExport.lastSuccessful.value.downloadLink, '_blank');
    this.createExport.cancelAll({ resetState: true });
  }
}
