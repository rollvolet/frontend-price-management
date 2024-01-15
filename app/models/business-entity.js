import Model, { attr, hasMany } from '@ember-data/model';

const ROLLVOLET_URI =
  'http://data.rollvolet.be/business-entities/b5e1f237-6b17-4698-b581-e0a61396936f';
const SUPPLIER_CATEGORY =
  'http://data.rollvolet.be/business-categories/34104acc-3633-4ea6-a465-87075d0e1cd1';

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
    return this.category == SUPPLIER_CATEGORY;
  }
}

export { ROLLVOLET_URI, SUPPLIER_CATEGORY };
