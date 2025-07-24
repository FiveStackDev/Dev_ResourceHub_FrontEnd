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
} from '@mui/material';
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
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">User</TableCell>
              <TableCell align="center">Asset ID</TableCell>
              <TableCell align="center">Asset</TableCell>
              {showHandoverColumns && (
                <TableCell align="center">Handover Date</TableCell>
              )}
              {showHandoverColumns && (
                <TableCell align="center">Days Remaining</TableCell>
              )}
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Category</TableCell>
              {customColumns.map((col, index) => (
                <TableCell key={`head-${index}`}>{col.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {assets.map((asset) => {
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
                  onClick={() => handleRowClick(asset)}
                  style={{ cursor: 'pointer' }}
                >
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
