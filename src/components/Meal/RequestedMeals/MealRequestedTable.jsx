import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Box,
  useTheme,
  Button,
} from '@mui/material';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';

import AddMealEventManual from './AddMealEventManual';
import axios from 'axios';
import { getAuthHeader } from '../../../utils/authHeader';

const MealRequestedTable = ({ events: initialEvents }) => {
  const theme = useTheme();
  const [events, setEvents] = useState(initialEvents);
  const [manualDialogOpen, setManualDialogOpen] = useState(false);
  const [adding, setAdding] = useState(false);

  // Sync local events state with prop when prop changes
  React.useEffect(() => {
    setEvents(initialEvents);
  }, [initialEvents]);

  const [sortDirection, setSortDirection] = useState('asc');
  const [sortColumn, setSortColumn] = useState('meal_request_date');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleSort = (column) => {
    const isAsc = sortColumn === column && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortColumn(column);
  };

  // Sort the events
  const sortedEvents = [...events].sort((a, b) => {
    let aValue = a[sortColumn];
    let bValue = b[sortColumn];

    if (typeof aValue === 'string') aValue = aValue.toLowerCase();
    if (typeof bValue === 'string') bValue = bValue.toLowerCase();

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Get current page data
  const paginatedEvents = sortedEvents.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  // Add meal event handler
  const handleManualAdd = async (data) => {
    setAdding(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const res = await axios.post(
        `${BASE_URLS.calendar}/mealevents/add`,
        {
          ...data,
          submitted_date: today,
        },
        { headers: { ...getAuthHeader() } },
      );
      if (res.status === 200 || res.status === 201) {
        setEvents((prev) => [
          ...prev,
          {
            ...data,
            submitted_date: today,
            username: data.username || '',
            mealtime_name: '',
            mealtype_name: '',
          },
        ]);
        toast.success('Meal event added!');
      } else {
        toast.error('Failed to add meal event.');
      }
    } catch (e) {
      toast.error('Error adding meal event.');
    } finally {
      setAdding(false);
    }
  };

  return (
    <Box position="relative">
      <Button
        variant="contained"
        color="primary"
        sx={{ mb: 2 }}
        onClick={() => setManualDialogOpen(true)}
      >
        Add Meal Request
      </Button>
      <AddMealEventManual
        open={manualDialogOpen}
        onClose={() => setManualDialogOpen(false)}
        onAdd={handleManualAdd}
        existingEvents={events}
      />
      <TableContainer component={Paper} id="meal-events-table">
        <Table>
          <TableHead>
            <TableRow>
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
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedEvents.map((mealEvent, index) => {
              const eventId = `${mealEvent.user_id}_${mealEvent.meal_request_date}_${index}`;
              return (
                <TableRow key={eventId} hover>
                  <TableCell>{mealEvent.username}</TableCell>
                  <TableCell>{mealEvent.meal_request_date}</TableCell>
                  <TableCell>{mealEvent.mealtime_name}</TableCell>
                  <TableCell>{mealEvent.mealtype_name}</TableCell>
                  <TableCell>{mealEvent.submitted_date}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={sortedEvents.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default MealRequestedTable;
