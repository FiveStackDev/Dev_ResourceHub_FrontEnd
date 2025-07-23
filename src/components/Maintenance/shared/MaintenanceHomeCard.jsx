import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

function MaintenanceHomeCard({ name, image, route }) {
  return (
    <Link to={route} style={{ textDecoration: 'none' }}>
      <Card
        sx={{
          width: 230,
          height: 275,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '15px',
          backgroundColor: 'rgb(188, 223, 255)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          transition: 'transform 0.2s ease-in-out',
          '&:hover': {
            transform: 'scale(1.03)',
          },
        }}
      >
        <CardMedia
          sx={{ height: 150, width: 140 }}
          image={image}
          title={name}
        />
        <CardContent>
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            textAlign="center"
          >
            {name}
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
}

export default MaintenanceHomeCard;
