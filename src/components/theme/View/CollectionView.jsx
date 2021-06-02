/**
 * Document view component.
 * @module components/theme/View/CollectionView
 */

import React, { useState, useEffect } from 'react';
import { Helmet } from '@plone/volto/helpers';
import { Container, Item } from 'semantic-ui-react';
import { useSelector, useDispatch } from 'react-redux';
import Filter from '@eeacms/volto-energy-theme/components/manage/Blocks/Listing/Filter';

import { find } from 'lodash';

import {
  getBlocksFieldname,
  getBlocksLayoutFieldname,
} from '@plone/volto/helpers';
import config from '@plone/volto/registry';
import { getBaseUrl } from '@plone/volto/helpers';
import ListingBlockTemplate from '@eeacms/volto-energy-theme/components/manage/Blocks/Listing/ListTemplate';
import { getContentWithData } from '@eeacms/volto-energy-theme/actions';
import cx from 'classnames';

/**
 * List view component class.
 * @function CollectionView
 * @params {object} content Content object.
 * @returns {string} Markup of the component.
 */

// const filterResults = (results = [], filterValue, facetFilter) => {
//   if (!(filterValue && facetFilter)) return results;

//   return results.filter((obj) =>
//     (obj[facetFilter.token] || []).indexOf(filterValue) > -1 ? true : false,
//   );
// };

const CollectionView = (props) => {
  const { content } = props;
  const dispatch = useDispatch();
  const [activeFilter, setActiveFilter] = useState('');

  let path = content['@id']
    .replace(config.settings.internalApiPath, '')
    .replace(config.settings.apiPath, '');
  path = getBaseUrl(path);

  const blocksFieldname = getBlocksFieldname(content);
  const blocksLayoutFieldname = getBlocksLayoutFieldname(content);

  const getListingBlock = () => {
    return find(
      content[blocksLayoutFieldname].items,
      (block) => content[blocksFieldname]?.[block]?.['@type'] === 'listing',
    );
  };

  const listingBlockid = getListingBlock();

  const listingBlockItems = useSelector((state) => state.content.subrequests);
  const items = listingBlockItems[listingBlockid]?.data?.items;

  useEffect(() => {
    //This is only done to get full expanded content along with metadata fields which is,
    // not possible with listing block's @querystring-search default action
    // which intern force to use two content items :(, this needs to be refactored
    const options = {
      metadata_fields: '_all',
      is_search: 1,
      fullobjects: true,
    };
    dispatch(getContentWithData(path, null, listingBlockid, options));
  }, [dispatch, path, listingBlockid]);

  const handleSelectFilter = (ev, { name }) => {
    setActiveFilter(name);
  };

  const listingBlockProps = content[blocksFieldname]?.[listingBlockid] || {};

  return (
    <Container>
      <Helmet title={content.title} />
      <section id="content-core">
        <div className="search-listing item-listing">
          <Item.Group>
            <h1
              style={{
                marginTop: '0',
                marginLeft: '2rem',
                marginRight: '2rem',
              }}
              className="documentFirstHeading"
            >
              {content.title}
              {content.subtitle && ` - ${content.subtitle}`}
            </h1>
            {content.description && (
              <p
                style={{ marginLeft: '2rem', marginRight: '2rem' }}
                className="documentDescription"
              >
                {content.description}
              </p>
            )}
            <div className={cx('block listing', listingBlockProps.variation)}>
              {items ? (
                <>
                  <ListingBlockTemplate
                    items={items}
                    {...listingBlockProps}
                    isEditMode={false}
                  />
                  {content.filter ? (
                    <Filter
                      handleSelectFilter={handleSelectFilter}
                      facetFilter={content.filter}
                      selectedValue={activeFilter}
                      results={listingBlockItems[listingBlockid]?.data?.items}
                    />
                  ) : (
                    ''
                  )}
                </>
              ) : (
                <div>No results Found</div>
              )}
            </div>
          </Item.Group>
        </div>
      </section>
    </Container>
  );
};
export default CollectionView;
