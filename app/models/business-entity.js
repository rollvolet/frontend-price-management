import Model, { attr, hasMany } from '@ember-data/model';
import constants from '../config/constants';

const { BUSINESS_CATEGORIES } = constants;

export default class BusinessEntityModel extends Model {
  @attr('string') uri;
  @attr name;
  @attr description;
  @attr legalname;
  @attr vatNumber;
  @attr homepage;
  @attr comment;
  @attr category;
  @attr('datetime') created;
  @attr('datetime') modified;

  @hasMany('offering') offerings;

  get isSupplier() {
    return this.category == BUSINESS_CATEGORIES.SUPPLIER;
  }
}
