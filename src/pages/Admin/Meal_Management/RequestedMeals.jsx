import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../layouts/Admin/AdminLayout';
import MealRequestTable from '../../../components/Meal/RequestedMeals/MealRequestedTable';
import { getAuthHeader } from '../../../utils/authHeader';
import { BASE_URLS } from '../../../services/api/config';
import '../../css/RequestedMeals.css';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Typography,
  Stack,
} from '@mui/material';

export default function RequestedMeals() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toLocaleDateString('en-CA'); // Uses YYYY-MM-DD format while respecting local timezone

  const [mealEvents, setMealEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [mealTimes, setMealTimes] = useState([]);
  const [mealTypes, setMealTypes] = useState([]);
  const [selectedMealTime, setSelectedMealTime] = useState('');
  const [selectedMealType, setSelectedMealType] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(todayStr);
  const [availableMealTypes, setAvailableMealTypes] = useState([]);
  const [selectedDateButton, setSelectedDateButton] = useState(0); // 0: today, -1: yesterday, 1: tomorrow

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

  // Fetch meal times
  useEffect(() => {
    fetch(`${BASE_URLS.mealtime}/details`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const mealTimesWithTypes = data.map((meal) => ({
          id: meal.mealtime_id,
          name: meal.mealtime_name,
          mealtype_ids: meal.mealtype_ids || [],
        }));
        setMealTimes(mealTimesWithTypes);
      })
      .catch((error) => console.error('Error fetching meal times:', error));
  }, []);

  // Fetch meal types
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

  // Update available meal types when meal time changes
  useEffect(() => {
    if (selectedMealTime) {
      const selectedMealTimeData = mealTimes.find(
        (mt) => String(mt.id) === String(selectedMealTime),
      );
      if (selectedMealTimeData) {
        const availableTypes = mealTypes.filter((type) =>
          selectedMealTimeData.mealtype_ids.includes(type.id),
        );
        setAvailableMealTypes(availableTypes);
        setSelectedMealType(''); // Reset meal type selection
      }
    } else {
      setAvailableMealTypes(mealTypes);
    }
  }, [selectedMealTime, mealTimes, mealTypes]);

  // Filter events based on selected values
  useEffect(() => {
    let filtered = mealEvents;

    // Apply date range filter
    if (startDate && endDate) {
      filtered = filtered.filter((event) => {
        const eventDate = new Date(event.meal_request_date);
        const eventDateStr = eventDate.toLocaleDateString('en-CA');
        return eventDateStr >= startDate && eventDateStr <= endDate;
      });
    }

    // Apply meal time filter
    if (selectedMealTime) {
      filtered = filtered.filter(
        (event) => String(event.mealtime_id) === String(selectedMealTime),
      );
    }

    // Apply meal type filter
    if (selectedMealType) {
      filtered = filtered.filter(
        (event) => String(event.mealtype_id) === String(selectedMealType),
      );
    }

    // Apply month filter only if no date range is selected
    if (selectedMonth && !startDate && !endDate) {
      filtered = filtered.filter((event) => {
        const eventMonth = new Date(event.meal_request_date).getMonth() + 1;
        return eventMonth === parseInt(selectedMonth, 10);
      });
    }

    setFilteredEvents(filtered);
  }, [
    selectedMealTime,
    selectedMealType,
    selectedMonth,
    startDate,
    endDate,
    mealEvents,
  ]);

  // Calculate statistics
  const getTotalRequests = () => filteredEvents.length;
  const getRequestsByMealTime = () => {
    const requestsByTime = {};
    mealTimes.forEach((time) => {
      requestsByTime[time.name] = filteredEvents.filter(
        (event) => String(event.mealtime_id) === String(time.id),
      ).length;
    });
    return requestsByTime;
  };

  // Date quick filters
  const handleQuickDateFilter = (days) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);

    setSelectedDateButton(days);

    if (days === 0) {
      // Today
      setStartDate(date.toLocaleDateString('en-CA'));
      setEndDate(date.toLocaleDateString('en-CA'));
    } else if (days === -1) {
      // Yesterday
      const yesterday = new Date(date);
      yesterday.setDate(date.getDate() - 1);
      setStartDate(yesterday.toLocaleDateString('en-CA'));
      setEndDate(yesterday.toLocaleDateString('en-CA'));
    } else if (days === 1) {
      // Tomorrow
      const tomorrow = new Date(date);
      tomorrow.setDate(date.getDate() + 1);
      setStartDate(tomorrow.toLocaleDateString('en-CA'));
      setEndDate(tomorrow.toLocaleDateString('en-CA'));
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen space-y-3 p-2">
        <h1 className="text-2xl font-semibold">Requested Meals</h1>

        {/* Statistics Cards */}
        <Box>
          <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto' }}>
            {/* Total Requests */}
            <Card className="summary-card total-card">
              <CardContent sx={{ py: 1, textAlign: 'center' }}>
                <Typography variant="h6">Total Requests</Typography>
                <Typography variant="h4">{getTotalRequests()}</Typography>
              </CardContent>
            </Card>

            {/* Meal Times */}
            {mealTimes.map((time) => (
              <Card key={time.id} className="summary-card meal-time-card">
                <CardContent sx={{ py: 1 }}>
                  <Typography variant="h6">{time.name}</Typography>
                  <Typography variant="h4">
                    {getRequestsByMealTime()[time.name] || 0}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mb: 2,
            flexWrap: 'wrap',
            alignItems: 'center',
            mt: 3,
          }}
        >
          {/* Left side: Quick Date Filters */}
          <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
            <Button
              className={`date-filter-button ${selectedDateButton === -1 ? 'selected' : ''}`}
              size="small"
              variant="outlined"
              onClick={() => handleQuickDateFilter(-1)}
            >
              Yesterday
            </Button>
            <Button
              className={`date-filter-button ${selectedDateButton === 0 ? 'selected' : ''}`}
              size="small"
              variant="outlined"
              onClick={() => handleQuickDateFilter(0)}
            >
              Today
            </Button>
            <Button
              className={`date-filter-button ${selectedDateButton === 1 ? 'selected' : ''}`}
              size="small"
              variant="outlined"
              onClick={() => handleQuickDateFilter(1)}
            >
              Tomorrow
            </Button>
          </Stack>

          {/* Right side: Other Filters */}
          <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 1 }}>
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
            <FormControl
              variant="outlined"
              size="small"
              sx={{ minWidth: 120 }}
              disabled={!selectedMealTime}
            >
              <InputLabel>Meal Type</InputLabel>
              <Select
                value={selectedMealType}
                onChange={(e) => setSelectedMealType(e.target.value)}
                label="Meal Type"
              >
                <MenuItem value="">All</MenuItem>
                {availableMealTypes.map((type) => (
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
                    {new Date(0, i).toLocaleString('default', {
                      month: 'long',
                    })}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Date Range Filter */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField
                label="Start Date"
                type="date"
                size="small"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ minWidth: 140 }}
              />
              <TextField
                label="End Date"
                type="date"
                size="small"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ minWidth: 140 }}
              />
            </Box>
          </Stack>
        </Box>

        <div className="mt-6">
          <MealRequestTable events={filteredEvents} />
        </div>
      </div>
    </AdminLayout>
  );
}
