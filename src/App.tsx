import React, { useState } from 'react';
import LoginScreen from './components/LoginScreen';
import HomeScreen from './components/HomeScreen';
import DoctorSelectionScreen from './components/DoctorSelectionScreen';
import EmergencyDoctorSelectionScreen from './components/EmergencyDoctorSelectionScreen';
import DoctorProfileScreen from './components/DoctorProfileScreen';
import OnboardingScreen from './components/OnboardingScreen';
import DoctorDashboard from './components/DoctorDashboard';
import PatientPaymentSettings from './components/PatientPaymentSettings';
import DoctorRegistrationScreen from './components/DoctorRegistrationScreen';

export type Screen = 'login' | 'onboarding' | 'home' | 'doctors' | 'emergency' | 'profile' | 'doctorDashboard' | 'patientSettings' | 'doctorRegistration';

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  location: string;
  experience: number;
  rating: number;
  reviews: number;
  availability: string;
  consultationFee: number;
  phone: string;
  image: string;
  languages: string[];
  qualifications: string[];
  about: string;
  isEmergencyAvailable?: boolean;
  treatableSymptoms: string[];
  treatableConditions: string[];
  specializations: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  isFirstTime: boolean;
  userType: 'doctor' | 'patient';
  location: string; // Location for both doctors and patients
  // Doctor-specific fields
  isAvailable?: boolean;
  consultationFee?: number;
  specialty?: string;
  hospital?: string; // Hospital name for doctors
  // Patient-specific fields
  preferredPaymentAmount?: number;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
    // If it's a first-time user, show onboarding, otherwise go to appropriate home
    if (userData.isFirstTime) {
      setCurrentScreen('onboarding');
    } else {
      // Doctors go to doctor dashboard, patients go to regular home
      if (userData.userType === 'doctor') {
        setCurrentScreen('doctorDashboard');
      } else {
        setCurrentScreen('home');
      }
    }
  };

  const handleUpdateProfile = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setCurrentScreen('login');
  };

  const navigateToScreen = (screen: Screen, doctor?: Doctor) => {
    setCurrentScreen(screen);
    if (doctor) {
      setSelectedDoctor(doctor);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    navigateToScreen('doctors');
  };

  const renderScreen = () => {
    if (!isAuthenticated) {
      return <LoginScreen onLogin={handleLogin} />;
    }

    switch (currentScreen) {
      case 'onboarding':
        return (
          <OnboardingScreen 
            onComplete={() => {
              if (user?.userType === 'doctor') {
                navigateToScreen('doctorDashboard');
              } else {
                navigateToScreen('home');
              }
            }} 
          />
        );
      case 'doctorDashboard':
        return (
          <DoctorDashboard 
            user={user!}
            onLogout={handleLogout}
            onUpdateProfile={handleUpdateProfile}
          />
        );
      case 'patientSettings':
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              <button
                onClick={() => navigateToScreen('home')}
                className="text-blue-600 hover:text-blue-800 flex items-center mb-4"
              >
                ← Back to Home
              </button>
              <PatientPaymentSettings 
                user={user!}
                onUpdateProfile={handleUpdateProfile}
              />
            </div>
          </div>
        );
      case 'home':
        return (
          <HomeScreen 
            onNavigateToDoctors={() => navigateToScreen('doctors')}
            onNavigateToEmergency={() => navigateToScreen('emergency')}
            onSearch={handleSearch}
            user={user}
            onLogout={handleLogout}
            onNavigateToSettings={() => navigateToScreen('patientSettings')}
          />
        );
      case 'doctors':
        return (
          <DoctorSelectionScreen 
            onBack={() => navigateToScreen('home')}
            onSelectDoctor={(doctor) => navigateToScreen('profile', doctor)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            userLocation={user?.location}
          />
        );
      case 'emergency':
        return (
          <EmergencyDoctorSelectionScreen 
            onBack={() => navigateToScreen('home')}
            onSelectDoctor={(doctor) => navigateToScreen('profile', doctor)}
            userLocation={user?.location}
          />
        );
      case 'profile':
        return (
          <DoctorProfileScreen 
            doctor={selectedDoctor!}
            onBack={() => navigateToScreen('doctors')}
          />
        );
      case 'doctorRegistration':
        return (
          <DoctorRegistrationScreen 
            onBack={() => navigateToScreen('login')}
            onRegistrationSuccess={(doctor) => {
              // Convert doctor data to User format and login
              const userData: UserType = {
                id: doctor._id,
                name: doctor.name,
                email: doctor.email,
                phone: doctor.phone,
                isFirstTime: true,
                userType: 'doctor',
                location: doctor.location,
                isAvailable: doctor.isAvailable,
                consultationFee: doctor.consultationFee,
                specialty: doctor.specialty,
                hospital: doctor.hospital
              };
              handleLogin(userData);
            }}
          />
        );
      default:
        return <LoginScreen onLogin={handleLogin} />;
    }
  };

  return (
    <div className="size-full bg-gradient-to-br from-blue-50 via-white to-green-50 min-h-screen relative">
      {/* MediDoor Branding - Top Right (only show when authenticated and not on doctor dashboard) */}
      {isAuthenticated && currentScreen !== 'doctorDashboard' && (
        <div className="absolute top-4 right-6 z-50">
          <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-white/20">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 medical-gradient-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="font-bold text-gray-800">MediDoor</span>
            </div>
          </div>
        </div>
      )}
      {renderScreen()}
    </div>
  );
}