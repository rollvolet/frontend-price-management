'use strict';

module.exports = function (environment) {
  let ENV = {
    modulePrefix: 'frontend-price-management',
    environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false,
      },
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    torii: {
      disableRedirectInitializer: true,
      providers: {
        'azure-ad2-oauth2': {
          tenantId: '3e9b8827-39f2-4fb4-9bc1-f8a200aaea79',
          apiKey: '5f012056-5ae1-48d5-9f8d-305221a92cf3',
          scope: 'User.Read',
          redirectUri: 'http://localhost:4200/torii/redirect.html',
        },
      },
    },
    'ember-simple-auth': {
      routeAfterAuthentication: 'main.products.index',
    },
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    ENV.torii.providers['azure-ad2-oauth2'].apiKey = '{{AUTH_CLIENT_ID}}';
    ENV.torii.providers['azure-ad2-oauth2'].redirectUri =
      '{{AUTH_REDIRECT_URI}}';
  }

  return ENV;
};
