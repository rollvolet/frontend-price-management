import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { isEmpty } from '@ember/utils';
import search from '../../../utils/mu-search';
import Snapshot from '../../../utils/snapshot';
import { copy } from 'ember-copy';
import ProductFilter from '../../../models/product-filter';

export default class MainProductsIndexRoute extends Route {
  queryParams = {
    page: {
      refreshModel: true
    },
    size: {
      refreshModel: true
    },
    sort: {
      refreshModel: true
    },
    name: {
      refreshModel: true
    },
    category: {
      refreshModel: true
    },
    broaderCategory: {
      refreshModel: true
    },
    identifier: {
      refreshModel: true
    },
    supplier: {
      refreshModel: true
    },
    supplierIdentifier: {
      refreshModel: true
    },
    rack: {
      refreshModel: true
    }
  }

  constructor() {
    super(...arguments);
    this.lastParams = new Snapshot();
  }

  model(params) {
    this.lastParams.stageLive(params);

    if (this.lastParams.anyFieldChanged(Object.keys(params).filter((key) => key !== 'page'))) {
      params.page = 0;
    }

    const filter = {};

    if (!isEmpty(params.name)) {
      filter[':wildcard:name'] = params.name.includes('*') ? params.name : `*${params.name}*`;
    }
    if (!isEmpty(params.identifier)) {
      filter['identifier'] = params.identifier;
    }
    if (!isEmpty(params.category)) {
      filter[':term:category'] = params.category;
    }
    if (!isEmpty(params.broaderCategory)) {
      filter[':term:broaderCategory'] = params.broaderCategory;
    }
    if (!isEmpty(params.supplier)) {
      filter[':term:purchaseOffering.businessEntity'] = params.supplier;
    }
    if (!isEmpty(params.supplierIdentifier)) {
      filter[':wildcard:purchaseOffering.identifier'] = params.supplierIdentifier;
    }
    if (!isEmpty(params.rack)) {
      filter[':wildcard:warehouseLocation.rack'] = params.rack;
    }

    if (!Object.keys(filter).length) {
      filter[':sqs:name'] = '*';
    }

    this.lastParams.commit();

    return search('products', params.page, params.size, params.sort, filter, (product) => {
      const entry = product.attributes;
      entry.id = product.id;
      return entry;
    });
  }

  setupController(controller) {
    super.setupController(...arguments);
    controller.set('filter', new ProductFilter(copy(this.lastParams.committed)));
    controller.set('page', this.lastParams.committed.page);
    controller.set('size', this.lastParams.committed.size);
    controller.set('sort', this.lastParams.committed.sort);
  }

  @action
  loading(transition) {
    const controller = this.controllerFor(this.routeName);
    controller.set('isLoadingModel', true);
    transition.promise.finally(function() {
      controller.set('isLoadingModel', false);
    });

    return true; // bubble the loading event
  }
}
