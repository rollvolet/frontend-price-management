import { attr, belongsTo } from '@ember-data/model';
import ProvenanceModel from './provenance-model';
import { isAfter } from 'date-fns';
import { isPresent } from '@ember/utils';

export default class OfferingModel extends ProvenanceModel {
  @attr('string') name;
  @attr('string') identifier;
  @attr('string') availability;
  @attr('datetime') validFrom;
  @attr('datetime') validThrough;

  @belongsTo('product', { inverse: 'purchaseOffering', async: true }) purchaseProduct;
  @belongsTo('product', { inverse: 'salesOffering', async: true }) salesProduct;
  @belongsTo('unit-price-specification', { inverse: 'offering', async: true })
  unitPriceSpecification;
  @belongsTo('business-entity', { inverse: 'offerings', async: true }) businessEntity;

  get isValid() {
    if (isPresent(this.validThrough)) {
      return isAfter(this.validThrough, new Date());
    }
    return true;
  }
}
