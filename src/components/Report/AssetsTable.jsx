import { getAuthHeader } from '../../utils/authHeader';
import React, { useEffect, useState } from 'react';
import SchedulePopup from './SchedulePopup';
import { decodeToken } from '../../contexts/UserContext';
import {
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
  useTheme,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import html2pdf from 'html2pdf.js';
import { BASE_URLS } from '../../services/api/config';
import { toast } from 'react-toastify';

// Component to display assets table
const AssetsTable = () => {
  const theme = useTheme();
  const [Assets, setassets] = useState([]);
  // Removed date range filter
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [conditionFilter, setConditionFilter] = useState('All');
  const [openSchedulePopup, setOpenSchedulePopup] = useState(false);
  const [selectedFrequency, setSelectedFrequency] = useState('');
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    frequency: '',
  });

  // Enhanced table state
  const [sortDirection, setSortDirection] = useState('asc');
  const [sortColumn, setSortColumn] = useState('asset_name');

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
          report_name: 'asset',
          frequency: selectedFrequency,
        }),
      });
      if (!res.ok) throw new Error('Failed to schedule report');
      toast.success('Asset report scheduled successfully!');
    } catch (err) {
      toast.error('Failed to schedule asset report.');
    }
    setOpenSchedulePopup(false);
    setSelectedFrequency('');
  };

  // Fetch data from the API
  useEffect(() => {
    fetch(`${BASE_URLS.asset}/details`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
    })
      .then((response) => response.json())
      .then((data) => setassets(data))
      .catch((error) => console.error('Error fetching meal events:', error));
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
        <h1 style="color: #333; margin-bottom: 10px; font-size: 24px;">Assets Report</h1>
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
      if (categoryFilter !== 'All' || conditionFilter !== 'All') {
        const filtersDiv = document.createElement('div');
        filtersDiv.style.marginBottom = '20px';
        filtersDiv.style.padding = '10px';
        filtersDiv.style.backgroundColor = '#f5f5f5';
        filtersDiv.style.borderRadius = '5px';

        let filtersText = '<strong>Applied Filters:</strong> ';
        if (categoryFilter !== 'All')
          filtersText += `Category: ${categoryFilter} `;
        if (conditionFilter !== 'All')
          filtersText += `Condition: ${conditionFilter}`;

        filtersDiv.innerHTML = filtersText;
        pdfContainer.appendChild(filtersDiv);
      }

      // Clone the table and style it for PDF
      const tableElement = document.getElementById('asset-table');
      const clonedTable = tableElement.cloneNode(true);

      // Style the cloned table for better PDF appearance
      clonedTable.style.width = '100%';
      clonedTable.style.borderCollapse = 'collapse';
      clonedTable.style.marginTop = '20px';

      // Style table cells
      const cells = clonedTable.querySelectorAll('td, th');
      cells.forEach((cell) => {
        cell.style.border = '1px solid #ddd';
        cell.style.padding = '8px';
        cell.style.fontSize = '12px';
        cell.style.textAlign = 'left';
      });

      // Style header cells
      const headerCells = clonedTable.querySelectorAll('th');
      headerCells.forEach((cell) => {
        cell.style.backgroundColor = '#f8f9fa';
        cell.style.fontWeight = 'bold';
        cell.style.color = '#333';
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
      footer.innerHTML = `
        <p style="margin: 0; font-size: 14px;"><strong>Total Assets: ${sortedAssets.length}</strong></p>
        <p style="margin: 5px 0 0 0; font-size: 12px; color: #666;">Report generated from Resource Hub System</p>
      `;
      pdfContainer.appendChild(footer);

      // Temporarily add to document
      document.body.appendChild(pdfContainer);

      const options = {
        filename: `assets_report_${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          allowTaint: true,
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'landscape', // Changed to landscape for better table viewing
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
          toast.success('Assets report downloaded successfully!');
        });
    } catch (error) {
      console.error('Error downloading assets report:', error);
      toast.error('Failed to download assets report.');
    }
  };

  // Get unique categories and condition types for filters
  const categoryOptions = [
    'All',
    ...Array.from(new Set(Assets.map((a) => a.category).filter(Boolean))),
  ];
  const conditionOptions = [
    'All',
    ...Array.from(new Set(Assets.map((a) => a.condition_type).filter(Boolean))),
  ];

  // Filtered data by category and condition type only
  const filteredAssets = Assets.filter((asset) => {
    const categoryMatch =
      categoryFilter === 'All' || asset.category === categoryFilter;
    const conditionMatch =
      conditionFilter === 'All' || asset.condition_type === conditionFilter;
    return categoryMatch && conditionMatch;
  });

  // Sorted assets
  const sortedAssets = [...filteredAssets].sort((a, b) => {
    let aValue = a[sortColumn];
    let bValue = b[sortColumn];

    if (typeof aValue === 'string') aValue = aValue.toLowerCase();
    if (typeof bValue === 'string') bValue = bValue.toLowerCase();

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Display all assets instead of paginated
  const currentPageAssets = sortedAssets;

  if (!Array.isArray(sortedAssets) || sortedAssets.length === 0) {
    const isPopupOpen = openSchedulePopup || confirmDialog.open;
    return (
      <Box position="relative">
        {/* Blur wrapper */}
        <div className={isPopupOpen ? 'blurred-content' : ''}>
          <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
            <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                label="Category"
              >
                {categoryOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Condition</InputLabel>
              <Select
                value={conditionFilter}
                onChange={(e) => setConditionFilter(e.target.value)}
                label="Condition"
              >
                {conditionOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <TableContainer component={Paper} id="asset-table">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Asset ID</TableCell>
                  <TableCell>Asset Name</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Condition Type</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Availability</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={7}>No data available.</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        {/* Popups rendered as before */}
        {openSchedulePopup && (
          <SchedulePopup
            onClose={() => setOpenSchedulePopup(false)}
            table="Asset"
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
                Are you sure you want to schedule the Asset report as{' '}
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
                  onClick={() =>
                    setConfirmDialog({ open: false, frequency: '' })
                  }
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
  }

  const isPopupOpen = openSchedulePopup || confirmDialog.open;
  return (
    <Box position="relative">
      {/* Blur wrapper */}
      <div className={isPopupOpen ? 'blurred-content' : ''}>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            mb: 2,
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              label="Category"
            >
              {categoryOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Condition</InputLabel>
            <Select
              value={conditionFilter}
              onChange={(e) => setConditionFilter(e.target.value)}
              label="Condition"
            >
              {conditionOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

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
        {/* Table Container */}
        <TableContainer component={Paper} id="asset-table">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{ cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => handleSort('asset_id')}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    Asset ID
                    {sortColumn === 'asset_id' &&
                      (sortDirection === 'asc' ? (
                        <ArrowUpward fontSize="small" />
                      ) : (
                        <ArrowDownward fontSize="small" />
                      ))}
                  </Box>
                </TableCell>
                <TableCell
                  sx={{ cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => handleSort('asset_name')}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    Asset Name
                    {sortColumn === 'asset_name' &&
                      (sortDirection === 'asc' ? (
                        <ArrowUpward fontSize="small" />
                      ) : (
                        <ArrowDownward fontSize="small" />
                      ))}
                  </Box>
                </TableCell>
                <TableCell
                  sx={{ cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => handleSort('category')}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    Category
                    {sortColumn === 'category' &&
                      (sortDirection === 'asc' ? (
                        <ArrowUpward fontSize="small" />
                      ) : (
                        <ArrowDownward fontSize="small" />
                      ))}
                  </Box>
                </TableCell>
                <TableCell
                  sx={{ cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => handleSort('quantity')}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    Quantity
                    {sortColumn === 'quantity' &&
                      (sortDirection === 'asc' ? (
                        <ArrowUpward fontSize="small" />
                      ) : (
                        <ArrowDownward fontSize="small" />
                      ))}
                  </Box>
                </TableCell>
                <TableCell
                  sx={{ cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => handleSort('condition_type')}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    Condition Type
                    {sortColumn === 'condition_type' &&
                      (sortDirection === 'asc' ? (
                        <ArrowUpward fontSize="small" />
                      ) : (
                        <ArrowDownward fontSize="small" />
                      ))}
                  </Box>
                </TableCell>
                <TableCell
                  sx={{ cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => handleSort('location')}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    Location
                    {sortColumn === 'location' &&
                      (sortDirection === 'asc' ? (
                        <ArrowUpward fontSize="small" />
                      ) : (
                        <ArrowDownward fontSize="small" />
                      ))}
                  </Box>
                </TableCell>
                <TableCell
                  sx={{ cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => handleSort('is_available')}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    Availability
                    {sortColumn === 'is_available' &&
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
              {currentPageAssets.map((asset, index) => (
                <TableRow key={asset.asset_id} hover>
                  <TableCell>{asset.asset_id}</TableCell>
                  <TableCell>{asset.asset_name}</TableCell>
                  <TableCell>{asset.category}</TableCell>
                  <TableCell>{asset.quantity}</TableCell>
                  <TableCell>{asset.condition_type}</TableCell>
                  <TableCell>{asset.location}</TableCell>
                  <TableCell>
                    {asset.is_available ? 'Available' : 'Not Available'}
                  </TableCell>
                </TableRow>
              ))}
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
              Total Assets: {sortedAssets.length}
            </span>
            {(categoryFilter !== 'All' || conditionFilter !== 'All') && (
              <span style={{ fontSize: '0.875rem', color: '#666' }}>
                Filtered from {Assets.length} total assets
              </span>
            )}
          </Box>
        </Box>
      </div>
      {/* Popups rendered as before */}
      {openSchedulePopup && (
        <SchedulePopup
          onClose={() => setOpenSchedulePopup(false)}
          table="Asset"
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
              Are you sure you want to schedule the Asset report as{' '}
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

export default AssetsTable;
