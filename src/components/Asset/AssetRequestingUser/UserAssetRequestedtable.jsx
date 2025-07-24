import React from 'react';
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
} from '@mui/material';
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

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Requested ID</TableCell>
            <TableCell>Asset</TableCell>
            <TableCell>Quantity</TableCell>
            {showHandoverColumns && <TableCell>Handover Date</TableCell>}
            {showHandoverColumns && <TableCell>Days Remaining</TableCell>}
            <TableCell>Status</TableCell>
            <TableCell>Return Status</TableCell>
            <TableCell>Category</TableCell>
            {customColumns.map((col, index) => (
              <TableCell key={`head-${index}`}>{col.label}</TableCell>
            ))}
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {assets.map((asset) => {
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
              <TableRow key={asset.requestedasset_id}>
                <TableCell>{asset.requestedasset_id}</TableCell>
                <TableCell>{asset.asset_name}</TableCell>
                <TableCell>{asset.quantity}</TableCell>
                {showHandoverColumns && <TableCell>{handoverDate}</TableCell>}
                {showHandoverColumns && <TableCell>{remainingDays}</TableCell>}
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
                          onClick={() => onEditAsset && onEditAsset(asset)}
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
                          onClick={() => onDeleteAsset && onDeleteAsset(asset)}
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
  );
};

export default MonitorTable;
