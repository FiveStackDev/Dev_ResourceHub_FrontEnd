import { getAuthHeader } from '../../utils/authHeader';
import React, { useState, useEffect } from 'react';
import { useThemeStyles } from '../../hooks/useThemeStyles';
import MealTimeCard from './MealTimeCard';
import './CalendarComponents.css';
import { BASE_URLS } from '../../services/api/config';
import { toast } from 'react-toastify';

export default function MealTimeSelect({
  selectedDate,
  onAddEvent,
  isMealSelected,
}) {
  const [mealTimes, setMealTimes] = useState([]);
  const [error, setError] = useState(null);

  // Theme styles hook
  const { updateCSSVariables } = useThemeStyles();

  // Update CSS variables when theme changes
  useEffect(() => {
    updateCSSVariables();
  }, [updateCSSVariables]);

  useEffect(() => {
    fetchMealTimes(); // Fetch meal times when component mounts
  }, []);

  const fetchMealTimes = async () => {
    try {
      const response = await fetch(`${BASE_URLS.mealtime}/details`, {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch meal times: ${response.status}`);
      }
      const data = await response.json();
      setMealTimes(data); // Update state with fetched meal times
    } catch (error) {
      console.error('Error fetching meal times:', error);
      toast.error(`Error: ${error.message}`); // Display error toast notification
    }
  };

  return (
    <div>
      <h3 className="calendar-section-title">Select a meal time</h3>
      {error && <div className="calendar-error-message">{error}</div>}
      <div className="calendar-meal-grid">
        {mealTimes.map((mealtime) => (
          <MealTimeCard
            key={mealtime.mealtime_id}
            id={mealtime.mealtime_id}
            name={mealtime.mealtime_name}
            image={mealtime.mealtime_image_url || '/default-mealtime.png'} // Fallback image if none is provided
            mealtype_ids={mealtime.mealtype_ids || []} // Pass meal type IDs from API
            onSelect={(mealTypeId, mealTypeName) =>
              onAddEvent(
                mealtime.mealtime_id,
                mealTypeId,
                mealtime.mealtime_name,
                mealTypeName,
              )
            }
            isDisabled={isMealSelected(mealtime.mealtime_id)} // Disable if meal is already selected
          />
        ))}
      </div>
    </div>
  );
}
