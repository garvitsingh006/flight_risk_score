import React, { useState, useEffect } from 'react';
import { Plane, MapPin, Thermometer, Clock, TrendingUp, AlertTriangle } from 'lucide-react';

interface ModelInputs {
  StateOfOccurrence: string;
  Location: string;
  StateOfRegistry: string;
  Over2250: boolean;
  Over5700: boolean;
  ScheduledCommercial: string;  // e.g., "Yes" / "No"
  Helicopter: string;           // e.g., "Yes" / "No"
  Airplane: boolean;
  Engines: number;
  EngineType: string;
  Latitude: number;
  Longitude: number;
  temp_max: number;
  temp_min: number;
  precip: number;
  Altitude: number;
  Month: number;
  DayOfWeek: number;
  IsWeekend: number;
  Season: number;               // e.g., "Summer"
  PrecipFlag: number;
  ColdTemp: number;
  HotTemp: number;
  wind_avg: number;
  Windy: number;
  IsHelicopter: number;
  IsScheduled: number;
  EngineTypeEnc: string;        // original string, not encoded number
  Hour: number;
  IsNight: boolean;
  TempRange: number;
  Precip_Wind: number;
  Precip_Night: number;
  Precip_Helicopter: number;
  Precip_Altitude: number;
  Wind_Altitude: number;
  TempRange_Season: number;
}

