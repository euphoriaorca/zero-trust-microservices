import * as React from 'react';
import PropTypes from 'prop-types';

// Mui
import { styled } from '@mui/material/styles';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import { Link as RouterLink, MemoryRouter } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';

function Router(props) {
  const { children } = props;
  if (typeof window === 'undefined') {
    return <StaticRouter location="/drafts">{children}</StaticRouter>;
  }

  return (
    <MemoryRouter initialEntries={['/drafts']} initialIndex={0}>
      {children}
    </MemoryRouter>
  );
}

Router.propTypes = {
  children: PropTypes.node,
};

const BadgeStyle = styled(Badge)(({ theme }) => ({
  '& span': {
    backgroundColor: theme.palette.primary.lighter,
    color: '#209CBC',
  },
}));

export default function ListItemLink({ icon, primary, badge, to, color, ...others }) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const renderLink = React.forwardRef((itemProps, ref) => (
    <RouterLink to={to} ref={ref} {...itemProps} role={undefined} />
  ));

  return (
    <li>
      <ListItem button component={renderLink} {...others}>
        {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
        <ListItemText primary={primary} sx={{ color }} />
        {badge ? <BadgeStyle badgeContent={4} /> : null}
      </ListItem>
    </li>
  );
}

export function LinkItem({ primary, to, ...others }) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const renderLink = React.forwardRef((itemProps, ref) => (
    <RouterLink to={to} ref={ref} {...itemProps} role={undefined} />
  ));

  return (
    <span>
      <Typography component={renderLink} {...others}>
        {primary}
      </Typography>
    </span>
  );
}

ListItemLink.propTypes = {
  icon: PropTypes.element,
  primary: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  badge: PropTypes.bool,
  color: PropTypes.string,
};

LinkItem.propTypes = {
  icon: PropTypes.element,
  primary: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  badge: PropTypes.bool,
  color: PropTypes.string,
};
