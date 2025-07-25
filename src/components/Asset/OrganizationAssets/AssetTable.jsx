import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  TablePagination,
  useTheme,
  Box,
} from '@mui/material';
import { Edit, Delete, ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { alpha } from '@mui/material/styles';
import EditAssetPopup from './AssetEdit'; // Import the Edit popup
import DeleteAssetPopup from './AssetDelete'; // Import the Delete popup

function AssetTable({
  assets,
  handleEditOpen,
  handleDeleteOpen,
  editOpen,
  deleteOpen,
  selectedAsset,
  handleUpdateAsset,
  handleDeleteAsset,
}) {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortDirection, setSortDirection] = useState('asc');
  const [sortColumn, setSortColumn] = useState('asset_name');

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
      <TableContainer component={Paper}>
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
                onClick={() => handleSort('asset_name')}
                sx={{
                  cursor: 'pointer',
                  '&:hover': { color: theme.palette.primary.main },
                }}
              >
                <strong>Asset Name</strong>
                {sortColumn === 'asset_name' && (
                  <span style={{ marginLeft: '4px' }}>
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
                <strong>Category</strong>
                {sortColumn === 'category' && (
                  <span style={{ marginLeft: '4px' }}>
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
                <strong>Quantity</strong>
                {sortColumn === 'quantity' && (
                  <span style={{ marginLeft: '4px' }}>
                    {sortDirection === 'asc' ? (
                      <ArrowUpward fontSize="small" />
                    ) : (
                      <ArrowDownward fontSize="small" />
                    )}
                  </span>
                )}
              </TableCell>
              <TableCell
                onClick={() => handleSort('condition_type')}
                sx={{
                  cursor: 'pointer',
                  '&:hover': { color: theme.palette.primary.main },
                }}
              >
                <strong>Condition</strong>
                {sortColumn === 'condition_type' && (
                  <span style={{ marginLeft: '4px' }}>
                    {sortDirection === 'asc' ? (
                      <ArrowUpward fontSize="small" />
                    ) : (
                      <ArrowDownward fontSize="small" />
                    )}
                  </span>
                )}
              </TableCell>
              <TableCell
                onClick={() => handleSort('location')}
                sx={{
                  cursor: 'pointer',
                  '&:hover': { color: theme.palette.primary.main },
                }}
              >
                <strong>Location</strong>
                {sortColumn === 'location' && (
                  <span style={{ marginLeft: '4px' }}>
                    {sortDirection === 'asc' ? (
                      <ArrowUpward fontSize="small" />
                    ) : (
                      <ArrowDownward fontSize="small" />
                    )}
                  </span>
                )}
              </TableCell>
              <TableCell>
                <strong>Availability</strong>
              </TableCell>
              <TableCell>
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedAssets.length > 0 ? (
              sortedAssets
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((asset) => (
                  <TableRow
                    key={asset.asset_id}
                    hover
                    sx={{
                      '&:hover': {
                        backgroundColor:
                          theme.palette.mode === 'dark'
                            ? alpha(theme.palette.action.hover, 0.1)
                            : theme.palette.action.hover,
                      },
                    }}
                  >
                    <TableCell>{asset.asset_name}</TableCell>
                    <TableCell>{asset.category}</TableCell>
                    <TableCell>{asset.quantity}</TableCell>
                    <TableCell>{asset.condition_type}</TableCell>
                    <TableCell>{asset.location}</TableCell>
                    <TableCell>
                      <Chip
                        label={asset.is_available ? 'Available' : 'Not Available'}
                        color={asset.is_available ? 'success' : 'default'}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        sx={{ mr: '10px' }}
                        color="primary"
                        variant="outlined"
                        onClick={() => handleEditOpen(asset)}
                      >
                        Edit <Edit />
                      </Button>
                      <Button
                        color="error"
                        variant="outlined"
                        onClick={() => handleDeleteOpen(asset)}
                      >
                        Delete <Delete />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No assets found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
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
      </TableContainer>

      {/* Edit and Delete Popups */}
      {selectedAsset && (
        <>
          <EditAssetPopup
            open={editOpen}
            asset={selectedAsset}
            onClose={() => handleEditOpen(null)}
            onUpdate={handleUpdateAsset}
          />
          <DeleteAssetPopup
            open={deleteOpen}
            asset={selectedAsset}
            onClose={() => handleDeleteOpen(null)}
            onDelete={handleDeleteAsset}
          />
        </>
      )}
    </>
  );
}

export default AssetTable;
