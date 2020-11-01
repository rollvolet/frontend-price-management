import Route from '@ember/routing/route';

export default class MainIndexRoute extends Route {
  beforeModel() {
    this.transitionTo('main.products.index');
  }
}
