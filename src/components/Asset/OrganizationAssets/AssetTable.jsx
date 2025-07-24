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
  Checkbox,
  TablePagination,
  useTheme,
  Box,
} from '@mui/material';
import { Edit, Delete, ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { alpha } from '@mui/material/styles';
import { Trash2 } from 'lucide-react';
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
  onDeleteAssets, // For bulk delete
}) {
  const theme = useTheme();
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortDirection, setSortDirection] = useState('asc');
  const [sortColumn, setSortColumn] = useState('asset_name');

  // Only select assets visible on the current page
  const getCurrentPageAssetIds = () => {
    return sortedAssets
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      .map((asset) => asset.asset_id);
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
                      backgroundColor: selected.includes(asset.asset_id)
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
                    }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selected.includes(asset.asset_id)}
                        onChange={() => handleSelect(asset.asset_id)}
                      />
                    </TableCell>
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
                <TableCell colSpan={8} align="center">
                  No assets found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Bulk Actions and Pagination */}
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
