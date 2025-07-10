import { getAuthHeader } from '../../utils/authHeader';
import React, { useState, useEffect } from 'react';
import MealTypeCard from './MealTypeCard';
import './Calender-CSS/MealTypeSelect.css';
import { BASE_URLS } from '../../services/api/config';
import { toast, ToastContainer } from 'react-toastify';

export default function MealTypeSelect({ onSelect }) {
  const [mealTypes, setMealTypes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMealTypes(); // Fetch meal types when component mounts
  }, []);

  const fetchMealTypes = async () => {
    try {
      const response = await fetch(
        `${BASE_URLS.mealtype}/details`,
        {
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch meal types: ${response.status}`);
      }
      const data = await response.json();
      setMealTypes(data); // Store retrieved meal types
    } catch (error) {
      console.error('Error fetching meal types:', error);
      toast.error(`Error: ${error.message}`); // Show error notification
    }
  };

  return (
    <div>
      <h3>Select a meal type</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className="meal">
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
