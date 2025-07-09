
import { useState, useEffect } from 'react';
import { Button, TextField, MenuItem, Select, InputLabel, FormControl, CircularProgress } from '@mui/material';
import { Plus, Search } from 'lucide-react';
import { AddMaintenancePopup } from '../../../components/Maintenance/AddMaintenancePopup';
import { ToastContainer, toast } from 'react-toastify';
import { MaintenanceTableUser } from '../../../components/Maintenance/MaintenanceTableUser';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import UserLayout from '../../../layouts/User/UserLayout';
import { BASE_URLS } from '../../../services/api/config';
import { useUser } from '../../../contexts/UserContext';
import { decodeToken } from '../../../contexts/UserContext';

const MaintenanceDetailsUser = () => {
  const [maintenance, setMaintenance] = useState([]);
  const [isAddMaintenanceOpen, setIsAddMaintenanceOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [loading, setLoading] = useState(true);

  const fetchMaintenanceData = async () => {
    try {
      const response = await axios.get(`${BASE_URLS.maintenance}/details`);
      setMaintenance(response.data);
    } catch (error) {
      console.error('Failed to fetch maintenance data:', error);
      toast.error('Failed to load maintenance data!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenanceData();
  }, []);

  const { userData } = useUser();
  // Fallback: decode token directly if userData.id is undefined
  let userId = userData.id;
  if (!userId) {
    const decoded = decodeToken();
    userId = decoded?.id;
    console.log('MaintenanceDetailsUser fallback decoded userId:', userId);
  } else {
    console.log('MaintenanceDetailsUser userId:', userId);
  }
  const handleAddMaintenance = async (newMaintenance) => {
    try {
      if (!userId) {
        toast.error('User ID not found. Please login again.');
        return;
      }

      const payload = {
        name: newMaintenance.name,
        priorityLevel: newMaintenance.priorityLevel,
        description: newMaintenance.description,
        user_id: parseInt(userId),
      };

      const response = await axios.post(
        `${BASE_URLS.maintenance}/add`,
        payload,
      );
      toast.success(response.data.message);
      fetchMaintenanceData();
      setIsAddMaintenanceOpen(false);
    } catch (error) {
      console.error('Error adding maintenance:', error);
      toast.error('Failed to add maintenance.');
    }
  };

  const filteredMaintenance = maintenance.filter((item) => {
    const searchMatch = item.name
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const typeMatch = filterType === 'All' || item.priorityLevel === filterType;
    return searchMatch && typeMatch;
  });

  return (
    <UserLayout>
      <div className="min-h-screen space-y-6 p-6">
        <h1 className="text-2xl font-semibold">Maintenance</h1>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <TextField
              label="Search"
              variant="outlined"
              size="small"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              InputProps={{ startAdornment: <Search size={20} /> }}
            />
            <FormControl
              variant="outlined"
              size="small"
              sx={{ width: '150px' }}
            >
              <InputLabel>Filter by Priority</InputLabel>
              <Select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                label="Filter by Priority"
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
              </Select>
            </FormControl>
          </div>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Plus size={20} />}
            onClick={() => setIsAddMaintenanceOpen(true)}
          >
            Add New Maintenance
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center">
            <CircularProgress />
          </div>
        ) : (
          <MaintenanceTableUser maintenance={filteredMaintenance} />
        )}

        <AddMaintenancePopup
          open={isAddMaintenanceOpen}
          onClose={() => setIsAddMaintenanceOpen(false)}
          onAdd={handleAddMaintenance}
        />
        <ToastContainer />
      </div>
    </UserLayout>
  );
};

export default MaintenanceDetailsUser;
