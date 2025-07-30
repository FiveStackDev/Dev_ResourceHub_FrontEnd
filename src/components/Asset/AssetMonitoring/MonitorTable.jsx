import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  useTheme,
  Chip,
  TablePagination,
  Paper,
  Box,
} from '@mui/material';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { alpha } from '@mui/material/styles';
import PopupEdit from './PopupEdit';

const getStatusColor = (status, theme) => {
  const normalizedStatus = status.toLowerCase();
  switch (normalizedStatus) {
    case 'accepted':
      return {
        bg: alpha(theme.palette.success.light, 0.2),
        color: theme.palette.success.main,
      };
    case 'pending':
      return {
        bg: alpha(theme.palette.info.light, 0.2),
        color: theme.palette.info.main,
      };
    case 'rejected':
      return {
        bg: alpha(theme.palette.error.light, 0.2),
        color: theme.palette.error.main,
      };
    default:
      return {
        bg: alpha(theme.palette.info.light, 0.2),
        color: theme.palette.info.main,
      };
  }
};

const MonitorTable = ({
  assets,
  showHandoverColumns = true,
  customColumns = [],
  onSave,
}) => {
  const theme = useTheme();
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortDirection, setSortDirection] = useState('asc');
  const [sortColumn, setSortColumn] = useState('requestedasset_id');

  const handleSort = (column) => {
    const isSameColumn = column === sortColumn;
    const newSortDirection =
      isSameColumn && sortDirection === 'asc' ? 'desc' : 'asc';

    setSortColumn(column);
    setSortDirection(newSortDirection);
  };

  const sortedAssets = [...assets].sort((a, b) => {
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleRowClick = (asset) => {
    setSelectedAsset(asset);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedAsset(null);
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
                  align="left"
                >
                  User
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
                  onClick={() => handleSort('asset_id')}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { color: theme.palette.primary.main },
                  }}
                  align="left"
                >
                  Asset ID
                  {sortColumn === 'asset_id' && (
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
                  onClick={() => handleSort('asset_name')}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { color: theme.palette.primary.main },
                  }}
                  align="left"
                >
                  Asset
                  {sortColumn === 'asset_name' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? (
                        <ArrowUpward fontSize="small" />
                      ) : (
                        <ArrowDownward fontSize="small" />
                      )}
                    </span>
                  )}
                </TableCell>
                {showHandoverColumns && (
                  <TableCell align="left">Handover Date</TableCell>
                )}
                {showHandoverColumns && (
                  <TableCell align="left">Days Remaining</TableCell>
                )}
                <TableCell
                  onClick={() => handleSort('status')}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { color: theme.palette.primary.main },
                  }}
                  align="left"
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
                <TableCell
                  onClick={() => handleSort('category')}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { color: theme.palette.primary.main },
                  }}
                  align="left"
                >
                  Category
                  {sortColumn === 'category' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? (
                        <ArrowUpward fontSize="small" />
                      ) : (
                        <ArrowDownward fontSize="small" />
                      )}
                    </span>
                  )}
                </TableCell>
                {customColumns.map((col, index) => (
                  <TableCell key={`head-${index}`}>{col.label}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedAssets
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((asset) => {
                  const validStatuses = ['Pending', 'Accepted', 'Rejected'];
                  const status = validStatuses.includes(asset.status)
                    ? asset.status
                    : 'Pending';
                  const statusStyle = getStatusColor(status, theme);
                  // Conditionally handle `is_returning` and other fields
                  const isReturning = asset.is_returning
                    ? 'Returning'
                    : 'Not Returning';
                  const handoverDate = asset.is_returning
                    ? asset.handover_date
                    : 'No Return';
                  const remainingDays =
                    asset.is_returning && asset.status === 'Accepted'
                      ? asset.remaining_days
                      : 'N/A';

                  return (
                    <TableRow
                      key={asset.requestedasset_id}
                      hover
                       align="left"

                      sx={{
                        '&:hover': {
                          backgroundColor:
                            theme.palette.mode === 'dark'
                              ? alpha(theme.palette.action.hover, 0.1)
                              : theme.palette.action.hover,
                        },
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        cursor: 'pointer',
                        ...(typeof remainingDays === 'number' && remainingDays < 0
                          ? { backgroundColor: 'rgba(255, 0, 0, 0.09)' }
                          : {}),
                      }}
                      onClick={() => handleRowClick(asset)}

                      
                    >
                      <TableCell align="left">
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={
                              asset.profile_picture_url ||
                              'https://i.pravatar.cc/50'
                            }
                            alt={asset.username}
                          />
                          {asset.username}
                        </div>
                      </TableCell>
                      <TableCell align="left">{asset.asset_id}</TableCell>
                      <TableCell align="left">{asset.asset_name}</TableCell>
                      {showHandoverColumns && (
                        <TableCell align="left">{handoverDate}</TableCell>
                      )}
                      {showHandoverColumns && (
                        <TableCell align="left">
                          {remainingDays}
                        </TableCell>
                      )}
                      <TableCell align="left">
                        <Chip
                          label={status}
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
                      <TableCell align="left">{asset.category}</TableCell>
                      {customColumns.map((col, index) => (
                        <TableCell key={`row-${index}`}>
                          {col.render(asset)}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <TablePagination
            component="div"
            count={assets.length}
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
      {selectedAsset && (
        <PopupEdit
          open={isPopupOpen}
          handleClose={handleClosePopup}
          asset={selectedAsset}
          onSave={onSave}
        />
      )}
    </>
  );
};

export default MonitorTable;
