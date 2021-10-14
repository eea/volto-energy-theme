/**
 * Search widget component.
 * @module components/theme/SearchWidget/SearchWidget
 */

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Form, Input } from 'semantic-ui-react';
import { compose } from 'redux';
import { PropTypes } from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { Icon } from '@plone/volto/components';
import zoomSVG from '@plone/volto/icons/zoom.svg';

import {
  quickResetSearchContent,
  quickSearchContent,
} from '@eeacms/volto-energy-theme/actions';

import { doesNodeContainClick } from 'semantic-ui-react/dist/commonjs/lib';
//import URLUtils from '@plone/volto/components/manage/AnchorPlugin/utils/URLUtils';

const messages = defineMessages({
  search: {
    id: 'Search',
    defaultMessage: 'Search',
  },
  searchSite: {
    id: 'Search Site',
    defaultMessage: 'Search Site',
  },
});

/**
 * SearchWidget component class.
 * @class SearchWidget
 * @extends Component
 */
class SearchWidget extends Component {
  static propTypes = {
    pathname: PropTypes.string.isRequired,
    quickResetSearchContent: PropTypes.func.isRequired,
    quickSearchContent: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.onChangeSection = this.onChangeSection.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.state = {
      text: '',
      section: false,
      active: false,
    };
    this.linkFormContainer = React.createRef();
  }

  componentDidMount() {
    this.props.quickResetSearchContent();
    document.addEventListener('mousedown', this.handleClickOutside, false);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside, false);
  }

  handleClickOutside = (e) => {
    if (
      this.linkFormContainer.current &&
      doesNodeContainClick(this.linkFormContainer.current, e)
    ) {
      this.setState({ active: true });
    } else {
      this.setState({ active: false });
    }
  };

  onChange(event, { value }) {
    // if (this.state.isInvalid && URLUtils.isUrl(URLUtils.normalizeUrl(value))) {
    //   nextState.isInvalid = false;
    // }
    if (value && value !== '') {
      this.props.quickSearchContent('', {
        Title: `*${value}*`,
      });
    } else {
      this.props.quickResetSearchContent();
    }
    this.setState({ text: value });
  }

  /**
   * On change section
   * @method onChangeSection
   * @param {object} event Event object.
   * @param {bool} checked Section checked.
   * @returns {undefined}
   */
  onChangeSection(event, { checked }) {
    this.setState({
      section: checked,
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location?.state?.text && this.props?.location?.state?.text) {
      if (prevProps.location.state.text !== this.props.location.state.text) {
        this.setState(
          {
            text: this.props?.location?.state?.text,
          },
          () => {
            const section = this.state.section
              ? `&path=${this.props.pathname}`
              : '';

            this.props.history.push({
              pathname: '/search',
              search: `?SearchableText=${this.state.text}${section}`,
              state: { text: this.state.text, section: section },
            });
          },
        );
      }
    }
  }

  /**
   * Submit handler
   * @method onSubmit
   * @param {event} event Event object.
   * @returns {undefined}
   */
  onSubmit(event) {
    const section = this.state.section ? `&path=${this.props.pathname}` : '';
    this.props.history.push({
      pathname: '/search',
      search: `?SearchableText=${this.state.text}${section}`,
      state: { text: this.state.text, section: section },
    });
    event && event.preventDefault();
  }

  onSelectItem = (item) => {
    this.setState(
      {
        text: item.title,
      },
      () => item?.['@id'] && this.props.history.push(item['@id']),
    );
    this.onClose();
  };

  onClose = () => {
    this.props.quickResetSearchContent();
    this.setState({ active: false });
  };

  render() {
    return (
      <div ref={this.linkFormContainer}>
        <Form autoComplete="off" action="/search" onSubmit={this.onSubmit}>
          <input
            autoComplete="false"
            name="hidden"
            type="text"
            style={{ display: 'none' }}
          />
          <Form.Field className="searchbox">
            <Input
              aria-label={this.props.intl.formatMessage(messages.search)}
              onChange={this.onChange}
              name="SearchableText"
              value={this.state.text}
              transparent
              placeholder={this.props.intl.formatMessage(messages.searchSite)}
              title={this.props.intl.formatMessage(messages.search)}
            />
            <button aria-label={this.props.intl.formatMessage(messages.search)}>
              <Icon name={zoomSVG} size="18px" />
            </button>
          </Form.Field>
          {this.state.active &&
          this.props.search &&
          this.props.search.length ? (
            <ul className="floating_search_results">
              {this.props.search.map((item) => (
                // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
                <li
                  onClick={() => this.onSelectItem(item)}
                  onKeyDown={() => this.onSelectItem(item)} //a11y
                  stylixe={{ padding: '5px' }}
                >
                  {item.title}
                </li>
              ))}
            </ul>
          ) : (
            ''
          )}
        </Form>
      </div>
    );
  }
}

// export default compose(
//   withRouter,
//   injectIntl,
// )(SearchWidget);

export default compose(
  withRouter,
  injectIntl,
  connect(
    (state) => ({
      search: state.quicksearch?.items,
    }),
    { quickResetSearchContent, quickSearchContent },
  ),
)(SearchWidget);
