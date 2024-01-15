import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

export default class MainCategoriesIndexController extends Controller {
  @tracked page = 0;
  @tracked size = 50;
  @tracked sort = 'label';
}
