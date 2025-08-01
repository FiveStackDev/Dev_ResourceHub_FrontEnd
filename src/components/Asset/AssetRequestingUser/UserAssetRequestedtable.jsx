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
  Button,
  Tooltip,
  TablePagination,
  Paper,
  Box,
} from '@mui/material';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { alpha } from '@mui/material/styles';
import { Edit, Trash2 } from 'lucide-react';

const getStatusColor = (status, theme) => {
  switch (status.toLowerCase()) {
    case 'active':
      return {
        bg:
          theme.palette.mode === 'dark'
            ? alpha(theme.palette.success.main, 0.2)
            : alpha(theme.palette.success.light, 0.2),
        color: theme.palette.success.main,
      };
    case 'inactive':
      return {
        bg:
          theme.palette.mode === 'dark'
            ? alpha(theme.palette.warning.main, 0.2)
            : alpha(theme.palette.warning.light, 0.2),
        color: theme.palette.warning.main,
      };
    case 'pending':
      return {
        bg:
          theme.palette.mode === 'dark'
            ? alpha(theme.palette.info.main, 0.2)
            : alpha(theme.palette.info.light, 0.2),
        color: theme.palette.info.main,
      };
    case 'accepted':
      return {
        bg:
          theme.palette.mode === 'dark'
            ? alpha(theme.palette.success.main, 0.2)
            : alpha(theme.palette.success.light, 0.2),
        color: theme.palette.success.main,
      };
    case 'rejected':
      return {
        bg:
          theme.palette.mode === 'dark'
            ? alpha(theme.palette.error.main, 0.2)
            : alpha(theme.palette.error.light, 0.2),
        color: theme.palette.error.main,
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

const MonitorTable = ({
  assets,
  showHandoverColumns = true,
  customColumns = [],
  onEditAsset,
  onDeleteAsset,
}) => {
  const theme = useTheme();
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
                  onClick={() => handleSort('requestedasset_id')}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { color: theme.palette.primary.main },
                  }}
                >
                  Requested ID
                  {sortColumn === 'requestedasset_id' && (
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
                <TableCell
                  onClick={() => handleSort('quantity')}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { color: theme.palette.primary.main },
                  }}
                >
                  Quantity
                  {sortColumn === 'quantity' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? (
                        <ArrowUpward fontSize="small" />
                      ) : (
                        <ArrowDownward fontSize="small" />
                      )}
                    </span>
                  )}
                </TableCell>
                {showHandoverColumns && <TableCell>Handover Date</TableCell>}
                {showHandoverColumns && <TableCell>Days Remaining</TableCell>}
                <TableCell
                  onClick={() => handleSort('status')}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { color: theme.palette.primary.main },
                  }}
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
                <TableCell>Return Status</TableCell>
                <TableCell
                  onClick={() => handleSort('category')}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { color: theme.palette.primary.main },
                  }}
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
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedAssets
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((asset) => {
                  const statusStyle = getStatusColor(asset.status, theme);

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
                        '&:hover': {
                          backgroundColor:
                            theme.palette.mode === 'dark'
                              ? alpha(theme.palette.action.hover, 0.1)
                              : theme.palette.action.hover,
                        },
                        borderBottom: `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      <TableCell>{asset.requestedasset_id}</TableCell>
                      <TableCell>{asset.asset_name}</TableCell>
                      <TableCell>{asset.quantity}</TableCell>
                      {showHandoverColumns && (
                        <TableCell>{handoverDate}</TableCell>
                      )}
                      {showHandoverColumns && (
                        <TableCell>{remainingDays}</TableCell>
                      )}
                      <TableCell>
                        <Chip
                          label={asset.status}
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
                      <TableCell>{isReturning}</TableCell>
                      <TableCell>{asset.category}</TableCell>
                      {customColumns.map((col, index) => (
                        <TableCell key={`row-${index}`}>
                          {col.render(asset)}
                        </TableCell>
                      ))}
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          {asset.status === 'Pending' && (
                            <Tooltip title="Edit Asset Request">
                              <Button
                                variant="outlined"
                                color="primary"
                                size="small"
                                startIcon={<Edit size={18} />}
                                onClick={() =>
                                  onEditAsset && onEditAsset(asset)
                                }
                                sx={{ borderRadius: theme.shape.borderRadius }}
                              >
                                Edit
                              </Button>
                            </Tooltip>
                          )}

                          {(asset.status === 'Rejected' ||
                            asset.status === 'Pending') && (
                            <Tooltip title="Delete Asset Request">
                              <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                startIcon={<Trash2 size={18} />}
                                onClick={() =>
                                  onDeleteAsset && onDeleteAsset(asset)
                                }
                                sx={{ borderRadius: theme.shape.borderRadius }}
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
    </>
  );
};

export default MonitorTable;
