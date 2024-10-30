import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { task } from 'ember-concurrency';
import { service } from '@ember/service';
import { schedule } from '@ember/runloop';
import constants from '../../config/constants';

const { BUSINESS_CATEGORIES } = constants;

export default class MainSuppliersController extends Controller {
  @service router;
  @service store;

  @tracked newSupplierName;
  @tracked newSupplierId;
  @tracked isOpenSupplierModal;

  get showCreateButton() {
    return this.router.currentRouteName == 'main.suppliers.index';
  }

  get newSupplierRkbLink() {
    if (this.newSupplierId) {
      return `https://rkb.rollvolet.be/customers/nb/${this.newSupplierId}`;
    }
    return undefined;
  }

  createSupplier = task(async () => {
    const supplier = this.store.createRecord('business-entity', {
      name: this.newSupplierName,
      identifier: this.newSupplierId,
      category: BUSINESS_CATEGORIES.SUPPLIER,
    });
    await supplier.save();
    this.closeNewSupplierModal();
    this.router.refresh('main.suppliers');
  });

  @action
  openNewSupplierModal() {
    this.isOpenSupplierModal = true;
    schedule('afterRender', this, function () {
      document.getElementById('new-supplier-name').focus();
    });
  }

  @action
  closeNewSupplierModal() {
    this.newSupplierName = null;
    this.newSupplierId = null;
    this.isOpenSupplierModal = false;
  }
}
