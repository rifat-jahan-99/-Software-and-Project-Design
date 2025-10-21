import React, { useState } from 'react';
import { MapPin, DollarSign, Save, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { User as UserType } from '../App';

interface PatientPaymentSettingsProps {
  user: UserType;
  onUpdateProfile: (updates: Partial<UserType>) => void;
}

export default function PatientPaymentSettings({ user, onUpdateProfile }: PatientPaymentSettingsProps) {
  const [location, setLocation] = useState(user.location || 'Dhaka');
  const [paymentAmount, setPaymentAmount] = useState(user.preferredPaymentAmount?.toString() || '0');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const locationFeeRanges: Record<string, { min: number; max: number; average: number }> = {
    'Dhaka': { min: 500, max: 2000, average: 800 },
    'Chittagong': { min: 400, max: 1500, average: 700 },
    'Sylhet': { min: 400, max: 1200, average: 650 },
    'Rajshahi': { min: 300, max: 1000, average: 600 },
    'Khulna': { min: 300, max: 1000, average: 600 },
    'Barisal': { min: 300, max: 900, average: 550 },
    'Rangpur': { min: 300, max: 900, average: 550 },
    'Mymensingh': { min: 300, max: 1000, average: 600 }
  };

  const currentRange = locationFeeRanges[location] || locationFeeRanges['Dhaka'];

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      onUpdateProfile({
        location,
        preferredPaymentAmount: parseInt(paymentAmount) || 0
      });
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  return (
    <Card className="p-6 bg-white rounded-xl shadow-lg">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-800">সেটিংস - Settings</h3>
            <p className="text-sm text-gray-600">Set your location to find nearby doctors and view local fees</p>
          </div>
          {showSuccess && (
            <div className="flex items-center space-x-2 bg-green-50 text-green-700 px-4 py-2 rounded-full">
              <CheckCircle className="w-5 h-5" />
              <span>Saved!</span>
            </div>
          )}
        </div>

        {/* Location Selection */}
        <div className="space-y-3">
          <Label className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span>আপনার অবস্থান - Your Location</span>
          </Label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Dhaka">ঢাকা - Dhaka</option>
            <option value="Chittagong">চট্টগ্রাম - Chittagong</option>
            <option value="Sylhet">সিলেট - Sylhet</option>
            <option value="Rajshahi">রাজশাহী - Rajshahi</option>
            <option value="Khulna">খুলনা - Khulna</option>
            <option value="Barisal">বরিশাল - Barisal</option>
            <option value="Rangpur">রংপুর - Rangpur</option>
            <option value="Mymensingh">ময়মনসিংহ - Mymensingh</option>
          </select>
        </div>

        {/* Location-based Fee Information */}
        <div className="bg-gradient-to-br from-blue-50 to-green-50 p-4 rounded-lg space-y-2">
          <h4 className="font-bold text-gray-800">📍 {location} - Typical Consultation Fees:</h4>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="bg-white p-2 rounded text-center">
              <p className="text-gray-600">Minimum</p>
              <p className="font-bold text-blue-700">৳{currentRange.min}</p>
            </div>
            <div className="bg-white p-2 rounded text-center">
              <p className="text-gray-600">Average</p>
              <p className="font-bold text-green-700">৳{currentRange.average}</p>
            </div>
            <div className="bg-white p-2 rounded text-center">
              <p className="text-gray-600">Maximum</p>
              <p className="font-bold text-purple-700">৳{currentRange.max}</p>
            </div>
          </div>
        </div>

        {/* Preferred Payment Amount */}
        <div className="space-y-3">
          <Label className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-gray-500" />
            <span>পছন্দের পেমেন্ট পরিমাণ - Preferred Payment Budget (৳)</span>
          </Label>
          <div className="flex items-center space-x-3">
            <span className="text-2xl font-bold text-gray-800">৳</span>
            <Input
              type="number"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              placeholder={currentRange.average.toString()}
              min="0"
              className="text-xl"
            />
          </div>
          <p className="text-sm text-gray-600">
            Set your budget to help filter doctors within your price range. Set to 0 to see all doctors.
          </p>
        </div>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full medical-gradient-primary text-white py-3"
        >
          {isSaving ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Saving...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <Save className="w-5 h-5" />
              <span>সংরক্ষণ করুন - Save Settings</span>
            </div>
          )}
        </Button>

        {/* Info Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-bold text-blue-800 mb-2">💡 How it works:</h4>
          <ul className="space-y-1 text-sm text-blue-700">
            <li>• Your location helps us show doctors near you</li>
            <li>• Payment budget filters doctors by consultation fee</li>
            <li>• Prices vary by doctor experience and specialty</li>
            <li>• Emergency services may have different pricing</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}
