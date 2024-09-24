import Controller from '@ember/controller';
import { task, timeout } from 'ember-concurrency';
import { service } from '@ember/service';
import { action } from '@ember/object';
import constants from 'frontend-price-management/config/constants';
import TaskModel from 'frontend-price-management/models/task';
const { PRICELIST_EXPORT_TASK_OPERATION } = constants;

export default class MainProductsController extends Controller {
  @service router;
  @service store;

  get showCreateButton() {
    return this.router.currentRouteName == 'main.products.index';
  }

  async createExportTask() {
    const now = new Date();
    const exportTask = this.store.createRecord('task', {
      operation: PRICELIST_EXPORT_TASK_OPERATION,
      created: now,
      modified: now,
      status: TaskModel.SCHEDULED,
    });
    return exportTask.save();
  }

  @task
  *createExport() {
    const task = yield this.createExportTask();
    yield timeout(5000);
    // TODO proper polled task execution monitoring
    yield task.reload();
    if (!task.isSuccessful) {
      throw 'Exporttask failed executing';
    }
    const resultContainer = yield task.resultContainer;
    const files = yield resultContainer.files;
    const file = files[0];
    return file;
  }
}
