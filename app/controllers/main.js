import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default class MainController extends Controller {
  @service preloader;

  get isLoading() {
    return this.preloader.isLoading;
  }
}
