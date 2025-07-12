import React from 'react';
import {
  Modal,
  Box,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Button,
} from '@mui/material';

function SchedulePopup({ onClose, table, onFrequencySelect }) {
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '400px',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: '8px',
  };

  const cardStyle = {
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  };

  return (
    <Modal
      open={true}
      onClose={onClose}
      aria-labelledby="frequency-modal-title"
    >
      <Box sx={modalStyle}>
        <Typography
          id="frequency-modal-title"
          variant="h5"
          component="h2"
          gutterBottom
          sx={{ textAlign: 'center', fontWeight: 'bold' }}
        >
          Schedule Your {table} Report
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{ textAlign: 'center', mb: 2, color: '#666' }}
        >
          Select the frequency for generating the <br></br> {table} Report
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <Card sx={{ ...cardStyle, width: '80%' }}>
            <CardActionArea onClick={() => onFrequencySelect && onFrequencySelect('Weekly')}>
              <CardContent sx={{ textAlign: 'center', padding: '20px' }}>
                <Typography variant="h6">Weekly</Typography>
                <Typography variant="body2" sx={{ color: '#aaa' }}>
                  Generate every week
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          <Card sx={{ ...cardStyle, width: '80%' }}>
            <CardActionArea onClick={() => onFrequencySelect && onFrequencySelect('Bi-Weekly')}>
              <CardContent sx={{ textAlign: 'center', padding: '20px' }}>
                <Typography variant="h6">Bi-Weekly</Typography>
                <Typography variant="body2" sx={{ color: '#aaa' }}>
                  Generate every two weeks
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          <Card sx={{ ...cardStyle, width: '80%' }}>
            <CardActionArea onClick={() => onFrequencySelect && onFrequencySelect('Monthly')}>
              <CardContent sx={{ textAlign: 'center', padding: '20px' }}>
                <Typography variant="h6">Monthly</Typography>
                <Typography variant="body2" sx={{ color: '#aaa' }}>
                  Generate every month
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Box>
        <br></br>
      </Box>
    </Modal>
  );
}

export default SchedulePopup;
