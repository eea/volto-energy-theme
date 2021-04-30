/**
 * Add your helpers here.
 * @module helpers
 * @example
 * export { Api } from './Api/Api';
 */
import config from '@plone/volto/registry';
import { getBaseUrl } from '@plone/volto/helpers';

export function getBasePath(url) {
  return getBaseUrl(url)
    .replace(config.settings.apiPath, '')
    .replace(config.settings.internalApiPath, '');
}
