import Controller from '@ember/controller';
import { task, timeout } from 'ember-concurrency';
import { service } from '@ember/service';
import { action } from '@ember/object';
import constants from 'frontend-price-management/config/constants';
import TaskModel from 'frontend-price-management/models/task';
const { PRICELIST_EXPORT_TASK_ALL_PROD_OP, PRICELIST_EXPORT_TASK_STOCK_OP } = constants;

export default class MainProductsController extends Controller {
  @service router;
  @service store;

  PRICELIST_EXPORT_TASK_ALL_PROD_OP = PRICELIST_EXPORT_TASK_ALL_PROD_OP;
  PRICELIST_EXPORT_TASK_STOCK_OP = PRICELIST_EXPORT_TASK_STOCK_OP;

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
