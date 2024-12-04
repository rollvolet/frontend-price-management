import Controller from '@ember/controller';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class MainUsersIndexController extends Controller {
  @service router;
  @service store;

  @tracked page = 0;
  @tracked size = 50;
  @tracked sort = 'name';
  @tracked selectedUser;

  get isOpenEditModal() {
    return this.selectedUser != null;
  }

  @action
  openEditModal(user) {
    this.selectedUser = user;
  }

  @action
  closeEditModal() {
    this.selectedUser = null;
  }

  @action
  refreshModel() {
    this.closeEditModal();
    this.router.refresh('main.users.index');
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
