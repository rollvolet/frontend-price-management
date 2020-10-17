import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { keepLatestTask } from 'ember-concurrency-decorators';
import { inject as service } from '@ember/service';
import { ROLLVOLET_URI } from '../../models/business-entity';

export default class ProductTableRowComponent extends Component {
  @service store;

  @tracked salesPrice;
  @tracked offering;

  constructor() {
    super(...arguments);
    this.loadData.perform();
  }

  @keepLatestTask
  *loadData() {
    const offerings = yield this.store.query('offering', {
      page: { size: 1 },
      'filter[business-entity][:uri:]': ROLLVOLET_URI,
      'filter[products][:id:]': this.args.model.id,
      include: [
        'unit-price-specifications.unit-code',
        'business-entity'
      ].join(',')
    });
    this.offering = offerings.firstObject;
    if (this.offering) {
      const priceSpecifications = yield this.offering.unitPriceSpecifications;
      this.salesPrice = priceSpecifications.firstObject;
    }
  }
}
