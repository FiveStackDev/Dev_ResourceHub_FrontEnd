import * as React from 'react';
import { useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { useThemeStyles } from '../../hooks/useThemeStyles';
import Popupmealtype from './popupmealtype';
import './CalendarComponents.css';

const MealTimeCard = ({ name, image, onSelect, isDisabled, id, mealtype_ids = [] }) => {
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
            style={{
              background: isDisabled 
                ? 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)' 
                : 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(59, 130, 246, 0.1) 100%)',
              color: isDisabled ? '#9ca3af' : '#3b82f6',
              border: isDisabled ? '2px solid #d1d5db' : '2px solid #3b82f6'
            }}
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
        mealtype_ids={mealtype_ids}
        onAddEvent={(mealTypeId, mealTypeName) =>
          onSelect(mealTypeId, mealTypeName)
        }
      />
    </div>
  );
};

export default MealTimeCard;
