import React from 'react';

const SensorCard = ({ title, value, unit, icon, color, status }) => {
  const colorClasses = {
    blue: 'from-blue-600 to-blue-800',
    orange: 'from-orange-600 to-orange-800',
    green: 'from-green-600 to-green-800',
    gray: 'from-gray-600 to-gray-800'
  };

  const statusColors = {
    Normal: 'text-green-400',
    Low: 'text-yellow-400',
    High: 'text-orange-400',
    Active: 'text-green-400',
    Inactive: 'text-gray-400'
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-lg shadow-lg p-6`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <span className="text-3xl">{icon}</span>
      </div>
      <div className="text-4xl font-bold text-white mb-2">
        {typeof value === 'number' ? value.toFixed(1) : value}
        <span className="text-xl ml-1">{unit}</span>
      </div>
      <div className={`text-sm font-semibold ${statusColors[status]}`}>
        Status: {status}
      </div>
    </div>
  );
};

export default SensorCard;