import { attr, hasMany, belongsTo } from '@ember-data/model';
import ProvenanceModel from './provenance-model';

export default class ProductModel extends ProvenanceModel {
  @attr('language-string-set') name;
  @attr('language-string-set', {
    // even though we use ember-mu-transform-helpers, this default isn't covered
    // TODO: check if we can offload this default to the library
    defaultValue() {
      return [];
    },
  })
  alternateNames;
  @attr('string') description;
  @attr('number') identifier;
  @attr('boolean') includeInStockReport;

  @belongsTo('warehouse-location', { inverse: 'products', async: true }) warehouseLocation;
  @belongsTo('offering', { inverse: 'purchaseProduct', async: true }) purchaseOffering;
  @belongsTo('offering', { inverse: 'salesProduct', async: true }) salesOffering;
  @belongsTo('product-category', { inverse: null, async: true }) category;
  @hasMany('file', { inverse: null, async: true }) attachments;
}
