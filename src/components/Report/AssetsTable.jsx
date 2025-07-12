import { getAuthHeader } from '../../utils/authHeader';
import React, { useEffect, useState } from 'react';
import{
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
} from '@mui/material';
import html2pdf from 'html2pdf.js';
import { BASE_URLS } from '../../services/api/config';
import { toast } from 'react-toastify';

// Component to display meal events table
const AssetsTable = () => {
  const [Assets, setassets] = useState([]);
  // Removed date range filter
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [conditionFilter, setConditionFilter] = useState('All');

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
  const categoryOptions = ['All', ...Array.from(new Set(Assets.map(a => a.category).filter(Boolean)))];
  const conditionOptions = ['All', ...Array.from(new Set(Assets.map(a => a.condition_type).filter(Boolean)))];

  // Filtered data by category and condition type only
  const filteredAssets = Assets.filter((asset) => {
    const categoryMatch = categoryFilter === 'All' || asset.category === categoryFilter;
    const conditionMatch = conditionFilter === 'All' || asset.condition_type === conditionFilter;
    return categoryMatch && conditionMatch;
  });

  if (!Array.isArray(filteredAssets) || filteredAssets.length === 0) {
    return (
      <Box>
        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              label="Category"
            >
              {categoryOptions.map(option => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Condition</InputLabel>
            <Select
              value={conditionFilter}
              onChange={e => setConditionFilter(e.target.value)}
              label="Condition"
            >
              {conditionOptions.map(option => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <TableContainer component={Paper} id="asset-table">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Asset Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Condition Type</TableCell>
                <TableCell>Location</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell colSpan={5}>No data available.</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            label="Category"
          >
            {categoryOptions.map(option => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Condition</InputLabel>
          <Select
            value={conditionFilter}
            onChange={e => setConditionFilter(e.target.value)}
            label="Condition"
          >
            {conditionOptions.map(option => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
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
      </Box>
      {/* Table Container */}
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
            {filteredAssets &&
              filteredAssets.map((Assets, index) => (
                <TableRow key={index}>
                  <TableCell>{Assets.asset_id}</TableCell>
                  <TableCell>{Assets.asset_name}</TableCell>
                  <TableCell>{Assets.category}</TableCell>
                  <TableCell>{Assets.quantity}</TableCell>
                  <TableCell>{Assets.condition_type}</TableCell>
                  <TableCell>{Assets.location}</TableCell>
                  <TableCell>
                    {' '}
                    {Assets.is_available ? 'Available' : 'Not Available'}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AssetsTable;
