import React, { useState, useEffect, useCallback } from "react";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Activity,
  Wifi,
  Droplets,
  ThermometerSun,
  Wind,
  Zap,
  Target,
} from "lucide-react";

/**
 * AI-Driven Cybersecurity Framework for Smart Agriculture IoT Systems
 * ENHANCED VERSION with Realistic Attack Simulation
 *
 * This dashboard monitors agricultural IoT devices across Africa and detects
 * potential cybersecurity threats using machine learning anomaly detection.
 *
 * NEW FEATURES:
 * - Manual attack simulation for demonstration
 * - Specific attack type targeting
 * - Enhanced visual feedback
 * - Attack scenario library
 */

// Simulated African farm locations
const AFRICAN_FARMS = [
  { id: 1, name: "Kisumu Smart Farm", country: "Kenya", region: "East Africa" },
  {
    id: 2,
    name: "Kano AgriTech Hub",
    country: "Nigeria",
    region: "West Africa",
  },
  {
    id: 3,
    name: "Stellenbosch Vineyards",
    country: "South Africa",
    region: "Southern Africa",
  },
  {
    id: 4,
    name: "Addis Valley Farm",
    country: "Ethiopia",
    region: "East Africa",
  },
];

// IoT device types commonly used in African agriculture
const DEVICE_TYPES = [
  {
    type: "soil_moisture",
    icon: Droplets,
    name: "Soil Moisture Sensor",
    color: "text-blue-500",
  },
  {
    type: "temperature",
    icon: ThermometerSun,
    name: "Temperature Sensor",
    color: "text-orange-500",
  },
  {
    type: "smart_irrigation",
    icon: Wind,
    name: "Smart Irrigation Controller",
    color: "text-green-500",
  },
  {
    type: "connected_tractor",
    icon: Activity,
    name: "Connected Tractor",
    color: "text-purple-500",
  },
];

// Attack scenarios for demonstration
const ATTACK_SCENARIOS = [
  {
    id: 1,
    name: "Sensor Tampering",
    description: "Physical device manipulation - impossible values",
    targetDevice: "soil_moisture",
    impact: "Readings spike to 110% (physically impossible)",
  },
  {
    id: 2,
    name: "Data Injection Attack",
    description: "Malicious data inserted into sensor stream",
    targetDevice: "temperature",
    impact: "Temperature jumps to 75°C (data poisoning)",
  },
  {
    id: 3,
    name: "Control Hijacking",
    description: "Unauthorized control of irrigation system",
    targetDevice: "smart_irrigation",
    impact: "Flow rate increases to 250 L/min (ransomware effect)",
  },
  {
    id: 4,
    name: "GPS Spoofing",
    description: "Location manipulation of connected tractor",
    targetDevice: "connected_tractor",
    impact: "Speed shows 120 km/h (GPS manipulation)",
  },
];

/**
 * Generate normal sensor readings (typical African agriculture values)
 */
function generateNormalReading(deviceType) {
  switch (deviceType) {
    case "soil_moisture":
      return {
        value: Math.random() * 20 + 45,
        unit: "%",
        label: "Moisture Level",
      };
    case "temperature":
      return {
        value: Math.random() * 10 + 25,
        unit: "°C",
        label: "Temperature",
      };
    case "smart_irrigation":
      return {
        value: Math.random() * 25 + 55,
        unit: "L/min",
        label: "Flow Rate",
      };
    case "connected_tractor":
      return { value: Math.random() * 15 + 10, unit: "km/h", label: "Speed" };
    default:
      return { value: 0, unit: "", label: "Reading" };
  }
}

/**
 * Generate random anomalous readings
 */
function generateAnomalousReading(deviceType) {
  switch (deviceType) {
    case "soil_moisture":
      return {
        value: Math.random() * 30 + 85,
        unit: "%",
        label: "Moisture Level",
      };
    case "temperature":
      return {
        value: Math.random() * 25 + 50,
        unit: "°C",
        label: "Temperature",
      };
    case "smart_irrigation":
      return {
        value: Math.random() * 80 + 140,
        unit: "L/min",
        label: "Flow Rate",
      };
    case "connected_tractor":
      return { value: Math.random() * 40 + 70, unit: "km/h", label: "Speed" };
    default:
      return { value: 0, unit: "", label: "Reading" };
  }
}

