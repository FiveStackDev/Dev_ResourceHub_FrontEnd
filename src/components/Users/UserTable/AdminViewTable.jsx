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
  Box,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';

export const ViewAdminsTable = ({ users }) => {
  const theme = useTheme();

  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortDirection, setSortDirection] = useState('asc');
  const [sortColumn, setSortColumn] = useState('user_id');

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
                  onClick={() => handleSort('email')}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { color: theme.palette.primary.main },
                  }}
                >
                  Email
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
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={user.profilePicture}
                          alt={user.email}
                          className="w-8 h-8 rounded-full"
                        />
                        {user.username}
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
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
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
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
    </>
  );
};
