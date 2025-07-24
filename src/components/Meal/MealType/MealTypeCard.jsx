import * as React from 'react';
import { useEffect } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ModeEditTwoToneIcon from '@mui/icons-material/ModeEditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import EditPopup from './EditMealTypePopup';
import DeletePopup from './DeleteMealTypePopup';
import '../Meal-CSS/Mealcard.css';
import { BASE_URLS } from '../../../services/api/config';
import { getAuthHeader } from '../../../utils/authHeader';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useThemeStyles } from '../../../hooks/useThemeStyles';

function MealCard({
  mealId,
  name,
  image,
  onEdit,
  onDelete,
  mealtime_ids = [],
}) {
  // States to control edit/delete dialogs and error messages
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [mealName, setMealName] = React.useState(name);
  const [mealImage, setMealImage] = React.useState(image);
  const [error, setError] = React.useState(null);

  // Theme styles hook
  const { updateCSSVariables } = useThemeStyles();

  // Update CSS variables when theme changes
  useEffect(() => {
    updateCSSVariables();
  }, [updateCSSVariables]);

  // Open edit dialog and clear errors
  const handleEditClickOpen = () => {
    setOpenEdit(true);
    setError(null);
  };

  // Close edit dialog and clear errors
  const handleEditClose = () => {
    setOpenEdit(false);
    setError(null);
  };

  // Open delete dialog and clear errors
  const handleDeleteClickOpen = () => {
    setOpenDelete(true);
    setError(null);
  };

  // Close delete dialog and clear errors
  const handleDeleteClose = () => {
    setOpenDelete(false);
    setError(null);
  };

  // Handle saving edited meal details with API call
  const handleSaveEdit = async (mealId, name, image, selectedMealTimeIds) => {
    try {
      const response = await fetch(`${BASE_URLS.mealtype}/details/${mealId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify({
          mealtype_name: name,
          mealtype_image_url: image,
          mealtime_ids: selectedMealTimeIds || [], // Include selected meal time IDs
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update meal');
      }

      const data = await response.json();
      setMealName(name); // Update state with new name
      setMealImage(image); // Update state with new image
      setOpenEdit(false); // Close edit popup
      toast.success('Meal updated successfully!');
    } catch (error) {
      setError(`Error updating meal: ${error.message}`); // Show error message
      toast.error(`Error updating meal: ${error.message}`);
    }
  };

  // Confirm and handle meal deletion
  const handleConfirmDelete = async () => {
    try {
      await onDelete(mealId); // Invoke parent delete handler
      setOpenDelete(false); // Close delete popup
      toast.success('Meal deleted successfully!');
    } catch (error) {
      setError(`Error deleting meal: ${error.message}`); // Show error message
      toast.error(`Error deleting meal: ${error.message}`);
    }
  };

  return (
    <div>
      <Card className="mealtime-card">
        {/* Meal image */}
        <CardMedia
          className="mealtime-card-media"
          image={mealImage}
          title={mealName}
        />
        {/* Meal name and error message */}
        <CardContent className="mealtime-card-content">
          <Typography gutterBottom variant="h5" component="div">
            {mealName}
          </Typography>
          {error && <Typography color="error">{error}</Typography>}
        </CardContent>
        {/* Edit and Delete action buttons */}
        <CardActions className="mealtime-card-actions">
          <Button
            variant="outlined"
            className="mealtime-card-button"
            onClick={handleEditClickOpen}
          >
            Edit <ModeEditTwoToneIcon />
          </Button>
          <Button
            variant="outlined"
            color="error"
            className="mealtime-card-button"
            onClick={handleDeleteClickOpen}
          >
            Delete <DeleteTwoToneIcon />
          </Button>
        </CardActions>
      </Card>

      {/* Edit dialog popup */}
      <EditPopup
        open={openEdit}
        onClose={handleEditClose}
        onSave={handleSaveEdit}
        mealName={mealName}
        mealImage={mealImage}
        setMealName={setMealName}
        setMealImage={setMealImage}
        mealId={mealId}
        existingMealTimes={mealtime_ids} // Pass existing meal time IDs from API
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
