import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { keepLatestTask, task } from 'ember-concurrency';
import { service } from '@ember/service';
import { compare } from '@ember/utils';
import { TrackedArray } from 'tracked-built-ins';

export default class CategoryListItemComponent extends Component {
  @service store;

  @tracked isExpanded = false;
  @tracked isEnabledInput = false;
  @tracked subcategories = new TrackedArray([]);
  @tracked newCategory;

  loadSubcategories = keepLatestTask(async () => {
    if (!this.subcategories.length) {
      this.subcategories = await this.args.model.narrowers;
    }
  });

  get sortedSubcategories() {
    return this.subcategories.slice(0).sort((a, b) => compare(a.label, b.label));
  }

  @action
  toggleIsExpanded() {
    this.isExpanded = !this.isExpanded;
    if (this.isExpanded) {
      this.loadSubcategories.perform();
    }
  }

  @action
  addCategory() {
    this.newCategory = null;
    this.isEnabledInput = true;
  }

  createCategory = task(async () => {
    if (this.isEnabledInput) {
      if (this.newCategory) {
        this.isEnabledInput = false;
        const category = this.store.createRecord('product-category', {
          label: this.newCategory,
          conceptScheme: this.args.model.conceptScheme,
          broader: this.args.model,
        });
        await category.save();
        this.newCategory = null;
      } else {
        this.isEnabledInput = false;
      }
    } // else input wasn't enabled. Just ignore.
  });

  @action
  cancelNewCategory() {
    this.isEnabledInput = false;
    this.newCategory = null;
  }

  saveCategory = task(async (category) => {
    await category.save();
  });

  @action
  cancelEditCategory(category) {
    category.rollbackAttributes();
  }
}
