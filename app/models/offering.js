import Model, { attr, belongsTo } from '@ember-data/model';

export default class OfferingModel extends Model {
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
}
