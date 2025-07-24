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
  Checkbox,
  TablePagination,
  Paper,
  Box,
  Button,
  Tooltip,
} from '@mui/material';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { alpha } from '@mui/material/styles';
import { Trash2 } from 'lucide-react';
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
  onDeleteAssets, // For bulk delete
}) => {
  const theme = useTheme();
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortDirection, setSortDirection] = useState('asc');
  const [sortColumn, setSortColumn] = useState('requestedasset_id');

  // Only select assets visible on the current page
  const getCurrentPageAssetIds = () => {
    return sortedAssets
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      .map((asset) => asset.requestedasset_id);
  };

  const handleSelectAll = (event) => {
    const currentPageAssetIds = getCurrentPageAssetIds();
    if (event.target.checked) {
      const newSelected = Array.from(
        new Set([...selected, ...currentPageAssetIds]),
      );
      setSelected(newSelected);
    } else {
      const newSelected = selected.filter(
        (id) => !currentPageAssetIds.includes(id),
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

  const handleBulkDelete = () => {
    if (onDeleteAssets) {
      onDeleteAssets(selected);
      setSelected([]);
    }
  };

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

  const canDeleteSelected = selected.length > 0;

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
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={
                      getCurrentPageAssetIds().length > 0 &&
                      getCurrentPageAssetIds().every((id) =>
                        selected.includes(id),
                      )
                    }
                    indeterminate={
                      getCurrentPageAssetIds().some((id) =>
                        selected.includes(id),
                      ) &&
                      !getCurrentPageAssetIds().every((id) =>
                        selected.includes(id),
                      )
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell
                  onClick={() => handleSort('username')}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { color: theme.palette.primary.main },
                  }}
                  align="center"
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
                  align="center"
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
                  align="center"
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
                  <TableCell align="center">Handover Date</TableCell>
                )}
                {showHandoverColumns && (
                  <TableCell align="center">Days Remaining</TableCell>
                )}
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
                <TableCell
                  onClick={() => handleSort('category')}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { color: theme.palette.primary.main },
                  }}
                  align="center"
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
                      sx={{
                        backgroundColor: selected.includes(asset.requestedasset_id)
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
                        cursor: 'pointer',
                      }}
                      onClick={() => handleRowClick(asset)}
                    >
                      <TableCell 
                        padding="checkbox"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Checkbox
                          checked={selected.includes(asset.requestedasset_id)}
                          onChange={() => handleSelect(asset.requestedasset_id)}
                        />
                      </TableCell>
                      <TableCell align="center">
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
                      <TableCell align="center">{asset.asset_id}</TableCell>
                      <TableCell align="center">{asset.asset_name}</TableCell>
                      {showHandoverColumns && (
                        <TableCell align="center">{handoverDate}</TableCell>
                      )}
                      {showHandoverColumns && (
                        <TableCell align="center">{remainingDays}</TableCell>
                      )}
                      <TableCell align="center">
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
                      <TableCell align="center">{asset.category}</TableCell>
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
                {selected.length} assets selected
              </span>
              <Button
                variant="contained"
                color="error"
                size="small"
                startIcon={<Trash2 size={18} />}
                onClick={handleBulkDelete}
                disabled={!canDeleteSelected}
                sx={{ borderRadius: theme.shape.borderRadius }}
              >
                Delete Selected
              </Button>
            </Box>
          )}

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
