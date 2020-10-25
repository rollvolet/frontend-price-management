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
    return ['name',
            'category',
            'broaderCategory',
            'identifier',
            'supplier',
            'supplierIdentifier',
            'rack'
           ];
  }

  reset() {
    this.keys.forEach(key => this[key] = undefined);
  }
}
