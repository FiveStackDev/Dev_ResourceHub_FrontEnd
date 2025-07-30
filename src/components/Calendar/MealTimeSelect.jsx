import { getAuthHeader } from '../../utils/authHeader';
import React, { useState, useEffect } from 'react';
import { useThemeStyles } from '../../hooks/useThemeStyles';
import MealTimeCard from './MealTimeCard';
import ReactMemo from 'react';
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
  const [isLoading, setIsLoading] = useState(true);

  // Theme styles hook
  const { updateCSSVariables } = useThemeStyles();

  // Update CSS variables when theme changes
  useEffect(() => {
    updateCSSVariables();
  }, [updateCSSVariables]);

  useEffect(() => {
    fetchMealTimes(); // Fetch meal times when component mounts
    // eslint-disable-next-line
  }, []);

  const fetchMealTimes = async () => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  // Memoize MealTimeCard for performance
  const MemoMealTimeCard = React.memo(MealTimeCard);

  // Skeleton loader array
  const skeletonCount = 4;
  const skeletons = Array.from({ length: skeletonCount });

  return (
    <div>
      <h3 className="calendar-section-title">Select a meal time</h3>
      {error && <div className="calendar-error-message">{error}</div>}
      {isLoading ? (
        <div className="calendar-meal-grid">
          {skeletons.map((_, idx) => (
            <div key={idx} className="calendar-meal-card calendar-meal-card-skeleton">
              <div className="calendar-meal-card-media skeleton-bg" />
              <div className="calendar-meal-card-content">
                <div className="skeleton-text" style={{ width: '60%', height: '1.2rem', background: '#e5e7eb', borderRadius: '4px' }}></div>
              </div>
              <div className="calendar-meal-card-actions">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mb-2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="calendar-meal-grid">
          {mealTimes.map((mealtime) => (
            <MemoMealTimeCard
              key={mealtime.mealtime_id}
              id={mealtime.mealtime_id}
              name={mealtime.mealtime_name}
              image={mealtime.mealtime_image_url || '/default-mealtime.png'}
              mealtype_ids={mealtime.mealtype_ids || []}
              onSelect={(mealTypeId, mealTypeName) =>
                onAddEvent(
                  mealtime.mealtime_id,
                  mealTypeId,
                  mealtime.mealtime_name,
                  mealTypeName,
                )
              }
              isDisabled={isMealSelected(mealtime.mealtime_id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
