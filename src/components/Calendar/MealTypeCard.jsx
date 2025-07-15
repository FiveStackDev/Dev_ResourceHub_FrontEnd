import * as React from 'react';
import { useEffect } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { ShoppingCart } from 'lucide-react';
import { useThemeStyles } from '../../hooks/useThemeStyles';
import './CalendarComponents.css';

function MealTypeCard({ id, name, image, onSelect }) {
  // Theme styles hook
  const { updateCSSVariables } = useThemeStyles();
  
  // Update CSS variables when theme changes
  useEffect(() => {
    updateCSSVariables();
  }, [updateCSSVariables]);

  return (
    <div className="calendar-meal-card">
      <div
        className="calendar-meal-card-media"
        style={{ backgroundImage: `url(${image})` }}
        title={name}
      />
      <div className="calendar-meal-card-content">
        <Typography gutterBottom variant="h5" component="div">
          {name}
        </Typography>
      </div>
      <div className="calendar-meal-card-actions">
        <button
          className="calendar-meal-card-button request-button"
          onClick={() => onSelect(id, name)}
        >
          <ShoppingCart size={16} />
          Request
        </button>
      </div>
    </div>
  );
}

export default MealTypeCard;
