import * as React from 'react';
import { useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { useThemeStyles } from '../../hooks/useThemeStyles';
import Popupmealtype from './popupmealtype';
import './CalendarComponents.css';

const MealTimeCard = ({ name, image, onSelect, isDisabled, id }) => {
  const [popupOpen, setPopupOpen] = React.useState(false);

  // Theme styles hook
  const { updateCSSVariables } = useThemeStyles();
  
  // Update CSS variables when theme changes
  useEffect(() => {
    updateCSSVariables();
  }, [updateCSSVariables]);

  // Handle card button click to open popup if not disabled
  const handleClick = () => {
    if (!isDisabled) {
      setPopupOpen(true);
    }
  };

  return (
    <div>
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
            className="calendar-meal-card-button select-button"
            onClick={handleClick}
            disabled={isDisabled}
          >
            <Calendar size={16} />
            Select
          </button>
        </div>
      </div>

      {/* Popup for selecting meal type */}
      <Popupmealtype
        open={popupOpen}
        handleClose={() => setPopupOpen(false)}
        onAddEvent={(mealTypeId, mealTypeName) =>
          onSelect(mealTypeId, mealTypeName)
        }
      />
    </div>
  );
};

export default MealTimeCard;
