import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { keepLatestTask } from 'ember-concurrency-decorators';
import { all } from 'ember-concurrency';

export default class InputProductCategorySelectComponent extends Component {
  @service store;

  @tracked options = [];

  constructor() {
    super(...arguments);
    this.loadData.perform();
  }

  @keepLatestTask
  *loadData() {
    const categories = this.store.peekAll('product-category');

    const wrappers = yield all(categories.map(async (category) => {
      const broader = await category.broader;
      return {
        category,
        broaderUri: broader && broader.uri
      };
    }));

    if (this.args.scope == 'top') {
      this.options = wrappers
        .filter(wrapper => wrapper.broaderUri == null)
        .map(wrapper => wrapper.category)
        .sortBy('label');
    } else if (this.args.scope) {
      this.options = wrappers
        .filter(wrapper => wrapper.broaderUri == this.args.scope)
        .map(wrapper => wrapper.category)
        .sortBy('label');
    } else {
      this.options = [];
    }

    const value = yield this.args.value; // argument may be a promise/proxy object
    if (value) {
      const selected = this.options.find(opt => opt.uri == value.uri);
      if (!selected) // selected value cannot be found in list of options, hence unset selected value
        this.selectValue(null);
    }
  }

  @action
  selectValue(selected) {
    this.args.onSelectionChange(selected);
  }
}
