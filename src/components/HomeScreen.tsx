import React, { useState } from 'react';
import { Search, Phone, Clock, MapPin, Star, Users, Shield, Heart, Stethoscope, LogOut, User, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { User as UserType } from '../App';

interface HomeScreenProps {
  onNavigateToDoctors: () => void;
  onNavigateToEmergency: () => void;
  onSearch: (query: string) => void;
  user?: UserType | null;
  onLogout?: () => void;
  onNavigateToSettings?: () => void;
}

export default function HomeScreen({ onNavigateToDoctors, onNavigateToEmergency, onSearch, user, onLogout, onNavigateToSettings }: HomeScreenProps) {
  const [searchValue, setSearchValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const symptomSuggestions = [
    {
      symptom: "বুকে ব্যথা",
      englishSymptom: "chest pain",
      specialty: "Cardiology",
      urgency: "high",
      icon: "❤️"
    },
    {
      symptom: "জ্বর",
      englishSymptom: "fever",
      specialty: "General Medicine",
      urgency: "medium",
      icon: "🌡️"
    },
    {
      symptom: "মাথা ব্যথা",
      englishSymptom: "headache", 
      specialty: "Neurology",
      urgency: "medium",
      icon: "🧠"
    },
    {
      symptom: "পেট ব্যথা",
      englishSymptom: "stomach pain",
      specialty: "Gastroenterology",
      urgency: "medium",
      icon: "🫃"
    },
    {
      symptom: "শ্বাসকষ্ট",
      englishSymptom: "breathing difficulty",
      specialty: "Pulmonology",
      urgency: "high",
      icon: "🫁"
    },
    {
      symptom: "ত্বকের সমস্যা",
      englishSymptom: "skin problems",
      specialty: "Dermatology",
      urgency: "low",
      icon: "✨"
    },
    {
      symptom: "চোখের সমস্যা",
      englishSymptom: "eye problems",
      specialty: "Ophthalmology",
      urgency: "medium",
      icon: "👁️"
    },
    {
      symptom: "শিশুর জ্বর",
      englishSymptom: "child fever",
      specialty: "Pediatrics",
      urgency: "high",
      icon: "👶"
    }
  ];

  const quickActions = [
    {
      title: "জেনারেল মেডিসিন",
      subtitle: "General Medicine",
      icon: "👨‍⚕️",
      color: "bg-blue-500",
      count: "150+ ডাক্তার",
      commonSymptoms: ["জ্বর", "কাশি", "সর্দি"]
    },
    {
      title: "শিশু বিশেষজ্ঞ",
      subtitle: "Pediatrics",
      icon: "👶",
      color: "bg-pink-500",
      count: "80+ ডাক্তার",
      commonSymptoms: ["শিশুর জ্বর", "টিকা", "বৃদ্ধি"]
    },
    {
      title: "হৃদরোগ বিশেষজ্ঞ",
      subtitle: "Cardiology", 
      icon: "❤️",
      color: "bg-red-500",
      count: "65+ ডাক্তার",
      commonSymptoms: ["বুকে ব্যথা", "হৃদস্পন্দন", "উচ্চ রক্তচাপ"]
    },
    {
      title: "গাইনি বিশেষজ্ঞ",
      subtitle: "Gynecology",
      icon: "👩‍⚕️",
      color: "bg-purple-500",
      count: "90+ ডাক্তার",
      commonSymptoms: ["পেটে ব্যথা", "অনিয়মিত মাসিক", "গর্ভকাল"]
    }
  ];

  const emergencyServices = [
    {
      title: "Emergency Ambulance",
      subtitle: "999 - National Emergency",
      icon: "🚑",
      number: "999"
    },
    {
      title: "Fire Service",
      subtitle: "Fire & Emergency",
      icon: "🚒", 
      number: "199"
    },
    {
      title: "Police Emergency",
      subtitle: "Bangladesh Police",
      icon: "🚔",
      number: "999"
    }
  ];

  const handleSearchInput = (value: string) => {
    setSearchValue(value);
    setShowSuggestions(value.length > 1);
  };

  const handleSearchSubmit = () => {
    if (searchValue.trim()) {
      onSearch(searchValue);
    }
  };

  const handleSuggestionClick = (suggestion: any) => {
    setSearchValue(`${suggestion.symptom} - ${suggestion.englishSymptom}`);
    setShowSuggestions(false);
    onSearch(`${suggestion.symptom} - ${suggestion.englishSymptom}`);
  };

  const filteredSuggestions = symptomSuggestions.filter(suggestion => 
    suggestion.symptom.toLowerCase().includes(searchValue.toLowerCase()) ||
    suggestion.englishSymptom.toLowerCase().includes(searchValue.toLowerCase()) ||
    suggestion.specialty.toLowerCase().includes(searchValue.toLowerCase())
  );

  const getUrgencyColor = (urgency: string) => {
    switch(urgency) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'সুপ্রভাত - Good Morning';
    if (hour < 17) return 'শুভ বিকাল - Good Afternoon';
    return 'শুভ সন্ধ্যা - Good Evening';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header with Bangladesh colors and User Info */}
      <div className="medical-gradient-bangladesh text-white p-6 pb-8 pt-16">
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <Heart className="w-6 h-6 text-white pulse-animation" />
              <h1 className="text-2xl font-bold">MediDoor Bangladesh</h1>
            </div>
            {user && (
              <div className="text-blue-100">
                <p className="text-sm">{getGreeting()}</p>
                <p className="font-medium">{user.name}</p>
              </div>
            )}
            <p className="text-blue-100 text-sm">স্বাস্থ্যসেবা আপনার হাতের মুঠোয়</p>
          </div>

          {/* User Profile Menu */}
          {user && onLogout && (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <User className="w-6 h-6 text-white" />
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 top-14 w-64 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 medical-gradient-primary rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">{user.name}</h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <p className="text-xs text-gray-500">{user.phone}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    {user.userType === 'patient' && onNavigateToSettings && (
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onNavigateToSettings();
                        }}
                        className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg text-blue-600 mb-1"
                      >
                        <Settings className="w-4 h-4" />
                        <span>পেমেন্ট সেটিংস - Payment Settings</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onLogout();
                      }}
                      className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg text-red-600"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>লগআউট - Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Emergency Button */}
        <Button
          onClick={onNavigateToEmergency}
          className="w-full medical-gradient-emergency text-white py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 pulse-animation"
        >
          <Phone className="w-5 h-5 mr-3" />
          <span className="text-lg">🚨 Call Doctor Now - জরুরি ডাক্তার</span>
        </Button>
      </div>

      <div className="p-6 space-y-6 -mt-4">
        {/* Enhanced Search Bar with Symptom Intelligence */}
        <Card className="p-4 shadow-lg bg-white rounded-xl relative">
          <div className="flex items-center space-x-3">
            <Stethoscope className="w-5 h-5 text-blue-500" />
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => handleSearchInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit()}
                placeholder="Search by symptoms: জ্বর, বুকে ব্যথা, headache, chest pain..."
                className="w-full bg-transparent outline-none text-gray-700 placeholder:text-gray-400"
              />
              {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="absolute top-8 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                  {filteredSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{suggestion.icon}</span>
                          <div>
                            <div className="font-medium text-gray-800">
                              {suggestion.symptom} - {suggestion.englishSymptom}
                            </div>
                            <div className="text-sm text-gray-500">
                              See {suggestion.specialty} specialists
                            </div>
                          </div>
                        </div>
                        <Badge className={`text-xs ${getUrgencyColor(suggestion.urgency)} border`}>
                          {suggestion.urgency}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Button onClick={handleSearchSubmit} className="medical-gradient-primary text-white px-4">
              <Search className="w-4 h-4" />
            </Button>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            💡 Type your symptoms in Bengali or English to find the right specialist
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 text-center bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-xl">
            <Users className="w-6 h-6 mx-auto mb-2" />
            <div className="text-2xl font-bold">500+</div>
            <div className="text-xs text-blue-100">Verified Doctors</div>
          </Card>
          <Card className="p-4 text-center bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-xl">
            <Shield className="w-6 h-6 mx-auto mb-2" />
            <div className="text-2xl font-bold">24/7</div>
            <div className="text-xs text-green-100">Emergency Care</div>
          </Card>
          <Card className="p-4 text-center bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl">
            <Star className="w-6 h-6 mx-auto mb-2" />
            <div className="text-2xl font-bold">4.8★</div>
            <div className="text-xs text-purple-100">Average Rating</div>
          </Card>
        </div>

        {/* Common Symptoms Quick Access */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">🩺 Common Symptoms</h2>
          <div className="grid grid-cols-2 gap-3">
            {symptomSuggestions.slice(0, 6).map((symptom, index) => (
              <Card
                key={index}
                className="p-3 cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:scale-105 bg-white rounded-xl border-l-4 border-blue-200"
                onClick={() => handleSuggestionClick(symptom)}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{symptom.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 text-sm">{symptom.symptom}</h3>
                    <p className="text-xs text-gray-500">{symptom.englishSymptom}</p>
                    <Badge className={`text-xs mt-1 ${getUrgencyColor(symptom.urgency)} border`}>
                      {symptom.specialty}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Specialties */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">বিশেষজ্ঞ বিভাগ - Specialties</h2>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <Card
                key={index}
                className="p-4 cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:scale-105 bg-white rounded-xl"
                onClick={onNavigateToDoctors}
              >
                <div className={`w-12 h-12 ${action.color} rounded-full flex items-center justify-center mb-3 mx-auto`}>
                  <span className="text-2xl">{action.icon}</span>
                </div>
                <div className="text-center">
                  <h3 className="font-bold text-gray-800 text-sm">{action.title}</h3>
                  <p className="text-xs text-gray-500">{action.subtitle}</p>
                  <p className="text-xs text-blue-600 mt-1">{action.count}</p>
                  <div className="flex flex-wrap justify-center gap-1 mt-2">
                    {action.commonSymptoms.map((symptom, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {symptom}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Emergency Services */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">🚨 Emergency Services</h2>
          <div className="space-y-3">
            {emergencyServices.map((service, index) => (
              <Card key={index} className="p-4 bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{service.icon}</span>
                    <div>
                      <h3 className="font-bold text-gray-800">{service.title}</h3>
                      <p className="text-sm text-gray-600">{service.subtitle}</p>
                    </div>
                  </div>
                  <Button variant="outline" className="medical-gradient-emergency text-white border-none">
                    {service.number}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Location Services */}
        <Card className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
          <div className="flex items-center space-x-3">
            <MapPin className="w-5 h-5 text-green-600" />
            <div>
              <h3 className="font-bold text-gray-800">Available in Bangladesh</h3>
              <p className="text-sm text-gray-600">Dhaka • Chittagong • Sylhet • Rajshahi • Khulna</p>
            </div>
          </div>
        </Card>

        {/* Welcome Message for New Users */}
        {user?.isFirstTime && (
          <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl">
            <div className="text-center space-y-2">
              <div className="text-3xl">🎉</div>
              <h3 className="font-bold text-gray-800">স্বাগতম - Welcome to MediDoor!</h3>
              <p className="text-sm text-gray-600">
                Start your healthcare journey with us. Find doctors, book appointments, and get the care you need.
              </p>
            </div>
          </Card>
        )}
      </div>

      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </div>
  );
}