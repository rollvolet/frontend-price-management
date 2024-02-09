import Service from '@ember/service';
import { service } from '@ember/service';
import { keepLatestTask } from 'ember-concurrency';

export default class PreloaderService extends Service {
  @service store;

  constructor() {
    super(...arguments);
    this.loadData.perform();
  }

  get isLoading() {
    return this.loadData.isRunning;
  }

  @keepLatestTask
  *loadData() {
    yield this.store.queryAll('product-category', {
      sort: 'label',
      include: 'broader',
    });
    yield this.store.queryAll('warehouse-department', {
      sort: 'name',
    });
    yield this.store.queryAll('unit-code', {
      sort: 'label',
    });
  }
}
