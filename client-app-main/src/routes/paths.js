// ----------------------------------------------------------------------
function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_DASHBOARD = '/dashboard';

// ---------------------------------------------------------//

export const PATH_AUTH = {
  register: '/',
  login: '/login',
  forgotPassword: '/reset-password',
  updatePassword: '/update-password',
  termsOfService: '/terms-of-services',
  nondescriminationPolicy: '/nondescrimintion-policy',
  privatePolicy: '/private-policy',
  emailSent: '/email-sent',
};

export const PATH_PAGE = {
  page404: '/404',
  page500: '/500',
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  general: {
    app: path(ROOTS_DASHBOARD, '/app'),
    onboarding: path(ROOTS_DASHBOARD, '/onboarding'),
    applicants: path(ROOTS_DASHBOARD, '/applicants'),
    jobs: path(ROOTS_DASHBOARD, '/jobs'),
    testing: path(ROOTS_DASHBOARD, '/testing'),
  },
};
