import React, { useState } from 'react';
import { ArrowLeft, User, Mail, Phone, MapPin, Stethoscope, Heart, Shield, Award, Clock, Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

interface DoctorRegistrationScreenProps {
  onBack: () => void;
  onRegistrationSuccess: (doctor: any) => void;
}

export default function DoctorRegistrationScreen({ onBack, onRegistrationSuccess }: DoctorRegistrationScreenProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    specialty: '',
    hospital: '',
    location: '',
    experience: '',
    consultationFee: '',
    about: '',
    qualifications: '',
    languages: ['Bengali', 'English']
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'নাম প্রয়োজন - Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'ইমেইল প্রয়োজন - Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'সঠিক ইমেইল দিন - Valid email required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'ফোন নম্বর প্রয়োজন - Phone number required';
    } else if (!/^(\+880|880|0)?1[3-9]\d{8}$/.test(formData.phone)) {
      newErrors.phone = 'সঠিক বাংলাদেশি নম্বর দিন - Valid Bangladesh number required';
    }

    if (!formData.password) {
      newErrors.password = 'পাসওয়ার্ড প্রয়োজন - Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষর - Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'পাসওয়ার্ড মিলছে না - Passwords do not match';
    }

    if (!formData.specialty.trim()) {
      newErrors.specialty = 'বিশেষত্ব প্রয়োজন - Specialty is required';
    }

    if (!formData.hospital.trim()) {
      newErrors.hospital = 'হাসপাতালের নাম প্রয়োজন - Hospital name is required';
    }

    if (!formData.location) {
      newErrors.location = 'অবস্থান নির্বাচন করুন - Please select location';
    }

    if (!formData.consultationFee || parseInt(formData.consultationFee) < 0) {
      newErrors.consultationFee = 'সঠিক পরামর্শ ফি দিন - Enter valid consultation fee';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
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
          experience: parseInt(formData.experience) || 0,
          consultationFee: parseInt(formData.consultationFee),
          about: formData.about,
          qualifications: formData.qualifications ? formData.qualifications.split(',').map(q => q.trim()) : [],
          languages: formData.languages
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onRegistrationSuccess(data.doctor);
      } else {
        setErrors({ general: data.message || 'Registration failed' });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="medical-gradient-primary text-white p-6">
        <div className="flex items-center space-x-4 mb-4">
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-white hover:bg-white/20 p-2 rounded-full"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Doctor Registration</h1>
            <p className="text-blue-100">Join MediDoor as a healthcare provider</p>
          </div>
        </div>
      </div>

      <div className="p-6 -mt-4">
        <Card className="p-6 bg-white rounded-xl shadow-lg max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <div className="w-16 h-16 medical-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Stethoscope className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Register as Doctor</h2>
            <p className="text-gray-600">Fill in your professional details to start serving patients</p>
          </div>

          {errors.general && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-500" />
                Basic Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span>Full Name *</span>
                  </Label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Dr. Your Name"
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span>Email *</span>
                  </Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="doctor@email.com"
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>Phone Number *</span>
                  </Label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+880-1711-123456"
                    className={errors.phone ? 'border-red-500' : ''}
                  />
                  {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span>Location *</span>
                  </Label>
                  <select
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.location ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Select Location</option>
                    <option value="Dhaka">Dhaka</option>
                    <option value="Chittagong">Chittagong</option>
                    <option value="Sylhet">Sylhet</option>
                    <option value="Rajshahi">Rajshahi</option>
                    <option value="Khulna">Khulna</option>
                    <option value="Barisal">Barisal</option>
                    <option value="Rangpur">Rangpur</option>
                    <option value="Mymensingh">Mymensingh</option>
                  </select>
                  {errors.location && <p className="text-sm text-red-600">{errors.location}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-gray-500" />
                    <span>Password *</span>
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
                  {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-gray-500" />
                    <span>Confirm Password *</span>
                  </Label>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="••••••••"
                    className={errors.confirmPassword ? 'border-red-500' : ''}
                  />
                  {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword}</p>}
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <Stethoscope className="w-5 h-5 mr-2 text-green-500" />
                Professional Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center space-x-2">
                    <Stethoscope className="w-4 h-4 text-gray-500" />
                    <span>Specialty *</span>
                  </Label>
                  <Input
                    type="text"
                    value={formData.specialty}
                    onChange={(e) => handleInputChange('specialty', e.target.value)}
                    placeholder="e.g., Cardiologist, General Physician"
                    className={errors.specialty ? 'border-red-500' : ''}
                  />
                  {errors.specialty && <p className="text-sm text-red-600">{errors.specialty}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center space-x-2">
                    <Heart className="w-4 h-4 text-gray-500" />
                    <span>Hospital/Clinic *</span>
                  </Label>
                  <Input
                    type="text"
                    value={formData.hospital}
                    onChange={(e) => handleInputChange('hospital', e.target.value)}
                    placeholder="e.g., Square Hospital, DMCH"
                    className={errors.hospital ? 'border-red-500' : ''}
                  />
                  {errors.hospital && <p className="text-sm text-red-600">{errors.hospital}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center space-x-2">
                    <Award className="w-4 h-4 text-gray-500" />
                    <span>Experience (Years)</span>
                  </Label>
                  <Input
                    type="number"
                    value={formData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    placeholder="5"
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center space-x-2">
                    <span>৳</span>
                    <span>Consultation Fee (৳) *</span>
                  </Label>
                  <Input
                    type="number"
                    value={formData.consultationFee}
                    onChange={(e) => handleInputChange('consultationFee', e.target.value)}
                    placeholder="500"
                    min="0"
                    className={errors.consultationFee ? 'border-red-500' : ''}
                  />
                  {errors.consultationFee && <p className="text-sm text-red-600">{errors.consultationFee}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-gray-500" />
                  <span>Qualifications</span>
                </Label>
                <Input
                  type="text"
                  value={formData.qualifications}
                  onChange={(e) => handleInputChange('qualifications', e.target.value)}
                  placeholder="MBBS, MD, FCPS (comma separated)"
                />
                <p className="text-xs text-gray-500">Separate multiple qualifications with commas</p>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center space-x-2">
                  <span>About Yourself</span>
                </Label>
                <Textarea
                  value={formData.about}
                  onChange={(e) => handleInputChange('about', e.target.value)}
                  placeholder="Tell patients about your experience, approach to treatment, and what makes you special..."
                  rows={4}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full medical-gradient-primary text-white py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  <span>Register as Doctor</span>
                )}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                onClick={onBack}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Login here
              </button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
