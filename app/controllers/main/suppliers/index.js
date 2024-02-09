import Controller from '@ember/controller';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class MainSuppliersIndexController extends Controller {
  @service router;

  @tracked page = 0;
  @tracked size = 25;
  @tracked sort = 'name';

  @action
  async deleteSupplier(supplier) {
    await supplier.destroyRecord();
    this.router.refresh('main.suppliers.index');
  }

  @action
  previousPage() {
    this.selectPage(this.page - 1);
  }

  @action
  nextPage() {
    this.selectPage(this.page + 1);
  }

  @action
  selectPage(page) {
    this.page = page;
  }
}
