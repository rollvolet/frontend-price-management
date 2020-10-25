import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { keepLatestTask } from 'ember-concurrency-decorators';

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
    const filter = {};

    if (this.args.scope == 'top')
      filter[':has-no:broader'] = true;
    else if (this.args.scope == 'sub')
      filter[':has:broader'] = true;

    this.options = yield this.store.query('product-category', {
      page: { size: 1000 },
      sort: 'label',
      filter
    });

    if (this.args.value) {
      this.selected = this.options.find(opt => opt.label.toLowerCase() == this.args.value.toLowerCase());
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
