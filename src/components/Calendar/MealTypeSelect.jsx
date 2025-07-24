import { getAuthHeader } from '../../utils/authHeader';
import React, { useState, useEffect } from 'react';
import { useThemeStyles } from '../../hooks/useThemeStyles';
import MealTypeCard from './MealTypeCard';
import './CalendarComponents.css';
import { BASE_URLS } from '../../services/api/config';
import { toast, ToastContainer } from 'react-toastify';

export default function MealTypeSelect({ onSelect, mealtype_ids = [] }) {
  const [mealTypes, setMealTypes] = useState([]);
  const [error, setError] = useState(null);

  // Theme styles hook
  const { updateCSSVariables } = useThemeStyles();

  // Update CSS variables when theme changes
  useEffect(() => {
    updateCSSVariables();
  }, [updateCSSVariables]);

  useEffect(() => {
    fetchMealTypes(); // Fetch meal types when component mounts or mealtype_ids change
  }, [mealtype_ids]);

  const fetchMealTypes = async () => {
    try {
      const response = await fetch(`${BASE_URLS.mealtype}/details`, {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch meal types: ${response.status}`);
      }
      const data = await response.json();

      // Filter meal types based on mealtype_ids if provided
      const filteredMealTypes =
        mealtype_ids.length > 0
          ? data.filter((mealType) =>
              mealtype_ids.includes(mealType.mealtype_id),
            )
          : data;

      setMealTypes(filteredMealTypes); // Store filtered meal types
    } catch (error) {
      console.error('Error fetching meal types:', error);
      toast.error(`Error: ${error.message}`); // Show error notification
    }
  };

  return (
    <div>
      <h3 className="calendar-section-title">Select a meal type</h3>
      {error && <div className="calendar-error-message">{error}</div>}
      <div className="calendar-meal-grid">
        {/* Render a card for each available meal type */}
        {mealTypes.map((mealType) => (
          <MealTypeCard
            key={mealType.mealtype_id}
            id={mealType.mealtype_id}
            name={mealType.mealtype_name}
            image={mealType.mealtype_image_url}
            onSelect={() =>
              onSelect(mealType.mealtype_id, mealType.mealtype_name)
            }
          />
        ))}
      </div>
      <ToastContainer /> {/* Container for toast notifications */}
    </div>
  );
}
