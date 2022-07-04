import * as React from 'react';
import PropTypes from 'prop-types';

import NavItem from './NavItem';

export const MainListItems = ({ navConfig }) => (
  <>{navConfig.map((obj) => obj.items.map((item, i) => <NavItem key={i} item={item} />))}</>
);

MainListItems.propTypes = {
  navConfig: PropTypes.array,
};
