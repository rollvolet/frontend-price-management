import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Controller | main/products/new', function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function (assert) {
    let controller = this.owner.lookup('controller:main/products/new');
    assert.ok(controller);
  });
});
