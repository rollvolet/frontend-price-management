import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class ProductCategoryModel extends Model {
  @attr uri;
  @attr label;
  @attr conceptScheme;

  @belongsTo('product-category', { inverse: 'narrowers' }) broader;
  @hasMany('product-category', { inverse: 'broader' }) narrowers;
}
