import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, MapPin, Clock, Phone, Filter, Search, Stethoscope } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Doctor } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface DoctorSelectionScreenProps {
  onBack: () => void;
  onSelectDoctor: (doctor: Doctor) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  userLocation?: string;
}

export default function DoctorSelectionScreen({ onBack, onSelectDoctor, searchQuery = '', onSearchChange, userLocation }: DoctorSelectionScreenProps) {
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [searchValue, setSearchValue] = useState(searchQuery);
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setSearchValue(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    fetchDoctors();
  }, [selectedSpecialty, selectedLocation, searchValue]);

  const fetchDoctors = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const params = new URLSearchParams();
      if (selectedSpecialty !== 'all') params.append('specialty', selectedSpecialty);
      if (selectedLocation !== 'all') params.append('location', selectedLocation);
      if (searchValue.trim()) params.append('search', searchValue.trim());

      const response = await fetch(`http://localhost:5000/api/doctors?${params.toString()}`);
      const data = await response.json();

      if (response.ok) {
        // Transform backend doctor data to match frontend Doctor interface
        const transformedDoctors: Doctor[] = data.map((doctor: any) => ({
          id: doctor._id,
          name: doctor.name,
          specialty: doctor.specialty,
          hospital: doctor.hospital,
          location: doctor.location,
          experience: doctor.experience || 0,
          rating: doctor.rating || 5.0,
          reviews: doctor.reviews || 0,
          availability: doctor.availability || "Available Now",
          consultationFee: doctor.consultationFee || 500,
          phone: doctor.phone,
          image: doctor.image || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400',
          languages: doctor.languages || ['Bengali', 'English'],
          qualifications: doctor.qualifications || [],
          about: doctor.about || '',
          isEmergencyAvailable: doctor.isEmergencyAvailable || false,
          treatableSymptoms: doctor.treatableSymptoms || [],
          treatableConditions: doctor.treatableConditions || [],
          specializations: doctor.specializations || []
        }));
        
        setDoctors(transformedDoctors);
      } else {
        setError('Failed to fetch doctors');
        // Fallback to static data if API fails
        setDoctors(getStaticDoctors());
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setError('Network error. Using offline data.');
      // Fallback to static data
      setDoctors(getStaticDoctors());
    } finally {
      setIsLoading(false);
    }
  };

  const getStaticDoctors = (): Doctor[] => [
    {
      id: '1',
      name: 'ডা. মোহাম্মদ রহিম',
      specialty: 'Cardiology',
      hospital: 'Square Hospital, Dhaka',
      location: 'Panthapath, Dhaka',
      experience: 15,
      rating: 4.9,
      reviews: 324,
      availability: 'Available Now',
      consultationFee: 1500,
      phone: '+880-1711-123456',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400',
      languages: ['Bengali', 'English'],
      qualifications: ['MBBS', 'MD (Cardiology)', 'Fellow of American College of Cardiology'],
      about: 'Senior Consultant with expertise in interventional cardiology and heart surgery.',
      isEmergencyAvailable: true,
      treatableSymptoms: ['বুকে ব্যথা', 'chest pain', 'হৃদস্পন্দন', 'heart palpitation', 'শ্বাসকষ্ট', 'breathing difficulty', 'উচ্চ রক্তচাপ', 'high blood pressure'],
      treatableConditions: ['Heart Disease', 'Hypertension', 'Arrhythmia', 'Coronary Artery Disease', 'Heart Attack'],
      specializations: ['Interventional Cardiology', 'Echocardiography', 'Cardiac Catheterization']
    },
    {
      id: '2',
      name: 'ডা. ফাতিমা খাতুন',
      specialty: 'Pediatrics',
      hospital: 'Dhaka Medical College Hospital',
      location: 'Ramna, Dhaka',
      experience: 12,
      rating: 4.8,
      reviews: 267,
      availability: 'Available in 30 mins',
      consultationFee: 1200,
      phone: '+880-1712-234567',
      image: 'https://images.unsplash.com/photo-1594824388853-d0d9ffeb0e80?w=400',
      languages: ['Bengali', 'English', 'Hindi'],
      qualifications: ['MBBS', 'DCH', 'MD (Pediatrics)'],
      about: 'Specialized in child healthcare and development with 12 years of experience.',
      isEmergencyAvailable: false,
      treatableSymptoms: ['শিশুর জ্বর', 'child fever', 'কাশি', 'cough', 'পেট ব্যথা', 'stomach pain', 'বমি', 'vomiting', 'ডায়রিয়া', 'diarrhea'],
      treatableConditions: ['Childhood Infections', 'Growth Disorders', 'Vaccination', 'Asthma in Children', 'Malnutrition'],
      specializations: ['Neonatal Care', 'Child Development', 'Vaccination', 'Pediatric Emergency']
    },
    {
      id: '3',
      name: 'ডা. আহমেদ হাসান',
      specialty: 'General Medicine',
      hospital: 'Apollo Hospital, Dhaka',
      location: 'Bashundhara, Dhaka',
      experience: 18,
      rating: 4.7,
      reviews: 445,
      availability: 'Available Now',
      consultationFee: 1000,
      phone: '+880-1713-345678',
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400',
      languages: ['Bengali', 'English'],
      qualifications: ['MBBS', 'FCPS (Medicine)', 'MRCP (UK)'],
      about: 'General practitioner with extensive experience in internal medicine.',
      isEmergencyAvailable: true,
      treatableSymptoms: ['জ্বর', 'fever', 'মাথা ব্যথা', 'headache', 'কাশি', 'cough', 'সর্দি', 'cold', 'পেট ব্যথা', 'stomach pain', 'ক্লান্তি', 'fatigue'],
      treatableConditions: ['Diabetes', 'Hypertension', 'Common Cold', 'Flu', 'Gastritis', 'Acid Reflux'],
      specializations: ['Internal Medicine', 'Diabetes Management', 'Hypertension', 'General Health']
    },
    {
      id: '4',
      name: 'ডা. নাসরিন সুলতানা',
      specialty: 'Gynecology',
      hospital: 'Holy Family Red Crescent Hospital',
      location: 'Eskaton, Dhaka',
      experience: 14,
      rating: 4.9,
      reviews: 198,
      availability: 'Available in 1 hour',
      consultationFee: 1400,
      phone: '+880-1714-456789',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
      languages: ['Bengali', 'English'],
      qualifications: ['MBBS', 'FCPS (Gynecology)', 'MS (Obstetrics & Gynecology)'],
      about: 'Expert in women\'s health and reproductive medicine.',
      isEmergencyAvailable: false,
      treatableSymptoms: ['পেটে ব্যথা', 'abdominal pain', 'অনিয়মিত মাসিক', 'irregular periods', 'সাদাস্রাব', 'white discharge', 'গর্ভকালীন সমস্যা', 'pregnancy issues'],
      treatableConditions: ['PCOS', 'Endometriosis', 'Pregnancy Care', 'Menstrual Disorders', 'Infertility'],
      specializations: ['Obstetrics', 'Gynecological Surgery', 'Fertility Treatment', 'Pregnancy Care']
    },
    {
      id: '5',
      name: 'ডা. করিম উদ্দিন',
      specialty: 'Neurology',
      hospital: 'National Institute of Neurosciences',
      location: 'Agargaon, Dhaka',
      experience: 20,
      rating: 4.8,
      reviews: 156,
      availability: 'Available Now',
      consultationFee: 1800,
      phone: '+880-1715-567890',
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400',
      languages: ['Bengali', 'English'],
      qualifications: ['MBBS', 'MD (Neurology)', 'Fellowship in Stroke Medicine'],
      about: 'Leading neurologist specializing in stroke and movement disorders.',
      isEmergencyAvailable: true,
      treatableSymptoms: ['মাথা ব্যথা', 'headache', 'মাথা ঘোরা', 'dizziness', 'খিঁচুনি', 'seizure', 'স্মৃতিশক্তি হ্রাস', 'memory loss', 'হাত কাঁপুনি', 'tremor'],
      treatableConditions: ['Stroke', 'Epilepsy', 'Parkinson\'s Disease', 'Alzheimer\'s Disease', 'Migraine', 'Multiple Sclerosis'],
      specializations: ['Stroke Medicine', 'Movement Disorders', 'Epilepsy', 'Dementia']
    },
    {
      id: '6',
      name: 'ডা. রোকেয়া বেগম',
      specialty: 'Dermatology',
      hospital: 'Chittagong Medical College Hospital',
      location: 'Chittagong',
      experience: 10,
      rating: 4.6,
      reviews: 89,
      availability: 'Available Tomorrow',
      consultationFee: 1100,
      phone: '+880-1716-678901',
      image: 'https://images.unsplash.com/photo-1594824388853-d0d9ffeb0e80?w=400',
      languages: ['Bengali', 'English'],
      qualifications: ['MBBS', 'DDV', 'MD (Dermatology)'],
      about: 'Skin specialist with expertise in cosmetic dermatology.',
      isEmergencyAvailable: false,
      treatableSymptoms: ['ত্বকে চুলকানি', 'skin itching', 'র‍্যাশ', 'rash', 'ব্রণ', 'acne', 'চুল পড়া', 'hair loss', 'ত্বকে দাগ', 'skin spots'],
      treatableConditions: ['Eczema', 'Psoriasis', 'Acne', 'Hair Loss', 'Skin Cancer', 'Vitiligo'],
      specializations: ['Cosmetic Dermatology', 'Skin Cancer', 'Hair Disorders', 'Pediatric Dermatology']
    },
    {
      id: '7',
      name: 'ডা. সাদিক আলী',
      specialty: 'Gastroenterology',
      hospital: 'United Hospital, Dhaka',
      location: 'Gulshan, Dhaka',
      experience: 16,
      rating: 4.7,
      reviews: 203,
      availability: 'Available Now',
      consultationFee: 1600,
      phone: '+880-1717-789012',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400',
      languages: ['Bengali', 'English'],
      qualifications: ['MBBS', 'FCPS (Gastroenterology)', 'Fellowship in Hepatology'],
      about: 'Expert in digestive system disorders and liver diseases.',
      isEmergencyAvailable: true,
      treatableSymptoms: ['পেট ব্যথা', 'stomach pain', 'বমি', 'vomiting', 'ডায়রিয়া', 'diarrhea', 'কোষ্ঠকাঠিন্য', 'constipation', 'গ্যাসের সমস্যা', 'gas problems', 'বদহজম', 'indigestion'],
      treatableConditions: ['IBS', 'Gastritis', 'Liver Disease', 'Hepatitis', 'Gallstones', 'Ulcer'],
      specializations: ['Hepatology', 'Endoscopy', 'Inflammatory Bowel Disease', 'Liver Transplant']
    },
    {
      id: '8',
      name: 'ডা. সুমাইয়া আক্তার',
      specialty: 'Pulmonology',
      hospital: 'Chest Disease Hospital, Dhaka',
      location: 'Mohakhali, Dhaka',
      experience: 11,
      rating: 4.6,
      reviews: 178,
      availability: 'Available in 45 mins',
      consultationFee: 1300,
      phone: '+880-1718-890123',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
      languages: ['Bengali', 'English'],
      qualifications: ['MBBS', 'FCPS (Pulmonology)', 'Fellowship in Critical Care'],
      about: 'Specialist in respiratory diseases and critical care.',
      isEmergencyAvailable: true,
      treatableSymptoms: ['শ্বাসকষ্ট', 'breathing difficulty', 'কাশি', 'cough', 'বুকে ব্যথা', 'chest pain', 'কফ', 'phlegm', 'হাঁপানি', 'asthma'],
      treatableConditions: ['Asthma', 'COPD', 'Pneumonia', 'Tuberculosis', 'Lung Cancer', 'Sleep Apnea'],
      specializations: ['Critical Care', 'Sleep Medicine', 'Interventional Pulmonology', 'Asthma Management']
    }
  ];

  const specialties = [
    { value: 'all', label: 'All Specialists', color: 'bg-gray-500', emoji: '🏥' },
    { value: 'Cardiology', label: 'Cardiology', color: 'bg-red-500', emoji: '❤️' },
    { value: 'Pediatrics', label: 'Pediatrics', color: 'bg-pink-500', emoji: '👶' },
    { value: 'General Medicine', label: 'General Medicine', color: 'bg-blue-500', emoji: '👨‍⚕️' },
    { value: 'Gynecology', label: 'Gynecology', color: 'bg-purple-500', emoji: '👩‍⚕️' },
    { value: 'Neurology', label: 'Neurology', color: 'bg-indigo-500', emoji: '🧠' },
    { value: 'Dermatology', label: 'Dermatology', color: 'bg-green-500', emoji: '✨' },
    { value: 'Gastroenterology', label: 'Gastroenterology', color: 'bg-orange-500', emoji: '🫃' },
    { value: 'Pulmonology', label: 'Pulmonology', color: 'bg-teal-500', emoji: '🫁' }
  ];

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

  // Enhanced filtering logic for symptoms and location
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSpecialty = selectedSpecialty === 'all' || doctor.specialty === selectedSpecialty;
    const matchesLocation = selectedLocation === 'all' || getCityFromLocation(doctor.location) === selectedLocation;
    
    if (!searchValue.trim()) {
      return matchesSpecialty && matchesLocation;
    }

    const searchLower = searchValue.toLowerCase().trim();
    const searchTerms = searchLower.split(/[\s,\-]+/).filter(term => term.length > 1);
    
    const searchableContent = [
      doctor.name.toLowerCase(),
      doctor.specialty.toLowerCase(),
      doctor.hospital.toLowerCase(),
      doctor.location.toLowerCase(),
      ...doctor.treatableSymptoms.map(s => s.toLowerCase()),
      ...doctor.treatableConditions.map(c => c.toLowerCase()),
      ...doctor.specializations.map(s => s.toLowerCase()),
      ...doctor.languages.map(l => l.toLowerCase())
    ];

    const matchesSearch = searchTerms.some(term => 
      searchableContent.some(content => content.includes(term))
    );

    return matchesSpecialty && matchesLocation && matchesSearch;
  }).sort((a, b) => {
    // Sort by location proximity first
    const aIsNearby = isNearbyLocation(a.location);
    const bIsNearby = isNearbyLocation(b.location);
    if (aIsNearby && !bIsNearby) return -1;
    if (!aIsNearby && bIsNearby) return 1;
    // Then by rating
    return b.rating - a.rating;
  });

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  const getAvailabilityColor = (availability: string) => {
    if (availability.includes('Now')) return 'bg-green-500';
    if (availability.includes('mins') || availability.includes('hour')) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  const getMatchedSymptoms = (doctor: Doctor) => {
    if (!searchValue.trim()) return [];
    
    const searchLower = searchValue.toLowerCase();
    const searchTerms = searchLower.split(/[\s,\-]+/).filter(term => term.length > 1);
    
    const matchedSymptoms = doctor.treatableSymptoms.filter(symptom =>
      searchTerms.some(term => symptom.toLowerCase().includes(term))
    );
    
    return matchedSymptoms.slice(0, 3); // Show only first 3 matches
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 pt-16">
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
          <div>
            <h1 className="text-xl font-bold">Find Doctors</h1>
            <p className="text-blue-100">
              {searchValue ? `${filteredDoctors.length} doctors found` : `Choose from ${filteredDoctors.length} available doctors`}
            </p>
          </div>
        </div>

        {/* Enhanced Search */}
        <div className="bg-white/20 rounded-xl p-3 flex items-center space-x-3">
          <Stethoscope className="w-5 h-5 text-white" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search by symptoms, specialty, doctor name..."
            className="flex-1 bg-transparent text-white placeholder-blue-200 outline-none"
          />
          <Filter className="w-5 h-5 text-white" />
        </div>

        {/* Search Results Indicator */}
        {searchValue && (
          <div className="mt-3 text-sm text-blue-100">
            🔍 Searching for: "{searchValue}" 
            {filteredDoctors.length > 0 && (
              <span className="ml-2 bg-white/20 px-2 py-1 rounded">
                {filteredDoctors.length} matches
              </span>
            )}
          </div>
        )}
      </div>

      <div className="p-6 space-y-6 -mt-4">
        {/* Location Filter */}
        {userLocation && (
          <div className="bg-white rounded-xl p-4 shadow-lg">
            <h3 className="font-bold text-gray-800 mb-3">📍 Location Filter</h3>
            <div className="flex space-x-2 overflow-x-auto pb-2">
              <Button
                onClick={() => setSelectedLocation('all')}
                variant={selectedLocation === 'all' ? "default" : "outline"}
                className={`whitespace-nowrap ${
                  selectedLocation === 'all' 
                    ? 'medical-gradient-primary text-white' 
                    : 'border-gray-300 text-gray-600'
                }`}
              >
                All Locations
              </Button>
              <Button
                onClick={() => setSelectedLocation(userLocation)}
                variant={selectedLocation === userLocation ? "default" : "outline"}
                className={`whitespace-nowrap ${
                  selectedLocation === userLocation 
                    ? 'bg-green-500 text-white' 
                    : 'border-gray-300 text-gray-600'
                }`}
              >
                <MapPin className="w-4 h-4 mr-1" />
                {userLocation} (Nearby)
              </Button>
            </div>
          </div>
        )}

        {/* Specialty Filter */}
        <div className="bg-white rounded-xl p-4 shadow-lg">
          <h3 className="font-bold text-gray-800 mb-3">Specialties</h3>
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {specialties.map((specialty) => (
              <Button
                key={specialty.value}
                onClick={() => setSelectedSpecialty(specialty.value)}
                variant={selectedSpecialty === specialty.value ? "default" : "outline"}
                className={`whitespace-nowrap ${
                  selectedSpecialty === specialty.value 
                    ? `${specialty.color} text-white` 
                    : 'border-gray-300 text-gray-600'
                }`}
              >
                <span className="mr-2">{specialty.emoji}</span>
                {specialty.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Doctors List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading doctors...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Connection Error</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={fetchDoctors} className="medical-gradient-primary text-white">
                Try Again
              </Button>
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No doctors found</h3>
              <p className="text-gray-600 mb-4">
                {searchValue
                  ? `No doctors match your search for "${searchValue}"`
                  : "No doctors available with the selected filters"}
              </p>
              <Button
                onClick={() => {
                  setSearchValue('');
                  setSelectedSpecialty('all');
                  setSelectedLocation('all');
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </div>
          ) : 
            filteredDoctors.map((doctor) => {
            const matchedSymptoms = getMatchedSymptoms(doctor);
            
            return (
              <Card
                key={doctor.id}
                className="p-4 cursor-pointer hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] bg-white rounded-xl"
                onClick={() => onSelectDoctor(doctor)}
              >
                <div className="flex space-x-4">
                  <div className="relative">
                    <ImageWithFallback
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-20 h-20 rounded-xl object-cover"
                    />
                    {doctor.isEmergencyAvailable && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white">🚨</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-gray-800">{doctor.name}</h3>
                        <p className="text-sm text-gray-600">{doctor.specialty}</p>
                        {matchedSymptoms.length > 0 && (
                          <div className="flex items-center space-x-1 mt-1">
                            <Stethoscope className="w-3 h-3 text-green-600" />
                            <span className="text-xs text-green-600 font-medium">
                              Treats: {matchedSymptoms.join(', ')}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-bold text-gray-800">{doctor.rating}</span>
                          <span className="text-xs text-gray-500">({doctor.reviews})</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{doctor.hospital}</span>
                      </div>
                      {isNearbyLocation(doctor.location) && (
                        <Badge className="bg-green-500 text-white text-xs">
                          📍 Nearby
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge className={`${getAvailabilityColor(doctor.availability)} text-white text-xs`}>
                          <Clock className="w-3 h-3 mr-1" />
                          {doctor.availability}
                        </Badge>
                        <span className="text-sm text-gray-500">{doctor.experience} years exp</span>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">৳{doctor.consultationFee}</p>
                        <p className="text-xs text-gray-500">Consultation Fee</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex space-x-1">
                        {doctor.languages.map((language, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {language}
                          </Badge>
                        ))}
                      </div>
                      {searchValue && matchedSymptoms.length > 0 && (
                        <Badge className="bg-green-100 text-green-700 text-xs">
                          🎯 Symptom Match
                        </Badge>
                      )}
                    </div>

                    {/* Show treatable conditions if relevant to search */}
                    {searchValue && (
                      <div className="text-xs text-gray-500">
                        <span className="font-medium">Also treats:</span> {doctor.treatableConditions.slice(0, 3).join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

      </div>
    </div>
  );
}