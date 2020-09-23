import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | main/categories', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:main/categories');
    assert.ok(route);
  });
});
