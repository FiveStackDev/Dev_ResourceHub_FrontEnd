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
  Box,
  Select,
  FormControl,
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

// Component to display meal events table

const statusOptions = [
  'All',
  'Pending',
  'In Progress',
  'Completed',
  'Rejected',
];
const priorityOptions = ['All', 'Low', 'Medium', 'High'];

const MaintenanceTable = ({ onDeleteMaintenances }) => {
  const theme = useTheme();
  const [Maintenance, setmaintenance] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
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
  const [sortColumn, setSortColumn] = useState('maintenance_id');

  // Selection functions
  const getCurrentPageMaintenanceIds = () => {
    return sortedMaintenance
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      .map((maintenance) => maintenance.maintenance_id);
  };

  const handleSelectAll = (event) => {
    const currentPageMaintenanceIds = getCurrentPageMaintenanceIds();
    if (event.target.checked) {
      const newSelected = [...new Set([...selected, ...currentPageMaintenanceIds])];
      setSelected(newSelected);
    } else {
      setSelected(selected.filter(id => !currentPageMaintenanceIds.includes(id)));
    }
  };

  const handleSelect = (maintenanceId) => {
    const selectedIndex = selected.indexOf(maintenanceId);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, maintenanceId];
    } else {
      newSelected = selected.filter((id) => id !== maintenanceId);
    }
    setSelected(newSelected);
  };

  const handleSort = (column) => {
    const isAsc = sortColumn === column && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortColumn(column);
  };

  const handleDeleteSelected = () => {
    if (onDeleteMaintenances && selected.length > 0) {
      onDeleteMaintenances(selected);
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
      // TODO: Replace with your actual endpoint
      const endpoint = `${BASE_URLS.report}/addscedulereport`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify({
          user_id: userId,
          report_name: 'maintenance',
          frequency: selectedFrequency,
        }),
      });
      if (!res.ok) throw new Error('Failed to schedule report');
      toast.success('Maintenance report scheduled successfully!');
    } catch (err) {
      toast.error('Failed to schedule maintenance report.');
    }
    setOpenSchedulePopup(false);
    setSelectedFrequency('');
  };

  // Fetch data from the API
  useEffect(() => {
    fetch(`${BASE_URLS.maintenance}/details`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
    })
      .then((response) => response.json())
      .then((data) => setmaintenance(data))
      .catch((error) => console.error('Error fetching maintenance:', error));
  }, []);

  // Function to download the table as PDF
  const handleDownloadPDF = () => {
    try {
      const element = document.getElementById('maintenance-table'); // Get the content to convert to PDF
      const options = {
        filename: 'maintenances.pdf', // Set the filename of the PDF
        image: { type: 'jpeg', quality: 0.98 }, // Set image quality
        html2canvas: { scale: 2 }, // Set the scale for the canvas
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }, // Set PDF size and orientation
      };
      html2pdf().from(element).set(options).save(); // Convert and download the PDF
      toast.success('maintenances report downloaded successfully!');
    } catch (error) {
      console.error('Error downloading maintenances report:', error);
      toast.error('Failed to download maintenances report.');
    }
  };

  // Filtered data
  const filteredMaintenance = Maintenance.filter((maintenance) => {
    const statusMatch =
      statusFilter === 'All' || maintenance.status === statusFilter;
    const priorityMatch =
      priorityFilter === 'All' || maintenance.priorityLevel === priorityFilter;
    let dateMatch = true;
    if (startDate && endDate && maintenance.submitted_date) {
      const submitted = new Date(maintenance.submitted_date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      dateMatch = submitted >= start && submitted <= end;
    }
    return statusMatch && priorityMatch && dateMatch;
  });

  // Sorted maintenance
  const sortedMaintenance = [...filteredMaintenance].sort((a, b) => {
    let aValue = a[sortColumn];
    let bValue = b[sortColumn];
    
    if (typeof aValue === 'string') aValue = aValue.toLowerCase();
    if (typeof bValue === 'string') bValue = bValue.toLowerCase();
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const currentPageMaintenance = sortedMaintenance.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const currentPageMaintenanceIds = getCurrentPageMaintenanceIds();
  const isAllCurrentPageSelected = currentPageMaintenanceIds.length > 0 && 
    currentPageMaintenanceIds.every(id => selected.includes(id));
  const isSomeCurrentPageSelected = currentPageMaintenanceIds.some(id => selected.includes(id));

  const isPopupOpen = openSchedulePopup || confirmDialog.open;
  return (
    <div style={{ position: 'relative' }}>
      {/* Blur wrapper */}
      <div className={isPopupOpen ? 'blurred-content' : ''}>
        <div
          style={{
            display: 'flex',
            gap: 16,
            marginBottom: 20,
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          {/* Status Filter */}
          <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label="Status"
            >
              {statusOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* Priority Filter */}
          <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Priority</InputLabel>
            <Select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              label="Priority"
            >
              {priorityOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
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
              <Tooltip title="Delete selected maintenance requests">
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

          <Button
            variant="contained"
            color="primary"
            onClick={handleDownloadPDF}
            style={{ marginLeft: 'auto' }}
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
        </div>

        {/* Table Container */}
        <TableContainer component={Paper} id="maintenance-table">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell >
                  
                </TableCell>
                <TableCell 
                  sx={{ cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => handleSort('maintenance_id')}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    Maintenance ID
                    {sortColumn === 'maintenance_id' && (
                      sortDirection === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />
                    )}
                  </Box>
                </TableCell>
                <TableCell 
                  sx={{ cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => handleSort('user_id')}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    User ID
                    {sortColumn === 'user_id' && (
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
                <TableCell>Description</TableCell>
                <TableCell 
                  sx={{ cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => handleSort('priorityLevel')}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    Priority Level
                    {sortColumn === 'priorityLevel' && (
                      sortDirection === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />
                    )}
                  </Box>
                </TableCell>
                <TableCell 
                  sx={{ cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => handleSort('status')}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    Status
                    {sortColumn === 'status' && (
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
              </TableRow>
            </TableHead>
            <TableBody>
              {currentPageMaintenance.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No data available.
                  </TableCell>
                </TableRow>
              ) : (
                currentPageMaintenance.map((maintenance, index) => (
                  <TableRow 
                    key={maintenance.maintenance_id}
                    hover
                    selected={selected.includes(maintenance.maintenance_id)}
                  >
                    <TableCell >
                      
                    </TableCell>
                    <TableCell>{maintenance.maintenance_id}</TableCell>
                    <TableCell>{maintenance.user_id}</TableCell>
                    <TableCell>{maintenance.username}</TableCell>
                    <TableCell style={{ maxWidth: '200px' }}>
                      {maintenance.description}
                    </TableCell>
                    <TableCell>{maintenance.priorityLevel}</TableCell>
                    <TableCell>{maintenance.status}</TableCell>
                    <TableCell>{maintenance.submitted_date}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={sortedMaintenance.length}
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
          table="Maintenance"
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
              Are you sure you want to schedule the Maintenance report as{' '}
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
    </div>
  );
};

export default MaintenanceTable;
