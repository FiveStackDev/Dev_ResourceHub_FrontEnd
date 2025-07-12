import { getAuthHeader } from '../../utils/authHeader';
import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Modal,
  Box,
  Typography,
  Card,
  CardContent,
  CardActionArea,
} from '@mui/material';
import html2pdf from 'html2pdf.js';
import { BASE_URLS } from '../../services/api/config';
import { toast } from 'react-toastify';
import SchedulePopup from './SchedulePopup';

const MealEventsTable = () => {
  const [mealEvents, setMealEvents] = useState(['']);
  const [filteredEvents, setFilteredEvents] = useState(['']);
  const [mealTimes, setMealTimes] = useState(['']);
  const [mealTypes, setMealTypes] = useState(['']);
  const [selectedMealTime, setSelectedMealTime] = useState('');
  const [selectedMealType, setSelectedMealType] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [openschedulePopup, setOpenSchedulePopup] = useState(false);

  // Fetch meal events
  useEffect(() => {
    fetch(`${BASE_URLS.calendar}/mealevents`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setMealEvents(data);
        setFilteredEvents(data);
      })
      .catch((error) => console.error('Error fetching meal events:', error));
  }, []);

  // Fetch meal times from API
  useEffect(() => {
    fetch(`${BASE_URLS.mealtime}/details`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const mealNames = data.map((meal) => ({
          id: meal.mealtime_id,
          name: meal.mealtime_name,
        }));
        setMealTimes(mealNames);
      })
      .catch((error) => console.error('Error fetching meal times:', error));
  }, []);

  // Fetch meal types from API
  useEffect(() => {
    fetch(`${BASE_URLS.mealtype}/details`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const mealTypeList = data.map((type) => ({
          id: type.mealtype_id,
          name: type.mealtype_name,
        }));
        setMealTypes(mealTypeList);
      })
      .catch((error) => console.error('Error fetching meal types:', error));
  }, []);

  // Filter events based on selected values
  useEffect(() => {
    let filtered = mealEvents;

    if (selectedMealTime) {
      filtered = filtered.filter(
        (event) => String(event.mealtime_id) === String(selectedMealTime)
      );
    }
    if (selectedMealType) {
      filtered = filtered.filter(
        (event) => String(event.mealtype_id) === String(selectedMealType)
      );
    }
    if (selectedMonth) {
      filtered = filtered.filter((event) => {
        const eventMonth = new Date(event.meal_request_date).getMonth() + 1;
        return eventMonth === parseInt(selectedMonth, 10);
      });
    }

    setFilteredEvents(filtered);
  }, [selectedMealTime, selectedMealType, selectedMonth, mealEvents]);

  const handleDownloadPDF = () => {
    try {
      const element = document.getElementById('meal-events-table');
      const options = {
        margin: 1,
        filename: 'MealEventsReport.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
      };
      html2pdf().from(element).set(options).save();
      toast.success('Meal events report downloaded successfully!');
    } catch (error) {
      console.error('Error downloading meal events report:', error);
      toast.error('Failed to download meal events report.');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '15px', marginBottom: 20 }}>
        {/* Meal Time Filter */}
        <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Meal Time</InputLabel>
          <Select
            value={selectedMealTime}
            onChange={(e) => setSelectedMealTime(e.target.value)}
            label="Meal Time"
          >
            <MenuItem value="">All</MenuItem>
            {mealTimes.map((time) => (
              <MenuItem key={time.id} value={time.id}>
                {time.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Meal Type Filter */}
        <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Meal Type</InputLabel>
          <Select
            value={selectedMealType}
            onChange={(e) => setSelectedMealType(e.target.value)}
            label="Meal Type"
          >
            <MenuItem value="">All</MenuItem>
            {mealTypes.map((type) => (
              <MenuItem key={type.id} value={type.id}>
                {type.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Month Filter */}
        <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Month</InputLabel>
          <Select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            label="Month"
          >
            <MenuItem value="">All</MenuItem>
            {Array.from({ length: 12 }, (_, i) => (
              <MenuItem key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString('default', { month: 'long' })}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Download PDF Button */}
        <Button variant="contained" color="primary" onClick={handleDownloadPDF}>
          Download PDF
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenSchedulePopup(true)}
        >
          Schedule PDF
        </Button>
      </div>

      {/* Table */}
      <TableContainer component={Paper} id="meal-events-table">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Meal Time</TableCell>
              <TableCell>Meal Type</TableCell>
              <TableCell>User Name</TableCell>
              <TableCell>Submitted Date</TableCell>
              <TableCell>Meal Request Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEvents.map((mealEvent, index) => (
              <TableRow key={index}>
                <TableCell>{mealEvent.mealtime_name}</TableCell>
                <TableCell>{mealEvent.mealtype_name}</TableCell>
                <TableCell>{mealEvent.username}</TableCell>
                <TableCell>{mealEvent.submitted_date}</TableCell>
                <TableCell>{mealEvent.meal_request_date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {openschedulePopup && (
        <SchedulePopup
          onClose={() => setOpenSchedulePopup(false)}
          table="Meal _Requests"
        />
      )}
    </div>
  );
};

export default MealEventsTable;
