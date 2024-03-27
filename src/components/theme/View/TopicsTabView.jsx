/**
 * Document view component.
 * @module components/theme/View/DefaultView
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { defineMessages, injectIntl } from 'react-intl';

import { map } from 'lodash';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import config from '@plone/volto/registry';
import {
  getBlocksFieldname,
  getBlocksLayoutFieldname,
  hasBlocksData,
  getBaseUrl,
  Helmet,
  flattenToAppURL,
} from '@plone/volto/helpers';

const messages = defineMessages({
  unknownBlock: {
    id: 'Unknown Block',
    defaultMessage: 'Unknown Block {block}',
  },
});

class DefaultView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabs: null,
    };
  }

  static defaultProps = {
    parent: null,
  };
  static propTypes = {
    tabs: PropTypes.array,
    content: PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string,
      text: PropTypes.shape({
        data: PropTypes.string,
      }),
    }).isRequired,
    localNavigation: PropTypes.any,
  };

  validateTitle = (content) => {
    const title = content.name || content.title;
    return /[A-Za-z]/gi.test(title) ? title : content.id.toUpperCase();
  };

  computeFolderTabs = (siblings) => {
    const tabsItems = siblings?.items?.map((i) => {
      return {
        url: flattenToAppURL(i.url),
        title: this.validateTitle(i),
      };
    });
    return tabsItems;
  };

  render() {
    const content = this.props.content;
    const intl = this.props.intl;
    const blocksFieldname = getBlocksFieldname(content);
    const blocksLayoutFieldname = getBlocksLayoutFieldname(content);
    const tabs = this.computeFolderTabs(content['@components'].siblings);

    return (
      hasBlocksData(content) && (
        <div id="page-document" className="ui wrapper">
          {tabs && tabs.length ? (
            <nav className="tabs">
              {tabs.map((tab) => (
                <Link
                  key={`localtab-${tab.url}`}
                  className={`tabs__item${
                    (tab.url === this.props.location.pathname &&
                      ' tabs__item_active') ||
                    ''
                  }`}
                  to={tab.url}
                  title={tab.title}
                >
                  {tab.title}
                </Link>
              ))}
            </nav>
          ) : (
            ''
          )}
          <Helmet title={this.validateTitle(content)} />
          {map(content[blocksLayoutFieldname].items, (block) => {
            const Block =
              config.blocks.blocksConfig[
                content[blocksFieldname]?.[block]?.['@type']
              ]?.['view'] || null;
            return Block !== null ? (
              <Block
                key={`block-${block}`}
                blockID={block}
                properties={content}
                path={getBaseUrl(this.props.pathname || '')}
                data={content[blocksFieldname][block]}
              />
            ) : (
              <div key={`blocktype-${block}`}>
                {intl.formatMessage(messages.unknownBlock, {
                  block: content[blocksFieldname]?.[block]?.['@type'],
                })}
              </div>
            );
          })}
        </div>
      )
    );
  }
}

export default compose(
  injectIntl,
  connect((state, props) => ({
    pathname: props.location.pathname,
    content:
      state.prefetch?.[state.router.location.pathname] || state.content.data,
  })),
)(DefaultView);
