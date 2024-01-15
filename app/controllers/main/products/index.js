import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { restartableTask, timeout } from 'ember-concurrency';

export default class MainProductsIndexController extends Controller {
  @tracked page = 0;
  @tracked size = 20;
  @tracked sort = 'identifier';

  @tracked isLoadingModel;
  @tracked filter;
  @tracked name;
  @tracked category;
  @tracked broaderCategory;
  @tracked identifier;
  @tracked supplier;
  @tracked supplierIdentifier;
  @tracked rack;

  @restartableTask
  *search({ ms = 500 }) {
    yield timeout(ms);
    for (let key of this.filter.keys) {
      this[key] = this.filter[key];
    }
  }

  @action
  selectFilter(key, value) {
    this.filter[key] = value;
    this.search.perform({ ms: 0 });
  }

  @action
  previousPage() {
    this.selectPage(this.page - 1);
  }

  @action
  nextPage() {
    this.selectPage(this.page + 1);
  }

  @action
  selectPage(page) {
    this.page = page;
  }

  @action
  resetFilters() {
    for (let key of this.filter.keys) {
      this[key] = undefined;
    }
    this.filter.reset();
  }
}
