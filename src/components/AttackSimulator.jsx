import React, { useState } from 'react';

const AttackSimulator = () => {
  const [attackActive, setAttackActive] = useState(false);
  const [target, setTarget] = useState('moisture');
  const [intensity, setIntensity] = useState(10);

  const startAttack = async () => {
    try {
      await fetch('http://localhost:5000/api/simulate-attack', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          active: true,
          target: target,
          intensity: intensity
        }),
      });
      setAttackActive(true);
    } catch (err) {
      console.error('Error starting attack:', err);
    }
  };

  const stopAttack = async () => {
    try {
      await fetch('http://localhost:5000/api/simulate-attack', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          active: false,
          target: null,
          intensity: 0
        }),
      });
      setAttackActive(false);
    } catch (err) {
      console.error('Error stopping attack:', err);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            {attackActive && (
        <div className="mt-4 bg-red-900 border border-red-700 rounded p-4">
          <p className="text-red-200 font-semibold">
            ⚠️ Active Attack: Manipulation on {target} readings
          </p>
        </div>
      )}
      <div className="flex items-center mb-4">
        <span className="text-2xl mr-3">⚠️</span>
        <h3 className="text-xl font-semibold text-white">Threat Simulation Panel</h3>
      </div>
      
      <p className="text-gray-400 mb-6 text-sm">
        Simulate attacks on sensor readings to test anomaly detection system
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-gray-300 mb-2 text-sm font-semibold">Target Sensor</label>
          <select
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            disabled={attackActive}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-red-500 focus:outline-none disabled:opacity-50"
          >
            <option value="moisture">Soil Moisture</option>
            <option value="temperature">Soil Temperature</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-300 mb-2 text-sm font-semibold">
            Attack Intensity: {intensity > 0 ? '+' : ''}{intensity}
          </label>
          <input
            type="range"
            min="-30"
            max="30"
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
            disabled={attackActive}
            className="w-full disabled:opacity-50"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>-30</span>
            <span>0</span>
            <span>+30</span>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        {!attackActive ? (
          <button
            onClick={startAttack}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded transition"
          >
            🚨 Start Attack Simulation
          </button>
        ) : (
          <button
            onClick={stopAttack}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded transition"
          >
            ✓ Stop Attack Simulation
          </button>
        )}
      </div>


    </div>
  );
};

export default AttackSimulator;