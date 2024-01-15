import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | preloader', function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function (assert) {
    let service = this.owner.lookup('service:preloader');
    assert.ok(service);
  });
});
