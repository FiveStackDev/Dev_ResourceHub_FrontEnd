import { getAuthHeader } from '../../utils/authHeader';
import React, { useState, useEffect } from 'react';
import { useThemeStyles } from '../../hooks/useThemeStyles';
import MealTypeCard from './MealTypeCard';
import ReactMemo from 'react';
import './CalendarComponents.css';
import { BASE_URLS } from '../../services/api/config';
import { toast, ToastContainer } from 'react-toastify';

export default function MealTypeSelect({ onSelect, mealtype_ids = [] }) {
  // Memoize MealTypeCard for performance
  const MemoMealTypeCard = React.memo(MealTypeCard);

  // Skeleton loader array
  const skeletonCount = 4;
  const skeletons = Array.from({ length: skeletonCount });
  const [mealTypes, setMealTypes] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Theme styles hook
  const { updateCSSVariables } = useThemeStyles();

  // Update CSS variables when theme changes
  useEffect(() => {
    updateCSSVariables();
  }, [updateCSSVariables]);

  useEffect(() => {
    fetchMealTypes(); // Fetch meal types when component mounts or mealtype_ids change
    // eslint-disable-next-line
  }, [mealtype_ids]);

  const fetchMealTypes = async () => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h3 className="calendar-section-title">Select a meal type</h3>
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
          {/* Render a card for each available meal type */}
          {mealTypes.map((mealType) => (
            <MemoMealTypeCard
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
      )}
      <ToastContainer /> {/* Container for toast notifications */}
    </div>
  );
}
