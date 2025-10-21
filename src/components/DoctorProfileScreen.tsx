import React, { useState } from 'react';
import { ArrowLeft, Star, MapPin, Phone, MessageCircle, Video, Clock, Award, Calendar, Heart, Shield, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Doctor } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface DoctorProfileScreenProps {
  doctor: Doctor;
  onBack: () => void;
}

function DoctorProfileScreen({ doctor, onBack }: DoctorProfileScreenProps) {
  const [selectedService, setSelectedService] = useState('consultation');
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [message, setMessage] = useState("");

  const services = [
    {
      id: 'consultation',
      name: 'Video Consultation',
      icon: Video,
      price: doctor.consultationFee,
      duration: '15-30 mins',
      color: 'bg-blue-500'
    },
    {
      id: 'voice',
      name: 'Voice Call',
      icon: Phone,
      price: Math.floor(doctor.consultationFee * 0.8),
      duration: '10-20 mins',
      color: 'bg-green-500'
    },
    {
      id: 'chat',
      name: 'Text Chat',
      icon: MessageCircle,
      price: Math.floor(doctor.consultationFee * 0.6),
      duration: '24hr response',
      color: 'bg-purple-500'
    },
    {
      id: 'visit',
      name: 'Hospital Visit',
      icon: MapPin,
      price: doctor.consultationFee + 500,
      duration: '30-45 mins',
      color: 'bg-orange-500'
    }
  ];

  const timeSlots = [
    { time: '10:00 AM', available: true },
    { time: '11:30 AM', available: true },
    { time: '2:00 PM', available: false },
    { time: '3:30 PM', available: true },
    { time: '5:00 PM', available: true },
    { time: '7:30 PM', available: false }
  ];

  const reviews = [
    {
      name: 'রাহুল আহমেদ',
      rating: 5,
      comment: 'Excellent doctor! Very caring and professional. Explained everything clearly in Bengali.',
      date: '2 days ago'
    },
    {
      name: 'সুমাইয়া খান',
      rating: 5,
      comment: 'Outstanding treatment and follow-up care. Highly recommend Dr. ' + doctor.name.split(' ').pop(),
      date: '1 week ago'
    },
    {
      name: 'মোহাম্মদ হাসান',
      rating: 4,
      comment: 'Good experience overall. The doctor was punctual and knowledgeable.',
      date: '2 weeks ago'
    }
  ];

  const selectedServiceData = services.find(s => s.id === selectedService);

  const handleBooking = async () => {
    try {
      const bookingData = {
        patientName: "Test Patient",
        patientId: "p123",
        patientEmail: "patient@example.com",
        patientPhone: "+880-1711-123456",
        doctorId: doctor.id,
        doctorName: doctor.name,
        doctorEmail: (doctor as any).email || "",
        date: bookingDate,
        time: bookingTime,
        service: selectedServiceData?.id || 'consultation',
        price: selectedServiceData?.price || doctor.consultationFee,
        duration: selectedServiceData?.duration || "30 mins",
        paymentStatus: "pending"
      };

      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Appointment booked successfully!");
        console.log("Booking successful:", data);
        
        // Reset form
        setBookingDate("");
        setBookingTime("");
      } else {
        setMessage("❌ Failed to book appointment: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      setMessage("❌ Failed to book appointment");
      console.error("Booking error:", err);
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
            <h1 className="text-xl font-bold">Doctor Profile</h1>
            <p className="text-blue-100">Complete medical consultation</p>
          </div>
          <Button className="bg-white/20 hover:bg-white/30 text-white border-none">
            <Heart className="w-4 h-4 mr-1" />
            Save
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-6 -mt-4">
        {/* Doctor Info Card */}
        <Card className="p-6 bg-white rounded-xl shadow-lg">
          <div className="flex space-x-4 mb-4">
            <div className="relative">
              <ImageWithFallback
                src={doctor.image}
                alt={doctor.name}
                className="w-24 h-24 rounded-xl object-cover"
              />
              {doctor.isEmergencyAvailable && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center pulse-animation">
                  <span className="text-white text-xs">🚨</span>
                </div>
              )}
            </div>

            <div className="flex-1 space-y-2">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{doctor.name}</h2>
                <p className="text-lg text-blue-600 font-medium">{doctor.specialty}</p>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="font-bold text-gray-800">{doctor.rating}</span>
                  <span className="text-gray-500">({doctor.reviews} reviews)</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-600">
                  <Award className="w-4 h-4" />
                  <span>{doctor.experience} years</span>
                </div>
              </div>

              <div className="flex items-center space-x-1 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{doctor.hospital}</span>
              </div>

              <div className="flex space-x-2">
                <Badge className="bg-green-500 text-white">
                  <Clock className="w-3 h-3 mr-1" />
                  {doctor.availability}
                </Badge>
                {doctor.languages.map((language, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {language}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{doctor.reviews}</div>
              <div className="text-xs text-gray-500">Happy Patients</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{doctor.experience}+</div>
              <div className="text-xs text-gray-500">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">98%</div>
              <div className="text-xs text-gray-500">Success Rate</div>
            </div>
          </div>
        </Card>

        {/* Service Selection */}
        <Card className="p-4 bg-white rounded-xl shadow-lg">
          <h3 className="font-bold text-gray-800 mb-4">Select Consultation Type</h3>
          <div className="grid grid-cols-2 gap-3">
            {services.map((service) => {
              const IconComponent = service.icon;
              return (
                <div
                  key={service.id}
                  onClick={() => setSelectedService(service.id)}
                  className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedService === service.id
                      ? `${service.color} text-white transform scale-105`
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  <div className="flex flex-col items-center text-center space-y-2">
                    <IconComponent className="w-6 h-6" />
                    <div className="font-bold text-sm">{service.name}</div>
                    <div className="text-lg font-bold">৳{service.price}</div>
                    <div className="text-xs opacity-90">{service.duration}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Available Time Slots */}
        <Card className="p-4 bg-white rounded-xl shadow-lg">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-blue-500" />
            Available Today
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {timeSlots.map((slot, index) => (
              <Button
                key={index}
                variant={slot.available ? "outline" : "ghost"}
                disabled={!slot.available}
                className={`p-3 ${slot.available ? 'hover:bg-blue-50 border-blue-200' : 'opacity-50'}`}
              >
                {slot.time}
              </Button>
            ))}
          </div>
        </Card>

        {/* About Doctor */}
        <Card className="p-4 bg-white rounded-xl shadow-lg">
          <h3 className="font-bold text-gray-800 mb-3">About Dr. {doctor.name.split(' ').pop()}</h3>
          <p className="text-gray-600 leading-relaxed mb-4">{doctor.about}</p>
          
          <Separator className="my-4" />
          
          <div>
            <h4 className="font-bold text-gray-800 mb-2">Qualifications</h4>
            <div className="space-y-2">
              {doctor.qualifications.map((qualification, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-blue-500" />
                  <span className="text-gray-600">{qualification}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Reviews */}
        <Card className="p-4 bg-white rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">Patient Reviews</h3>
            <Badge className="bg-yellow-100 text-yellow-800">
              <Star className="w-3 h-3 mr-1 fill-current" />
              {doctor.rating} Average
            </Badge>
          </div>
          
          <div className="space-y-4">
            {reviews.map((review, index) => (
              <div key={index} className="border-l-4 border-blue-200 pl-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-800">{review.name}</span>
                    <div className="flex space-x-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-yellow-500 fill-current" />
                      ))}
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{review.date}</span>
                </div>
                <p className="text-gray-600 text-sm">{review.comment}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Book Appointment Button */}
        <div className="sticky bottom-6 bg-white p-4 rounded-xl shadow-lg border">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-gray-600">Selected: {selectedServiceData?.name}</p>
              <p className="text-2xl font-bold text-green-600">৳{selectedServiceData?.price}</p>
            </div>
            <div className="text-right text-sm text-gray-500">
              <p>Duration: {selectedServiceData?.duration}</p>
              <p>Available: {doctor.availability}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex space-x-2">
              <input
                type="date"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="flex-1 border rounded-lg p-2 text-sm"
                placeholder="Select date"
              />
              <input
                type="time"
                value={bookingTime}
                onChange={(e) => setBookingTime(e.target.value)}
                className="flex-1 border rounded-lg p-2 text-sm"
                placeholder="Select time"
              />
            </div>
            
            {message && (
              <div className={`text-sm p-2 rounded-lg ${
                message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {message}
              </div>
            )}
            
            <div className="flex space-x-3">
              <Button 
                onClick={handleBooking}
                disabled={!bookingDate || !bookingTime}
                className="flex-1 medical-gradient-primary text-white py-4 rounded-xl shadow-lg disabled:opacity-50"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Book Appointment
              </Button>
              <Button variant="outline" className="px-6 py-4 rounded-xl">
                <Phone className="w-5 h-5" />
              </Button>
              <Button variant="outline" className="px-6 py-4 rounded-xl">
                <MessageCircle className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorProfileScreen;
