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
  Box,
  InputLabel,
  TextField,
  Checkbox,
  TablePagination,
  Tooltip,
  useTheme,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { Trash2 } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { BASE_URLS } from '../../services/api/config';
import { toast } from 'react-toastify';
import SchedulePopup from './SchedulePopup';
import { decodeToken } from '../../contexts/UserContext';

const MealEventsTable = ({ onDeleteMealEvents }) => {
  const theme = useTheme();
  const [mealEvents, setMealEvents] = useState(['']);
  const [filteredEvents, setFilteredEvents] = useState(['']);
  const [mealTimes, setMealTimes] = useState(['']);
  const [mealTypes, setMealTypes] = useState(['']);
  const [selectedMealTime, setSelectedMealTime] = useState('');
  const [selectedMealType, setSelectedMealType] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  // Removed day filter
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [openSchedulePopup, setOpenSchedulePopup] = useState(false);
  const [selectedFrequency, setSelectedFrequency] = useState('');
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    frequency: '',
  });

  // Enhanced table state
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortDirection, setSortDirection] = useState('asc');
  const [sortColumn, setSortColumn] = useState('meal_request_date');

  // Selection functions
  const getCurrentPageMealEventIds = () => {
    return sortedEvents
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      .map((event, index) => `${event.user_id}_${event.meal_request_date}_${index}`); // Create unique ID
  };

  const handleSelectAll = (event) => {
    const currentPageMealEventIds = getCurrentPageMealEventIds();
    if (event.target.checked) {
      const newSelected = [...new Set([...selected, ...currentPageMealEventIds])];
      setSelected(newSelected);
    } else {
      setSelected(selected.filter(id => !currentPageMealEventIds.includes(id)));
    }
  };

  const handleSelect = (eventId) => {
    const selectedIndex = selected.indexOf(eventId);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, eventId];
    } else {
      newSelected = selected.filter((id) => id !== eventId);
    }
    setSelected(newSelected);
  };

  const handleSort = (column) => {
    const isAsc = sortColumn === column && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortColumn(column);
  };

  const handleDeleteSelected = () => {
    if (onDeleteMealEvents && selected.length > 0) {
      onDeleteMealEvents(selected);
      setSelected([]);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle frequency selection from SchedulePopup
  const handleFrequencySelect = (frequency) => {
    setSelectedFrequency(frequency);
    setConfirmDialog({ open: true, frequency });
  };

  // Handle confirmation of scheduling
  const handleConfirmSchedule = async () => {
    setConfirmDialog({ open: false, frequency: '' });
    try {
      const decoded = decodeToken();
      const userId = decoded?.id;
      if (!userId) throw new Error('User ID not found');
      const endpoint = `${BASE_URLS.report}/addscedulereport`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify({
          user_id: userId,
          report_name: 'meal',
          frequency: selectedFrequency,
        }),
      });
      if (!res.ok) throw new Error('Failed to schedule report');
      toast.success('Meal report scheduled successfully!');
    } catch (err) {
      toast.error('Failed to schedule meal report.');
    }
    setOpenSchedulePopup(false);
    setSelectedFrequency('');
  };

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

    // If both startDate and endDate are set, use date range filter and ignore year/month/day
    if (startDate && endDate) {
      filtered = filtered.filter((event) => {
        const eventDate = new Date(event.meal_request_date);
        return (
          eventDate >= new Date(startDate) && eventDate <= new Date(endDate)
        );
      });
    } else {
      if (selectedMealTime) {
        filtered = filtered.filter(
          (event) => String(event.mealtime_id) === String(selectedMealTime),
        );
      }
      if (selectedMealType) {
        filtered = filtered.filter(
          (event) => String(event.mealtype_id) === String(selectedMealType),
        );
      }
      if (selectedMonth) {
        filtered = filtered.filter((event) => {
          const eventMonth = new Date(event.meal_request_date).getMonth() + 1;
          return eventMonth === parseInt(selectedMonth, 10);
        });
      }
      if (selectedYear) {
        filtered = filtered.filter((event) => {
          const eventYear = new Date(event.meal_request_date).getFullYear();
          return eventYear === parseInt(selectedYear, 10);
        });
      }
    }

    setFilteredEvents(filtered);
  }, [
    selectedMealTime,
    selectedMealType,
    selectedMonth,
    selectedYear,
    startDate,
    endDate,
    mealEvents,
  ]);

  // Sorted events
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    let aValue = a[sortColumn];
    let bValue = b[sortColumn];
    
    if (typeof aValue === 'string') aValue = aValue.toLowerCase();
    if (typeof bValue === 'string') bValue = bValue.toLowerCase();
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const currentPageEvents = sortedEvents.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const currentPageMealEventIds = getCurrentPageMealEventIds();
  const isAllCurrentPageSelected = currentPageMealEventIds.length > 0 && 
    currentPageMealEventIds.every(id => selected.includes(id));
  const isSomeCurrentPageSelected = currentPageMealEventIds.some(id => selected.includes(id));

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

  // Blur effect logic like asset table
  const isPopupOpen = openSchedulePopup || confirmDialog.open;
  return (
    <Box position="relative">
      {/* Blur wrapper */}
      <div className={isPopupOpen ? 'blurred-content' : ''}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
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

          {/* Year Filter */}
          <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Year</InputLabel>
            <Select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              label="Year"
            >
              <MenuItem value="">All</MenuItem>
              {/* Dynamically get years from mealEvents */}
              {Array.from(
                new Set(
                  mealEvents
                    .filter((event) => event && event.meal_request_date)
                    .map((event) =>
                      new Date(event.meal_request_date).getFullYear(),
                    ),
                ),
              )
                .sort((a, b) => b - a)
                .map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
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

          {/* Date Range Filter (after Month) */}
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

          {selected.length > 0 && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 2,
                py: 1,
                backgroundColor: alpha(theme.palette.primary.main, 0.12),
                borderRadius: 1,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              }}
            >
              <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                {selected.length} selected
              </span>
              <Tooltip title="Delete selected meal events">
                <Button
                  size="small"
                  variant="contained"
                  color="error"
                  onClick={handleDeleteSelected}
                  sx={{ minWidth: 'auto', px: 1 }}
                >
                  <Trash2 size={16} />
                </Button>
              </Tooltip>
            </Box>
          )}

          {/* Download PDF Button */}
          <Button
            variant="contained"
            color="primary"
            onClick={handleDownloadPDF}
            sx={{ ml: 'auto' }}
          >
            Download PDF
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenSchedulePopup(true)}
          >
            Schedule PDF
          </Button>
        </Box>
        {/* Table */}
        <TableContainer component={Paper} id="meal-events-table">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={isSomeCurrentPageSelected && !isAllCurrentPageSelected}
                    checked={isAllCurrentPageSelected}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell 
                  sx={{ cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => handleSort('mealtime_name')}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    Meal Time
                    {sortColumn === 'mealtime_name' && (
                      sortDirection === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />
                    )}
                  </Box>
                </TableCell>
                <TableCell 
                  sx={{ cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => handleSort('mealtype_name')}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    Meal Type
                    {sortColumn === 'mealtype_name' && (
                      sortDirection === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />
                    )}
                  </Box>
                </TableCell>
                <TableCell 
                  sx={{ cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => handleSort('username')}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    User Name
                    {sortColumn === 'username' && (
                      sortDirection === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />
                    )}
                  </Box>
                </TableCell>
                <TableCell 
                  sx={{ cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => handleSort('submitted_date')}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    Submitted Date
                    {sortColumn === 'submitted_date' && (
                      sortDirection === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />
                    )}
                  </Box>
                </TableCell>
                <TableCell 
                  sx={{ cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => handleSort('meal_request_date')}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    Meal Request Date
                    {sortColumn === 'meal_request_date' && (
                      sortDirection === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentPageEvents.map((mealEvent, index) => {
                const eventId = `${mealEvent.user_id}_${mealEvent.meal_request_date}_${index}`;
                return (
                  <TableRow 
                    key={eventId}
                    hover
                    selected={selected.includes(eventId)}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selected.includes(eventId)}
                        onChange={() => handleSelect(eventId)}
                      />
                    </TableCell>
                    <TableCell>{mealEvent.mealtime_name}</TableCell>
                    <TableCell>{mealEvent.mealtype_name}</TableCell>
                    <TableCell>{mealEvent.username}</TableCell>
                    <TableCell>{mealEvent.submitted_date}</TableCell>
                    <TableCell>{mealEvent.meal_request_date}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={sortedEvents.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </TableContainer>
      </div>
      {/* Popups rendered as before */}
      {openSchedulePopup && (
        <SchedulePopup
          onClose={() => setOpenSchedulePopup(false)}
          table="Meal"
          onFrequencySelect={handleFrequencySelect}
        />
      )}
      {confirmDialog.open && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            bgcolor: 'rgba(0,0,0,0.3)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              bgcolor: 'background.paper',
              p: 4,
              borderRadius: 2,
              minWidth: 300,
            }}
          >
            <p>
              Are you sure you want to schedule the Meal report as{' '}
              <b>{confirmDialog.frequency}</b>?
            </p>
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                mt: 2,
                justifyContent: 'flex-end',
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleConfirmSchedule}
              >
                Confirm
              </Button>
              <Button
                variant="outlined"
                onClick={() => setConfirmDialog({ open: false, frequency: '' })}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Box>
      )}
      {/* Blur effect style */}
      <style>{`
        .blurred-content {
          filter: blur(6px);
          pointer-events: none;
          user-select: none;
          transition: filter 0.2s;
        }
      `}</style>
    </Box>
  );
};

export default MealEventsTable;
