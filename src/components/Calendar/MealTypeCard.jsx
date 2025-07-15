import * as React from 'react';
import { useEffect } from 'react';
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
        <h5>{name}</h5>
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
