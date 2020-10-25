import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { keepLatestTask, restartableTask } from 'ember-concurrency-decorators';
import { timeout } from 'ember-concurrency';
import { SUPPLIER_CATEGORY } from '../../models/business-entity';

export default class InputFieldBusinessEntitySelectComponent extends Component {
  @service store;

  @tracked options = [];
  @tracked selected;

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
        category: SUPPLIER_CATEGORY
      }
    });

    if (this.args.value) {
      const selectedOptions = yield this.store.query('business-entity', {
        page: { size: 1 },
        filter: {
          ':exact:name': this.args.value
        }
      });
      this.selected = selectedOptions.firstObject;
    }
  }

  @restartableTask
  *search(term) {
    yield timeout(500);
    return this.store.query('business-entity', {
      page: { size: 50 },
      sort: 'name',
      filter: {
        name: term && term.toLowerCase(),
        category: SUPPLIER_CATEGORY
      }
    });
  }

  @action
  changeValue(selected) {
    this.selected = selected;
    this.args.onSelectionChange(this.selected && this.selected.name);
  }
}
