import React, { useState } from 'react';
import { ChevronRight, Heart, Shield, Clock, MapPin } from 'lucide-react';
import { Button } from './ui/button';

interface OnboardingScreenProps {
  onComplete: () => void;
}

const onboardingData = [
  {
    id: 1,
    title: "সহজ স্বাস্থ্যসেবা",
    subtitle: "Easy Healthcare in Bangladesh",
    description: "Connect with certified doctors across Dhaka, Chittagong, and all major cities in Bangladesh",
    icon: Heart,
    gradient: "medical-gradient-primary",
    bgColor: "from-blue-100 to-cyan-100"
  },
  {
    id: 2,
    title: "জরুরি সেবা ২৪/৭",
    subtitle: "Emergency Care 24/7",
    description: "Immediate access to emergency doctors and ambulance services throughout Bangladesh",
    icon: Shield,
    gradient: "medical-gradient-emergency",
    bgColor: "from-red-100 to-pink-100"
  },
  {
    id: 3,
    title: "তাৎক্ষণিক পরামর্শ",
    subtitle: "Instant Consultation",
    description: "Video calls, voice calls, and chat with experienced Bangladeshi doctors in Bengali and English",
    icon: Clock,
    gradient: "medical-gradient-success",
    bgColor: "from-green-100 to-emerald-100"
  }
];

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < onboardingData.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const currentData = onboardingData[currentStep];
  const IconComponent = currentData.icon;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentData.bgColor} flex flex-col items-center justify-center p-6 transition-all duration-500`}>
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Progress indicators */}
        <div className="flex justify-center space-x-2 mb-8">
          {onboardingData.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-8 rounded-full transition-all duration-300 ${
                index === currentStep 
                  ? 'bg-gradient-to-r from-red-500 to-green-500 scale-110' 
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Main content */}
        <div className="space-y-6 float-animation">
          <div className={`mx-auto w-24 h-24 rounded-full ${currentData.gradient} flex items-center justify-center shadow-2xl`}>
            <IconComponent className="w-12 h-12 text-white" />
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-gray-800">
              {currentData.title}
            </h1>
            <h2 className="text-lg text-gray-600 font-medium">
              {currentData.subtitle}
            </h2>
            <p className="text-gray-600 leading-relaxed px-4">
              {currentData.description}
            </p>
          </div>
        </div>

        {/* Bangladesh flag colors accent */}
        <div className="flex justify-center space-x-1 my-6">
          <div className="w-16 h-1 bg-green-600 rounded"></div>
          <div className="w-16 h-1 bg-red-500 rounded"></div>
        </div>

        {/* Action buttons */}
        <div className="space-y-4 w-full">
          <Button
            onClick={handleNext}
            className={`w-full ${currentData.gradient} text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 py-6 rounded-xl`}
          >
            <span className="mr-2">
              {currentStep === onboardingData.length - 1 ? 'শুরু করুন - Get Started' : 'পরবর্তী - Next'}
            </span>
            <ChevronRight className="w-5 h-5" />
          </Button>

          {currentStep < onboardingData.length - 1 && (
            <Button
              onClick={handleSkip}
              variant="ghost"
              className="w-full text-gray-600 hover:text-gray-800"
            >
              Skip
            </Button>
          )}
        </div>

        {/* Location indicator */}
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 mt-8">
          <MapPin className="w-4 h-4" />
          <span>🇧🇩 Available across Bangladesh</span>
        </div>
      </div>
    </div>
  );
}