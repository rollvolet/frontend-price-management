import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { warn } from '@ember/debug';
import { A } from '@ember/array';
import { keepLatestTask, task } from 'ember-concurrency-decorators';
import { all } from 'ember-concurrency';
import { VAT_RATE, PRICE_OUT_CALCULATION_BASIS, MARGIN_CALCULATION_BASIS } from '../../models/unit-price-specification';
import formatDecimal from '../../utils/format-decimal';

export default class ProductEditComponent extends Component {
  priceOutCalculationBasis = PRICE_OUT_CALCULATION_BASIS;
  marginCalculationBasis = MARGIN_CALCULATION_BASIS;

  @tracked broaderCategory;
  @tracked errors = A();

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

  @task
  *rollback() {
    const warehouseLocation = yield this.args.model.warehouseLocation;
    const purchaseOffering = yield this.args.model.purchaseOffering;
    const purchasePrice = yield purchaseOffering.unitPriceSpecification;
    const salesOffering = yield this.args.model.salesOffering;
    const salesPrice = yield salesOffering.unitPriceSpecification;

    warehouseLocation.rollbackAttributes();
    purchasePrice.rollbackAttributes();
    purchaseOffering.rollbackAttributes();
    salesPrice.rollbackAttributes();
    salesOffering.rollbackAttributes();
    this.args.model.rollbackAttributes();

    if (!this.args.model.isNew) {
      yield all([
        warehouseLocation.belongsTo('department').reload(),
        purchasePrice.belongsTo('unitCode').reload(),
        purchaseOffering.belongsTo('unitPriceSpecification').reload(),
        purchaseOffering.belongsTo('businessEntity').reload(),
        salesPrice.belongsTo('unitCode').reload(),
        salesOffering.belongsTo('unitPriceSpecification').reload(),
        this.args.model.belongsTo('category').reload(),
        this.args.model.belongsTo('warehouseLocation').reload(),
        this.args.model.belongsTo('purchaseOffering').reload(),
        this.args.model.belongsTo('salesOffering').reload(),
      ]);

      this.loadData.perform(); // restore broaderCategory
    }
  }

  @task
  *cancel() {
    yield this.rollback.perform();
    this.args.onCancel();
  }

  @task
  *save() {
    this.errors = A();
    // TODO add some validation
    try {
      const warehouseLocation = yield this.args.model.warehouseLocation;
      yield warehouseLocation.save();
      const purchaseOffering = yield this.args.model.purchaseOffering;
      const purchasePrice = yield purchaseOffering.unitPriceSpecification;
      yield purchasePrice.save();
      yield purchaseOffering.save();
      const salesOffering = yield this.args.model.salesOffering;
      const salesPrice = yield salesOffering.unitPriceSpecification;
      yield salesPrice.save();
      yield salesOffering.save();
      yield this.args.model.save();

      if (this.args.onSave)
        this.args.onSave();
    } catch (e) {
      warn(`Failed to save product: ${e}`, { id: 'save.failure' });
      this.errors = A(['Opslaan mislukt. Contacteer support als dit probleem zich blijft voordoen.']);
    }
  }

  @keepLatestTask
  *recalculateSalesPrice() {
    const purchaseOffering = yield this.args.model.purchaseOffering;
    const purchasePrice = yield purchaseOffering.unitPriceSpecification;
    purchasePrice.currencyValue = formatDecimal(purchasePrice.currencyValue);

    const salesOffering = yield this.args.model.salesOffering;
    const salesPrice = yield salesOffering.unitPriceSpecification;

    if (salesPrice.calculationBasis == MARGIN_CALCULATION_BASIS) {
      salesPrice.margin = formatDecimal(salesPrice.margin);
      if (salesPrice.valueAddedTaxIncluded) {
        const value = purchasePrice.currencyValue * salesPrice.margin * (1 + VAT_RATE);
        salesPrice.currencyValue = formatDecimal(value);
      } else {
        const value = purchasePrice.currencyValue * salesPrice.margin;
        salesPrice.currencyValue = formatDecimal(value);
      }
    } else {
      salesPrice.currencyValue = formatDecimal(salesPrice.currencyValue);
      const margin = salesPrice.currencyValueTaxExcluded / purchasePrice.currencyValue;
      salesPrice.margin = formatDecimal(margin);
    }
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
