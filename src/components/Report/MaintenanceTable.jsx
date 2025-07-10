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
} from '@mui/material';
import html2pdf from 'html2pdf.js';
import { BASE_URLS } from '../../services/api/config';
import { toast } from 'react-toastify';

// Component to display meal events table
const MaintenanceTable = () => {
  const [Maintenance, setmaintenance] = useState(['']);

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

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={handleDownloadPDF}
        style={{ marginBottom: 20, float: 'right' }}
      >
        Download PDF
      </Button>

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
            {Maintenance.map((maintenance, index) => (
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
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default MaintenanceTable;
