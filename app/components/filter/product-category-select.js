import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { guidFor } from '@ember/object/internals';
import { keepLatestTask, all } from 'ember-concurrency';

export default class FilterProductCategorySelectComponent extends Component {
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

    const wrappers = yield all(
      categories.map(async (category) => {
        const broader = await category.broader;
        return {
          category,
          broaderUri: broader?.uri,
        };
      })
    );

    if (this.args.scope == 'top') {
      this.options = wrappers
        .filter((wrapper) => !wrapper.broaderUri)
        .map((wrapper) => wrapper.category)
        .sortBy('label');
    } else if (this.args.scope) {
      this.options = wrappers
        .filter((wrapper) => wrapper.broaderUri == this.args.scope.uri)
        .map((wrapper) => wrapper.category)
        .sortBy('label');
    } else {
      this.options = [];
    }
  }

  get fieldId() {
    return `filter-product-category-select-${guidFor(this)}`;
  }
}
