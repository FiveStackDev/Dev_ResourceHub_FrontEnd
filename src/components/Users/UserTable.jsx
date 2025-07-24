import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  TablePagination,
  Button,
  Tooltip,
  useTheme,
  Box,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Pencil, Trash2 } from 'lucide-react';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { useUser } from '../../contexts/UserContext';

export const UserTable = ({ users, onEditUser, onDeleteUsers }) => {
  const theme = useTheme();
  const { userData, isAdmin, isSuperAdmin } = useUser();

  const [selected, setSelected] = useState([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortDirection, setSortDirection] = useState('asc');
  const [sortColumn, setSortColumn] = useState('email');

  const canDeleteUser = (targetUserType) => {
    if (isSuperAdmin) return true;
    if (isAdmin && targetUserType === 'User') return true;
    return false;
  };

  // Only select users visible on the current page
  const getCurrentPageUserIds = () => {
    return sortedUsers
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      .map((user) => user.id);
  };

  const handleSelectAll = (event) => {
    const currentPageUserIds = getCurrentPageUserIds();
    if (event.target.checked) {
      // Add only current page users to selection, plus any already selected from other pages
      const newSelected = Array.from(
        new Set([...selected, ...currentPageUserIds]),
      );
      setSelected(newSelected);
    } else {
      // Remove only current page users from selection
      const newSelected = selected.filter(
        (id) => !currentPageUserIds.includes(id),
      );
      setSelected(newSelected);
    }
  };

  const handleSelect = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, id];
    } else {
      newSelected = selected.filter((item) => item !== id);
    }

    setSelected(newSelected);
  };

  const handleDelete = () => {
    onDeleteUsers(selected);
    setSelected([]);
    setIsDeleteDialogOpen(false);
  };

  const handleSort = (column) => {
    const isSameColumn = column === sortColumn;
    const newSortDirection =
      isSameColumn && sortDirection === 'asc' ? 'desc' : 'asc';

    setSortColumn(column);
    setSortDirection(newSortDirection);
  };

  const sortedUsers = [...users].sort((a, b) => {
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const selectedUsers = users.filter((u) => selected.includes(u.id));
  const canDeleteSelected = selectedUsers.every((u) =>
    canDeleteUser(u.userType),
  );

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
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={
                      getCurrentPageUserIds().length > 0 &&
                      getCurrentPageUserIds().every((id) =>
                        selected.includes(id),
                      )
                    }
                    indeterminate={
                      getCurrentPageUserIds().some((id) =>
                        selected.includes(id),
                      ) &&
                      !getCurrentPageUserIds().every((id) =>
                        selected.includes(id),
                      )
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell
                  onClick={() => handleSort('email')}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { color: theme.palette.primary.main },
                  }}
                >
                  User
                  {sortColumn === 'email' && (
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
                  onClick={() => handleSort('userType')}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { color: theme.palette.primary.main },
                  }}
                >
                  User Type
                  {sortColumn === 'userType' && (
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
                  onClick={() => handleSort('additionalDetails')}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { color: theme.palette.primary.main },
                  }}
                >
                  Additional Details
                  {sortColumn === 'additionalDetails' && (
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
              {sortedUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow
                    key={user.id}
                    hover
                    sx={{
                      backgroundColor: selected.includes(user.id)
                        ? theme.palette.mode === 'dark'
                          ? alpha(theme.palette.primary.dark, 0.2)
                          : alpha(theme.palette.primary.light, 0.2)
                        : 'transparent',
                      '&:hover': {
                        backgroundColor:
                          theme.palette.mode === 'dark'
                            ? alpha(theme.palette.action.hover, 0.1)
                            : theme.palette.action.hover,
                      },
                      borderBottom: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selected.includes(user.id)}
                        onChange={() => handleSelect(user.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={user.profilePicture}
                          alt={user.email}
                          className="w-8 h-8 rounded-full"
                        />
                        {user.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        style={{
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          backgroundColor:
                            user.userType === 'SuperAdmin'
                              ? theme.palette.mode === 'dark'
                                ? alpha('#9333ea', 0.2)
                                : alpha('#9333ea', 0.1)
                              : user.userType === 'Admin'
                                ? theme.palette.mode === 'dark'
                                  ? alpha(theme.palette.primary.main, 0.2)
                                  : alpha(theme.palette.primary.main, 0.1)
                                : theme.palette.mode === 'dark'
                                  ? alpha(theme.palette.grey[700], 0.5)
                                  : alpha(theme.palette.grey[300], 0.8),
                          color:
                            user.userType === 'SuperAdmin'
                              ? '#9333ea'
                              : user.userType === 'Admin'
                                ? theme.palette.primary.main
                                : theme.palette.text.secondary,
                        }}
                      >
                        {user.userType}
                      </span>
                    </TableCell>
                    <TableCell>{user.additionalDetails}</TableCell>
                    <TableCell align="center">
                      <div className="flex justify-center gap-2">
                        <Tooltip title="Edit User">
                          <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            startIcon={<Pencil size={18} />}
                            onClick={() => onEditUser(user)}
                            sx={{ borderRadius: theme.shape.borderRadius }}
                          >
                            Edit
                          </Button>
                        </Tooltip>
                        <Tooltip
                          title={
                            canDeleteUser(user.userType)
                              ? 'Delete User'
                              : 'Not authorized'
                          }
                        >
                          <span>
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              startIcon={<Trash2 size={18} />}
                              onClick={() => {
                                setSelected([user.id]);
                                setIsDeleteDialogOpen(true);
                              }}
                              disabled={!canDeleteUser(user.userType)}
                              sx={{ borderRadius: theme.shape.borderRadius }}
                            >
                              Delete
                            </Button>
                          </span>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {selected.length > 0 && (
            <Box
              sx={{
                backgroundColor:
                  theme.palette.mode === 'dark'
                    ? alpha(theme.palette.primary.dark, 0.15)
                    : alpha(theme.palette.primary.light, 0.15),
                padding: '8px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: `1px solid ${theme.palette.divider}`,
                borderBottom: `1px solid ${theme.palette.divider}`,
              }}
            >
              <span
                style={{ color: theme.palette.primary.main, fontWeight: 500 }}
              >
                {selected.length} users selected
              </span>
              <Button
                variant="contained"
                color="error"
                size="small"
                startIcon={<Trash2 size={18} />}
                onClick={() => setIsDeleteDialogOpen(true)}
                disabled={!canDeleteSelected}
                sx={{ borderRadius: theme.shape.borderRadius }}
              >
                Delete Selected
              </Button>
            </Box>
          )}

          <TablePagination
            component="div"
            count={users.length}
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

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        userCount={selected.length}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
      />
    </>
  );
};
