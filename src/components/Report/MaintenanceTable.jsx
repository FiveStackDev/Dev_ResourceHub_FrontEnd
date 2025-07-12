import { getAuthHeader } from '../../utils/authHeader';
import React, { useEffect, useState } from 'react';import {
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
  TextField,
} from '@mui/material';
import html2pdf from 'html2pdf.js';
import { BASE_URLS } from '../../services/api/config';
import { toast } from 'react-toastify';

// Component to display meal events table

const statusOptions = [
  'All',
  'Pending',
  'In Progress',
  'Completed',
  'Rejected',
];
const priorityOptions = [
  'All',
  'Low',
  'Medium',
  'High',
];

const MaintenanceTable = () => {
  const [Maintenance, setmaintenance] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

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
    const statusMatch = statusFilter === 'All' || maintenance.status === statusFilter;
    const priorityMatch = priorityFilter === 'All' || maintenance.priorityLevel === priorityFilter;
    let dateMatch = true;
    if (startDate && endDate && maintenance.submitted_date) {
      const submitted = new Date(maintenance.submitted_date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      dateMatch = submitted >= start && submitted <= end;
    }
    return statusMatch && priorityMatch && dateMatch;
  });

  return (
    <div>
      <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
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
        <Button
          variant="contained"
          color="primary"
          onClick={handleDownloadPDF}
          style={{ marginLeft: 'auto' }}
        >
          Download PDF
        </Button>
      </div>

      {/* Table Container */}
      <TableContainer component={Paper} id="maintenance-table">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Maintenance ID</TableCell>
              <TableCell>User ID</TableCell>
              <TableCell>User Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Priority Level</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Submitted Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMaintenance.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No data available.
                </TableCell>
              </TableRow>
            ) : (
              filteredMaintenance.map((maintenance, index) => (
                <TableRow key={index}>
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
      </TableContainer>
    </div>
  );
};

export default MaintenanceTable;
