// routes
import { PATH_DASHBOARD } from '../../routes/paths';
import { HomeIcon, StartIcon, JobsIcon, ApplicantsIcon, TestingIcon } from '../../assets/icons/Icones';

const navConfig = [
  {
    subheader: 'general',
    items: [
      {
        title: 'Getting Started',
        path: PATH_DASHBOARD.general.onboarding,
        icon: <StartIcon />,
        badge: false,
      },
      { title: 'Home', path: PATH_DASHBOARD.general.app, icon: <HomeIcon />, badge: false },
      { title: 'Applicants', path: PATH_DASHBOARD.general.applicants, icon: <ApplicantsIcon />, badge: true },
      { title: 'Jobs', path: PATH_DASHBOARD.general.jobs, icon: <JobsIcon />, badge: false },
      { title: 'Testing', path: PATH_DASHBOARD.general.testing, icon: <TestingIcon />, badge: false },
    ],
  },
];

export default navConfig;
