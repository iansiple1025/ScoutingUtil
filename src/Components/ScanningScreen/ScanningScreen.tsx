/**
 * Component for the scanning screen where teams are scanned and added to the database.
 */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, TextField, Typography, Container, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import axios from 'axios';

/**
 * Interface representing the structure of match data.
 */
interface MatchData {
  match: string;
  blueAlliance: number[];
  redAlliance: number[];
}

/**
 * Component for the scanning screen.
 */
const ScanningScreen: React.FC = () => {
  // Get district and match number from the URL parameters
  const { district, matchNumber } = useParams<{ district: string; matchNumber: string }>();

  // State variables
  const [matchData, setMatchData] = useState<MatchData | null>(null);
  const [scannedTeams, setScannedTeams] = useState<number[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [responseMessage, setResponseMessage] = useState<string>('');

  // Fetch match data from the server on component mount or when district or match number change
  useEffect(() => {
    const fetchMatchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/matches/${district}/${matchNumber}`);
        const responseData = response.data;

        // Update match data state with retrieved data
        setMatchData({
          match: matchNumber || '',
          blueAlliance: responseData.body.slice(0, 3),
          redAlliance: responseData.body.slice(3),
        });
      } catch (error) {
        console.error('Error fetching match data:', error);
      }
    };

    fetchMatchData();
  }, [district, matchNumber]);

  // Handle input change in the text field
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  // Handle adding a team to the database
  const handleAddTeam = async () => {
    // Format team data
    const teamData = `"${inputValue}"`;
    const teamNumberString = inputValue.split(',')[1].substring(1);
    const dataMatchNumber = teamData.split(',')[0].substring(1);

    // Validate match number
    if (dataMatchNumber !== '"' + matchNumber + '"'){
      setResponseMessage(`Invalid match number. Match number is ${matchNumber}`);
      return;
    }

    // Validate team number
    const teamNumber = parseInt(teamNumberString);
    if (isNaN(teamNumber)) {
      setResponseMessage('Invalid team data format. Please enter a valid input.');
      return;
    }

    try {
      // Add team to the database
      const response = await axios.post(`http://localhost:8080/impi/${district}/add`, teamData, {
        headers: {
          'Content-Type': 'text/plain',
        },
      });

      // Update scanned teams state and display response message
      if (matchData?.blueAlliance.includes(teamNumber) || matchData?.redAlliance.includes(teamNumber)) {
        setScannedTeams([...scannedTeams, teamNumber]);
      }
      setResponseMessage(response.data);
      setInputValue('');
    } catch (error) {
      console.error('Error adding team:', error);
      setResponseMessage('Error adding team');
    }
  };

  // Handle key press event in the text field
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleAddTeam();
    }
  };

  // Check if a team is scanned
  const isTeamScanned = (teamNumber: number) => {
    return scannedTeams.includes(teamNumber);
  };

  // Handle navigating to the next match
  const handleNextMatch = () => {
    const nextMatchNumber = parseInt(matchNumber || '0') + 1;
    window.location.href = `/ScanningScreen/${district}/${nextMatchNumber}`;
  };

  return (
    <Container>
      <Typography variant="h3" align="center" gutterBottom style={{paddingTop:"10%"}}>
        Qualification Match {matchNumber}
      </Typography>
      {matchData ? (
        <Grid container justifyContent="center" spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" align="center" gutterBottom style={{paddingTop:"10%"}}>
              Blue Alliance
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Team Number</TableCell>
                    <TableCell align="center">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {matchData.blueAlliance.map((teamNumber, index) => (
                    <TableRow key={index}>
                      <TableCell align="center" style={{ fontSize: '1.5rem', backgroundColor:"#eef"}}>
                        {teamNumber}
                      </TableCell>
                      <TableCell align="center" style={{ color: isTeamScanned(teamNumber) ? '#28a745' : '#dc3545', fontSize: '1.5rem' }}>
                        {isTeamScanned(teamNumber) ? 'Scanned' : 'Not Scanned'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" align="center" gutterBottom style={{paddingTop:"10%"}}>
              Red Alliance
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Team Number</TableCell>
                    <TableCell align="center">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {matchData.redAlliance.map((teamNumber, index) => (
                    <TableRow key={index}>
                      <TableCell align="center" style={{ fontSize: '1.5rem', backgroundColor:"#fee"}}>
                        {teamNumber}
                      </TableCell>
                      <TableCell align="center" style={{ color: isTeamScanned(teamNumber) ? '#28a745' : '#dc3545', fontSize: '1.5rem' }}>
                        {isTeamScanned(teamNumber) ? 'Scanned' : 'Not Scanned'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      ) : (
        <Typography variant="body1" align="center">
          Loading...
        </Typography>
      )}
      <Grid container justifyContent="center" spacing={2} style={{ marginTop: '20px' }}>
        <Grid item>
          <TextField
            type="text"
            variant="outlined"
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Enter team data..."
            style={{ marginRight: '400px', width: '100%' }}
            inputProps={{ style: { fontSize: '1.2rem' } }}
          />
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={handleAddTeam} style={{ backgroundColor: '#007bff', color: 'white', fontSize: '1.2rem' }}>
            Add Team
          </Button>
        </Grid>
      </Grid>
      <div style={{ textAlign: 'center', marginTop: '10%' }}>
        <Typography variant="body1" align="center" style={{ color: responseMessage.includes('Error') ? '#dc3545' : '#28a745' }}>
          {responseMessage}
        </Typography>
      </div>
      <div style={{ textAlign: 'center', marginTop: '5%' }}>
        <Button variant="contained" onClick={handleNextMatch} style={{ backgroundColor: '#28a745', color: 'white', fontSize: '1.2rem' }}>
          Next Match
        </Button>
      </div>
    </Container>
  );
};

export default ScanningScreen;
