import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { keepLatestTask, all } from 'ember-concurrency';

export default class SearchProductCategorySelectComponent extends Component {
  @service store;

  @tracked options = [];
  @tracked selected;

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
        broaderLabel: broader && broader.label
      };
    }));

    if (this.args.scope == 'top') {
      this.options = wrappers
        .filter(wrapper => wrapper.broaderLabel == null)
        .map(wrapper => wrapper.category)
        .sortBy('label');
    } else if (this.args.scope) {
      this.options = wrappers
        .filter(wrapper => wrapper.broaderLabel == this.args.scope)
        .map(wrapper => wrapper.category)
        .sortBy('label');
    } else {
      this.options = [];
    }

    if (this.args.value) {
      this.selected = this.options.find(opt => opt.label.toLowerCase() == this.args.value.toLowerCase());

      if (this.args.value && !this.selected) // selected value cannot be found in list of options, hence unset selected value
        this.selectValue(null);
    }
  }

  @action
  selectValue(selected) {
    this.selected = selected;
    this.args.onSelectionChange(this.selected && this.selected.label);
  }

  @action
  onValueUpdate() {
    // value has been updated from outside. Make sure this.selected is in sync
    const selectedLabel = this.selected && this.selected.label;
    if (this.args.value != selectedLabel) {
      if (this.args.value)
        this.selected = this.options.find(opt => opt.label.toLowerCase() == this.args.value.toLowerCase());
      else
        this.selected = null;
    }
  }
}
