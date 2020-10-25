import Controller from '@ember/controller';
import { action } from '@ember/object';
import { restartableTask } from 'ember-concurrency-decorators';
import { timeout } from 'ember-concurrency';

export default class MainProductsIndexController extends Controller {
  page = 0;
  size = 20;
  sort = 'identifier';

  @restartableTask
  *search({ ms = 500 }) {
    yield timeout(ms);
    for (let key of this.filter.keys) {
      this.set(key, this.filter[key]);
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
    this.set('page', page);
  }

  @action
  resetFilters() {
    for (let key of this.filter.keys) {
      this.set(key, undefined);
    }
    this.filter.reset();
  }
}
