import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { keepLatestTask, task } from 'ember-concurrency-decorators';
import { inject as service } from '@ember/service';

export default class CategoryListItemComponent extends Component {
  @service store;

  @tracked isExpanded = false;
  @tracked isEnabledInput = false;
  @tracked subcategories = [];
  @tracked newCategory;

  @keepLatestTask
  *loadSubcategories() {
    if (!this.subcategories.length)
      this.subcategories = yield this.args.model.narrowers;
  }

  get sortedSubcategories() {
    return this.subcategories.sortBy('label');
  }

  @action
  toggleIsExpanded() {
    this.isExpanded = !this.isExpanded;
    if (this.isExpanded)
      this.loadSubcategories.perform();
  }

  @action
  addCategory() {
    this.newCategory = null;
    this.isEnabledInput = true;
  }

  @task
  *saveCategory() {
    if (this.newCategory) {
      this.isEnabledInput = false;
      const category = this.store.createRecord('product-category', {
        label: this.newCategory,
        conceptScheme: this.args.model.conceptScheme,
        broader: this.args.model
      });
      yield category.save();
      this.subcategories = this.subcategories; // required to trigger rerender
      this.newCategory = null;
    } else {
      this.isEnabledInput = false;
    }
  }

  @action
  cancelCategory() {
    this.isEnabledInput = false;
    this.newCategory = null;
  }
}
