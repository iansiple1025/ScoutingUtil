import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { ChartData, ChartOptions } from 'chart.js';
import { Chart, registerables } from 'chart.js';
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  SelectChangeEvent,
  Checkbox,
  ListItemText,
  OutlinedInput,
  TableContainer,
  Paper,
  Box,
} from '@mui/material';

interface TeamData {
  teamNumber: string;
  avgAutoCloseNotes: number;
  avgAutoFarNotes: number;
  avgSpeakerNotes: number;
  avgAmpNotes: number;
  avgNotesFed: number;
  avgDefenseRating: number;
}

const DashboardScreen: React.FC = () => {
  const [teamData, setTeamData] = useState<TeamData[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<string>('avgAutoCloseNotes');
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [compCode, setCompCode] = useState<string>('2024mimus');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Show loading spinner while fetching data
      try {
        const response = await axios.get(`http://localhost:8080/impi/getAvgData/${compCode}`);
        const formattedData = Object.entries(response.data).map(([teamNumber, values]) => {
          const numericValues = values as number[];
          return {
            teamNumber,
            avgAutoCloseNotes: numericValues[0],
            avgAutoFarNotes: numericValues[1],
            avgSpeakerNotes: numericValues[2],
            avgAmpNotes: numericValues[3],
            avgNotesFed: numericValues[4],
            avgDefenseRating: numericValues[5],
          };
        });

        setTeamData(formattedData as TeamData[]);
      } catch (error) {
        console.error('Error fetching team data:', error);
      } finally {
        setLoading(false); // Hide loading spinner once data is fetched
      }
    };
    fetchData();
  }, [compCode]);

  Chart.register(...registerables);

  const handleMetricChange = (event: SelectChangeEvent<string>) => {
    setSelectedMetric(event.target.value);
  };

  const handleTeamChange = (event: SelectChangeEvent<string[]>) => {
    setSelectedTeams(event.target.value as string[]);
  };

  const handleCompCodeChange = (event: SelectChangeEvent<string>) => {
    setCompCode(event.target.value);
  };

  const filteredTeamData = selectedTeams.length > 0
    ? teamData.filter(team => selectedTeams.includes(team.teamNumber))
    : teamData;

  const chartData: ChartData<'bar'> = {
    labels: loading ? [] : filteredTeamData.map(team => `Team ${team.teamNumber}`),
    datasets: [
      {
        label: selectedMetric.replace('avg', '').replace(/([A-Z])/g, ' $1').trim(),
        data: loading ? [] : filteredTeamData.map(team => team[selectedMetric as keyof TeamData] as number),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Container>
      <Box display="flex" justifyContent="center" marginBottom={4} paddingTop={"5%"}>
        <Typography variant="h3" component="h1" gutterBottom>
          Team Performance Dashboard
        </Typography>
      </Box>

      <Box display="flex" alignItems="center" gap={2} marginY={2}>
        <FormControl variant="outlined" size="small">
          <InputLabel>Select Competition Code</InputLabel>
          <Select value={compCode} onChange={handleCompCodeChange} label="Select Competition Code">
            <MenuItem value="2024mimil">2024mimil</MenuItem>
            <MenuItem value="2024mimus">2024mimus</MenuItem>
            <MenuItem value="2024micmp4">2024micmp4</MenuItem>
            <MenuItem value="2024arc">2024arc</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth variant="outlined">
          <InputLabel>Select Metric</InputLabel>
          <Select value={selectedMetric} onChange={handleMetricChange} label="Select Metric">
            <MenuItem value="avgAutoCloseNotes">Avg Auto Close Notes</MenuItem>
            <MenuItem value="avgAutoFarNotes">Avg Auto Far Notes</MenuItem>
            <MenuItem value="avgSpeakerNotes">Avg Speaker Notes</MenuItem>
            <MenuItem value="avgAmpNotes">Avg Amp Notes</MenuItem>
            <MenuItem value="avgNotesFed">Avg Notes Fed</MenuItem>
            <MenuItem value="avgDefenseRating">Avg Defense Rating</MenuItem>
          </Select>
        </FormControl>

        <FormControl variant="outlined" size="small">
          <InputLabel>Select Teams</InputLabel>
          <Select
            multiple
            value={selectedTeams}
            onChange={handleTeamChange}
            input={<OutlinedInput label="Select Teams" />}
            renderValue={(selected) => selected.join(', ')}
          >
            {teamData.map((team) => (
              <MenuItem key={team.teamNumber} value={team.teamNumber}>
                <Checkbox checked={selectedTeams.indexOf(team.teamNumber) > -1} />
                <ListItemText primary={`Team ${team.teamNumber}`} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Bar data={chartData} options={chartOptions} />

          <Typography variant="h4" component="h2" gutterBottom style={{ paddingTop: '4%', textAlign: 'center' }}>
            Team Rankings ({selectedMetric.replace('avg', '').replace(/([A-Z])/g, ' $1').trim()})
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: 'bold', border: '1px solid #ddd', textAlign: 'center', padding: '10px' }}>
                    Team Number
                  </TableCell>
                  <TableCell style={{ fontWeight: 'bold', border: '1px solid #ddd', textAlign: 'center', padding: '10px' }}>
                    {selectedMetric.replace('avg', '').replace(/([A-Z])/g, ' $1').trim()}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTeamData
                  .sort((a, b) => (b[selectedMetric as keyof TeamData] as number) - (a[selectedMetric as keyof TeamData] as number))
                  .map((team) => (
                    <TableRow key={team.teamNumber}>
                      <TableCell style={{ border: '1px solid #ddd', textAlign: 'center', padding: '10px' }}>
                        {team.teamNumber}
                      </TableCell>
                      <TableCell style={{ border: '1px solid #ddd', textAlign: 'center', padding: '10px' }}>
                        {team[selectedMetric as keyof TeamData]}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Container>
  );
};

export default DashboardScreen;
