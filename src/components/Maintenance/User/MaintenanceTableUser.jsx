import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  useTheme,
  Chip,
  Button,
  Tooltip,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Edit, Trash2 } from 'lucide-react';

export const MaintenanceTableUser = ({ maintenance, onEditMaintenance, onDeleteMaintenance }) => {
  const theme = useTheme();
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
                      <TableCell> <div className="flex items-center gap-3">
                        <img
                          src={item.profilePicture}
                          alt={item.username}
                          className="w-8 h-8 rounded-full"
                        />
                        {item.username}
                      </div></TableCell>
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
                        
                          <div className="flex justify-end gap-2">
                            {(item.status === 'Pending') && (
                              <Tooltip title="Edit Maintenance">
                                <Button
                                  variant="outlined"
                                  color="primary"
                                  size="small"
                                  startIcon={<Edit size={18} />}
                                  onClick={() => onEditMaintenance && onEditMaintenance(item)}
                                >
                                  Edit
                                </Button>
                              </Tooltip>
                            )}
                            {(item.status === 'Pending' || item.status === 'Rejected') && (
                            <Tooltip title="Delete Maintenance">
                              <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                startIcon={<Trash2 size={18} />}
                                onClick={() => onDeleteMaintenance && onDeleteMaintenance(item)}
                              >
                                Delete
                              </Button>
                            </Tooltip>
                            )}
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
    </>
  );
};
