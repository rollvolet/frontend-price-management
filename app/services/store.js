// eslint-disable-next-line ember/use-ember-data-rfc-395-imports
import Store from 'ember-data/store';
import ArrayProxy from '@ember/array/proxy';

export default class ExtendedStoreService extends Store {
  /*
   * Executes regulare "query"-method. Queries for only one result and returns that if any.
   */
  async queryOne(modelName, queryOptions, options) {
    const query = queryOptions || {};
    if (!(query['page[size]'] || (query.page && query.page.size))) {
      query['page[size]'] = 1;
    }
    const results = await this.query(modelName, query, options);
    if (results.length) {
      return results[0];
    } else {
      return null;
    }
  }

  async count(modelName, query, options) {
    query = query || {};
    if (!(query['page[size]'] || (query.page && query.page.size))) {
      query['page[size]'] = 1;
    }
    const results = await this.query(modelName, query, options);
    const count = results.meta.count;
    return count;
  }

  findRecordByUri(modelName, uri) {
    const cachedRecord = this.peekAll(modelName).find((model) => model.uri == uri);
    if (cachedRecord) {
      return cachedRecord;
    } else {
      return this.queryOne(modelName, {
        'filter[:uri:]': uri,
      });
    }
  }

  async queryAll(modelName, query, options) {
    query = query || {}; // eslint-disable-line no-param-reassign
    let batchSize = query['page[size]'] || (query.page && query.page.size);
    if (!batchSize) {
      batchSize = 100;
      query['page[size]'] = batchSize;
    }
    const firstBatch = await this.query(modelName, query, options);
    const count = firstBatch.meta.count;
    const nbOfBatches = Math.ceil(count / batchSize);
    const batches = [];
    for (let i = 1; i < nbOfBatches; i++) {
      const queryForBatch = Object.assign({}, query, {
        'page[size]': batchSize,
        'page[number]': i,
      });
      const batch = this.query(modelName, queryForBatch, options);
      batches.push(batch);
    }

    const otherBatches = await Promise.all(batches);
    return ArrayProxy.create({
      content: [firstBatch, ...otherBatches].map((batch) => batch.slice(0)).flat(),
      meta: {
        count,
      },
    });
  }
}
