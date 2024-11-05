import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import { enqueueTask, keepLatestTask, task, timeout } from 'ember-concurrency';
import constants from '../../config/constants';
import { without } from 'frontend-price-management/utils/array';
import { recalculateSalesPrice } from '../../utils/product-price';

const { CALCULATION_BASIS } = constants;

export default class ProductEditComponent extends Component {
  priceOutCalculationBasis = CALCULATION_BASIS.PRICE_OUT;
  marginCalculationBasis = CALCULATION_BASIS.MARGIN;

  @service store;
  @service notification;

  @tracked broaderCategory;
  @tracked showDeleteConfirmationModal = false;
  @tracked newAlias;

  constructor() {
    super(...arguments);
    this.loadData.perform();
  }

  loadData = keepLatestTask(async () => {
    const category = await this.args.model.category;
    if (category) {
      this.broaderCategory = await category.broader;
    } else {
      this.broaderCategory = null;
    }
  });

  rollback = task(async () => {
    const warehouseLocation = await this.args.model.warehouseLocation;
    const purchaseOffering = await this.args.model.purchaseOffering;
    const purchasePrice = await purchaseOffering.unitPriceSpecification;
    const salesOffering = await this.args.model.salesOffering;
    const salesPrice = await salesOffering.unitPriceSpecification;

    warehouseLocation.rollbackAttributes();
    purchasePrice.rollbackAttributes();
    purchaseOffering.rollbackAttributes();
    salesPrice.rollbackAttributes();
    salesOffering.rollbackAttributes();
    this.args.model.rollbackAttributes();

    // reset state of relationships for an existing record
    if (this.args.model.id) {
      await Promise.all([
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
  });

  cancel = task(async () => {
    await this.rollback.perform();
    this.args.onCancel();
  });

  save = task(async () => {
    // TODO add some validation
    try {
      const [warehouseLocation, purchaseOffering, salesOffering] = await Promise.all([
        this.args.model.warehouseLocation,
        this.args.model.purchaseOffering,
        this.args.model.salesOffering,
      ]);
      const [purchasePrice, salesPrice] = await Promise.all([
        purchaseOffering.unitPriceSpecification,
        salesOffering.unitPriceSpecification,
      ]);
      await Promise.all([warehouseLocation.save(), purchasePrice.save(), salesPrice.save()]);
      await Promise.all([purchaseOffering.save(), salesOffering.save()]);
      await this.args.model.save();

      if (this.args.onSave) {
        this.args.onSave();
      }
    } catch (e) {
      this.notification.addError({
        title: 'Opslaan mislukt!',
        message: 'Probeer het product nogmaals op te slaan.',
        error: e,
      });
    }
  });

  delete = task(async () => {
    const [warehouseLocation, purchaseOffering, salesOffering, attachments] = await Promise.all([
      this.args.model.warehouseLocation,
      this.args.model.purchaseOffering,
      this.args.model.salesOffering,
      this.args.model.attachments,
    ]);
    const [purchasePrice, salesPrice] = await Promise.all([
      purchaseOffering.unitPriceSpecification,
      salesOffering.unitPriceSpecification,
    ]);
    await this.args.model.destroyRecord();
    await Promise.all(
      [warehouseLocation, purchaseOffering, purchasePrice, salesOffering, salesPrice].map(
        (record) => record.destroyRecord(),
      ),
    );
    await Promise.all(attachments.map((file) => file.destroyRecord()));
    await timeout(4000); // wait for delete-delta to be handled by mu-search

    this.showDeleteConfirmationModal = false;
    if (this.args.onDelete) {
      this.args.onDelete();
    }
  });

  recalculateProductSalesPrice = keepLatestTask(async () => {
    await recalculateSalesPrice(this.args.model);
  });

  uploadFile = enqueueTask(async (file) => {
    try {
      const response = await file.upload('/files');
      const { data } = await response.json();
      const uploadedFile = await this.store.findRecord('file', data.id);
      const attachments = await this.args.model.attachments;
      attachments.push(uploadedFile);
    } catch (e) {
      this.notification.addError({
        title: 'Er is iets misgelopen!',
        message: 'Probeer het bestand nogmaals op te laden.',
        error: e,
      });
    }
  });

  deleteFile = task(async (file) => {
    let attachments = await this.args.model.attachments;
    this.args.model.attachments = without(attachments, file);
  });

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
    if (this.broaderCategory != category) {
      this.args.model.category = null; // new top-level has been selected, hence reset category
    }
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
  async setCalculationBasis(e) {
    const calculationBasis = e.target.value;
    const offering = await this.args.model.salesOffering;
    const price = await offering.unitPriceSpecification;
    price.calculationBasis = calculationBasis;
  }

  @action
  async setPriceIn(value) {
    const offering = await this.args.model.purchaseOffering;
    const price = await offering.unitPriceSpecification;
    price.currencyValue = value;
    this.recalculateProductSalesPrice.perform();
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
    this.recalculateProductSalesPrice.perform();
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
    this.recalculateProductSalesPrice.perform();
  }
}
