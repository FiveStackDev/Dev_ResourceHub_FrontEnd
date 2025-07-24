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

// Component to display assets table
const AssetsTable = ({ onDeleteAssets }) => {
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
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortDirection, setSortDirection] = useState('asc');
  const [sortColumn, setSortColumn] = useState('asset_name');

  // Selection functions
  const getCurrentPageAssetIds = () => {
    return sortedAssets
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      .map((asset) => asset.asset_id);
  };

  const handleSelectAll = (event) => {
    const currentPageAssetIds = getCurrentPageAssetIds();
    if (event.target.checked) {
      const newSelected = [...new Set([...selected, ...currentPageAssetIds])];
      setSelected(newSelected);
    } else {
      setSelected(selected.filter(id => !currentPageAssetIds.includes(id)));
    }
  };

  const handleSelect = (assetId) => {
    const selectedIndex = selected.indexOf(assetId);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, assetId];
    } else {
      newSelected = selected.filter((id) => id !== assetId);
    }
    setSelected(newSelected);
  };

  const handleSort = (column) => {
    const isAsc = sortColumn === column && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortColumn(column);
  };

  const handleDeleteSelected = () => {
    if (onDeleteAssets && selected.length > 0) {
      onDeleteAssets(selected);
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
      const element = document.getElementById('asset-table'); // Get the content to convert to PDF
      const options = {
        filename: 'assets.pdf', // Set the filename of the PDF
        image: { type: 'jpeg', quality: 0.98 }, // Set image quality
        html2canvas: { scale: 2 }, // Set the scale for the canvas
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }, // Set PDF size and orientation
      };
      html2pdf().from(element).set(options).save(); // Convert and download the PDF
      toast.success('Assets report downloaded successfully!');
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

  const currentPageAssets = sortedAssets.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const currentPageAssetIds = getCurrentPageAssetIds();
  const isAllCurrentPageSelected = currentPageAssetIds.length > 0 && 
    currentPageAssetIds.every(id => selected.includes(id));
  const isSomeCurrentPageSelected = currentPageAssetIds.some(id => selected.includes(id));

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
                  <TableCell>
                    <Checkbox disabled />
                  </TableCell>
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
        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
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
              <Tooltip title="Delete selected assets">
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
                <TableCell>
                  
                </TableCell>
                <TableCell 
                  sx={{ cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => handleSort('asset_id')}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    Asset ID
                    {sortColumn === 'asset_id' && (
                      sortDirection === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />
                    )}
                  </Box>
                </TableCell>
                <TableCell 
                  sx={{ cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => handleSort('asset_name')}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    Asset Name
                    {sortColumn === 'asset_name' && (
                      sortDirection === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />
                    )}
                  </Box>
                </TableCell>
                <TableCell 
                  sx={{ cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => handleSort('category')}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    Category
                    {sortColumn === 'category' && (
                      sortDirection === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />
                    )}
                  </Box>
                </TableCell>
                <TableCell 
                  sx={{ cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => handleSort('quantity')}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    Quantity
                    {sortColumn === 'quantity' && (
                      sortDirection === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />
                    )}
                  </Box>
                </TableCell>
                <TableCell 
                  sx={{ cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => handleSort('condition_type')}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    Condition Type
                    {sortColumn === 'condition_type' && (
                      sortDirection === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />
                    )}
                  </Box>
                </TableCell>
                <TableCell 
                  sx={{ cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => handleSort('location')}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    Location
                    {sortColumn === 'location' && (
                      sortDirection === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />
                    )}
                  </Box>
                </TableCell>
                <TableCell 
                  sx={{ cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => handleSort('is_available')}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    Availability
                    {sortColumn === 'is_available' && (
                      sortDirection === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentPageAssets.map((asset, index) => (
                <TableRow 
                  key={asset.asset_id}
                  hover
                  selected={selected.includes(asset.asset_id)}
                >
                  <TableCell >
                    
                  </TableCell>
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
          <TablePagination
            component="div"
            count={sortedAssets.length}
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
