// routes
import Router from './routes';

// theme
import ThemeProvider from './theme';
// components

import { ProgressBarStyle } from './components/ProgressBar';
import ThemeColorPresets from './components/ThemeColorPresets';
import NotistackProvider from './components/NotistackProvider';
import MotionLazyContainer from './components/animate/MotionLazyContainer';

// ----------------------------------------------------------------------

export default function App() {
  return (
    <ThemeProvider>
      <ThemeColorPresets>
        <NotistackProvider>
          <MotionLazyContainer>
            <ProgressBarStyle />
            <Router />
          </MotionLazyContainer>
        </NotistackProvider>
      </ThemeColorPresets>
    </ThemeProvider>
  );
}
