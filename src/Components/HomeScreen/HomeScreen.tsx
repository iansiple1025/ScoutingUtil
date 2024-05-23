/**
 * HomeScreen Component
 *
 * This component serves as the home screen for the Impi Scouting Utility application. 
 * It provides a list of districts that the user can select to navigate to the respective matches screen.
 */

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import './HomeScreen.css';
import { useNavigate } from 'react-router-dom';

/**
 * HomeScreen functional component
 */
const HomeScreen: React.FC = () => {
  // Hook to handle navigation
  const navigate = useNavigate();

  /**
   * Handles the button click event to navigate to the matches screen for the selected district.
   *
   * @param {string} district - The district code for which matches will be displayed.
   */
  const handleButtonClick = (district: string) => {
    navigate(`/MatchesScreen/${district}`);
  };


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: "5%", textAlign: 'center' }}>
      <Typography variant="h3" gutterBottom>
        Welcome to Impi Scouting Util
      </Typography>
      <List sx={{ width: '100%', maxWidth: 700, bgcolor: 'background.paper', paddingTop: "10%" }}>
        {["2024mimil", "2024mimus", "2024micmp4", "2024arc"].map((value) => (
          <ListItem
            key={value}
            disableGutters
            secondaryAction={
              <Button variant="contained" color="primary" onClick={() => handleButtonClick(value)}>
                Matches
              </Button>
            }
          >
            <ListItemText
              primary={
                <Typography variant="body1" sx={{ fontSize: '1.75rem' }}>
                  {`${value}`}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default HomeScreen;
