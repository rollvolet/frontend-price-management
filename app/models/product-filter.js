import { tracked } from '@glimmer/tracking';

export default class ProductFilter {
  @tracked name;
  @tracked category;
  @tracked broaderCategory;
  @tracked identifier;
  @tracked supplier;
  @tracked supplierIdentifier;
  @tracked rack;

  constructor(filter = {}) {
    for (let key of Object.keys(filter)) {
      this[key] = filter[key];
    }
  }

  get keys() {
    return [
      'name',
      'category',
      'broaderCategory',
      'identifier',
      'supplier',
      'supplierIdentifier',
      'rack',
      'availableOnly',
    ];
  }

  toQueryParams() {
    const val = {};
    for (let key of this.keys) {
      if (['supplier', 'category', 'broaderCategory'].includes(key)) {
        val[key] = this[key]?.uri;
      } else {
        val[key] = this[key];
      }
    }
    return val;
  }

  reset() {
    this.keys.forEach((key) => {
      if (key === 'availableOnly') {
        this[key] = false;
      } else {
        this[key] = undefined;
      }
    });
  }
}
