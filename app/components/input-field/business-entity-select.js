import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { keepLatestTask, restartableTask, timeout } from 'ember-concurrency';
import constants from '../../config/constants';

const { BUSINESS_CATEGORIES } = constants;

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
        category: BUSINESS_CATEGORIES.SUPPLIER,
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
