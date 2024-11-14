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
  this.route('forbidden');
  this.route('main', { path: '/' }, function () {
    this.route('products', function () {
      this.route('new');
      this.route('detail', { path: '/:product_id' }, function () {
        this.route('edit');
      });
    });
    this.route('suppliers', function () {
      this.route('edit', { path: '/:supplier_id' });
    });
    this.route('categories', function () {});
    this.route('users', function () {});
  });
});
