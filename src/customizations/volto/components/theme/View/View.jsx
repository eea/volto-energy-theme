/**
 * View container.
 * @module components/theme/View/View
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Portal } from 'react-portal';
import { injectIntl } from 'react-intl';
import qs from 'query-string';
import config from '@plone/volto/registry';

import { Comments, Tags, Toolbar } from '@plone/volto/components';
import { listActions, getContent } from '@plone/volto/actions';
import {
  BodyClass,
  getBaseUrl,
  getLayoutFieldname,
} from '@plone/volto/helpers';
import Scrollspy from 'react-scrollspy';

/**
 * View container class.
 * @class View
 * @extends Component
 */
class View extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    actions: PropTypes.shape({
      object: PropTypes.arrayOf(PropTypes.object),
      object_buttons: PropTypes.arrayOf(PropTypes.object),
      user: PropTypes.arrayOf(PropTypes.object),
    }),
    // listActions: PropTypes.func.isRequired,
    /**
     * Action to get the content
     */
    // getContent: PropTypes.func.isRequired,
    /**
     * Pathname of the object
     */
    // pathname: PropTypes.string.isRequired,
    location: PropTypes.shape({
      search: PropTypes.string,
      pathname: PropTypes.string,
    }).isRequired,
    /**
     * Version id of the object
     */
    versionId: PropTypes.string,
    /**
     * Content of the object
     */
    content: PropTypes.shape({
      /**
       * Layout of the object
       */
      layout: PropTypes.string,
      /**
       * Allow discussion of the object
       */
      allow_discussion: PropTypes.bool,
      /**
       * Title of the object
       */
      title: PropTypes.string,
      /**
       * Description of the object
       */
      description: PropTypes.string,
      /**
       * Type of the object
       */
      '@type': PropTypes.string,
      /**
       * Subjects of the object
       */
      subjects: PropTypes.arrayOf(PropTypes.string),
      is_folderish: PropTypes.bool,
    }),
    error: PropTypes.shape({
      /**
       * Error type
       */
      status: PropTypes.number,
    }),
  };

  /**
   * Default properties.
   * @property {Object} defaultProps Default properties.
   * @static
   */
  static defaultProps = {
    actions: null,
    content: null,
    versionId: null,
    error: null,
  };

  state = {
    hasObjectButtons: null,
    headings: [],
  };

  /**
   * Component will mount
   * @method componentWillMount
   * @returns {undefined}
   */
  componentDidMount() {
    this.props.listActions(getBaseUrl(this.props.pathname));
    this.props.getContent(
      getBaseUrl(this.props.pathname),
      this.props.versionId,
    );

    if (
      __CLIENT__ &&
      this.props.content &&
      this.props.content.table_of_contents &&
      document.querySelector('.inPageNavigation')
    ) {
      this.makeHeadings();
    }
  }

  compareTwoArraysOfHeadings = (arr1, arr2) => {
    // returns true if any object in arr1 can't be found in arr2
    return arr1.some(
      (arr1Item) =>
        !arr2.find(
          (arr2Item) =>
            arr1Item.id === arr2Item.id && arr1Item.text === arr2Item.text,
        ),
    );
  };

  componentDidUpdate(prevProps, prevState) {
    // path comparison here doesn't work, because the path will update before the content
    if (
      this.props.content?.table_of_contents &&
      prevProps.content.id !== this.props.content.id &&
      !this.compareTwoArraysOfHeadings(prevState.headings, this.state.headings)
    ) {
      if (
        __CLIENT__ &&
        this.props.content &&
        this.props.content.table_of_contents &&
        document.querySelector('.inPageNavigation')
      ) {
        this.makeHeadings();
      }
    }
    if (this.props.pathname !== prevProps.pathname) {
      this.props.listActions(getBaseUrl(this.props.pathname));
      this.props.getContent(
        getBaseUrl(this.props.pathname),
        this.props.versionId,
      );
    }
  }

  /**
   * Component will receive props
   * @method componentWillReceiveProps
   * @param {Object} nextProps Next properties
   * @returns {undefined}
   */
  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.pathname !== this.props.pathname) {
  //     this.props.listActions(getBaseUrl(nextProps.pathname));
  //     this.props.getContent(
  //       getBaseUrl(nextProps.pathname),
  //       this.props.versionId,
  //     );
  //   }

  //   if (nextProps.actions.object_buttons) {
  //     const objectButtons = nextProps.actions.object_buttons;
  //     this.setState({
  //       hasObjectButtons: !!objectButtons.length,
  //     });
  //   }
  // }

  /**
   * Default fallback view
   * @method getViewDefault
   * @returns {string} Markup for component.
   */
  getViewDefault = () => config.views.defaultView;

  /**
   * Get view by content type
   * @method getViewByType
   * @returns {string} Markup for component.
   */
  getViewByType = () =>
    config.views.contentTypesViews[this.props.content['@type']] || null;

  /**
   * Get view by content layout property
   * @method getViewByLayout
   * @returns {string} Markup for component.
   */
  getViewByLayout = () =>
    config.views.layoutViews[
      this.props.content[getLayoutFieldname(this.props.content)]
    ] || null;

  /**
   * Cleans the component displayName (specially for connected components)
   * which have the Connect(componentDisplayName)
   * @method cleanViewName
   * @param  {string} dirtyDisplayName The displayName
   * @returns {string} Clean displayName (no Connect(...)).
   */
  cleanViewName = (dirtyDisplayName) =>
    dirtyDisplayName.replace('Connect(', '').replace(')', '').toLowerCase();

  makeHeadings() {
    const headings = Array.from(
      document.querySelectorAll('.content-page h2'),
    ).map((el, index) => {
      const id = `${index}`;
      el.setAttribute('id', id);
      const text = el.innerText;
      // console.log(text)
      return { id, text };
    });
    // if(headings && headings.lenght) {
    // return headings
    // }
    this.setState({ headings });
  }

  render() {
    if (this.props.error) {
      let FoundView;
      if (this.props.error.status === undefined) {
        // For some reason, while development and if CORS is in place and the
        // requested resource is 404, it returns undefined as status, then the
        // next statement will fail
        FoundView = config.views.errorViews['404'];
      } else {
        FoundView = config.views.errorViews[this.props.error.status.toString()];
      }
      if (!FoundView) {
        FoundView = config.views.errorViews['404']; // default to 404
      }
      return (
        <div id="view">
          <FoundView />
        </div>
      );
    }
    if (!this.props.content) {
      return <span />;
    }
    const RenderedView =
      this.getViewByType() || this.getViewByLayout() || this.getViewDefault();
    const hasTocAndHeadings =
      this.props.content &&
      this.props.content.table_of_contents &&
      __CLIENT__ &&
      document.querySelector('.inPageNavigation') &&
      this.state.headings &&
      this.state.headings.length;

    return (
      <div id="view">
        {/* Body class if displayName in component is set */}
        <BodyClass
          className={
            RenderedView.displayName
              ? `view-${this.cleanViewName(RenderedView.displayName)}`
              : null
          }
        />

        {/* Body class depending on content type */}
        {this.props.content && this.props.content['@type'] && (
          <BodyClass
            className={`contenttype-${this.props.content['@type']
              .replace(' ', '-')
              .toLowerCase()}`}
          />
        )}

        <RenderedView
          content={this.props.content}
          location={this.props.location}
          token={this.props.token}
          history={this.props.history}
        />

        {this.props.content.subjects &&
          this.props.content.subjects.length > 0 && (
            <Tags tags={this.props.content.subjects} />
          )}
        {/* Add opt-in social sharing if required, disabled by default */}
        {/* In the future this might be parameterized from the app config */}
        {/* <SocialSharing
          url={typeof window === 'undefined' ? '' : window.location.href}
          title={this.props.content.title}
          description={this.props.content.description || ''}
        /> */}
        {this.props.content.allow_discussion && (
          <Comments pathname={this.props.pathname} />
        )}

        <Portal node={__CLIENT__ && document.getElementById('toolbar')}>
          <Toolbar pathname={this.props.pathname} inner={<span />} />
        </Portal>
        {hasTocAndHeadings ? (
          <Portal
            node={__CLIENT__ && document.querySelector('.inPageNavigation')}
          >
            <div className="headings_navigation">
              <h5>
                <b>In page navigation</b>
              </h5>
              <Scrollspy
                className="scrollspy headings_navigation_list"
                items={this.state.headings.map(({ id }) => id)}
                currentClassName="isCurrent"
              >
                {this.state.headings.map(({ id, text }) => (
                  <li key={id}>
                    <a href={`#${id}`}>{text}</a>
                  </li>
                ))}
              </Scrollspy>
            </div>
          </Portal>
        ) : (
          ''
        )}
      </div>
    );
  }
}

export default compose(
  injectIntl,
  connect(
    (state, props) => ({
      actions:
        state.prefetch?.[state.router.location.pathname]?.['@components']
          ?.actions,
      token: state.userSession.token,
      content:
        state.prefetch?.[state.router.location.pathname] || state.content.data,
      error: state.content.get.error,
      pathname: state.router.location.pathname,
      versionId:
        qs.parse(props.location.search) &&
        qs.parse(props.location.search).version_id,
    }),
    {
      listActions,
      getContent,
    },
  ),
)(View);
