import * as React from 'react';
import { useEffect } from 'react';
import { Package } from 'lucide-react';
import { useThemeStyles } from '../../../hooks/useThemeStyles';
import '../AssetComponents.css';

function AssetHomeCard({ name, image, onClick }) {
  // Theme styles hook
  const { updateCSSVariables } = useThemeStyles();

  // Update CSS variables when theme changes
  useEffect(() => {
    updateCSSVariables();
  }, [updateCSSVariables]);

  return (
    <div onClick={onClick} className="asset-home-card">
      <div
        className="asset-home-card-media"
        style={{ backgroundImage: `url(${image})` }}
        title={name}
      />
      <div className="asset-home-card-content">
        <h5>{name}</h5>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: 'var(--asset-card-text-primary)',
          opacity: 0.7,
        }}
      >
        <Package size={16} />
        <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>
          Asset Category
        </span>
      </div>
    </div>
  );
}

export default AssetHomeCard;
