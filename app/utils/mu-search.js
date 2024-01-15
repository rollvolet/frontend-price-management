import fetch from 'fetch';
import ArrayProxy from '@ember/array/proxy';
import { A } from '@ember/array';

function getPaginationMetadata(pageNumber, size, total) {
  const pagination = {};

  pagination.first = {
    number: 0,
    size,
  };

  const lastPageNumber =
    total % size === 0 ? Math.floor(total / size) - 1 : Math.floor(total / size);
  const lastPageSize = total % size === 0 ? size : total % size;
  pagination.last = {
    number: lastPageNumber,
    size: lastPageSize,
  };

  pagination.self = {
    number: pageNumber,
    size,
  };

  if (pageNumber > 0) {
    pagination.prev = {
      number: pageNumber - 1,
      size,
    };
  }

  if (pageNumber < lastPageNumber) {
    const nextPageSize = pageNumber + 1 === lastPageNumber ? lastPageSize : size;
    pagination.next = {
      number: pageNumber + 1,
      size: nextPageSize,
    };
  }

  return pagination;
}

function sortOrder(sort) {
  if (sort.startsWith('-')) {
    return 'desc';
  }
  if (sort.length > 0) {
    return 'asc';
  }
  return null;
}

function stripSort(sort) {
  return sort.replace(/(^\+)|(^-)/g, '');
}

function snakeToCamel(text) {
  return text.replace(/(-\w)/g, (entry) => entry[1].toUpperCase());
}

async function muSearch(index, page, size, sort, filter, dataMapping) {
  const endpoint = new URL(`/${index}/search`, window.location.origin);
  const params = new URLSearchParams(
    Object.entries({
      'page[size]': size,
      'page[number]': page,
    })
  );

  for (const field in filter) {
    params.append(`filter[${field}]`, filter[field]);
  }

  if (sort) {
    params.append(`sort[${snakeToCamel(stripSort(sort))}]`, sortOrder(sort));
  }

  endpoint.search = params.toString();

  const response = await fetch(endpoint, {
    headers: {
      Accept: 'application/vnd.api+json',
    },
  });
  const { count, data } = await response.json();
  const pagination = getPaginationMetadata(page, size, count);
  const entries = A(data.map(dataMapping));

  return ArrayProxy.create({
    content: entries,
    meta: {
      count,
      pagination,
    },
  });
}

export default muSearch;
