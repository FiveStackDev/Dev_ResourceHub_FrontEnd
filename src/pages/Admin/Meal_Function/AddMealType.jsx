import { getAuthHeader } from '../../../utils/authHeader';
import { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MealCard from '../../../components/Meal/MealType/MealTypeCard';
import { MealCardPopup } from '../../../components/Meal/MealType/AddMealTypePopup';
import '../../css/MealManagement.css';
import AdminLayout from '../../../layouts/Admin/AdminLayout';
import { BASE_URLS } from '../../../services/api/config';

function AddMealType() {
  // State variables
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [mealTypes, setMealTypes] = useState([]);
  const [error, setError] = useState(null);

  const title = 'Add New Meal Type';
  const getSubtitle = () => 'Manage meal types for the day';

  // Popup handlers
  const handlePopupOpen = () => setIsPopupOpen(true);
  const handlePopupClose = () => setIsPopupOpen(false);

  // Delete meal type by ID
  const handleDelete = async (mealId) => {
    try {
      const response = await fetch(`${BASE_URLS.mealtype}/details/${mealId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
      });
      if (response.ok) {
        await fetchMealTypes(); // Refresh data after deletion
      } else {
        setError('Failed to delete meal type');
      }
    } catch (error) {
      setError(`Error deleting meal type: ${error.message}`);
    }
  };

  // Fetch all meal types from the backend
  const fetchMealTypes = async () => {
    try {
      const response = await fetch(`${BASE_URLS.mealtype}/details`, {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch meal types');
      }
      const data = await response.json();
      setMealTypes(data);
    } catch (error) {
      setError(`Error fetching meal types: ${error.message}`);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchMealTypes();
  }, []);

  return (
    <AdminLayout>
      <div className="min-h-screen space-y-6 p-6">
        <h1 className="text-2xl font-semibold">Meal types</h1>

        {/* Button to open popup */}
        <Button
          variant="contained"
          className="meal-add-btn"
          onClick={handlePopupOpen}
        >
          New Meal Type
          <span className="meal-add-icon">
            <AddIcon />
          </span>
        </Button>

        {/* Error message display */}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {/* Meal type cards */}
        <div className="meal-items-grid">
          {mealTypes.length > 0 ? (
            mealTypes.map((meal) => (
              <MealCard
                key={meal.mealtype_id}
                mealId={meal.mealtype_id}
                name={meal.mealtype_name}
                image={meal.mealtype_image_url || '/default-meal.png'}
                mealtime_ids={meal.mealtime_ids || []}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <p className="meal-no-items">No meal types available</p>
          )}
        </div>

        {/* Popup for adding/editing meal types */}
        <MealCardPopup
          open={isPopupOpen}
          onClose={handlePopupClose}
          title={title}
          subtitle={getSubtitle()}
          onSubmit={fetchMealTypes} // Refresh list on submit
        />
      </div>
    </AdminLayout>
  );
}

export default AddMealType;
