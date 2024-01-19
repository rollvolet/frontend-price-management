import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class ProductCategoryModel extends Model {
  @attr('string') uri;
  @attr('string') label;
  @attr('string') conceptScheme;

  @belongsTo('product-category', { inverse: 'narrowers', async: true }) broader;
  @hasMany('product-category', { inverse: 'broader', async: true }) narrowers;
}
