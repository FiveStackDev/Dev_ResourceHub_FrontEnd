import { getAuthHeader } from '../../utils/authHeader';
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Tooltip,
  TablePagination,
  useTheme,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Pencil, Trash2, SendHorizontal } from 'lucide-react';
import { EditMaintenance } from './EditMaintenancePopup.jsx';
import { DeleteConfirmDialog } from './DeleteConfirmDialog.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URLS } from '../../services/api/config.js';

const SendConfirmDialog = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Notification</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to send this notification?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="primary" autoFocus>
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const MaintenanceTable = ({
  maintenance,
  onEditMaintenance,
  onDeleteMaintenance,
}) => {
  const theme = useTheme();
  const [editMaintenance, setEditMaintenance] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Get color for priority level
  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return {
          bg:
            theme.palette.mode === 'dark'
              ? alpha(theme.palette.error.main, 0.2)
              : alpha(theme.palette.error.light, 0.2),
          color: theme.palette.error.main,
        };
      case 'medium':
        return {
          bg:
            theme.palette.mode === 'dark'
              ? alpha(theme.palette.warning.main, 0.2)
              : alpha(theme.palette.warning.light, 0.2),
          color: theme.palette.warning.main,
        };
      case 'low':
        return {
          bg:
            theme.palette.mode === 'dark'
              ? alpha(theme.palette.success.main, 0.2)
              : alpha(theme.palette.success.light, 0.2),
          color: theme.palette.success.main,
        };
      default:
        return {
          bg:
            theme.palette.mode === 'dark'
              ? alpha(theme.palette.info.main, 0.2)
              : alpha(theme.palette.info.light, 0.2),
          color: theme.palette.info.main,
        };
    }
  };

  // Get color for status
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return {
          bg:
            theme.palette.mode === 'dark'
              ? alpha(theme.palette.success.main, 0.2)
              : alpha(theme.palette.success.light, 0.2),
          color: theme.palette.success.main,
        };
      case 'in progress':
        return {
          bg:
            theme.palette.mode === 'dark'
              ? alpha(theme.palette.info.main, 0.2)
              : alpha(theme.palette.info.light, 0.2),
          color: theme.palette.info.main,
        };
      case 'pending':
        return {
          bg:
            theme.palette.mode === 'dark'
              ? alpha(theme.palette.warning.main, 0.2)
              : alpha(theme.palette.warning.light, 0.2),
          color: theme.palette.warning.main,
        };
      default:
        return {
          bg:
            theme.palette.mode === 'dark'
              ? alpha(theme.palette.grey[600], 0.2)
              : alpha(theme.palette.grey[400], 0.2),
          color: theme.palette.text.secondary,
        };
    }
  };

  // Function to call addnotification endpoint
  const handleSendNotification = async (maintenanceItem) => {
    try {
      const response = await fetch(`${BASE_URLS.maintenance}/addnotification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify({
          user_id: parseInt(maintenanceItem.user_id),
          maintenance_id: parseInt(maintenanceItem.maintenance_id),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to add notification: ${response.status} ${errorText}`,
        );
      }

      const result = await response.json();
      toast.success(result.message || 'Notification sent successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
      });
    } catch (error) {
      console.error('Error adding notification:', error);
      toast.error(`Failed to send notification: ${error.message}`, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
      });
    }
  };

  // Handle opening the send confirmation dialog
  const handleOpenSendDialog = (maintenanceItem) => {
    setSelectedMaintenance(maintenanceItem);
    setIsSendDialogOpen(true);
  };

  // Handle confirming the send action
  const handleConfirmSend = () => {
    if (selectedMaintenance) {
      handleSendNotification(selectedMaintenance);
    }
    setIsSendDialogOpen(false);
    setSelectedMaintenance(null);
  };

  return (
    <>
      <Paper elevation={theme.palette.mode === 'dark' ? 2 : 1}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor:
                    theme.palette.mode === 'dark'
                      ? theme.palette.background.paper
                      : theme.palette.grey[100],
                  '& .MuiTableCell-root': {
                    color: theme.palette.text.primary,
                    fontWeight: 600,
                  },
                }}
              >
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Priority Level</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {maintenance
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item) => {
                  const priorityStyle = getPriorityColor(item.priorityLevel);
                  const statusStyle = getStatusColor(item.status);

                  return (
                    <TableRow
                      key={item.maintenance_id}
                      hover
                      sx={{
                        '&:hover': {
                          backgroundColor:
                            theme.palette.mode === 'dark'
                              ? alpha(theme.palette.action.hover, 0.1)
                              : theme.palette.action.hover,
                        },
                        borderBottom: `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      <TableCell>{item.username}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>
                        <Chip
                          label={item.priorityLevel}
                          size="small"
                          sx={{
                            backgroundColor: priorityStyle.bg,
                            color: priorityStyle.color,
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            height: '24px',
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={item.status}
                          size="small"
                          sx={{
                            backgroundColor: statusStyle.bg,
                            color: statusStyle.color,
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            height: '24px',
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <div className="flex justify-center gap-2">
                          <Tooltip title="Edit Maintenance">
                            <Button
                              variant="outlined"
                              color="primary"
                              size="small"
                              startIcon={<Pencil size={18} />}
                              onClick={() => setEditMaintenance(item)}
                              sx={{
                                borderRadius: theme.shape.borderRadius,
                              }}
                            >
                              Edit
                            </Button>
                          </Tooltip>
                          <Tooltip title="Delete Maintenance">
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              startIcon={<Trash2 size={18} />}
                              onClick={() => {
                                setSelectedId(item.maintenance_id);
                                setIsDeleteDialogOpen(true);
                              }}
                              sx={{
                                borderRadius: theme.shape.borderRadius,
                              }}
                            >
                              Delete
                            </Button>
                          </Tooltip>
                          <Tooltip title="Send Notification">
                            <Button
                              variant="outlined"
                              color="primary"
                              startIcon={<SendHorizontal size={20} />}
                              onClick={() => handleOpenSendDialog(item)}
                            >
                              Send
                            </Button>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={maintenance.length}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Paper>

      {editMaintenance && (
        <EditMaintenance
          maintenance={editMaintenance}
          open={!!editMaintenance}
          onClose={() => setEditMaintenance(null)}
          onSave={(editedMaintenance) => {
            onEditMaintenance(editedMaintenance);
            setEditMaintenance(null);
          }}
        />
      )}

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => {
          onDeleteMaintenance(selectedId);
          setIsDeleteDialogOpen(false);
        }}
      />

      <SendConfirmDialog
        open={isSendDialogOpen}
        onClose={() => setIsSendDialogOpen(false)}
        onConfirm={handleConfirmSend}
      />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
};
