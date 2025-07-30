import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material';

export const QuickActions = ({ actions }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleAction = (path, external) => {
    if (path) {
      if (external) {
        window.open(path, '_blank');
      } else {
        navigate(path);
      }
    } else {
      console.warn('Action triggered with no path defined.');
    }
  }

  if (!actions || actions.length === 0) {
    return <div className="p-4 text-gray-500">No quick actions available.</div>;
  }

  return (
    <div
      style={{
        background: theme.palette.background.paper,
        color: theme.palette.text.primary,
        boxShadow: theme.shadows[1],
      }}
      className="p-6 rounded-lg"
    >
      <h2
        className="mb-4 text-xl font-semibold"
        style={{ color: theme.palette.text.primary }}
      >
        Quick Actions
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {actions.map((action, idx) => (
          <button
            key={idx}
            onClick={() => handleAction(action.path, action.external)}
            className="flex items-center w-full gap-3 p-3 transition-colors rounded-lg"
            style={{
              background: theme.palette.action.hover,
              color: theme.palette.text.primary,
            }}
          >
            {action.icon && (
              <action.icon
                className={`${action.iconColor || 'text-gray-500'} mb-2`}
                size={24}
              />
            )}
            <span>{action.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
