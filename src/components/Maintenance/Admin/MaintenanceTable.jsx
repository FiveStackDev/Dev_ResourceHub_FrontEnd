import { getAuthHeader } from '../../../utils/authHeader';
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
  Box,
} from '@mui/material';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { alpha } from '@mui/material/styles';
import { Pencil, SendHorizontal, Send, X,Trash2 } from 'lucide-react';
import { EditMaintenance } from './EditMaintenancePopup.jsx';
import { DeleteConfirmDialog } from '../shared/DeleteConfirmDialog.jsx';
import { ToastContainer, toast } from 'react-toastify';
import { BASE_URLS } from '../../../services/api/config.js';
import '../shared/MaintenanceDialog.css';
import SendConfirmDialog from './SendConfirmDialog.jsx';

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
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortDirection, setSortDirection] = useState('asc');
  const [sortColumn, setSortColumn] = useState('maintenance_id');

  const handleSort = (column) => {
    const isSameColumn = column === sortColumn;
    const newSortDirection =
      isSameColumn && sortDirection === 'asc' ? 'desc' : 'asc';

    setSortColumn(column);
    setSortDirection(newSortDirection);
  };

  const sortedMaintenance = [...maintenance].sort((a, b) => {
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

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
  // Function to call sendMaintenanceNotification endpoint with role
  const handleSendNotification = async (maintenanceItem, role) => {
    try {
      const response = await fetch(
        `${BASE_URLS.notification}/sendMaintenanceNotification`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
          },
          body: JSON.stringify({
            type: 'maintenance',
            reference_id: maintenanceItem.maintenance_id,
            title: maintenanceItem.title || 'Maintenance Notification',
            message:
              maintenanceItem.description ||
              'A new maintenance notification has been sent.',
            priority: maintenanceItem.priorityLevel || 'General',
            recipient: role || 'User',
          }),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to send maintenance notification: ${response.status} ${errorText}`,
        );
      }

      const result = await response.json();
      toast.success(result.message || 'Maintenance notification sent!');
    } catch (error) {
      console.error('Error sending maintenance notification:', error);
      toast.error(`Failed to send notification: ${error.message}`);
    }
  };

  // Handle opening the send confirmation dialog
  const handleOpenSendDialog = (maintenanceItem) => {
    setSelectedMaintenance(maintenanceItem);
    setIsSendDialogOpen(true);
  };

  // Handle confirming the send action, now receives role
  const handleConfirmSend = (role) => {
    if (selectedMaintenance) {
      handleSendNotification(selectedMaintenance, role);
    }
    setIsSendDialogOpen(false);
    setSelectedMaintenance(null);
  };

  return (
    <>
      <Paper
        className="relative"
        elevation={theme.palette.mode === 'dark' ? 2 : 1}
      >
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
                <TableCell
                  onClick={() => handleSort('username')}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { color: theme.palette.primary.main },
                  }}
                >
                  Name
                  {sortColumn === 'username' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? (
                        <ArrowUpward fontSize="small" />
                      ) : (
                        <ArrowDownward fontSize="small" />
                      )}
                    </span>
                  )}
                </TableCell>
                <TableCell
                  onClick={() => handleSort('description')}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { color: theme.palette.primary.main },
                  }}
                >
                  Description
                  {sortColumn === 'description' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? (
                        <ArrowUpward fontSize="small" />
                      ) : (
                        <ArrowDownward fontSize="small" />
                      )}
                    </span>
                  )}
                </TableCell>
                <TableCell
                  onClick={() => handleSort('category')}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { color: theme.palette.primary.main },
                  }}
                >
                  Category
                  {sortColumn === 'Category' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? (
                        <ArrowUpward fontSize="small" />
                      ) : (
                        <ArrowDownward fontSize="small" />
                      )}
                    </span>
                  )}
                </TableCell>
                <TableCell
                  onClick={() => handleSort('priorityLevel')}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { color: theme.palette.primary.main },
                  }}
                >
                  Priority Level
                  {sortColumn === 'priorityLevel' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? (
                        <ArrowUpward fontSize="small" />
                      ) : (
                        <ArrowDownward fontSize="small" />
                      )}
                    </span>
                  )}
                </TableCell>
                <TableCell
                  onClick={() => handleSort('status')}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { color: theme.palette.primary.main },
                  }}
                  align="center"
                >
                  Status
                  {sortColumn === 'status' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? (
                        <ArrowUpward fontSize="small" />
                      ) : (
                        <ArrowDownward fontSize="small" />
                      )}
                    </span>
                  )}
                </TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedMaintenance
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
                      <TableCell>{item.category}</TableCell>

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

        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
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
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
          />
        </Box>
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

      <ToastContainer />
    </>
  );
};
