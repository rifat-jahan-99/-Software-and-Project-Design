import React, { useState } from 'react';
import { ArrowLeft, Phone, MapPin, Clock, Star, AlertTriangle, Activity } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Doctor } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface EmergencyDoctorSelectionScreenProps {
  onBack: () => void;
  onSelectDoctor: (doctor: Doctor) => void;
  userLocation?: string;
}

export default function EmergencyDoctorSelectionScreen({ onBack, onSelectDoctor, userLocation }: EmergencyDoctorSelectionScreenProps) {
  const [urgencyLevel, setUrgencyLevel] = useState<string>('high');

  // Helper function to extract city from location
  const getCityFromLocation = (location: string): string => {
    const cities = ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 'Rangpur', 'Mymensingh'];
    for (const city of cities) {
      if (location.includes(city)) return city;
    }
    return 'Unknown';
  };

  // Helper function to check if location matches
  const isNearbyLocation = (doctorLocation: string): boolean => {
    if (!userLocation) return false;
    const doctorCity = getCityFromLocation(doctorLocation);
    return doctorCity === userLocation;
  };

  const emergencyDoctors: Doctor[] = [
    {
      id: 'e1',
      name: 'ডা. আব্দুল করিম',
      specialty: 'Emergency Medicine',
      hospital: 'Dhaka Medical College Emergency',
      location: 'Ramna, Dhaka - 2km away',
      experience: 12,
      rating: 4.9,
      reviews: 156,
      availability: 'Available Now',
      consultationFee: 2000,
      phone: '+880-1711-999001',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400',
      languages: ['Bengali', 'English'],
      qualifications: ['MBBS', 'FCPS (Emergency Medicine)', 'Advanced Trauma Life Support'],
      about: 'Emergency medicine specialist available 24/7 for critical cases.',
      isEmergencyAvailable: true
    },
    {
      id: 'e2',
      name: 'ডা. সালমা আক্তার',
      specialty: 'Critical Care',
      hospital: 'Square Hospital ICU',
      location: 'Panthapath, Dhaka - 3km away',
      experience: 15,
      rating: 4.8,
      reviews: 203,
      availability: 'Available Now',
      consultationFee: 2500,
      phone: '+880-1712-999002',
      image: 'https://images.unsplash.com/photo-1594824388853-d0d9ffeb0e80?w=400',
      languages: ['Bengali', 'English'],
      qualifications: ['MBBS', 'MD (Critical Care)', 'Fellowship in Intensive Care'],
      about: 'ICU specialist for critical and life-threatening conditions.',
      isEmergencyAvailable: true
    },
    {
      id: 'e3',
      name: 'ডা. রফিকুল ইসলাম',
      specialty: 'Cardiothoracic Surgery',
      hospital: 'National Heart Foundation',
      location: 'Mirpur, Dhaka - 5km away',
      experience: 18,
      rating: 4.9,
      reviews: 89,
      availability: 'Available in 15 mins',
      consultationFee: 3000,
      phone: '+880-1713-999003',
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400',
      languages: ['Bengali', 'English'],
      qualifications: ['MBBS', 'FCPS (Surgery)', 'Fellowship in Cardiac Surgery'],
      about: 'Heart surgeon for emergency cardiac interventions.',
      isEmergencyAvailable: true
    },
    {
      id: 'e4',
      name: 'ডা. নাজমা খাতুন',
      specialty: 'Pediatric Emergency',
      hospital: 'Bangladesh Shishu Hospital',
      location: 'Sher-e-Bangla Nagar, Dhaka - 4km away',
      experience: 10,
      rating: 4.7,
      reviews: 124,
      availability: 'Available Now',
      consultationFee: 1800,
      phone: '+880-1714-999004',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
      languages: ['Bengali', 'English'],
      qualifications: ['MBBS', 'DCH', 'FCPS (Pediatrics)'],
      about: 'Pediatric emergency specialist for children\'s critical care.',
      isEmergencyAvailable: true
    }
  ];

  const urgencyLevels = [
    { 
      value: 'critical', 
      label: 'Critical', 
      color: 'bg-red-600', 
      emoji: '🚨', 
      description: 'Life-threatening emergency' 
    },
    { 
      value: 'high', 
      label: 'High', 
      color: 'bg-orange-500', 
      emoji: '⚡', 
      description: 'Urgent medical attention needed' 
    },
    { 
      value: 'moderate', 
      label: 'Moderate', 
      color: 'bg-yellow-500', 
      emoji: '⚠️', 
      description: 'Prompt medical care required' 
    }
  ];

  const filteredDoctors = emergencyDoctors.filter(doctor => {
    if (urgencyLevel === 'critical') return doctor.availability === 'Available Now';
    return true;
  }).sort((a, b) => {
    // Sort by location proximity first (nearby doctors come first)
    const aIsNearby = isNearbyLocation(a.location);
    const bIsNearby = isNearbyLocation(b.location);
    if (aIsNearby && !bIsNearby) return -1;
    if (!aIsNearby && bIsNearby) return 1;
    // Then by availability (Available Now comes first)
    if (a.availability === 'Available Now' && b.availability !== 'Available Now') return -1;
    if (a.availability !== 'Available Now' && b.availability === 'Available Now') return 1;
    // Finally by rating
    return b.rating - a.rating;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      {/* Emergency Header */}
      <div className="medical-gradient-emergency text-white p-6">
        <div className="flex items-center space-x-4 mb-4">
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-white hover:bg-white/20 p-2 rounded-full"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-6 h-6 pulse-animation" />
              <h1 className="text-xl font-bold">Emergency Doctors</h1>
            </div>
            <p className="text-red-100">24/7 Emergency Medical Services in Bangladesh</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">999</div>
            <div className="text-xs text-red-100">National Emergency</div>
          </div>
        </div>

        {/* Quick Emergency Actions */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <Button className="bg-white/20 hover:bg-white/30 text-white border-none p-3 rounded-lg">
            <Phone className="w-4 h-4 mr-1" />
            Call 999
          </Button>
          <Button className="bg-white/20 hover:bg-white/30 text-white border-none p-3 rounded-lg">
            <Activity className="w-4 h-4 mr-1" />
            Ambulance
          </Button>
          <Button className="bg-white/20 hover:bg-white/30 text-white border-none p-3 rounded-lg">
            <MapPin className="w-4 h-4 mr-1" />
            Nearest ER
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-6 -mt-4">
        {/* Urgency Level Selector */}
        <Card className="p-4 bg-white rounded-xl shadow-lg">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
            Select Emergency Level
          </h3>
          <div className="space-y-2">
            {urgencyLevels.map((level) => (
              <div
                key={level.value}
                onClick={() => setUrgencyLevel(level.value)}
                className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  urgencyLevel === level.value
                    ? `${level.color} text-white transform scale-105`
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{level.emoji}</span>
                    <div>
                      <div className="font-bold">{level.label} Priority</div>
                      <div className="text-sm opacity-90">{level.description}</div>
                    </div>
                  </div>
                  {urgencyLevel === level.value && (
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-current rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Emergency Doctors */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Available Emergency Doctors</h2>
            <Badge className="bg-red-500 text-white">
              {filteredDoctors.length} doctors online
            </Badge>
          </div>

          {filteredDoctors.map((doctor) => (
            <Card
              key={doctor.id}
              className="p-4 cursor-pointer hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] bg-white rounded-xl border-l-4 border-red-500"
              onClick={() => onSelectDoctor(doctor)}
            >
              <div className="flex space-x-4">
                <div className="relative">
                  <ImageWithFallback
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                  <div className="absolute -top-1 -right-1 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center pulse-animation">
                    <Activity className="w-4 h-4 text-white" />
                  </div>
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-gray-800">{doctor.name}</h3>
                      <p className="text-sm text-red-600 font-medium">{doctor.specialty}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-bold text-gray-800">{doctor.rating}</span>
                      </div>
                      <Badge className="bg-green-500 text-white text-xs mt-1">
                        {doctor.availability}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4 text-red-500" />
                      <span>{doctor.location}</span>
                    </div>
                    {isNearbyLocation(doctor.location) && (
                      <Badge className="bg-green-500 text-white text-xs">
                        📍 Nearby
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-blue-500 text-white text-xs">
                        {doctor.experience} years
                      </Badge>
                      <span className="text-sm text-gray-500">Emergency Specialist</span>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-red-600">৳{doctor.consultationFee}</p>
                      <p className="text-xs text-gray-500">Emergency Fee</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex space-x-1">
                      {doctor.languages.map((language, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {language}
                        </Badge>
                      ))}
                    </div>
                    <Button className="medical-gradient-emergency text-white border-none px-4 py-1">
                      <Phone className="w-3 h-3 mr-1" />
                      Call Now
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Emergency Hotlines */}
        <Card className="p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-200">
          <h3 className="font-bold text-red-800 mb-3">🚨 Bangladesh Emergency Hotlines</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center justify-between p-2 bg-white rounded-lg">
              <span className="text-sm">National Emergency</span>
              <Badge className="bg-red-500 text-white">999</Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-white rounded-lg">
              <span className="text-sm">Fire Service</span>
              <Badge className="bg-orange-500 text-white">199</Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-white rounded-lg">
              <span className="text-sm">Ambulance</span>
              <Badge className="bg-green-500 text-white">999</Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-white rounded-lg">
              <span className="text-sm">Police</span>
              <Badge className="bg-blue-500 text-white">999</Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}