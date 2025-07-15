import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ModeEditTwoToneIcon from '@mui/icons-material/ModeEditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import EditPopup from './EditMealTimePopup';
import DeletePopup from './DeleteMealTimePopup';
import '../Meal-CSS/Mealcard.css';
import { BASE_URLS } from '../../../services/api/config';
import { getAuthHeader } from '../../../utils/authHeader';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MealCard({ mealId, name, image, onDelete }) {
  // State to control edit popup visibility
  const [openEdit, setOpenEdit] = React.useState(false);
  // State to control delete popup visibility
  const [openDelete, setOpenDelete] = React.useState(false);
  // State to hold current meal name
  const [mealName, setMealName] = React.useState(name);
  // State to hold current meal image URL
  const [mealImage, setMealImage] = React.useState(image);
  // State to hold error messages
  const [error, setError] = React.useState(null);

  // Open edit popup and reset errors
  const handleEditClickOpen = () => {
    setOpenEdit(true);
    setError(null);
  };

  // Close edit popup and reset errors
  const handleEditClose = () => {
    setOpenEdit(false);
    setError(null);
  };

  // Open delete popup and reset errors
  const handleDeleteClickOpen = () => {
    setOpenDelete(true);
    setError(null);
  };

  // Close delete popup and reset errors
  const handleDeleteClose = () => {
    setOpenDelete(false);
    setError(null);
  };

  // Update meal details via API call
  const handleSaveEdit = async (mealId, name, image) => {
    try {
      const response = await fetch(`${BASE_URLS.mealtime}/details/${mealId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify({ mealtime_name: name, mealtime_image_url: image }),
      });

      if (!response.ok) throw new Error('Failed to update meal');

      await response.json();
      // Update local state with new meal data
      setMealName(name);
      setMealImage(image);
      setOpenEdit(false);
      toast.success('Meal updated successfully!');
    } catch (error) {
      // Show error message on failure
      setError(`Error updating meal: ${error.message}`);
      toast.error(`Error updating meal: ${error.message}`);
    }
  };

  // Handle meal deletion with error handling
  const handleConfirmDelete = async () => {
    try {
      await onDelete(mealId);
      setOpenDelete(false);
      toast.success('Meal deleted successfully!');
    } catch (error) {
      // Show error message on failure
      setError(`Error deleting meal: ${error.message}`);
      toast.error(`Error deleting meal: ${error.message}`);
    }
  };

  return (
    <div>
      <Card className="mealtime-card">
        {/* Display meal image */}
        <CardMedia className="mealtime-card-media" image={mealImage} title={mealName} />
        <CardContent className="mealtime-card-content">
          {/* Display meal name */}
          <Typography gutterBottom variant="h5" component="div">{mealName}</Typography>
          {/* Display error message if any */}
          {error && <Typography color="error">{error}</Typography>}
        </CardContent>
        <CardActions className="mealtime-card-actions">
          {/* Button to open edit popup */}
          <Button variant="outlined" className="mealtime-card-button" onClick={handleEditClickOpen}>
            Edit <ModeEditTwoToneIcon />
          </Button>
          {/* Button to open delete popup */}
          <Button variant="outlined" color="error" className="mealtime-card-button" onClick={handleDeleteClickOpen}>
            Delete <DeleteTwoToneIcon />
          </Button>
        </CardActions>
      </Card>

      {/* Edit meal popup */}
      <EditPopup
        open={openEdit}
        onClose={handleEditClose}
        onSave={handleSaveEdit}
        mealName={mealName}
        mealImage={mealImage}
        setMealName={setMealName}
        setMealImage={setMealImage}
        mealId={mealId}
      />

      {/* Delete confirmation popup */}
      <DeletePopup
        open={openDelete}
        onClose={handleDeleteClose}
        onDelete={handleConfirmDelete}
        mealId={mealId}
        mealName={mealName}
      />
    </div>
  );
}

export default MealCard;
