import EmberRouter from '@ember/routing/router';
import config from 'frontend-price-management/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('login');
  this.route('mock-login');
  this.route('oops');
  this.route('main', { path: '/' }, function () {
    this.route('products', function () {
      this.route('list', function () {
        this.route('prices');
      });
      this.route('new');
      this.route('detail', { path: '/:product_id' }, function () {
        this.route('edit');
      });
    });
    this.route('suppliers', function () {
      this.route('edit', { path: '/:supplier_id' });
    });
    this.route('categories', function () {});
  });
});
