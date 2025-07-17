import { useTheme } from '@mui/material';

export const RecentActivities = ({ activities }) => {
  const theme = useTheme();

  return (
    <div
      style={{
        background: theme.palette.background.paper,
        color: theme.palette.text.primary,
        boxShadow: theme.shadows[1],
      }}
      className="rounded-lg p-6"
    >
      <h2
        className="text-xl font-semibold mb-4"
        style={{ color: theme.palette.text.primary }}
      >
        Recent Activities
      </h2>
      <div className="space-y-4">
        {activities.map((activity, index) => {
          const formattedDate = new Date(activity.timestamp).toLocaleDateString();
          return (
            <div
              key={index}
              className="flex items-center justify-between py-2 border-b"
            >
              <span style={{ color: theme.palette.text.secondary }}>
                {activity.title}
              </span>
              <span
                className="text-sm"
                style={{ color: theme.palette.text.secondary }}
              >
                {formattedDate}
              </span>{' '}
              {/* Display formatted date and time */}
            </div>
          );
        })}
      </div>
    </div>
  );
};
