import { getAuthHeader } from '../../../utils/authHeader';
import { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MealCard from '../../../components/Meal/MealTime/MealTimeCard';
import { MealCardPopup } from '../../../components/Meal/MealTime/AddMealTimePopup';
import '../../css/MealManagement.css';
import AdminLayout from '../../../layouts/Admin/AdminLayout';
import { BASE_URLS } from '../../../services/api/config';

function AddMealTime() {
  // State variables
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [mealTimes, setMealTimes] = useState([]);
  const [error, setError] = useState(null);

  const title = 'Add New Meal Time';
  const getSubtitle = () => 'Manage meal times for the day';

  // Open and close handlers for popup
  const handlePopupOpen = () => setIsPopupOpen(true);
  const handlePopupClose = () => setIsPopupOpen(false);

  // Handle deletion of a meal time
  const handleDelete = async (mealId) => {
    try {
      const response = await fetch(`${BASE_URLS.mealtime}/details/${mealId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
      });
      if (response.ok) {
        await fetchMealTimes(); // Refresh list on success
      } else {
        setError('Failed to delete meal time');
      }
    } catch (error) {
      setError(`Error deleting meal time: ${error.message}`);
    }
  };

  // Fetch all meal times from API
  const fetchMealTimes = async () => {
    try {
      const response = await fetch(`${BASE_URLS.mealtime}/details`, {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch meal times');
      }
      const data = await response.json();
      setMealTimes(data);
    } catch (error) {
      setError(`Error fetching meal times: ${error.message}`);
    }
  };

  // Fetch meal times on component mount
  useEffect(() => {
    fetchMealTimes();
  }, []);

  return (
    <AdminLayout>
      <div className="min-h-screen space-y-6 p-6">
        <h1 className="text-2xl font-semibold">Meal times</h1>

        {/* Button to open the add meal time popup */}
        <Button
          variant="contained"
          className="meal-add-btn"
          onClick={handlePopupOpen}
        >
          New Meal Time
          <span className="meal-add-icon">
            <AddIcon />
          </span>
        </Button>

        {/* Error message display */}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {/* Meal time cards */}
        <div className="meal-items-grid">
          {mealTimes.length > 0 ? (
            mealTimes.map((meal) => (
              <MealCard
                key={meal.mealtime_id}
                mealId={meal.mealtime_id}
                name={meal.mealtime_name}
                image={meal.mealtime_image_url || '/default-meal.png'}
                mealtype_ids={meal.mealtype_ids || []}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <p className="meal-no-items">No meal times available</p>
          )}
        </div>

        {/* Add/Edit meal time popup */}
        <MealCardPopup
          open={isPopupOpen}
          onClose={handlePopupClose}
          title={title}
          subtitle={getSubtitle()}
          onSubmit={fetchMealTimes} // Refresh after submission
        />
      </div>
    </AdminLayout>
  );
}

export default AddMealTime;
