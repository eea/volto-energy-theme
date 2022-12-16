/**
 * Breadcrumbs components.
 * @module components/theme/Breadcrumbs/Breadcrumbs
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import { Breadcrumb } from 'semantic-ui-react';
import { defineMessages, injectIntl } from 'react-intl';

import { Icon } from '@plone/volto/components';

import config from '@plone/volto/registry';

import homeSVG from '@plone/volto/icons/home.svg';
import { getBreadcrumbs } from '@plone/volto/actions';
import { getBaseUrl } from '@plone/volto/helpers';

const messages = defineMessages({
  home: {
    id: 'Home',
    defaultMessage: 'Home',
  },
});

const RouterLink = ({ item }) => {
  const url = (item?.url || item?.['@id']) && (item?.url || item?.['@id'])
    .replace(config.settings.apiPath, '')
    .replace(config.settings.internalApiPath, '');
  return (
    <Link title={item.title} to={url} className="section">
      {item.title}
    </Link>
  );
};

/**
 * Breadcrumbs container class.
 * @class Breadcrumbs
 * @extends Component
 */
class Breadcrumbs extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    pathname: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        url: PropTypes.string,
      }),
    ).isRequired,
  };

  /**
   *
   *
   * @memberof Breadcrumbs
   */
  componentDidMount() {
    this.props.getBreadcrumbs(getBaseUrl(this.props.pathname));
  }

  /**
   *
   *
   * @param {*} prevProps
   * @memberof Breadcrumbs
   */
  componentDidUpdate(prevProps) {
    if (this.props.pathname !== prevProps.pathname) {
      this.props.getBreadcrumbs(getBaseUrl(this.props.pathname));
    }
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    return (
      <Breadcrumb>
        <Link
          to="/"
          key="home-section-/"
          className="section"
          title={this.props.intl.formatMessage(messages.home)}
        >
          <Icon name={homeSVG} size="18px" />
        </Link>
        {this.props.items &&
          this.props.items.length > 0 &&
          this.props.items.map((item, index, items) => [
            <Breadcrumb.Divider key={`divider-${index}-${item.url}`} />,
            index < items.length - 1 ? (
              <RouterLink item={item} key={index} />
            ) : (
              <Breadcrumb.Section key={`section-${item.url}`} active>
                {item.title}
              </Breadcrumb.Section>
            ),
          ])}
      </Breadcrumb>
    );
  }
}

export default compose(
  injectIntl,
  connect(
    (state) => {
      return {
        items: state.breadcrumbs?.items || [],
      };
    },
    { getBreadcrumbs },
  ),
)(Breadcrumbs);
