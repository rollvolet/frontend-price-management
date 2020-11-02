import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { keepLatestTask } from 'ember-concurrency-decorators';
import { PRICE_OUT_CALCULATION_BASIS, MARGIN_CALCULATION_BASIS } from '../../models/unit-price-specification';

export default class ProductEditComponent extends Component {
  priceOutCalculationBasis = PRICE_OUT_CALCULATION_BASIS;
  marginCalculationBasis = MARGIN_CALCULATION_BASIS;

  @tracked broaderCategory;

  constructor() {
    super(...arguments);
    this.loadData.perform();
  }

  @keepLatestTask
  *loadData() {
    const category = yield this.args.model.category;
    if (category)
      this.broaderCategory = yield category.broader;
    else
      this.broaderCategory = null;
  }

  @action
  setBroaderCategory(category) {
    if (this.broaderCategory != category)
      this.args.model.category = null; // new top-level has been selected, hence reset category
    this.broaderCategory = category;
  }

  @action
  setCategory(category) {
    this.args.model.category = category;
  }

  @action
  async setSupplier(supplier) {
    const offering = await this.args.model.purchaseOffering;
    offering.businessEntity = supplier;
  }

  @action
  async setWarehouseDepartment(department) {
    const warehouseLocation = await this.args.model.warehouseLocation;
    warehouseLocation.department = department;
  }

  @action
  async setPriceOutCalculationBasis() {
    const offering = await this.args.model.salesOffering;
    const price = await offering.unitPriceSpecification;
    price.calculationBasis = PRICE_OUT_CALCULATION_BASIS;
  }

  @action
  async setMarginCalculationBasis() {
    const offering = await this.args.model.salesOffering;
    const price = await offering.unitPriceSpecification;
    price.calculationBasis = MARGIN_CALCULATION_BASIS;
  }

  @action
  async setUnitPriceIn(unitCode) {
    const offering = await this.args.model.purchaseOffering;
    const price = await offering.unitPriceSpecification;
    price.unitCode = unitCode;
  }

  @action
  async setUnitPriceOut(unitCode) {
    const offering = await this.args.model.salesOffering;
    const price = await offering.unitPriceSpecification;
    price.unitCode = unitCode;
  }
}
