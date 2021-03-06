/**
 * Add your actions here.
 * @module actions
 * @example
 * import {
 *   searchContent,
 * } from './search/search';
 *
 * export {
 *   searchContent,
 * };
 */

import {
  SET_FOLDER_HEADER,
  SET_FOLDER_TABS,
  GET_PARENT_FOLDER_DATA,
  GET_LOCALNAVIGATION,
  QUICK_RESET_SEARCH_CONTENT,
  QUICK_SEARCH_CONTENT,
  GET_INDEX_VALUES,
} from '../constants/ActionTypes';

import { GET_CONTENT } from '@plone/volto/constants/ActionTypes';

import { compact, concat, isArray, join, map, pickBy, toPairs } from 'lodash';

// export { getChartDataFromVisualization } from 'volto-blocks/actions'

// const getChartDataFromVisualization = getChartDataFromVisualization
// export getChartDataFromVisualization
// console.log(getChartDataFromVisualization)

// export getChartDataFromVisualization;

export function setFolderHeader(payload) {
  const actualPayload = {};
  for (const key in payload) {
    if (payload[key] !== null && payload[key] !== undefined) {
      actualPayload[key] = payload[key];
    }
  }

  if (Object.keys(actualPayload)) {
    return {
      type: SET_FOLDER_HEADER,
      payload: actualPayload,
    };
  }
  return;
}

export function getIndexValues(name) {
  return {
    type: GET_INDEX_VALUES,
    request: {
      op: 'post',
      path: '/@index-values',
      data: { name },
    },
  };
}

export function getLocalnavigation(folder) {
  return {
    type: GET_LOCALNAVIGATION,
    request: {
      op: 'get',
      path: `${folder}/@localnavigation?expand.navigation.depth=2`,
    },
  };
}

export function setFolderTabs(payload) {
  return {
    type: SET_FOLDER_TABS,
    payload: payload,
  };
}

export function getParentFolderData(url) {
  return {
    type: GET_PARENT_FOLDER_DATA,
    request: {
      op: 'get',
      path: `/${url}?fullobjects`,
    },
  };
}

export function quickSearchContent(url, options, subrequest = null) {
  let queryArray = [];
  const arrayOptions = pickBy(options, (item) => isArray(item));

  queryArray = concat(
    queryArray,
    options
      ? join(
          map(toPairs(pickBy(options, (item) => !isArray(item))), (item) => {
            if (item[0] === 'SearchableText') {
              // Adds the wildcard to the SearchableText param
              item[1] = `${item[1]}*`;
            }
            return join(item, '=');
          }),
          '&',
        )
      : '',
  );

  queryArray = concat(
    queryArray,
    arrayOptions
      ? join(
          map(pickBy(arrayOptions), (item, key) =>
            join(
              item.map((value) => `${key}:list=${value}`),
              '&',
            ),
          ),
          '&',
        )
      : '',
  );

  const querystring = join(compact(queryArray), '&');

  return {
    type: QUICK_SEARCH_CONTENT,
    subrequest,
    request: {
      op: 'get',
      path: `${url}/@search${querystring ? `?${querystring}` : ''}`,
    },
  };
}

export function quickResetSearchContent(subrequest = null) {
  return {
    type: QUICK_RESET_SEARCH_CONTENT,
    subrequest,
  };
}

export function getContentWithData(
  url,
  version = null,
  subrequest = null,
  data = {},
) {
  let qs = Object.keys(data)
    .map(function (key) {
      return key + '=' + data[key];
    })
    .join('&');

  return {
    type: GET_CONTENT,
    subrequest,
    request: {
      op: 'get',
      path: `${url}${version ? `/@history/${version}` : ''}${
        qs ? `?${qs}` : ''
      }`,
      data,
    },
  };
}