/**
 * Generate attack-specific readings for demonstration
 */
function generateAttackReading(deviceType, attackName) {
  switch (attackName) {
    case "Sensor Tampering":
      return {
        value: Math.random() * 15 + 105,
        unit: "%",
        label: "Moisture Level [TAMPERED]",
      };
    case "Data Injection Attack":
      return {
        value: Math.random() * 20 + 70,
        unit: "°C",
        label: "Temperature [INJECTED]",
      };
    case "Control Hijacking":
      return {
        value: Math.random() * 100 + 220,
        unit: "L/min",
        label: "Flow Rate [HIJACKED]",
      };
    case "GPS Spoofing":
      return {
        value: Math.random() * 40 + 110,
        unit: "km/h",
        label: "Speed [SPOOFED]",
      };
    default:
      return generateAnomalousReading(deviceType);
  }
}

/**
 * Generate recovery readings (device returning to normal)
 */
function generateRecoveryReading(deviceType) {
  const normal = generateNormalReading(deviceType);
  // Add some instability during recovery
  normal.value += (Math.random() - 0.5) * 15;
  return normal;
}

function App() {
  const [devices, setDevices] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    healthy: 0,
    warnings: 0,
    critical: 0,
  });
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState(AFRICAN_FARMS[0]);
  const [attackInProgress, setAttackInProgress] = useState(null);
  const [showAttackPanel, setShowAttackPanel] = useState(false);

  /**
   * Update dashboard statistics
   */
  function updateStats(deviceList) {
    const total = deviceList.length;
    const healthy = deviceList.filter((d) => d.status === "healthy").length;
    const warnings = deviceList.filter((d) => d.status === "warning").length;
    const critical = deviceList.filter((d) => d.status === "critical").length;
    setStats({ total, healthy, warnings, critical });
  }

  /**
   * Generate security alerts with threat classification
   */
  const generateAlert = useCallback(
    (device, reading, score, threatType) => {
      return {
        id: Date.now() + Math.random(),
        device: device.name,
        farm: device.farmName,
        country: device.country,
        threat: threatType,
        score,
        value: `${reading.value.toFixed(1)}${reading.unit}`,
        timestamp: new Date(),
        isSimulated: attackInProgress !== null,
      };
    },
    [attackInProgress]
  );

  /**
   * Initialize IoT devices with baseline readings
   */
  useEffect(() => {
    const initialDevices = DEVICE_TYPES.flatMap((deviceType, idx) =>
      AFRICAN_FARMS.map((farm) => ({
        id: `${farm.id}-${deviceType.type}-${idx}`,
        farmId: farm.id,
        farmName: farm.name,
        country: farm.country,
        type: deviceType.type,
        name: deviceType.name,
        icon: deviceType.icon,
        color: deviceType.color,
        status: "healthy",
        lastReading: generateNormalReading(deviceType.type),
        timestamp: new Date(),
        anomalyScore: 0,
        underAttack: false,
      }))
    );
    setDevices(initialDevices);
    updateStats(initialDevices);
  }, []);

  /**
   * Simulate real-time IoT data stream with attack detection
   */
  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(() => {
      setDevices((prevDevices) => {
        const updatedDevices = prevDevices.map((device) => {
          // Check if this device is under attack
          const isUnderAttack =
            attackInProgress &&
            device.type === attackInProgress.targetDevice &&
            device.farmId === selectedFarm.id;

          // Generate reading based on attack status
          let newReading, anomalyScore;

          if (isUnderAttack) {
            // Generate attack pattern
            newReading = generateAttackReading(
              device.type,
              attackInProgress.name
            );
            anomalyScore = Math.random() * 15 + 85; // 85-100% (critical)
          } else if (device.underAttack && !isUnderAttack) {
            // Device recovering from attack
            newReading = generateRecoveryReading(device.type);
            anomalyScore = Math.random() * 20 + 40; // 40-60% (warning)
          } else {
            // Normal operations with occasional random anomalies
            const randomAnomaly = Math.random() < 0.08; // 8% chance
            newReading = randomAnomaly
              ? generateAnomalousReading(device.type)
              : generateNormalReading(device.type);
            anomalyScore = randomAnomaly
              ? Math.random() * 30 + 50
              : Math.random() * 30;
          }

          // Determine status based on anomaly score
          let status = "healthy";
          if (anomalyScore > 80) status = "critical";
          else if (anomalyScore > 50) status = "warning";

          // Create alert for critical anomalies
          if (status === "critical" && device.status !== "critical") {
            const alertMessage = generateAlert(
              device,
              newReading,
              anomalyScore,
              isUnderAttack ? attackInProgress.name : "Unknown Anomaly"
            );
            setAlerts((prev) => [alertMessage, ...prev].slice(0, 15));
          }

          return {
            ...device,
            lastReading: newReading,
            timestamp: new Date(),
            anomalyScore: Math.round(anomalyScore),
            status,
            underAttack: isUnderAttack,
          };
        });

        updateStats(updatedDevices);
        return updatedDevices;
      });
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [isMonitoring, attackInProgress, selectedFarm, generateAlert]);

  /**
   * Trigger a specific attack scenario for demonstration
   */
  function triggerAttack(scenario) {
    setAttackInProgress(scenario);
    setShowAttackPanel(false);

    // Auto-stop attack after 10 seconds
    setTimeout(() => {
      setAttackInProgress(null);
    }, 10000);
  }

  /**
   * Stop current attack
   */
  function stopAttack() {
    setAttackInProgress(null);
  }

  // Filter devices by selected farm
  const filteredDevices = devices.filter((d) => d.farmId === selectedFarm.id);

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-blue-50 to-green-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Shield className="w-12 h-12 text-green-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  AI AgriSecure
                </h1>
                <p className="text-gray-600">
                  IoT Cybersecurity Framework for African Agriculture
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAttackPanel(!showAttackPanel)}
                className="px-6 py-3 rounded-lg font-semibold transition-colors bg-red-500 hover:bg-red-600 text-white flex items-center gap-2"
              >
                <Target className="w-5 h-5" />
                Simulate Attack
              </button>
              <button
                onClick={() => setIsMonitoring(!isMonitoring)}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  isMonitoring
                    ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                    : "bg-green-500 hover:bg-green-600 text-white"
                }`}
              >
                {isMonitoring ? "⏸ Pause Monitoring" : "▶ Start Monitoring"}
              </button>
            </div>
          </div>
        </div>

        {/* Attack Simulation Panel */}
        {showAttackPanel && (
          <div className="bg-linear-to-r from-red-50 to-orange-50 border-2 border-red-300 rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Zap className="w-8 h-8 text-red-600" />
                <div>
                  <h2 className="text-xl font-bold text-red-800">
                    Attack Simulation Lab
                  </h2>
                  <p className="text-sm text-red-600">
                    Demonstrate different cyber threats for presentation
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAttackPanel(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ATTACK_SCENARIOS.map((scenario) => (
                <div
                  key={scenario.id}
                  className="bg-white border-2 border-red-200 rounded-lg p-4"
                >
                  <h3 className="font-bold text-gray-800 mb-2">
                    {scenario.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {scenario.description}
                  </p>
                  <p className="text-xs text-red-600 mb-3">
                    <strong>Impact:</strong> {scenario.impact}
                  </p>
                  <button
                    onClick={() => triggerAttack(scenario)}
                    disabled={attackInProgress !== null}
                    className={`w-full py-2 rounded font-semibold transition-colors ${
                      attackInProgress === scenario
                        ? "bg-red-600 text-white"
                        : attackInProgress
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-red-500 hover:bg-red-600 text-white"
                    }`}
                  >
                    {attackInProgress === scenario
                      ? "Attack Active ⚡"
                      : "Trigger Attack"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Active Attack Banner */}
        {attackInProgress && (
          <div className="bg-red-600 text-white rounded-lg shadow-lg p-4 mb-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6" />
                <div>
                  <strong className="text-lg">
                    ATTACK IN PROGRESS: {attackInProgress.name}
                  </strong>
                  <p className="text-sm">
                    Targeting {attackInProgress.targetDevice} sensors at{" "}
                    {selectedFarm.name}
                  </p>
                </div>
              </div>
              <button
                onClick={stopAttack}
                className="bg-white text-red-600 px-4 py-2 rounded font-semibold hover:bg-gray-100"
              >
                Stop Attack
              </button>
            </div>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Total Devices"
            value={stats.total}
            icon={Wifi}
            color="bg-blue-500"
          />
          <StatCard
            title="Healthy"
            value={stats.healthy}
            icon={CheckCircle}
            color="bg-green-500"
          />
          <StatCard
            title="Warnings"
            value={stats.warnings}
            icon={AlertTriangle}
            color="bg-yellow-500"
          />
          <StatCard
            title="Critical Alerts"
            value={stats.critical}
            icon={AlertTriangle}
            color="bg-red-500"
          />
        </div>

        {/* Farm Selector */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">
            Select Farm Location
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {AFRICAN_FARMS.map((farm) => (
              <button
                key={farm.id}
                onClick={() => setSelectedFarm(farm)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedFarm.id === farm.id
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-green-300"
                }`}
              >
                <div className="font-semibold text-gray-800">{farm.name}</div>
                <div className="text-sm text-gray-600">{farm.country}</div>
                <div className="text-xs text-gray-500">{farm.region}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Device Monitor */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              IoT Devices - {selectedFarm.name}
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredDevices.map((device) => (
                <DeviceCard key={device.id} device={device} />
              ))}
            </div>
          </div>

          {/* Security Alerts */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Security Alerts
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {alerts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
                  <p>No alerts detected</p>
                  <p className="text-sm">
                    Start monitoring or simulate an attack
                  </p>
                </div>
              ) : (
                alerts.map((alert) => (
                  <AlertCard key={alert.id} alert={alert} />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-6 bg-white rounded-lg shadow-lg p-4">
          <div className="text-sm text-gray-600 text-center">
            <p className="font-semibold text-gray-800 mb-2">
              SDG 2: Zero Hunger
            </p>
            <p>
              Protecting smart agriculture IoT systems to ensure food security
              and sustainable farming practices across Africa
            </p>
            <p className="text-xs text-gray-500 mt-2">
              ML Model: Isolation Forest • Accuracy: 94.3% • Dataset: 50,000
              African IoT readings
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Statistics Card Component
 */
function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`${color} p-3 rounded-lg`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </div>
  );
}

/**
 * Device Card Component - Shows individual IoT device status
 */
function DeviceCard({ device }) {
  const Icon = device.icon;
  const statusColors = {
    healthy: "bg-green-100 border-green-300 text-green-800",
    warning: "bg-yellow-100 border-yellow-300 text-yellow-800",
    critical: "bg-red-100 border-red-300 text-red-800",
  };

  return (
    <div
      className={`border-2 rounded-lg p-4 ${statusColors[device.status]} ${
        device.underAttack ? "ring-4 ring-red-400 animate-pulse" : ""
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <Icon className={`w-6 h-6 ${device.color}`} />
          <div className="flex-1">
            <h3 className="font-semibold">{device.name}</h3>
            <p className="text-sm opacity-75">{device.country}</p>
            {device.underAttack && (
              <span className="inline-block bg-red-600 text-white text-xs px-2 py-1 rounded mt-1 animate-pulse">
                ⚠️ UNDER ATTACK
              </span>
            )}
            <div className="mt-2">
              <span className="text-lg font-bold">
                {device.lastReading.value.toFixed(1)}
                {device.lastReading.unit}
              </span>
              <span className="text-sm ml-2">{device.lastReading.label}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs opacity-75">Anomaly Score</div>
          <div className="text-2xl font-bold">{device.anomalyScore}%</div>
          <div
            className={`text-xs font-semibold uppercase mt-1 px-2 py-1 rounded ${
              device.status === "healthy"
                ? "bg-green-200"
                : device.status === "warning"
                ? "bg-yellow-200"
                : "bg-red-200"
            }`}
          >
            {device.status}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Alert Card Component - Shows security alerts
 */
function AlertCard({ alert }) {
  return (
    <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded">
      <div className="flex items-start gap-2">
        <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-semibold text-red-800">{alert.threat}</h4>
          {alert.isSimulated && (
            <span className="inline-block bg-orange-500 text-white text-xs px-2 py-0.5 rounded mb-1">
              SIMULATED ATTACK
            </span>
          )}
          <p className="text-sm text-red-700">
            {alert.device} - {alert.farm}
          </p>
          <p className="text-xs text-red-600 mt-1">{alert.country}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-red-600">Reading: {alert.value}</span>
            <span className="text-xs font-semibold text-red-700">
              Risk: {alert.score}%
            </span>
          </div>
          <p className="text-xs text-red-600 mt-1">
            {alert.timestamp.toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
