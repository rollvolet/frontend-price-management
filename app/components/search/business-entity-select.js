import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { keepLatestTask, restartableTask, timeout } from 'ember-concurrency';
import { SUPPLIER_CATEGORY } from '../../models/business-entity';

export default class SearchBusinessEntitySelectComponent extends Component {
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
        category: SUPPLIER_CATEGORY,
      },
    });

    if (this.args.value) {
      const selectedOptions = yield this.store.query('business-entity', {
        page: { size: 1 },
        filter: {
          ':exact:name': this.args.value,
        },
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
        category: SUPPLIER_CATEGORY,
      },
    });
  }

  @action
  selectValue(selected) {
    this.selected = selected;
    this.args.onSelectionChange(this.selected && this.selected.name);
  }

  @action
  onValueUpdate() {
    // value has been updated from outside. Make sure this.selected is in sync
    const selectedName = this.selected && this.selected.name;
    if (this.args.value != selectedName) {
      if (this.args.value) {
        this.selected = this.options.find(
          (opt) => opt.name.toLowerCase() == this.args.value.toLowerCase()
        );
      } else {
        this.selected = null;
      }
    }
  }
}
