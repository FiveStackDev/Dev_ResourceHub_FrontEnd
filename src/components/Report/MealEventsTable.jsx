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
  Tooltip,
  useTheme,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import html2pdf from 'html2pdf.js';
import { BASE_URLS } from '../../services/api/config';
import { toast } from 'react-toastify';
import SchedulePopup from './SchedulePopup';
import { decodeToken } from '../../contexts/UserContext';

const MealEventsTable = () => {
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
  const [sortDirection, setSortDirection] = useState('asc');
  const [sortColumn, setSortColumn] = useState('meal_request_date');

  const handleSort = (column) => {
    const isAsc = sortColumn === column && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortColumn(column);
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

  // Display all events instead of paginated
  const currentPageEvents = sortedEvents;

  const handleDownloadPDF = () => {
    try {
      // Create a temporary container for PDF content
      const pdfContainer = document.createElement('div');
      pdfContainer.style.padding = '20px';
      pdfContainer.style.fontFamily = 'Arial, sans-serif';
      pdfContainer.style.backgroundColor = '#ffffff';
      pdfContainer.style.color = '#000000';

      // Create header with title and date
      const header = document.createElement('div');
      header.style.textAlign = 'center';
      header.style.marginBottom = '30px';
      header.innerHTML = `
        <h1 style="color: #333; margin-bottom: 10px; font-size: 24px;">Meal Events Report</h1>
        <p style="color: #666; font-size: 14px; margin: 0;">Generated on: ${new Date().toLocaleDateString(
          'en-US',
          {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          },
        )}</p>
        <hr style="margin: 20px 0; border: 1px solid #ddd;">
      `;
      pdfContainer.appendChild(header);

      // Add filters information if any are applied
      if (
        selectedMealTime ||
        selectedMealType ||
        selectedMonth ||
        selectedYear ||
        startDate ||
        endDate
      ) {
        const filtersDiv = document.createElement('div');
        filtersDiv.style.marginBottom = '20px';
        filtersDiv.style.padding = '15px';
        filtersDiv.style.backgroundColor = '#f8f9fa';
        filtersDiv.style.borderRadius = '5px';
        filtersDiv.style.border = '1px solid #dee2e6';
        filtersDiv.style.color = '#000000';

        let filtersText =
          '<strong style="color: #000000;">Applied Filters:</strong><br>';
        if (selectedMealTime) {
          const mealTime = mealTimes.find(
            (time) => time.id == selectedMealTime,
          );
          filtersText += `<span style="color: #333;">Meal Time: ${mealTime ? mealTime.name : selectedMealTime}</span><br>`;
        }
        if (selectedMealType) {
          const mealType = mealTypes.find(
            (type) => type.id == selectedMealType,
          );
          filtersText += `<span style="color: #333;">Meal Type: ${mealType ? mealType.name : selectedMealType}</span><br>`;
        }
        if (selectedYear)
          filtersText += `<span style="color: #333;">Year: ${selectedYear}</span><br>`;
        if (selectedMonth)
          filtersText += `<span style="color: #333;">Month: ${new Date(0, selectedMonth - 1).toLocaleString('default', { month: 'long' })}</span><br>`;
        if (startDate && endDate)
          filtersText += `<span style="color: #333;">Date Range: ${startDate} to ${endDate}</span>`;

        filtersDiv.innerHTML = filtersText;
        pdfContainer.appendChild(filtersDiv);
      }

      // Clone the table and style it for PDF
      const tableElement = document.getElementById('meal-events-table');
      const clonedTable = tableElement.cloneNode(true);

      // Style the cloned table for better PDF appearance
      clonedTable.style.width = '100%';
      clonedTable.style.borderCollapse = 'collapse';
      clonedTable.style.marginTop = '20px';
      clonedTable.style.backgroundColor = '#ffffff';

      // Style table cells with light theme colors
      const cells = clonedTable.querySelectorAll('td, th');
      cells.forEach((cell) => {
        cell.style.border = '1px solid #dee2e6';
        cell.style.padding = '8px';
        cell.style.fontSize = '12px';
        cell.style.textAlign = 'left';
        cell.style.backgroundColor = '#ffffff';
        cell.style.color = '#000000';
      });

      // Style header cells with light theme
      const headerCells = clonedTable.querySelectorAll('th');
      headerCells.forEach((cell) => {
        cell.style.backgroundColor = '#f8f9fa';
        cell.style.fontWeight = 'bold';
        cell.style.color = '#000000';
        cell.style.borderBottom = '2px solid #dee2e6';
      });

      // Remove sort icons from the cloned table
      const sortIcons = clonedTable.querySelectorAll('.MuiSvgIcon-root');
      sortIcons.forEach((icon) => icon.remove());

      pdfContainer.appendChild(clonedTable);

      // Add footer with summary
      const footer = document.createElement('div');
      footer.style.marginTop = '30px';
      footer.style.padding = '15px';
      footer.style.backgroundColor = '#f8f9fa';
      footer.style.borderRadius = '5px';
      footer.style.border = '1px solid #dee2e6';
      footer.innerHTML = `
        <p style="margin: 0; font-size: 14px; color: #000000;"><strong>Total Meal Events: ${sortedEvents.length}</strong></p>
        <p style="margin: 5px 0 0 0; font-size: 12px; color: #666;">Report generated from Resource Hub System</p>
      `;
      pdfContainer.appendChild(footer);

      // Temporarily add to document
      document.body.appendChild(pdfContainer);

      const options = {
        filename: `meal_events_report_${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          allowTaint: true,
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'landscape',
        },
        margin: [10, 10, 10, 10],
      };

      html2pdf()
        .from(pdfContainer)
        .set(options)
        .save()
        .then(() => {
          // Remove temporary container
          document.body.removeChild(pdfContainer);
          toast.success('Meal events report downloaded successfully!');
        });
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
        {/* Desktop View */}
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              mb: 2,
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
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

            {/* Buttons */}
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
        </Box>

        {/* Mobile View */}
        <Box sx={{ display: { xs: 'block', sm: 'none' }, mb: 3 }}>
          {/* Mobile Filters Row */}
          <Box 
            sx={{
              display: 'flex',
              gap: 1,
              mb: 2,
              pt: 2,
              overflowX: 'auto',
              flexWrap: 'nowrap',
              pb: 1,
              '&::-webkit-scrollbar': {
                height: '4px',
              },
              '&::-webkit-scrollbar-track': {
                background: '#f1f1f1',
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#888',
                borderRadius: '4px',
              },
            }}
          >
            {/* Meal Time Filter */}
            <FormControl 
              variant="outlined" 
              size="small" 
              sx={{ 
                minWidth: '80px',
                flex: '0 0 auto'
              }}
            >
              <InputLabel>Time</InputLabel>
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
              sx={{ 
                minWidth: '80px',
                flex: '0 0 auto'
              }}
            >
              <InputLabel>Type</InputLabel>
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

            {/* Date Range Filter */}
            <TextField
              label="Start Date"
              type="date"
              size="small"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ 
                width: '105px',
                flex: '0 0 auto'
              }}
            />
            <TextField
              label="End Date"
              type="date"
              size="small"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ 
                width: '105px',
                flex: '0 0 auto'
              }}
            />
          </Box>

          {/* Mobile Buttons Row */}
          <Box 
            sx={{
              display: 'flex',
              gap: 2,
              justifyContent: 'space-between',
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleDownloadPDF}
              sx={{ flex: 1 }}
            >
              Download PDF
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenSchedulePopup(true)}
              sx={{ flex: 1 }}
            >
              Schedule PDF
            </Button>
          </Box>
        </Box>
        {/* Table */}
        <TableContainer component={Paper} id="meal-events-table">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{ cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => handleSort('mealtime_name')}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    Meal Time
                    {sortColumn === 'mealtime_name' &&
                      (sortDirection === 'asc' ? (
                        <ArrowUpward fontSize="small" />
                      ) : (
                        <ArrowDownward fontSize="small" />
                      ))}
                  </Box>
                </TableCell>
                <TableCell
                  sx={{ cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => handleSort('mealtype_name')}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    Meal Type
                    {sortColumn === 'mealtype_name' &&
                      (sortDirection === 'asc' ? (
                        <ArrowUpward fontSize="small" />
                      ) : (
                        <ArrowDownward fontSize="small" />
                      ))}
                  </Box>
                </TableCell>
                <TableCell
                  sx={{ cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => handleSort('username')}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    User Name
                    {sortColumn === 'username' &&
                      (sortDirection === 'asc' ? (
                        <ArrowUpward fontSize="small" />
                      ) : (
                        <ArrowDownward fontSize="small" />
                      ))}
                  </Box>
                </TableCell>
                <TableCell
                  sx={{ cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => handleSort('submitted_date')}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    Submitted Date
                    {sortColumn === 'submitted_date' &&
                      (sortDirection === 'asc' ? (
                        <ArrowUpward fontSize="small" />
                      ) : (
                        <ArrowDownward fontSize="small" />
                      ))}
                  </Box>
                </TableCell>
                <TableCell
                  sx={{ cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => handleSort('meal_request_date')}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    Meal Request Date
                    {sortColumn === 'meal_request_date' &&
                      (sortDirection === 'asc' ? (
                        <ArrowUpward fontSize="small" />
                      ) : (
                        <ArrowDownward fontSize="small" />
                      ))}
                  </Box>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentPageEvents.map((mealEvent, index) => {
                const eventId = `${mealEvent.user_id}_${mealEvent.meal_request_date}_${index}`;
                return (
                  <TableRow key={eventId} hover>
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
        </TableContainer>

        {/* Summary Section */}
        <Box sx={{ mt: 2, p: 2, borderRadius: 1 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontWeight: 'bold' }}>
              Total Meal Events: {sortedEvents.length}
            </span>
            {(selectedMealTime ||
              selectedMealType ||
              selectedMonth ||
              selectedYear ||
              startDate ||
              endDate) && (
              <span style={{ fontSize: '0.875rem', color: '#666' }}>
                Filtered from {mealEvents.length} total events
              </span>
            )}
          </Box>
        </Box>
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
