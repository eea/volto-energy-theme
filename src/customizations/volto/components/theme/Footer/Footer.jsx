/**
 * Footer component.
 * @module components/theme/Footer/Footer
 */

import React from 'react';
import { Segment, Grid } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';
import cx from 'classnames';
import eeaLogo from '@eeacms/volto-energy-theme/components/theme/Footer/ec.svg.png';
import ecLogo from '@eeacms/volto-energy-theme/components/theme/Footer/eea.png';
import { connect } from 'react-redux';

import { Anontools } from '@plone/volto/components';

// const messages = defineMessages({
//   copyright: {
//     id: 'Copyright',
//     defaultMessage: 'Copyright',
//   },
// });

/**
 * Component to display the footer.
 * @function Footer
 * @param {Object} intl Intl object
 * @returns {string} Markup of the component
 */
const Footer = (props) => (
  <Segment
    role="contentinfo"
    vertical
    padded
    textAlign="center"
    className="footer"
  >
    {/* <Container fluid> */}
    <Grid>
      <Grid.Column width={3} />
      <Grid.Column tablet={12} computer={6} largeScreen={6}>
        <Grid columns={2}>
          <Grid.Column
            // style={{
            //   display: 'flex',
            //   justifyContent: 'center',
            //   alignItems: 'center',
            //   textAlign: 'left',
            //   flexDirection: 'column',
            // }}
            style={{ textAlign: 'left', padding: '2rem' }}
            tablet={12}
            computer={6}
            largeScreen={6}
          >
            <p>
              Find information on the EU and its Member States' progress towards
              their 2030 targets on climate and energy.
            </p>
            <div>
              <ul
                className={cx('unlist', {
                  ulist: props.token,
                })}
              >
                {!props.token && (
                  <li className="tools">
                    <Anontools />
                  </li>
                )}
                <li>
                  <Link className="item" to="/contact">
                    <FormattedMessage id="contact" defaultMessage="Contact" />
                  </Link>
                </li>
                <li>
                  <Link className="item" to="/privacy_statement">
                    <FormattedMessage
                      id="privacy"
                      defaultMessage="Privacy statement"
                    />
                  </Link>
                </li>
                <li>
                  <Link className="item" to="/legal_notice">
                    <FormattedMessage
                      id="legal"
                      defaultMessage="Legal notice"
                    />
                  </Link>
                </li>
              </ul>
            </div>
          </Grid.Column>
          <Grid.Column
            tablet={12}
            computer={6}
            largeScreen={6}
            className={cx({ footer_logo: !props.token })}
          >
            <div className="footerLogoWrapper">
              <a
                href="https://www.ec.europa.eu/"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  style={{ width: '120px', marginRight: '2rem' }}
                  className="footerLogo"
                  src={eeaLogo}
                  alt=""
                />
              </a>
              <a
                href="https://www.eea.europa.eu/"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  style={{ width: '160px' }}
                  className="footerLogo"
                  src={ecLogo}
                  alt=""
                />
              </a>
            </div>
          </Grid.Column>
        </Grid>
      </Grid.Column>
      <Grid.Column tablet={1} computer={3} largeScreen={3} />
    </Grid>
    {/* </Container> */}
  </Segment>
);

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
Footer.propTypes = {
  /**
   * i18n object
   */
};

export default connect((state) => ({
  token: state.userSession.token,
}))(injectIntl(Footer));
