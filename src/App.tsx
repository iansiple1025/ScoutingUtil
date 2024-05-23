/**
 * Main Application Component
 *
 * This component sets up the main structure of the application, including routing and navigation tabs.
 */

import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import './App.css';
import Typography from '@mui/material/Typography';
import { Route, BrowserRouter as Router, Routes, useLocation, useNavigate } from 'react-router-dom';

// Importing individual screens
import HomeScreen from './Components/HomeScreen/HomeScreen';
import MatchesScreen from './Components/MatchesScreen/MatchesScreen';
import ScanningScreen from './Components/ScanningScreen/ScanningScreen';
import RemoveDataScreen from './Components/RemoveDataScreen/RemoveDataScreen';
import DashboardScreen from './Components/DashboardScreen/DashboardScreen';

/**
 * NavigationTabs Component
 *
 * This component provides navigation tabs for the application.
 * It updates the selected tab based on the current route and handles navigation between different screens.
 */
const NavigationTabs: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // State to track the currently selected tab
  const [value, setValue] = React.useState(() => {
    switch (location.pathname) {
      case '/HomeScreen':
        return 0;
      case '/RemoveDataScreen':
        return 1;
      case '/DashboardScreen':
        return 2;
      default:
        return false; // Indicates no tab should be selected
    }
  });

  /**
   * Handles tab change event and navigates to the corresponding route.
   *
   * @param {React.SyntheticEvent} event - The event object
   * @param {number} newValue - The new tab index
   */
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    switch (newValue) {
      case 0:
        navigate('/HomeScreen');
        break;
      case 1:
        navigate('/RemoveDataScreen');
        break;
      case 2:
        navigate('/DashboardScreen');
        break;
      default:
        navigate('/HomeScreen');
    }
  };

  // Update the selected tab based on the current route
  React.useEffect(() => {
      switch (location.pathname) {
        case '/HomeScreen':
          setValue(0);
          break;
        case '/RemoveDataScreen':
          setValue(1);
          break;
        case '/DashboardScreen':
          setValue(2);
          break;
        default:
          setValue(-1); // Indicates no tab should be selected
          break;
    }
  }, [location.pathname]);
  

  return (
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', backgroundColor: 'midnightblue' }}>
      <Typography variant="h5" sx={{ flexGrow: 1, paddingTop: '0.5%', paddingLeft: '2%', color: 'chartreuse' }}>
        Impi Scouting Utility
      </Typography>
      <Tabs
        onChange={handleChange}
        value={value}
        aria-label="Tabs where selection follows focus"
        selectionFollowsFocus
        sx={{
          '& .MuiTabs-indicator': {
            backgroundColor: 'chartreuse',
          },
          '& .MuiTab-root.Mui-selected': {
            color: 'chartreuse',
          },
        }}
      >
        <Tab label="Home" style={{ color: 'chartreuse' }} />
        <Tab label="Remove Data" style={{ color: 'chartreuse' }} />
        <Tab label="Dashboard" style={{ color: 'chartreuse' }} />
      </Tabs>
    </Box>
  );
};

/**
 * App Component
 *
 * This component sets up the routing for the application and includes the NavigationTabs component.
 */
const App: React.FC = () => {
  return (
    <Router>
      <NavigationTabs />
      <Routes>
        <Route path="/HomeScreen" element={<HomeScreen />} />
        <Route path="/MatchesScreen/:district" element={<MatchesScreen />} />
        <Route path="/DashboardScreen" element={<DashboardScreen />} />
        <Route path="/ScanningScreen/:district/:matchNumber" element={<ScanningScreen />} />
        <Route path="/RemoveDataScreen" element={<RemoveDataScreen />} />
        <Route path="*" element={<HomeScreen />} />
      </Routes>
    </Router>
  );
};

export default App;
