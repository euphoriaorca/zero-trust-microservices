import * as React from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
// mui
import { getActive } from '../../components/nav-section';
import ListItemLink from '../../components/LinkList';

export default function NavItem({ item }) {
  const { pathname } = useLocation();
  const active = getActive(item.path, pathname);

  return (
    <ListItemLink
      to={item.path}
      primary={item.title}
      icon={item.icon}
      badge={item.badge}
      sx={{
        color: 'text.grayText',
        ...(active && {
          bgcolor: 'primary.lighter',
          color: 'primary.main',
          borderLeft: '3px solid #209CBC',
        }),
      }}
    />
  );
}

NavItem.propTypes = {
  item: PropTypes.object,
};
