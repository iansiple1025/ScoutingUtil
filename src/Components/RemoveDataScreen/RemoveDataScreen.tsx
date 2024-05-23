/**
 * Component for removing match data from the database.
 */
import React, { useState } from 'react';
import { Button, TextField, Typography, Container, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import axios from 'axios';

/**
 * Interface representing the structure of record data.
 */
interface RecordData {
  match: {
    matchNumber: number;
  };
  teamNumber: number;
  scouterName: string;
  startingPosition: number;
  passedStartingLine: number;
  scoredFirstShot: number;
  autoCloseNotesScored: number;
  autoFarNotesScored: number;
  teleopSpeakerNotes: number;
  teleopAmpNotes: number;
  teleopNotesFed: number;
  defenseRating: number;
  mechanicalFailure: number;
  endLocation: number;
  scoredTrapNote: number;
  comments: string;
}

/**
 * Component for the remove data screen.
 */
const RemoveDataScreen: React.FC = () => {
  // State variables
  const [compCode, setCompCode] = useState<string>('');
  const [matchNumber, setMatchNumber] = useState<string>('');
  const [records, setRecords] = useState<RecordData[]>([]);
  const [responseMessage, setResponseMessage] = useState<string>('');

  // Handle change in competition code input field
  const handleCompCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCompCode(event.target.value);
  };

  // Handle change in match number input field
  const handleMatchNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMatchNumber(event.target.value);
  };

  // Handle search for records based on competition code and match number
  const handleSearch = async () => {
    try {
      // Fetch records from the server
      const response = await axios.get(`http://localhost:8080/impi/match/${compCode}/${matchNumber}`);
      setRecords(response.data);
      setResponseMessage('');
    } catch (error) {
      console.error('Error fetching records:', error);
      setResponseMessage('Error fetching records');
    }
  };

  // Handle deletion of a record
  const handleDelete = async (teamNumber: number, matchNumber: number) => {
    try {
      // Delete record from the server
      await axios.delete(`http://localhost:8080/impi/${compCode}/${teamNumber}/${matchNumber}`);
      // Fetch updated records from the server
      const response = await axios.get(`http://localhost:8080/impi/match/${compCode}/${matchNumber}`);
      setRecords(response.data);
      setResponseMessage('Record deleted successfully');
    } catch (error) {
      console.error('Error deleting record:', error);
      setResponseMessage('Error deleting record');
    }
  };

  return (
    <Container>
      <Typography variant="h3" align="center" gutterBottom style={{paddingTop:'10%'}}>
        Remove Data
      </Typography>
      <Grid container justifyContent="center" spacing={2}>
        <Grid item style={{paddingTop:'10%'}}>
          <TextField
            label="Competition Code"
            variant="outlined"
            value={compCode}
            onChange={handleCompCodeChange}
            style={{ marginRight: '10px', width: '200px' }}
          />
        </Grid>
        <Grid item style={{paddingTop:'10%'}}>
          <TextField
            label="Match Number"
            variant="outlined"
            value={matchNumber}
            onChange={handleMatchNumberChange}
            style={{ marginRight: '10px', width: '200px' }}
          />
        </Grid>
        <Grid item style={{paddingTop:'11%'}}>
          <Button variant="contained" onClick={handleSearch} style={{ backgroundColor: '#007bff', color: 'white' }}>
            Search
          </Button>
        </Grid>
      </Grid>
      {responseMessage && (
        <Typography variant="body1" align="center" style={{ color: responseMessage.includes('Error') ? '#dc3545' : '#28a745', marginTop: '20px' }}>
          {responseMessage}
        </Typography>
      )}
      {records.length > 0 && (
        <TableContainer component={Paper} style={{ marginTop: '20px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Match Number</TableCell>
                <TableCell align="center">Team Number</TableCell>
                <TableCell align="center">Scouter Name</TableCell>
                <TableCell align="center">Starting Position</TableCell>
                <TableCell align="center">Passed Starting Line</TableCell>
                <TableCell align="center">Scored First Shot</TableCell>
                <TableCell align="center">Auto Close Notes Scored</TableCell>
                <TableCell align="center">Auto Far Notes Scored</TableCell>
                <TableCell align="center">Teleop Speaker Notes</TableCell>
                <TableCell align="center">Teleop Amp Notes</TableCell>
                <TableCell align="center">Teleop Notes Fed</TableCell>
                <TableCell align="center">Defense Rating</TableCell>
                <TableCell align="center">Mechanical Failure</TableCell>
                <TableCell align="center">End Location</TableCell>
                <TableCell align="center">Scored Trap Note</TableCell>
                <TableCell align="center">Comments</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {records.map((record, index) => (
                <TableRow key={index}>
                  <TableCell align="center">{record.match.matchNumber}</TableCell>
                  <TableCell align="center">{record.teamNumber}</TableCell>
                  <TableCell align="center">{record.scouterName}</TableCell>
                  <TableCell align="center">{record.startingPosition}</TableCell>
                  <TableCell align="center">{record.passedStartingLine}</TableCell>
                  <TableCell align="center">{record.scoredFirstShot}</TableCell>
                  <TableCell align="center">{record.autoCloseNotesScored}</TableCell>
                  <TableCell align="center">{record.autoFarNotesScored}</TableCell>
                  <TableCell align="center">{record.teleopSpeakerNotes}</TableCell>
                  <TableCell align="center">{record.teleopAmpNotes}</TableCell>
                  <TableCell align="center">{record.teleopNotesFed}</TableCell>
                  <TableCell align="center">{record.defenseRating}</TableCell>
                  <TableCell align="center">{record.mechanicalFailure}</TableCell>
                  <TableCell align="center">{record.endLocation}</TableCell>
                  <TableCell align="center">{record.scoredTrapNote}</TableCell>
                  <TableCell align="center">{record.comments}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleDelete(record.teamNumber, record.match.matchNumber)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default RemoveDataScreen;
