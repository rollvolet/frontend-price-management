import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { warn } from '@ember/debug';
import { A } from '@ember/array';
import { enqueueTask, keepLatestTask, task } from 'ember-concurrency-decorators';
import { all, timeout } from 'ember-concurrency';
import { VAT_RATE, PRICE_OUT_CALCULATION_BASIS, MARGIN_CALCULATION_BASIS } from '../../models/unit-price-specification';
import roundDecimal from '../../utils/round-decimal';

export default class ProductEditComponent extends Component {
  priceOutCalculationBasis = PRICE_OUT_CALCULATION_BASIS;
  marginCalculationBasis = MARGIN_CALCULATION_BASIS;

  @service store;
  @service notification;

  @tracked broaderCategory;
  @tracked showDeleteConfirmationModal = false;

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
      this.notification.addError({
        title: "Opslaan mislukt!",
        message: "Probeer het product nogmaals op te slaan.",
        error: e
      });
    }
  }

  @task
  *delete() {
    const warehouseLocation = yield this.args.model.warehouseLocation;
    const purchaseOffering = yield this.args.model.purchaseOffering;
    const purchasePrice = yield purchaseOffering.unitPriceSpecification;
    const salesOffering = yield this.args.model.salesOffering;
    const salesPrice = yield salesOffering.unitPriceSpecification;
    const attachments = yield this.args.model.attachments;

    yield this.args.model.destroyRecord();
    yield all([
      warehouseLocation,
      purchaseOffering,
      purchasePrice,
      salesOffering,
      salesPrice].map(record => record.destroyRecord()));
    yield all(attachments.map(file => file.destroyRecord()));
    yield timeout(4000); // wait for delete-delta to be handled by mu-search

    this.showDeleteConfirmationModal = false;
    if (this.args.onDelete)
      this.args.onDelete();
  }

  @keepLatestTask
  *recalculateSalesPrice() {
    const purchaseOffering = yield this.args.model.purchaseOffering;
    const purchasePrice = yield purchaseOffering.unitPriceSpecification;
    purchasePrice.currencyValue = roundDecimal(purchasePrice.currencyValue);

    const salesOffering = yield this.args.model.salesOffering;
    const salesPrice = yield salesOffering.unitPriceSpecification;

    if (salesPrice.calculationBasis == MARGIN_CALCULATION_BASIS) {
      salesPrice.margin = roundDecimal(salesPrice.margin);
      if (salesPrice.valueAddedTaxIncluded) {
        const value = purchasePrice.currencyValue * salesPrice.margin * (1 + VAT_RATE);
        salesPrice.currencyValue = roundDecimal(value);
      } else {
        const value = purchasePrice.currencyValue * salesPrice.margin;
        salesPrice.currencyValue = roundDecimal(value);
      }
    } else {
      salesPrice.currencyValue = roundDecimal(salesPrice.currencyValue);
      const margin = salesPrice.currencyValueTaxExcluded / purchasePrice.currencyValue;
      salesPrice.margin = roundDecimal(margin);
    }
  }

  @enqueueTask
  *uploadFile(file) {
    try {
      const response = yield file.upload('/files');
      const uploadedFile = yield this.store.findRecord('file', response.body.data.id);
      this.args.model.attachments.pushObject(uploadedFile);
    } catch(e) {
      this.notification.addError({
        title: "Er is iets misgelopen!",
        message: "Probeer het bestand nogmaals op te laden.",
        error: e
      });
    }
  }

  @task
  *deleteFile(file) {
    this.args.model.attachments.removeObject(file);
  }

  @action
  askToDelete() {
    this.showDeleteConfirmationModal = true;
  }

  @action
  cancelDelete() {
    this.showDeleteConfirmationModal = false;
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
  async setPriceIn(value) {
    const offering = await this.args.model.purchaseOffering;
    const price = await offering.unitPriceSpecification;
    price.currencyValue = value;
    this.recalculateSalesPrice.perform();
  }

  @action
  async setUnitPriceIn(unitCode) {
    const offering = await this.args.model.purchaseOffering;
    const price = await offering.unitPriceSpecification;
    price.unitCode = unitCode;
  }

  @action
  async setPriceOut(value) {
    const offering = await this.args.model.salesOffering;
    const price = await offering.unitPriceSpecification;
    price.currencyValue = value;
    this.recalculateSalesPrice.perform();
  }

  @action
  async setUnitPriceOut(unitCode) {
    const offering = await this.args.model.salesOffering;
    const price = await offering.unitPriceSpecification;
    price.unitCode = unitCode;
  }

  @action
  async setMargin(value) {
    const offering = await this.args.model.salesOffering;
    const price = await offering.unitPriceSpecification;
    price.margin = value;
    this.recalculateSalesPrice.perform();
  }
}
