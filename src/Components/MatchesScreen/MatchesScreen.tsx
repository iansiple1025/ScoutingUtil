/**
 * Component for displaying match data.
 */
import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

/**
 * Interface representing the structure of match data.
 */
interface MatchData {
  match: string;
  redalliance: string[];
  bluealliance: string[];
  numberOfTeamsScanned: number; // New field for number of teams scanned
}

/**
 * Component for displaying match data.
 */
const MatchesScreen: React.FC = () => {
  // Get the district parameter from the URL
  const { district } = useParams();
  // State variable to store match data
  const [matchData, setMatchData] = useState<MatchData[]>([]);

  // Fetch match data from the server
  useEffect(() => {
    const fetchMatchData = async () => {
      try {
        // Fetch raw match data from the server
        const response = await axios.get(`http://localhost:8080/matches/${district}`);
        const responseData = response.data.body;

        // Transform raw match data into required format
        const transformedData: MatchData[] = await Promise.all(
          Object.keys(responseData).map(async (matchNumber) => {
            // Fetch the number of teams scanned for the current match
            const matchDataResponse = await axios.get(`http://localhost:8080/impi/getNumberScanned/${district}/${matchNumber}`);
            const numberOfTeamsScanned = matchDataResponse.data;

            return {
              match: matchNumber,
              redalliance: responseData[matchNumber].slice(3).map((team: number) => `${team}`),
              bluealliance: responseData[matchNumber].slice(0, 3).map((team: number) => `${team}`),
              numberOfTeamsScanned,
            };
          })
        );

        // Set the transformed match data
        setMatchData(transformedData);
      } catch (error) {
        console.error('Error fetching match data:', error);
      }
    };

    // Call the fetchMatchData function when the district parameter changes
    fetchMatchData();
  }, [district]);
  return (
    <TableContainer component={Paper}>
      <Table aria-label="match table" sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#d3d3d3', color: 'black' }}>
            <TableCell sx={{ color: "black", fontWeight: 'bold', border: '1px solid #ffffff' }}>Match</TableCell>
            <TableCell sx={{ color: 'black', fontWeight: 'bold', border: '1px solid #ffffff' }}>Red Alliance</TableCell>
            <TableCell sx={{ color: 'black', fontWeight: 'bold', border: '1px solid #ffffff' }}>Blue Alliance</TableCell>
            <TableCell sx={{ color: 'black', fontWeight: 'bold', border: '1px solid #ffffff' }}>Scan</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {matchData.map((row, index) => (
            <TableRow
              key={index}
              sx={{
                '&:nth-of-type(odd)': { backgroundColor: '#f5f5f5' },
                '&:nth-of-type(even)': { backgroundColor: '#ffffff' },
              }}
            >
              <TableCell sx={{ border: '1px solid #dddddd', backgroundColor: row.numberOfTeamsScanned >= 6 ? '#28a745' : 'inherit' }}>
                {row.match}
              </TableCell>
              <TableCell sx={{ color: '#d32f2f', fontWeight: 'bold', border: '1px solid #dddddd' , backgroundColor:"#fee"}}>
                {row.redalliance.join(', ')}
              </TableCell>
              <TableCell sx={{ color: '#1976d2', fontWeight: 'bold', border: '1px solid #dddddd', backgroundColor:"#eef"}}>
                {row.bluealliance.join(', ')}
              </TableCell>
              <TableCell sx={{ border: '1px solid #dddddd' }}>
                <Link to={`/ScanningScreen/${district}/${row.match}`}>
                  <Button variant="contained" color="primary">Scan</Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MatchesScreen;
