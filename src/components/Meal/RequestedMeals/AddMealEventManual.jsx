import React, { useState, useEffect } from 'react';
import { getAuthHeader } from '../../../utils/authHeader';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  CircularProgress,
} from '@mui/material';
import { BASE_URLS } from '../../../services/api/config';
import { toast } from 'react-toastify';

const AddMealEventManual = ({ open, onClose, onAdd, existingEvents }) => {
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState('');

  const [mealTimes, setMealTimes] = useState([]);
  const [selectedMealTime, setSelectedMealTime] = useState('');
  const [mealTypes, setMealTypes] = useState([]);
  const [selectedMealType, setSelectedMealType] = useState('');
  const [mealtypeIds, setMealtypeIds] = useState([]); // for filtering like calendar
  const [date, setDate] = useState('');
  const [addDisabled, setAddDisabled] = useState(true);

  // Fetch all users on mount
  useEffect(() => {
    if (!open) return;
    setUserLoading(true);
    fetch(`${BASE_URLS.user}/details`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setUsers(
          Array.isArray(data)
            ? data.map((user) => ({
                ...user,
                id: user.user_id?.toString(),
                username: user.username || user.email?.split('@')[0],
                profilePicture:
                  user.profile_picture_url ||
                  `https://ui-avatars.com/api/?name=${user.username || user.email?.split('@')[0]}`,
                userType: user.usertype,
                phoneNumber: user.phone_number,
                additionalDetails: user.bio,
              }))
            : [],
        );
      })
      .catch(() => setUserError('Error fetching users.'))
      .finally(() => setUserLoading(false));
  }, [open]);

  // Fetch meal times
  useEffect(() => {
    if (!open) return;
    fetch(`${BASE_URLS.mealtime}/details`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setMealTimes(
          Array.isArray(data)
            ? data.map((mt) => ({
                ...mt,
                mealtime_id: mt.mealtime_id,
                mealtime_name: mt.mealtime_name,
              }))
            : [],
        );
      });
  }, [open]);

  // Fetch all meal types once, filter by mealtype_ids for selected meal time
  useEffect(() => {
    if (!open) return;
    fetch(`${BASE_URLS.mealtype}/details`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setMealTypes(
          Array.isArray(data)
            ? data.map((mt) => ({
                ...mt,
                mealtype_id: mt.mealtype_id,
                mealtype_name: mt.mealtype_name,
              }))
            : [],
        );
      });
  }, [open]);

  // Update mealtypeIds when meal time changes
  useEffect(() => {
    if (!selectedMealTime) {
      setMealtypeIds([]);
      setSelectedMealType('');
      return;
    }
    const mt = mealTimes.find((m) => m.mealtime_id === selectedMealTime);
    setMealtypeIds(mt && mt.mealtype_ids ? mt.mealtype_ids : []);
    setSelectedMealType('');
  }, [selectedMealTime, mealTimes]);

  // Enable add button only if all fields are selected
  useEffect(() => {
    setAddDisabled(
      !selectedUser || !selectedMealTime || !selectedMealType || !date,
    );
  }, [selectedUser, selectedMealTime, selectedMealType, date]);

  // Check for duplicate event
  const checkDuplicate = () => {
    return existingEvents.some(
      (ev) =>
        ev.user_id === selectedUser?.user_id &&
        ev.meal_request_date === date &&
        ev.mealtime_id === selectedMealTime,
    );
  };

  const handleAdd = () => {
    if (checkDuplicate()) {
      toast.error('This user already has a meal time for this date.');
      return;
    }
    const today = new Date().toISOString().split('T')[0];
    if (date < today) {
      toast.error('Cannot add event for past date.');
      return;
    }
    onAdd({
      user_id: selectedUser.user_id,
      mealtime_id: selectedMealTime,
      mealtype_id: selectedMealType,
      meal_request_date: date,
    });
    onClose();
    setSelectedUser(null);
    setSelectedMealTime('');
    setSelectedMealType('');
    setDate('');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography sx={{ color: 'primary.main' }} variant="h3">
          Add Meal Event Manually
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Autocomplete
          options={users}
          getOptionLabel={(option) =>
            option.username
              ? `${option.username} (${option.email})`
              : option.email
          }
          loading={userLoading}
          value={selectedUser}
          onChange={(_, value) => setSelectedUser(value)}
          inputValue={userSearch}
          onInputChange={(_, value) => setUserSearch(value)}
          renderOption={(props, option) => (
            <li {...props} key={option.id || option.user_id}>
              <img
                src={option.profilePicture}
                alt={option.username}
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  marginRight: 8,
                }}
              />
              <span style={{ fontWeight: 500, color: '#000000ff' }}>
                {option.username}
              </span>
              <span style={{ color: '#00000067', marginLeft: 6 }}>
                ({option.userType})
              </span>
              <span style={{ color: '#666666ff', marginLeft: 8 }}>
                {option.email}
              </span>
            </li>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search User"
              margin="normal"
              error={!!userError}
              helperText={userError}
            />
          )}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Meal Time</InputLabel>
          <Select
            value={selectedMealTime}
            label="Meal Time"
            onChange={(e) => setSelectedMealTime(e.target.value)}
          >
            {mealTimes.map((mt) => (
              <MenuItem key={mt.mealtime_id} value={mt.mealtime_id}>
                {mt.mealtime_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Meal Type</InputLabel>
          <Select
            value={selectedMealType}
            label="Meal Type"
            onChange={(e) => setSelectedMealType(e.target.value)}
            disabled={!selectedMealTime || mealtypeIds.length === 0}
          >
            {mealTypes
              .filter((mt) => mealtypeIds.includes(mt.mealtype_id))
              .map((mt) => (
                <MenuItem key={mt.mealtype_id} value={mt.mealtype_id}>
                  {mt.mealtype_name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          margin="normal"
          label="Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleAdd} disabled={addDisabled}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddMealEventManual;
