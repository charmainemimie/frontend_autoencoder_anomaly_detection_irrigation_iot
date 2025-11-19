import React, { useState, useEffect } from 'react';
import SensorCard from './SensorCard';
import SensorChart from './SensorChart';
import AttackSimulator from './AttackSimulator';

const Dashboard = ({ user, onLogout }) => {
  const [readings, setReadings] = useState({
    moisture: 0,
    temperature: 0,
    valve: 0,
    valve_flow_rate: 0,
    anomaly_detected: false,
    anomaly_score: 0
  });
  const [history, setHistory] = useState({
    moisture: [],
    temperature: [],
    valve: [],
    valve_flow_rate: [],
    timestamps: []
  });

  useEffect(() => {
    const fetchReadings = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/readings');
        const data = await response.json();
        
        setReadings(data);
        
        // Update history (keep last 50 points)
        setHistory(prev => ({
          moisture: [...prev.moisture, data.moisture].slice(-50),
          temperature: [...prev.temperature, data.temperature].slice(-50),
          valve: [...prev.valve, data.valve].slice(-50),
          valve_flow_rate: [...prev.valve_flow_rate, data.valve_flow_rate].slice(-50),
          timestamps: [...prev.timestamps, new Date(data.timestamp).toLocaleTimeString()].slice(-50)
        }));
      } catch (err) {
        console.error('Error fetching readings:', err);
      }
    };

    fetchReadings();
    const interval = setInterval(fetchReadings, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-green-400">Smart Irrigation Monitor</h1>
              <p className="text-gray-400 text-sm mt-1">
                Admin: {user.name} | Farm: {user.farm}
              </p>
            </div>
            <button
              onClick={onLogout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Alert Banner */}
      {readings.anomaly_detected && (
        <div className="bg-red-600 text-white px-6 py-3 text-center font-semibold animate-pulse">
          ⚠️ ANOMALY DETECTED - Unusual sensor readings detected! Score: {readings.anomaly_score.toFixed(4)}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Attack Simulator */}
        <AttackSimulator />

        {/* Sensor Cards */}      
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <SensorCard
            title="Soil Moisture"
            value={readings.moisture}
            unit="%"
            icon="💧"
            color="blue"
            status={readings.moisture < 35 ? 'Low' : readings.moisture > 60 ? 'High' : 'Normal'}
          />
          <SensorCard
            title="Soil Temperature"
            value={readings.temperature}
            unit="°C"
            icon="🌡️"
            color="orange"
            status={readings.temperature < 20 ? 'Low' : readings.temperature > 30 ? 'High' : 'Normal'}
          />
          <SensorCard
            title="Irrigation Valve"
            value={readings.valve === 1 ? 'OPEN' : 'CLOSED'}
            unit=""
            icon="🚰"
            color={readings.valve === 1 ? 'green' : 'gray'}
            status={readings.valve === 1 ? 'Active' : 'Inactive'}
            subtitle={readings.valve === 1 ? `Flow: ${readings.valve_flow_rate.toFixed(2)} L/min` : ''}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <SensorChart
            title="Soil Moisture Over Time"
            data={history.moisture}
            labels={history.timestamps}
            color="rgb(59, 130, 246)"
            unit="%"
          />
          <SensorChart
            title="Soil Temperature Over Time"
            data={history.temperature}
            labels={history.timestamps}
            color="rgb(249, 115, 22)"
            unit="°C"
          />
        </div>

        <div className="mb-8">
          <SensorChart
            title="Irrigation Valve Status"
            data={history.valve}
            labels={history.timestamps}
            color="rgb(34, 197, 94)"
            unit=""
            type="step"
          />
        </div>

        <div className="mb-8">
          <SensorChart
            title="Valve Flow Rate (L/min)"
            data={history.valve_flow_rate}
            labels={history.timestamps}
            color="rgb(59, 130, 246)"
            unit=" L/min"
            type="linear"
          />
        </div>

      
      </div>
    </div>
  );
};

export default Dashboard;