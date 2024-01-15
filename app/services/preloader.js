import Service from '@ember/service';
import { inject as service } from '@ember/service';
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
    yield this.store.query('product-category', {
      page: { size: 1000 },
      sort: 'label',
      include: 'broader',
    });
    yield this.store.query('warehouse-department', {
      page: { size: 1000 },
      sort: 'name',
    });
    yield this.store.query('unit-code', {
      page: { size: 1000 },
      sort: 'label',
    });
  }
}
