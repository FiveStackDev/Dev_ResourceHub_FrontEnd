import { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  CircularProgress,
} from '@mui/material';
import { Plus, Search } from 'lucide-react';
import {
  AddMaintenancePopup,
  EditMaintenancePopup,
  DeleteMaintenancePopup,
} from '../../../components/Maintenance/User';
import { ToastContainer, toast } from 'react-toastify';
import { MaintenanceTableUser } from '../../../components/Maintenance/User';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import UserLayout from '../../../layouts/User/UserLayout';
import { BASE_URLS } from '../../../services/api/config';
import { getAuthHeader } from '../../../utils/authHeader';
import { useUser } from '../../../contexts/UserContext';
import { decodeToken } from '../../../contexts/UserContext';

const MaintenanceDetailsUser = () => {
  const [maintenance, setMaintenance] = useState([]);
  const [isAddMaintenanceOpen, setIsAddMaintenanceOpen] = useState(false);
  const [isEditMaintenanceOpen, setIsEditMaintenanceOpen] = useState(false);
  const [isDeleteMaintenanceOpen, setIsDeleteMaintenanceOpen] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [loading, setLoading] = useState(true);

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

  const fetchMaintenanceData = async () => {
    try {
      const response = await axios.get(
        `${BASE_URLS.maintenance}/details/${userId}`,
        { headers: { ...getAuthHeader() } },
      );
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
        category: newMaintenance.category,
      };

      const response = await axios.post(
        `${BASE_URLS.maintenance}/add`,
        payload,
        { headers: { ...getAuthHeader() } },
      );
      toast.success(response.data.message);
      fetchMaintenanceData();
      setIsAddMaintenanceOpen(false);
    } catch (error) {
      console.error('Error adding maintenance:', error);
      toast.error('Failed to add maintenance.');
    }
  };

  const handleEditMaintenance = (maintenance) => {
    setSelectedMaintenance(maintenance);
    setIsEditMaintenanceOpen(true);
  };

  const handleDeleteMaintenance = (maintenance) => {
    setSelectedMaintenance(maintenance);
    setIsDeleteMaintenanceOpen(true);
  };

  const handleSaveEdit = async (updatedMaintenance) => {
    try {
      const response = await axios.put(
        `${BASE_URLS.maintenance}/details/${updatedMaintenance.maintenance_id}`,
        updatedMaintenance,
        { headers: { ...getAuthHeader() } },
      );
      toast.success(response.data.message);
      fetchMaintenanceData();
      setIsEditMaintenanceOpen(false);
      setSelectedMaintenance(null);
    } catch (error) {
      console.error('Error updating maintenance:', error);
      toast.error('Failed to update maintenance.');
    }
  };

  const handleConfirmDelete = async (maintenance) => {
    try {
      await axios.delete(
        `${BASE_URLS.maintenance}/details/${maintenance.maintenance_id}`,
        { headers: { ...getAuthHeader() } },
      );
      toast.success('Maintenance deleted successfully!');
      fetchMaintenanceData();
      setIsDeleteMaintenanceOpen(false);
      setSelectedMaintenance(null);
    } catch (error) {
      console.error('Failed to delete maintenance:', error);
      toast.error('Failed to delete maintenance!');
    }
  };

  const filteredMaintenance = maintenance.filter((item) => {
    const searchMatch = (item.username || '')
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const typeMatch =
      filterType === 'All' ||
      item.priorityLevel === filterType ||
      item.status === filterType ||
      item.category === filterType;
    return searchMatch && typeMatch;
  });

  return (
    <UserLayout>
      <div className="min-h-screen space-y-3 p-2">
        <h1 className="text-2xl font-semibold">Maintenance & Services</h1>

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
            <FormControl
              variant="outlined"
              size="small"
              sx={{ width: '150px' }}
            >
              <InputLabel>Filter by Category</InputLabel>
              <Select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                label="Filter by Category"
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Tech Support">Tech Support </MenuItem>
                <MenuItem value="General Maintenance">
                  General Maintenance{' '}
                </MenuItem>
                <MenuItem value="Cleaning and Hygiene">
                  Cleaning and Hygiene{' '}
                </MenuItem>
                <MenuItem value="Furniture and Fixtures">
                  Furniture and Fixtures{' '}
                </MenuItem>
                <MenuItem value="Safety and Security">
                  Safety and Security{' '}
                </MenuItem>
                <MenuItem value="Lighting and power">
                  Lighting and power{' '}
                </MenuItem>
              </Select>
            </FormControl>
            <FormControl
              variant="outlined"
              size="small"
              sx={{ width: '150px' }}
            >
              <InputLabel>Filter by Status</InputLabel>
              <Select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                label="Filter by Status"
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Rejected">Rejected</MenuItem>
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
          <MaintenanceTableUser
            maintenance={filteredMaintenance}
            onEditMaintenance={handleEditMaintenance}
            onDeleteMaintenance={handleDeleteMaintenance}
          />
        )}

        <AddMaintenancePopup
          open={isAddMaintenanceOpen}
          onClose={() => setIsAddMaintenanceOpen(false)}
          onAdd={handleAddMaintenance}
        />

        {/* Edit Dialog */}
        <EditMaintenancePopup
          open={isEditMaintenanceOpen}
          onClose={() => {
            setIsEditMaintenanceOpen(false);
            setSelectedMaintenance(null);
          }}
          maintenance={selectedMaintenance}
          onSave={handleSaveEdit}
        />

        {/* Delete Dialog */}
        <DeleteMaintenancePopup
          open={isDeleteMaintenanceOpen}
          onClose={() => {
            setIsDeleteMaintenanceOpen(false);
            setSelectedMaintenance(null);
          }}
          maintenance={selectedMaintenance}
          onDelete={handleConfirmDelete}
        />

        <ToastContainer />
      </div>
    </UserLayout>
  );
};

export default MaintenanceDetailsUser;
