import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import { guidFor } from '@ember/object/internals';
import { keepLatestTask, all } from 'ember-concurrency';
import { compare } from '@ember/utils';

export default class InputFieldProductCategorySelectComponent extends Component {
  @service store;

  @tracked options = [];
  @tracked selected;

  constructor() {
    super(...arguments);
    this.loadData.perform();
  }

  loadData = keepLatestTask(async () => {
    const categories = this.store.peekAll('product-category');

    const wrappers = await all(
      categories.map(async (category) => {
        const broader = await category.broader;
        return {
          category,
          broaderUri: broader?.uri,
        };
      }),
    );

    if (this.args.scope == 'top') {
      this.options = wrappers
        .filter((wrapper) => !wrapper.broaderUri)
        .map((wrapper) => wrapper.category)
        .sort((a, b) => compare(a.label, b.label));
    } else if (this.args.scope) {
      this.options = wrappers
        .filter((wrapper) => wrapper.broaderUri == this.args.scope.uri)
        .map((wrapper) => wrapper.category)
        .sort((a, b) => compare(a.label, b.label));
    } else {
      this.options = [];
    }
  });

  get fieldId() {
    return `product-category-select-${guidFor(this)}`;
  }
}
