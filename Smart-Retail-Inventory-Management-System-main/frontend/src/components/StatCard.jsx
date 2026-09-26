import React from 'react';

const StatCard = ({ title, value, icon: Icon, trend, accentColor = '#6366f1' }) => {
  return (
    <div className="glass-card stat-card" style={{ '--card-accent': accentColor }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="stat-title">{title}</div>
          <div className="stat-value">{value}</div>
          {trend && (
            <div style={{ fontSize: '0.8rem', color: trend.isPositive ? '#10b981' : '#ef4444', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
              <span>{trend.isPositive ? '↑' : '↓'} {trend.text}</span>
            </div>
          )}
        </div>
        {Icon && (
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: `rgba(${parseInt(accentColor.slice(1,3),16)}, ${parseInt(accentColor.slice(3,5),16)}, ${parseInt(accentColor.slice(5,7),16)}, 0.15)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: accentColor
          }}>
            <Icon size={22} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
