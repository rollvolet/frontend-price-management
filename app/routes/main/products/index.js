import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { isPresent } from '@ember/utils';
import search, { getWildcardFilterValue } from '../../../utils/mu-search';
import Snapshot from '../../../utils/snapshot';
import { copy } from 'ember-copy';
import ProductFilter from '../../../models/product-filter';

export default class MainProductsIndexRoute extends Route {
  @service store;

  queryParams = {
    page: {
      refreshModel: true,
    },
    size: {
      refreshModel: true,
    },
    sort: {
      refreshModel: true,
    },
    name: {
      refreshModel: true,
    },
    category: {
      refreshModel: true,
    },
    broaderCategory: {
      refreshModel: true,
    },
    identifier: {
      refreshModel: true,
    },
    supplier: {
      refreshModel: true,
    },
    supplierIdentifier: {
      refreshModel: true,
    },
    rack: {
      refreshModel: true,
    },
    availableOnly: {
      refreshModel: true,
    },
  };

  constructor() {
    super(...arguments);
    this.lastParams = new Snapshot();
  }

  async model(params) {
    this.lastParams.stageLive(params);

    if (this.lastParams.anyFieldChanged(Object.keys(params).filter((key) => key !== 'page'))) {
      params.page = 0;
    }

    const { supplier, category, broaderCategory, availableOnly } = params;
    this.supplier = supplier ? await this.store.findRecordByUri('business-entity', supplier) : null;
    this.category = category
      ? await this.store.findRecordByUri('product-category', category)
      : null;
    this.broaderCategory = broaderCategory
      ? await this.store.findRecordByUri('product-category', broaderCategory)
      : null;
    this.availableOnly = availableOnly;

    const filter = {};

    filter[':wildcard:name'] = getWildcardFilterValue(params.name);
    if (isPresent(params.identifier)) {
      filter['identifier'] = params.identifier;
    }
    filter['category.uuid'] = this.category?.id;
    filter['broaderCategory.uuid'] = this.broaderCategory?.id;
    filter['purchaseOffering.businessEntity.uuid'] = this.supplier?.id;
    filter[':wildcard:purchaseOffering.identifier'] = getWildcardFilterValue(
      params.supplierIdentifier
    );
    filter[':wildcard:warehouseLocation.rack'] = getWildcardFilterValue(params.rack);

    if (params.availableOnly) {
      // No validThrough dates in the future assumed.
      // (has-no || gt now) would require custom elastic query
      filter[':has-no:salesOffering.validThrough'] = 't';
    }

    this.lastParams.commit();

    return search('products', params.page, params.size, params.sort, filter, (product) => {
      const entry = product.attributes;
      entry.id = product.id;
      // create record for convenience of the isValid getter
      // final response stays a pojo
      const offering = this.store.createRecord('offering', {
        validFrom: entry.salesOffering.validFrom,
        validThrough: entry.salesOffering.validThrough,
      });
      entry.salesOffering.isValid = offering.isValid;
      offering.destroyRecord();
      return entry;
    });
  }

  setupController(controller) {
    super.setupController(...arguments);

    const filter = copy(this.lastParams.committed);
    filter.supplier = this.supplier;
    filter.category = this.category;
    filter.broaderCategory = this.broaderCategory;

    filter.availableOnly = this.availableOnly;
    if (!controller.filter) {
      controller.filter = new ProductFilter(filter);
    }

    controller.page = this.lastParams.committed.page;
    controller.size = this.lastParams.committed.size;
    controller.sort = this.lastParams.committed.sort;
  }

  @action
  loading(transition) {
    // eslint-disable-next-line ember/no-controller-access-in-routes
    const controller = this.controllerFor(this.routeName);
    controller.isLoadingModel = true;
    transition.promise.finally(function () {
      controller.isLoadingModel = false;
    });

    return true; // bubble the loading event
  }
}
