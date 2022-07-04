// react
import { useRoutes, useLocation, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';

//  layouts
import MainLayout from '../layouts/main';
import DashboardLayout from '../layouts/dashboard';

// guards
import GuestGuard from '../guards/GuestGuard';
import AuthGuard from '../guards/AuthGuard';

// import AuthGuard from '../guards/AuthGuard';
import LoadingScreen from '../components/LoadingScreen';

// config
import { PATH_AFTER_LOGIN } from '../config';

// ----------------------------------------------------------------------

const Loadable = (Component) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();

  return (
    <Suspense fallback={<LoadingScreen isDashboard={pathname.includes('/dashboard')} />}>
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    {
      path: '/',
      element: (
        <GuestGuard>
          <MainLayout />
        </GuestGuard>
      ),
      children: [
        { element: <Register />, index: true },
        { path: 'login', element: <Login /> },
      ],
    },
    {
      path: 'reset-password',
      element: (
        <MainLayout>
          <ResetPassword />
        </MainLayout>
      ),
      children: [{ element: <ResetPassword />, index: true }],
    },
    {
      path: 'update-password',
      element: (
        <MainLayout>
          <ResetPassword />
        </MainLayout>
      ),
      children: [{ element: <SetNewPassword />, index: true }],
    },

    // Dashboard Routes
    {
      path: 'dashboard',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        { path: 'onboarding', element: <Onboarding /> },
        { path: 'applicants', element: <Applicants /> },
        { path: 'jobs', element: <Jobs /> },
        { path: 'testing', element: <Testing /> },
        { path: 'app', element: <Home /> },
      ],
    },
  ]);
}

// AUTHENTICATION
const Register = Loadable(lazy(() => import('../pages/auth/Register')));
const Login = Loadable(lazy(() => import('../pages/auth/Login')));
const ResetPassword = Loadable(lazy(() => import('../pages/auth/ResetPassword')));
const SetNewPassword = Loadable(lazy(() => import('../pages/auth/SetNewPassword')));

// DASHBOARD
const Onboarding = Loadable(lazy(() => import('../pages/dashboard/onboarding/Onboarding')));
const Home = Loadable(lazy(() => import('../pages/dashboard/Home')));
const Jobs = Loadable(lazy(() => import('../pages/dashboard/Jobs')));
const Applicants = Loadable(lazy(() => import('../pages/dashboard/Applicants')));
const Testing = Loadable(lazy(() => import('../pages/dashboard/Test')));
