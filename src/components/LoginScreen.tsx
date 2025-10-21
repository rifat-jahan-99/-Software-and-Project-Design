import React, { useState } from 'react';
import { Eye, EyeOff, Phone, Mail, Lock, User, MapPin, Heart, Shield, Stethoscope } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { User as UserType } from '../App';

interface LoginScreenProps {
  onLogin: (user: UserType) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [userType, setUserType] = useState<'doctor' | 'patient' | null>(null);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    specialty: '', // For doctors
    consultationFee: '', // For doctors
    hospital: '', // For doctors
    location: '' // For both doctors and patients
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!isLoginMode && !formData.name.trim()) {
      newErrors.name = 'নাম প্রয়োজন - Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'ইমেইল প্রয়োজন - Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'সঠিক ইমেইল দিন - Valid email required';
    }

    if (!isLoginMode && !formData.phone.trim()) {
      newErrors.phone = 'ফোন নম্বর প্রয়োজন - Phone number required';
    } else if (!isLoginMode && !/^(\+880|880|0)?1[3-9]\d{8}$/.test(formData.phone)) {
      newErrors.phone = 'সঠিক বাংলাদেশি নম্বর দিন - Valid Bangladesh number required';
    }

    if (!formData.password) {
      newErrors.password = 'পাসওয়ার্ড প্রয়োজন - Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষর - Password must be at least 6 characters';
    }

    if (!isLoginMode && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'পাসওয়ার্ড মিলছে না - Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (isLoginMode) {
        // Login logic
        if (userType === 'doctor') {
          const response = await fetch('http://localhost:5000/api/doctors/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: formData.email,
              password: formData.password,
            }),
          });

          const data = await response.json();

          if (response.ok) {
            const userData: UserType = {
              id: data.doctor._id,
              name: data.doctor.name,
              email: data.doctor.email,
              phone: data.doctor.phone,
              isFirstTime: false,
              userType: 'doctor',
              location: data.doctor.location,
              isAvailable: data.doctor.isAvailable,
              consultationFee: data.doctor.consultationFee,
              specialty: data.doctor.specialty,
              hospital: data.doctor.hospital
            };
            onLogin(userData);
          } else {
            setErrors({ general: data.message || 'Login failed' });
          }
        } else {
          // Patient login (simulated for now)
          const userData: UserType = {
            id: Math.random().toString(36).substr(2, 9),
            name: formData.email.split('@')[0],
            email: formData.email,
            phone: '+880-1711-123456',
            isFirstTime: false,
            userType: 'patient',
            location: 'Dhaka',
            preferredPaymentAmount: 0
          };
          onLogin(userData);
        }
      } else {
        // Registration logic
        if (userType === 'doctor') {
          const response = await fetch('http://localhost:5000/api/doctors/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: formData.name,
              email: formData.email,
              password: formData.password,
              phone: formData.phone,
              specialty: formData.specialty,
              hospital: formData.hospital,
              location: formData.location,
              experience: 0,
              consultationFee: parseInt(formData.consultationFee) || 500,
              about: '',
              qualifications: [],
              languages: ['Bengali', 'English']
            }),
          });

          const data = await response.json();

          if (response.ok) {
            const userData: UserType = {
              id: data.doctor._id,
              name: data.doctor.name,
              email: data.doctor.email,
              phone: data.doctor.phone,
              isFirstTime: true,
              userType: 'doctor',
              location: data.doctor.location,
              isAvailable: data.doctor.isAvailable,
              consultationFee: data.doctor.consultationFee,
              specialty: data.doctor.specialty,
              hospital: data.doctor.hospital
            };
            onLogin(userData);
          } else {
            setErrors({ general: data.message || 'Registration failed' });
          }
        } else {
          // Patient registration (simulated for now)
          const userData: UserType = {
            id: Math.random().toString(36).substr(2, 9),
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            isFirstTime: true,
            userType: 'patient',
            location: formData.location || 'Dhaka',
            preferredPaymentAmount: 0
          };
          onLogin(userData);
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (type: 'doctor' | 'patient') => {
    const demoUser: UserType = type === 'doctor' ? {
      id: 'demo-doctor',
      name: 'ডাঃ সালমা খাতুন',
      email: 'dr.salma@medidoor.bd',
      phone: '+880-1711-123456',
      isFirstTime: false,
      userType: 'doctor',
      location: 'Dhaka',
      isAvailable: true,
      consultationFee: 800,
      specialty: 'Cardiologist',
      hospital: 'Square Hospital'
    } : {
      id: 'demo-patient',
      name: 'রহিম আহমেদ',
      email: 'rahim@medidoor.bd',
      phone: '+880-1711-123456',
      isFirstTime: false,
      userType: 'patient',
      location: 'Dhaka',
      preferredPaymentAmount: 0
    };
    onLogin(demoUser);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 medical-gradient-bangladesh rounded-full flex items-center justify-center shadow-2xl">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <Stethoscope className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">MediDoor</h1>
            <p className="text-gray-600">স্বাস্থ্যসেবা আপনার হাতের মুঠোয়</p>
            <p className="text-sm text-gray-500">Healthcare at Your Fingertips</p>
          </div>
        </div>

        {/* Bangladesh flag colors accent */}
        <div className="flex justify-center space-x-2">
          <div className="w-16 h-1 bg-green-600 rounded"></div>
          <div className="w-16 h-1 bg-red-500 rounded"></div>
        </div>

        {/* User Type Selection (if not yet selected) */}
        {!userType && (
          <Card className="p-6 bg-white rounded-xl shadow-xl">
            <h2 className="text-center mb-4 text-gray-800">Select User Type</h2>
            <p className="text-center text-sm text-gray-600 mb-6">আপনি কে? - Who are you?</p>
            <div className="space-y-3">
              <button
                onClick={() => setUserType('doctor')}
                className="w-full p-4 rounded-xl border-2 border-blue-200 hover:border-blue-500 hover:bg-blue-50 transition-all group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 medical-gradient-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Stethoscope className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="font-bold text-gray-800">ডাক্তার - Doctor</h3>
                    <p className="text-sm text-gray-600">Manage availability & fees</p>
                  </div>
                </div>
              </button>
              <button
                onClick={() => setUserType('patient')}
                className="w-full p-4 rounded-xl border-2 border-green-200 hover:border-green-500 hover:bg-green-50 transition-all group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 medical-gradient-success rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="font-bold text-gray-800">রোগী - Patient</h3>
                    <p className="text-sm text-gray-600">Find doctors & book appointments</p>
                  </div>
                </div>
              </button>
            </div>
          </Card>
        )}

        {/* Login/Register Form (only show when user type is selected) */}
        {userType && (
        <Card className="p-6 bg-white rounded-xl shadow-xl">
          {/* Back button to change user type */}
          <button
            onClick={() => setUserType(null)}
            className="text-sm text-blue-600 hover:text-blue-800 mb-4 flex items-center"
          >
            ← Change user type
          </button>
          <div className="space-y-4">
            {/* Tab Headers */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setIsLoginMode(true)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  isLoginMode
                    ? 'medical-gradient-primary text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                লগইন - Login
              </button>
              <button
                onClick={() => setIsLoginMode(false)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  !isLoginMode
                    ? 'medical-gradient-primary text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                রেজিস্টার - Register
              </button>
            </div>

            {errors.general && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name field (only for registration) */}
              {!isLoginMode && (
                <div className="space-y-2">
                  <Label className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span>নাম - Full Name</span>
                  </Label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="আপনার পূর্ণ নাম লিখুন - Enter your full name"
                    className={`${errors.name ? 'border-red-500' : ''}`}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600">{errors.name}</p>
                  )}
                </div>
              )}

              {/* Email field */}
              <div className="space-y-2">
                <Label className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span>ইমেইল - Email</span>
                </Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your@email.com"
                  className={`${errors.email ? 'border-red-500' : ''}`}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Phone field (only for registration) */}
              {!isLoginMode && (
                <div className="space-y-2">
                  <Label className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>ফোন নম্বর - Phone Number</span>
                  </Label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+880-1711-123456"
                    className={`${errors.phone ? 'border-red-500' : ''}`}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>
              )}

              {/* Location field (for both doctors and patients during registration) */}
              {!isLoginMode && (
                <div className="space-y-2">
                  <Label className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span>অবস্থান - Location</span>
                  </Label>
                  <select
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Location - অবস্থান নির্বাচন করুন</option>
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
              )}

              {/* Doctor-specific fields (only for doctor registration) */}
              {!isLoginMode && userType === 'doctor' && (
                <>
                  <div className="space-y-2">
                    <Label className="flex items-center space-x-2">
                      <Stethoscope className="w-4 h-4 text-gray-500" />
                      <span>বিশেষত্ব - Specialty</span>
                    </Label>
                    <Input
                      type="text"
                      value={formData.specialty}
                      onChange={(e) => handleInputChange('specialty', e.target.value)}
                      placeholder="e.g., Cardiologist, General Physician"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center space-x-2">
                      <Heart className="w-4 h-4 text-gray-500" />
                      <span>হাসপাতাল - Hospital/Clinic</span>
                    </Label>
                    <Input
                      type="text"
                      value={formData.hospital}
                      onChange={(e) => handleInputChange('hospital', e.target.value)}
                      placeholder="e.g., Square Hospital, DMCH"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center space-x-2">
                      <span>৳</span>
                      <span>পরামর্শ ফি - Consultation Fee (৳)</span>
                    </Label>
                    <Input
                      type="number"
                      value={formData.consultationFee}
                      onChange={(e) => handleInputChange('consultationFee', e.target.value)}
                      placeholder="500"
                      min="0"
                    />
                  </div>
                </>
              )}

              {/* Password field */}
              <div className="space-y-2">
                <Label className="flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-gray-500" />
                  <span>পাসওয়ার্ড - Password</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="••••••••"
                    className={`pr-10 ${errors.password ? 'border-red-500' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password field (only for registration) */}
              {!isLoginMode && (
                <div className="space-y-2">
                  <Label className="flex items-center space-x-2">
                    <Lock className="w-4 h-4 text-gray-500" />
                    <span>পাসওয়ার্ড নিশ্চিত করুন - Confirm Password</span>
                  </Label>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="••••••••"
                    className={`${errors.confirmPassword ? 'border-red-500' : ''}`}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full medical-gradient-primary text-white py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>{isLoginMode ? 'Logging in...' : 'Creating Account...'}</span>
                  </div>
                ) : (
                  <span>
                    {isLoginMode ? 'লগইন করুন - Login' : 'একাউন্ট তৈরি করুন - Create Account'}
                  </span>
                )}
              </Button>
            </form>

            {/* Forgot Password (only in login mode) */}
            {isLoginMode && (
              <div className="text-center">
                <button className="text-sm text-blue-600 hover:text-blue-800">
                  পাসওয়ার্ড ভুলে গেছেন? - Forgot Password?
                </button>
              </div>
            )}

            <Separator className="my-4" />

            {/* Demo Login */}
            <div className="space-y-2">
              <p className="text-sm text-gray-600 text-center mb-2">অথবা ডেমো দিয়ে শুরু করুন - Or try demo:</p>
              <Button
                onClick={() => handleDemoLogin(userType)}
                variant="outline"
                className={`w-full ${
                  userType === 'doctor' 
                    ? 'border-blue-300 text-blue-700 hover:bg-blue-50' 
                    : 'border-green-300 text-green-700 hover:bg-green-50'
                }`}
              >
                <Shield className="w-4 h-4 mr-2" />
                {userType === 'doctor' 
                  ? 'ডাক্তার ডেমো - Doctor Demo' 
                  : 'রোগী ডেমো - Patient Demo'}
              </Button>
            </div>
          </div>
        </Card>
        )}

        {/* Features Preview */}
        <Card className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
          <h3 className="font-bold text-gray-800 mb-3 text-center">🇧🇩 MediDoor Bangladesh Features</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center space-x-2">
              <Heart className="w-4 h-4 text-red-500" />
              <span className="text-sm text-gray-700">500+ Doctors</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-green-500" />
              <span className="text-sm text-gray-700">24/7 Emergency</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-700">All Bangladesh</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-purple-500" />
              <span className="text-sm text-gray-700">Video Consult</span>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>By continuing, you agree to our Terms & Privacy Policy</p>
          <p className="mt-1">🇧🇩 Proudly serving Bangladesh</p>
        </div>
      </div>
    </div>
  );
}