import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { keepLatestTask, restartableTask, timeout } from 'ember-concurrency';
import { SUPPLIER_CATEGORY } from '../../models/business-entity';

export default class InputFieldBusinessEntitySelectComponent extends Component {
  @service store;

  @tracked options = [];

  constructor() {
    super(...arguments);
    this.loadData.perform();
  }

  @keepLatestTask
  *loadData() {
    this.options = yield this.store.query('business-entity', {
      page: { size: 50 },
      sort: 'name',
      filter: {
        category: SUPPLIER_CATEGORY,
      },
    });
  }

  @restartableTask
  *search(term) {
    yield timeout(500);
    return this.store.query('business-entity', {
      page: { size: 50 },
      sort: 'name',
      filter: {
        name: term && term.toLowerCase(),
        category: SUPPLIER_CATEGORY,
      },
    });
  }
}
