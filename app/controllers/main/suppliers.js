import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import constants from '../../config/constants';

const { BUSINESS_CATEGORIES } = constants;

export default class MainSuppliersController extends Controller {
  @service router;
  @service store;

  @tracked newSupplierName;
  @tracked isOpenSupplierModal;

  get showCreateButton() {
    return this.router.currentRouteName == 'main.suppliers.index';
  }

  @task
  *createSupplier() {
    const supplier = this.store.createRecord('business-entity', {
      name: this.newSupplierName,
      category: BUSINESS_CATEGORIES.SUPPLIER,
    });
    yield supplier.save();
    this.router.refresh('main.suppliers.index');
  }

  @action
  openNewSupplierModal() {
    this.isOpenSupplierModal = true;
  }

  @action
  closeNewSupplierModal() {
    this.newSupplierName = null;
    this.isOpenSupplierModal = false;
  }
}
