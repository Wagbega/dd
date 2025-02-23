import React, { useState } from 'react';
import { X, Calculator, Zap, Battery, Sun, Info } from 'lucide-react';
import { supabase } from './lib/supabase';
import { toast } from 'react-hot-toast';

interface PowerCalculatorProps {
    isOpen: boolean;
    onClose: () => void;
}

interface Appliance {
    name: string;
    watts: number;
    hours: number;
}

const commonAppliances = [
    { name: 'Refrigerator', watts: 150 },
    { name: 'LED TV', watts: 100 },
    { name: 'Air Conditioner (1.5 ton)', watts: 1500 },
    { name: 'Ceiling Fan', watts: 75 },
    { name: 'Microwave', watts: 1000 },
    { name: 'Desktop Computer', watts: 200 },
    { name: 'Washing Machine', watts: 500 },
    { name: 'Water Heater', watts: 3000 }
];

const PowerCalculator: React.FC<PowerCalculatorProps> = ({ isOpen, onClose }) => {
    const [appliances, setAppliances] = useState<Appliance[]>([]);
    const [newAppliance, setNewAppliance] = useState<Appliance>({
        name: '',
        watts: 0,
        hours: 1
    });
    const [sunHours, setSunHours] = useState(5);
    const [backupDays, setBackupDays] = useState(1);
    const [efficiency, setEfficiency] = useState(0.85);
    const [isCalculating, setIsCalculating] = useState(false);

    const addAppliance = () => {
        if (!newAppliance.name || newAppliance.watts <= 0 || newAppliance.hours <= 0) {
            toast.error('Please fill in all appliance details correctly');
            return;
        }
        setAppliances([...appliances, newAppliance]);
        setNewAppliance({ name: '', watts: 0, hours: 1 });
    };

    const removeAppliance = (index: number) => {
        setAppliances(appliances.filter((_, i) => i !== index));
    };

    const addCommonAppliance = (appliance: { name: string; watts: number }) => {
        setAppliances([...appliances, { ...appliance, hours: 1 }]);
    };

    const calculatePowerNeeds = async () => {
        if (appliances.length === 0) {
            toast.error('Please add at least one appliance');
            return;
        }

        setIsCalculating(true);

        try {
            // Calculate daily energy usage in watt-hours
            const dailyUsage = appliances.reduce((total, app) => total + (app.watts * app.hours), 0);

            // Calculate required solar system size (kW)
            const solarSize = (dailyUsage / (sunHours * efficiency)) / 1000;

            // Calculate required battery size (kWh)
            const batterySize = (dailyUsage * backupDays) / (efficiency * 1000);

            // Calculate required inverter size (kW) with 20% overhead
            const inverterSize = (Math.max(...appliances.map(a => a.watts)) * 1.2) / 1000;

            // Save calculation to database
            const { error } = await supabase
                .from('stats')
                .insert([{
                    daily_usage: dailyUsage,
                    sun_hours: sunHours,
                    backup_days: backupDays,
                    efficiency: efficiency,
                    solar_size: solarSize,
                    battery_size: batterySize,
                    inverter_size: inverterSize
                }]);

            if (error) throw error;

            toast.success('Power needs calculated successfully!', {
                duration: 5000,
                icon: '⚡'
            });

            // Show results
            toast((t) => (
                <div className="space-y-2">
                    <p className="font-semibold">Recommended System Specifications:</p>
                    <ul className="text-sm space-y-1">
                        <li>• Solar Panels: {solarSize.toFixed(2)} kW</li>
                        <li>• Battery Bank: {batterySize.toFixed(2)} kWh</li>
                        <li>• Inverter: {inverterSize.toFixed(2)} kW</li>
                    </ul>
                </div>
            ), {
                duration: 8000,
                icon: '📊'
            });

        } catch (error) {
            console.error('Error calculating power needs:', error);
            toast.error('Failed to calculate power needs');
        } finally {
            setIsCalculating(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white rounded-t-2xl z-10">
                    <div className="flex items-center gap-2">
                        <Calculator className="w-6 h-6 text-blue-600" />
                        <h3 className="text-2xl font-bold text-gray-900">Power Needs Calculator</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 space-y-8">
                    {/* Quick Add Section */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Zap className="w-5 h-5 text-blue-600" />
                            Quick Add Common Appliances
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {commonAppliances.map((app) => (
                                <button
                                    key={app.name}
                                    onClick={() => addCommonAppliance(app)}
                                    className="p-3 text-sm border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                                >
                                    <div className="font-medium">{app.name}</div>
                                    <div className="text-gray-600">{app.watts}W</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Custom Appliance Form */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold flex items-center gap-2">
                            <Zap className="w-5 h-5 text-blue-600" />
                            Add Custom Appliance
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input
                                type="text"
                                value={newAppliance.name}
                                onChange={(e) => setNewAppliance({ ...newAppliance, name: e.target.value })}
                                placeholder="Appliance name"
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <input
                                type="number"
                                value={newAppliance.watts || ''}
                                onChange={(e) => setNewAppliance({ ...newAppliance, watts: parseInt(e.target.value) || 0 })}
                                placeholder="Power (watts)"
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <input
                                type="number"
                                value={newAppliance.hours || ''}
                                onChange={(e) => setNewAppliance({ ...newAppliance, hours: parseInt(e.target.value) || 0 })}
                                placeholder="Hours per day"
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <button
                            onClick={addAppliance}
                            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Add Appliance
                        </button>
                    </div>

                    {/* Appliances List */}
                    {appliances.length > 0 && (
                        <div>
                            <h4 className="text-lg font-semibold mb-4">Added Appliances</h4>
                            <div className="space-y-2">
                                {appliances.map((app, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                    >
                                        <div>
                                            <span className="font-medium">{app.name}</span>
                                            <span className="text-gray-600 text-sm ml-2">
                                                ({app.watts}W × {app.hours}h = {app.watts * app.hours}Wh/day)
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => removeAppliance(index)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* System Parameters */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold flex items-center gap-2">
                            <Sun className="w-5 h-5 text-blue-600" />
                            System Parameters
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Sun Hours per Day
                                </label>
                                <input
                                    type="number"
                                    value={sunHours}
                                    onChange={(e) => setSunHours(parseFloat(e.target.value) || 5)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Backup Days
                                </label>
                                <input
                                    type="number"
                                    value={backupDays}
                                    onChange={(e) => setBackupDays(parseFloat(e.target.value) || 1)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    System Efficiency
                                </label>
                                <input
                                    type="number"
                                    value={efficiency}
                                    onChange={(e) => setEfficiency(parseFloat(e.target.value) || 0.85)}
                                    step="0.01"
                                    min="0"
                                    max="1"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-gray-200 sticky bottom-0 bg-white rounded-b-2xl">
                    <button
                        onClick={calculatePowerNeeds}
                        disabled={isCalculating || appliances.length === 0}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg shadow-md transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isCalculating ? (
                            <>Calculating...</>
                        ) : (
                            <>Calculate Power Needs</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PowerCalculator;