function App() {
    const [inputs, setInputs] = useState<ModelInputs>({
        StateOfOccurrence: 'USA',
        Location: 'San Francisco , California',
        StateOfRegistry: 'CHN',
        Over2250: true,
        Over5700: true,
        ScheduledCommercial: 'Yes',
        Helicopter: 'Yes',
        Airplane: true,
        Engines: 2,
        EngineType: 'Jet',
        Latitude: 17.9139,
        Longitude: -87.9711,
        temp_max: 32.29,
        temp_min: 25.95,
        precip: 0.026,
        Altitude: 3,
        Month: 8,
        DayOfWeek: 5,
        IsWeekend: 1,
        Season: 3,
        PrecipFlag: 0,
        ColdTemp: 0,
        HotTemp: 0,
        wind_avg: 15.69,
        Windy: 0,
        IsHelicopter: 1,
        IsScheduled: 1,
        EngineTypeEnc: 'Jet',
        Hour: 0,
        IsNight: true,
        TempRange: 7,
        Precip_Wind: 0.4,
        Precip_Night: 0.026,
        Precip_Helicopter: 0.026,
        Precip_Altitude: 0.078,
        Wind_Altitude: 47.07,
        TempRange_Season: 1.04
    });


  const [prediction, setPrediction] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (key: keyof ModelInputs, value: string | number | boolean) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };


  const enrichedInputs = {
        ...inputs,
        TempRange: inputs.temp_max - inputs.temp_min,
        Precip_Wind: inputs.precip * inputs.wind_avg,
        Precip_Night: inputs.precip * (inputs.IsNight ? 1 : 0),
        Precip_Helicopter: inputs.precip * inputs.IsHelicopter,
        Precip_Altitude: inputs.precip * inputs.Altitude,
        Wind_Altitude: inputs.wind_avg * inputs.Altitude,
        TempRange_Season: inputs.TempRange * inputs.Season,
    };   



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(enrichedInputs),
      });

      if (!response.ok) {
        throw new Error('Failed to get prediction');
      }

      const data = await response.json();
      setPrediction(data.risk_percentage);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk: number) => {
    if (risk < 20) return 'text-green-600';
    if (risk < 50) return 'text-yellow-600';
    if (risk < 80) return 'text-orange-600';
    return 'text-red-600';
  };

  const getRiskLevel = (risk: number) => {
    if (risk < 20) return 'Low Risk';
    if (risk < 50) return 'Moderate Risk';
    if (risk < 80) return 'High Risk';
    return 'Critical Risk';
  };

  useEffect(() => {
  setInputs((prev) => ({
    ...prev,
    IsHelicopter: prev.Helicopter === "Yes" ? 1 : 0,
    IsScheduled: prev.ScheduledCommercial === "Yes" ? 1 : 0
  }));
}, [inputs.Helicopter, inputs.ScheduledCommercial]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-3">
            <Plane className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-black-900">Aircraft Risk Predictor</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Location Section */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Location & Geography</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State of Occurrence</label>
                    <input
                      type="text"
                      value={inputs.StateOfOccurrence}
                      onChange={(e) => handleInputChange('StateOfOccurrence', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., CA"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      value={inputs.Location}
                      onChange={(e) => handleInputChange('Location', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Los Angeles"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State of Registry</label>
                    <input
                      type="text"
                      value={inputs.StateOfRegistry}
                      onChange={(e) => handleInputChange('StateOfRegistry', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., CA"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
                    <input
                      type="number"
                      step="0.000001"
                      value={inputs.Latitude}
                      onChange={(e) => handleInputChange('Latitude', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
                    <input
                      type="number"
                      step="0.000001"
                      value={inputs.Longitude}
                      onChange={(e) => handleInputChange('Longitude', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Altitude (ft)</label>
                    <input
                      type="number"
                      value={inputs.Altitude}
                      onChange={(e) => handleInputChange('Altitude', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Aircraft Section */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <Plane className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Aircraft Specifications</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Over 2250 lbs</label>
                    <select
                      value={inputs.Over2250 ? 'true' : 'false'}
                      onChange={(e) => handleInputChange('Over2250', e.target.value === 'true')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="false">No</option>
                      <option value="true">Yes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Over 5700 lbs</label>
                    <select
                      value={inputs.Over5700? 'true' : 'false'}
                      onChange={(e) => handleInputChange('Over5700', e.target.value === 'true')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="false">No</option>
                      <option value="true">Yes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Scheduled Commercial</label>
                    <select
                        value={inputs.ScheduledCommercial}
                        onChange={(e) => handleInputChange('ScheduledCommercial', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Helicopter</label>
                    <select
                        value={inputs.Helicopter}
                        onChange={(e) => handleInputChange('Helicopter', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Airplane</label>
                    <select
                      value={inputs.Airplane ? 'true' : 'false'}
                      onChange={(e) => handleInputChange('Airplane', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="false">No</option>
                      <option value="true">Yes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Number of Engines</label>
                    <input
                      type="number"
                      min="1"
                      max="8"
                      value={inputs.Engines}
                      onChange={(e) => handleInputChange('Engines', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Engine Type</label>
                    <select
                      value={inputs.EngineType}
                      onChange={(e) => handleInputChange('EngineType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Turbopop">Turboprop</option>
                      <option value="Jet">Jet</option>
                      <option value="Piston">Piston</option>
                    </select>
                  </div>
                    <div>
                         <label className="block text-sm font-medium text-gray-700 mb-2">Engine Type Encoded</label>
                        <select
                        value={inputs.EngineTypeEnc}
                        onChange={(e) => handleInputChange('EngineTypeEnc', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                        <option value="Turbopop">Turbopop</option>
                        <option value="Jet">Jet</option>
                        <option value="Piston">Piston</option>
                        </select>
                    </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Is Helicopter</label>
                    <select
                      value={inputs.IsHelicopter}
                      onChange={(e) => handleInputChange('IsHelicopter', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={0}>No</option>
                      <option value={1}>Yes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Is Scheduled</label>
                    <select
                      value={inputs.IsScheduled}
                      onChange={(e) => handleInputChange('IsScheduled', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={0}>No</option>
                      <option value={1}>Yes</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Weather Section */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <Thermometer className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Weather Conditions</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Temperature (°C)</label>
                    <input
                      type="number"
                      value={inputs.temp_max}
                      onChange={(e) => handleInputChange('temp_max', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Min Temperature (°C)</label>
                    <input
                      type="number"
                      value={inputs.temp_min}
                      onChange={(e) => handleInputChange('temp_min', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Precipitation (in)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={inputs.precip}
                      onChange={(e) => handleInputChange('precip', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Average Wind (mph)</label>
                    <input
                      type="number"
                      value={inputs.wind_avg}
                      onChange={(e) => handleInputChange('wind_avg', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Precipitation Flag</label>
                    <select
                      value={inputs.PrecipFlag}
                      onChange={(e) => handleInputChange('PrecipFlag', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={0}>No</option>
                      <option value={1}>Yes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cold Temperature</label>
                    <select
                      value={inputs.ColdTemp}
                      onChange={(e) => handleInputChange('ColdTemp', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={0}>No</option>
                      <option value={1}>Yes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hot Temperature</label>
                    <select
                      value={inputs.HotTemp}
                      onChange={(e) => handleInputChange('HotTemp', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={0}>No</option>
                      <option value={1}>Yes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Windy</label>
                    <select
                      value={inputs.Windy}
                      onChange={(e) => handleInputChange('Windy', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={0}>No</option>
                      <option value={1}>Yes</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Time Section */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Time & Date</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Month (1-12)</label>
                    <input
                      type="number"
                      min="1"
                      max="12"
                      value={inputs.Month}
                      onChange={(e) => handleInputChange('Month', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Day of Week (0-6)</label>
                    <input
                      type="number"
                      min="0"
                      max="6"
                      value={inputs.DayOfWeek}
                      onChange={(e) => handleInputChange('DayOfWeek', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hour (0-23)</label>
                    <input
                      type="number"
                      min="0"
                      max="23"
                      value={inputs.Hour}
                      onChange={(e) => handleInputChange('Hour', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Is Weekend</label>
                    <select
                      value={inputs.IsWeekend}
                      onChange={(e) => handleInputChange('IsWeekend', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={0}>No</option>
                      <option value={1}>Yes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Season</label>
                    <select
                        value={inputs.Season}
                        onChange={(e) => handleInputChange('Season', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                        <option value={1}>Winter</option>
                        <option value={2}>Spring</option>
                        <option value={3}>Summer</option>
                        <option value={4}>Fall</option>
                    </select>

                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Is Night</label>
                    <select
                        value={inputs.IsNight ? 'true' : 'false'}
                        onChange={(e) => handleInputChange('IsNight', e.target.value === 'true')}
                        >
                        <option value="false">No</option>
                        <option value="true">Yes</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <TrendingUp className="w-5 h-5" />
                      <span>Predict Risk</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Risk Assessment</h3>
                
                {prediction !== null && (
                  <div className="text-center">
                    <div className="mb-6">
                      <div className={`text-6xl font-bold ${getRiskColor(prediction)} mb-2`}>
                        {prediction.toFixed(1)}%
                      </div>
                      <div className={`text-lg font-medium ${getRiskColor(prediction)}`}>
                        {getRiskLevel(prediction)}
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                        <div 
                          className={`h-3 rounded-full transition-all duration-500 ${
                            prediction < 20 ? 'bg-green-500' :
                            prediction < 50 ? 'bg-yellow-500' :
                            prediction < 80 ? 'bg-orange-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(prediction, 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>0%</span>
                        <span>50%</span>
                        <span>100%</span>
                      </div>
                    </div>

                    {prediction >= 50 && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                        <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-red-800">
                          <strong>High Risk Detected:</strong> Consider reviewing flight conditions and implementing additional safety measures.
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-red-800">
                      <strong>Error:</strong> {error}
                    </div>
                  </div>
                )}

                {prediction === null && !loading && !error && (
                  <div className="text-center text-gray-500">
                    <Plane className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Fill out the form and click "Predict Risk" to get your aircraft risk assessment.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;