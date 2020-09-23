import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | main/products/index', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:main/products/index');
    assert.ok(route);
  });
});
