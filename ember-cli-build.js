'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    // Add options here
    svgJar: {
      sourceDirs: ['public', 'node_modules/remixicon/icons'],
    },
  });

  return app.toTree();
};
