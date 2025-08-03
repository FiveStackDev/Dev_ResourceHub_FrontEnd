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
import { MaintenanceTable } from '../../../components/Maintenance/Admin';
import { AddMaintenancePopup } from '../../../components/Maintenance/User';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import AdminLayout from '../../../layouts/Admin/AdminLayout.jsx';
import { BASE_URLS } from '../../../services/api/config.js';
import { getAuthHeader } from '../../../utils/authHeader';
import { useUser } from '../../../contexts/UserContext';
import { decodeToken } from '../../../contexts/UserContext';

const MaintenanceDetails = () => {
  const [maintenance, setMaintenance] = useState([]);
  const [isAddMaintenanceOpen, setIsAddMaintenanceOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [loading, setLoading] = useState(true);

  const fetchMaintenanceData = async () => {
    try {
      const response = await axios.get(`${BASE_URLS.maintenance}/details`, {
        headers: { ...getAuthHeader() },
      });
      setMaintenance(response.data);
      console.log('Fetched maintenance data:', response.data);
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
        category: newMaintenance.category,
        user_id: parseInt(userId),
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

  const handleDeleteMaintenance = async (maintenanceId) => {
    try {
      await axios.delete(`${BASE_URLS.maintenance}/details/${maintenanceId}`, {
        headers: { ...getAuthHeader() },
      });
      toast.success('Maintenance deleted successfully!');
      fetchMaintenanceData();
    } catch (error) {
      console.error('Failed to delete maintenance:', error);
      toast.error('Failed to delete maintenance!');
    }
  };

  const handleEditMaintenance = async (editedMaintenance) => {
    try {
      if (!editedMaintenance.maintenance_id) {
        console.error(
          'Invalid maintenance object: Missing maintenance_id',
          editedMaintenance,
        );
        toast.error('Failed to update maintenance: Missing maintenance_id.');
        return;
      }

      const response = await axios.put(
        `${BASE_URLS.maintenance}/details/${editedMaintenance.maintenance_id}`,
        editedMaintenance,
        { headers: { ...getAuthHeader() } },
      );
      toast.success(response.data.message);
      fetchMaintenanceData();
    } catch (error) {
      console.error(
        'Error updating maintenance:',
        error.response?.data || error.message,
      );
      toast.error('Failed to update maintenance.');
    }
  };

  const filteredMaintenance = maintenance.filter((item) => {
    const searchMatch = item.username
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
    <AdminLayout>
      <div className="space-y-3 p-2">
        <h1 className="text-2xl font-semibold">Maintenances & Services</h1>

        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          {/* Left side - Filters */}
          <div className="flex flex-col sm:flex-row gap-4 flex-1 flex-wrap">
            <TextField
              label="Search"
              variant="outlined"
              size="small"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              InputProps={{ startAdornment: <Search size={20} /> }}
              className="w-full sm:w-[200px]"
            />
            <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
              <FormControl
                variant="outlined"
                size="small"
                className="w-full sm:w-[150px]"
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
                className="w-full sm:w-[150px]"
              >
                <InputLabel>Filter by Category</InputLabel>
                <Select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  label="Filter by Category"
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Tech Support">Tech Support</MenuItem>
                  <MenuItem value="General Maintenance">General Maintenance</MenuItem>
                  <MenuItem value="Cleaning and Hygiene">Cleaning and Hygiene</MenuItem>
                  <MenuItem value="Building Maintenance">Building Maintenance</MenuItem>
                  <MenuItem value="Safety and Security">Safety and Security</MenuItem>
                  <MenuItem value="Utilities & Energy">Utilities & Energy</MenuItem>
                  <MenuItem value="HVAC">HVAC(Heating, Ventilation & Air Conditioning)</MenuItem>
                </Select>
              </FormControl>

              <FormControl
                variant="outlined"
                size="small"
                className="w-full sm:w-[150px]"
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
          </div>

          {/* Right side - Add Button */}
          <div className="flex justify-end">
            <Button
              variant="contained"
              color="primary"
              startIcon={<Plus size={20} />}
              onClick={() => setIsAddMaintenanceOpen(true)}
              className="w-full sm:w-auto"
            >
              Add New Request
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center">
            <CircularProgress />
          </div>
        ) : (
          <MaintenanceTable
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
      </div>
    </AdminLayout>
  );
};

export default MaintenanceDetails;
