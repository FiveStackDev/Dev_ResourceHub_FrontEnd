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

// Component to display meal events table

const statusOptions = [
  'All',
  'Pending',
  'In Progress',
  'Completed',
  'Rejected',
];
const priorityOptions = ['All', 'Low', 'Medium', 'High'];

const MaintenanceTable = () => {
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
  const [sortDirection, setSortDirection] = useState('desc');
  const [sortColumn, setSortColumn] = useState('maintenance_id');

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
        <h1 style="color: #333; margin-bottom: 10px; font-size: 24px;">Maintenance Report</h1>
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
        statusFilter !== 'All' ||
        priorityFilter !== 'All' ||
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
        if (statusFilter !== 'All')
          filtersText += `<span style="color: #333;">Status: ${statusFilter}</span><br>`;
        if (priorityFilter !== 'All')
          filtersText += `<span style="color: #333;">Priority: ${priorityFilter}</span><br>`;
        if (startDate && endDate)
          filtersText += `<span style="color: #333;">Date Range: ${startDate} to ${endDate}</span>`;

        filtersDiv.innerHTML = filtersText;
        pdfContainer.appendChild(filtersDiv);
      }

      // Clone the table and style it for PDF
      const tableElement = document.getElementById('maintenance-table');
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

      // Force light theme styles for PDF
      pdfContainer.style.backgroundColor = '#ffffff';
      pdfContainer.style.color = '#000000';

      // Add filters information if any are applied
      if (
        statusFilter !== 'All' ||
        priorityFilter !== 'All' ||
        startDate ||
        endDate
      ) {
        const filtersInfo = document.createElement('div');
        filtersInfo.style.marginBottom = '20px';
        filtersInfo.style.padding = '15px';
        filtersInfo.style.backgroundColor = '#f8f9fa';
        filtersInfo.style.borderRadius = '5px';
        filtersInfo.style.border = '1px solid #dee2e6';

        let filterText =
          '<h3 style="margin: 0 0 10px 0; color: #333; font-size: 16px;">Applied Filters:</h3>';
        if (statusFilter !== 'All')
          filterText += `<p style="margin: 2px 0; color: #555;">Status: ${statusFilter}</p>`;
        if (priorityFilter !== 'All')
          filterText += `<p style="margin: 2px 0; color: #555;">Priority: ${priorityFilter}</p>`;
        if (startDate && endDate)
          filterText += `<p style="margin: 2px 0; color: #555;">Date Range: ${startDate} to ${endDate}</p>`;

        filtersInfo.innerHTML = filterText;
        pdfContainer.appendChild(filtersInfo);
      }

      // Add footer with summary
      const footer = document.createElement('div');
      footer.style.marginTop = '30px';
      footer.style.padding = '15px';
      footer.style.backgroundColor = '#f8f9fa';
      footer.style.borderRadius = '5px';
      footer.style.border = '1px solid #dee2e6';
      footer.innerHTML = `
        <p style="margin: 0; font-size: 14px; color: #000;"><strong>Total Maintenance Requests: ${sortedMaintenance.length}</strong></p>
        <p style="margin: 5px 0 0 0; font-size: 12px; color: #666;">Report generated from Resource Hub System</p>
      `;
      pdfContainer.appendChild(footer);

      // Temporarily add to document
      document.body.appendChild(pdfContainer);

      const options = {
        filename: `maintenance_report_${new Date().toISOString().split('T')[0]}.pdf`,
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
          toast.success('Maintenance report downloaded successfully!');
        });
    } catch (error) {
      console.error('Error downloading maintenance report:', error);
      toast.error('Failed to download maintenance report.');
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

  // Display all maintenance instead of paginated
  const currentPageMaintenance = sortedMaintenance;

  const isPopupOpen = openSchedulePopup || confirmDialog.open;
  return (
    <div style={{ position: 'relative' }}>
      {/* Blur wrapper */}
      <div className={isPopupOpen ? 'blurred-content' : ''}>
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          {/* Desktop View */}
          <div
            style={{
              display: 'flex',
              gap: 16,
              marginBottom: 20,
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
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
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenSchedulePopup(true)}
            >
              Schedule PDF
            </Button>
          </div>
        </Box>

        {/* Mobile View */}
        <Box sx={{ display: { xs: 'block', sm: 'none' }, mb: 3 }}>
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              mb: 2,
              pt: 1,
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
            <FormControl
              variant="outlined"
              size="small"
              sx={{
                minWidth: '80px',
                flex: '0 0 auto',
              }}
            >
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

            <FormControl
              variant="outlined"
              size="small"
              sx={{
                minWidth: '80px',
                flex: '0 0 auto',
              }}
            >
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

            <TextField
              label="Start Date"
              type="date"
              size="small"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{
                width: '105px',
                flex: '0 0 auto',
              }}
            />
            <TextField
              label="End Date"
              type="date"
              size="small"
              value={endDate}
              onChange={(e) => setEndDate(e.value)}
              InputLabelProps={{ shrink: true }}
              sx={{
                width: '105px',
                flex: '0 0 auto',
              }}
            />
          </Box>

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

        {/* Table Container */}
        <TableContainer component={Paper} id="maintenance-table">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{ cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => handleSort('maintenance_id')}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    Number
                    {sortColumn === 'maintenance_id' &&
                      (sortDirection === 'asc' ? (
                        <ArrowUpward fontSize="small" />
                      ) : (
                        <ArrowDownward fontSize="small" />
                      ))}
                  </Box>
                </TableCell>
                <TableCell
                  sx={{ cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => handleSort('user_id')}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    User_ID
                    {sortColumn === 'user_id' &&
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
                <TableCell>Description</TableCell>
                <TableCell
                  sx={{ cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => handleSort('priorityLevel')}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    Priority Level
                    {sortColumn === 'priorityLevel' &&
                      (sortDirection === 'asc' ? (
                        <ArrowUpward fontSize="small" />
                      ) : (
                        <ArrowDownward fontSize="small" />
                      ))}
                  </Box>
                </TableCell>
                <TableCell
                  sx={{ cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => handleSort('status')}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    Status
                    {sortColumn === 'status' &&
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
              {currentPageMaintenance.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No data available.
                  </TableCell>
                </TableRow>
              ) : (
                currentPageMaintenance.map((maintenance, index) => (
                  <TableRow key={maintenance.maintenance_id} hover>
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
              Total Maintenance Requests: {sortedMaintenance.length}
            </span>
            {(statusFilter !== 'All' ||
              priorityFilter !== 'All' ||
              startDate ||
              endDate) && (
              <span style={{ fontSize: '0.875rem', color: '#666' }}>
                Filtered from {Maintenance.length} total requests
              </span>
            )}
          </Box>
        </Box>
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
