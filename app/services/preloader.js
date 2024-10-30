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

  loadData = keepLatestTask(async () => {
    await this.store.queryAll('product-category', {
      sort: 'label',
      include: 'broader',
    });
    await this.store.queryAll('warehouse-department', {
      sort: 'name',
    });
    await this.store.queryAll('unit-code', {
      sort: 'label',
    });
  });
}
