'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    // Add options here
    babel: {
      plugins: [require.resolve('ember-concurrency/async-arrow-task-transform')],
    },
    svgJar: {
      sourceDirs: ['public', 'node_modules/remixicon/icons'],
    },
    minifyCSS: {
      enabled: false
    }
  });

  return app.toTree();
};
