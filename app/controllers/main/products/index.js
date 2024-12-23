import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { isBlank } from '@ember/utils';
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
  @tracked availableOnly = true;

  @tracked previewProduct;

  debounceFilter = restartableTask(async (key, event) => {
    const value = event.target.value;
    this.filter[key] = isBlank(value) ? undefined : value;
    await timeout(500);
    await this.applyFilter();
  });

  @action
  selectFilter(key, value) {
    this.filter[key] = value;
    if (key == 'broaderCategory') {
      this.filter['category'] = undefined;
    }
    this.applyFilter();
  }

  @action
  resetFilters() {
    this.filter.reset();
    this.applyFilter();
  }

  // Copy values of this.filter to tracked properties on this controller.
  // This will trigger a model refresh.
  applyFilter() {
    const qpValues = this.filter.toQueryParams();
    for (let key of Object.keys(qpValues)) {
      this[key] = qpValues[key];
    }
  }

  @action
  showPreview(product) {
    this.previewProduct = product;
  }

  @action
  closePreview() {
    this.previewProduct = undefined;
  }

  @action
  toggleAvailableOnly() {
    this.availableOnly = !this.availableOnly;
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
}
