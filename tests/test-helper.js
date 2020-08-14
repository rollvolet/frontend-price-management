import Application from 'frontend-price-management/app';
import config from 'frontend-price-management/config/environment';
import { setApplication } from '@ember/test-helpers';
import { start } from 'ember-qunit';

setApplication(Application.create(config.APP));

start();
