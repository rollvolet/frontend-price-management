import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | main/products/new', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:main/products/new');
    assert.ok(route);
  });
});
