import React, { useState, useEffect } from 'react';
import { User, Calendar, DollarSign, Activity, Clock, Users, Phone, Mail, MapPin, Stethoscope, Power, Settings, LogOut, CheckCircle, XCircle, Heart, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { User as UserType } from '../App';

interface DoctorDashboardProps {
  user: UserType;
  onLogout: () => void;
  onUpdateProfile: (updates: Partial<UserType>) => void;
}

export default function DoctorDashboard({ user, onLogout, onUpdateProfile }: DoctorDashboardProps) {
  const [isAvailable, setIsAvailable] = useState(user.isAvailable ?? true);
  const [consultationFee, setConsultationFee] = useState(user.consultationFee?.toString() || '500');
  const [location, setLocation] = useState(user.location || 'Dhaka');
  const [hospital, setHospital] = useState(user.hospital || 'Local Hospital');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, [user.id]);

  const fetchAppointments = async () => {
    try {
      setIsLoadingAppointments(true);
      const response = await fetch(`http://localhost:5000/api/bookings/doctor/${user.id}`);
      const data = await response.json();
      
      if (response.ok) {
        setAppointments(data);
      } else {
        console.error('Failed to fetch appointments:', data.message);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setIsLoadingAppointments(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId: string, status: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${appointmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        // Refresh appointments after update
        fetchAppointments();
      } else {
        console.error('Failed to update appointment status');
      }
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  };

  const handleAvailabilityToggle = () => {
    const newAvailability = !isAvailable;
    setIsAvailable(newAvailability);
    onUpdateProfile({ isAvailable: newAvailability });
  };

  const handleSaveChanges = () => {
    setIsSaving(true);
    setTimeout(() => {
      onUpdateProfile({ 
        consultationFee: parseInt(consultationFee) || 500,
        location,
        hospital
      });
      setIsEditing(false);
      setIsSaving(false);
    }, 1000);
  };

  // Calculate real statistics from appointments
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(apt => apt.date === today).length;
  const weeklyPatients = appointments.filter(apt => {
    const aptDate = new Date(apt.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return aptDate >= weekAgo;
  }).length;
  const monthlyRevenue = appointments
    .filter(apt => apt.status === 'completed')
    .reduce((sum, apt) => sum + (apt.price || 0), 0);

  const stats = {
    todayAppointments,
    weeklyPatients,
    monthlyRevenue,
    rating: 4.8 // This would come from user profile
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">ডাক্তার ড্যাশবোর্ড</h1>
            <p className="text-gray-600">Doctor Dashboard - Welcome back!</p>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={fetchAppointments}
              variant="outline"
              className="border-blue-300 text-blue-700 hover:bg-blue-50"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button
              onClick={onLogout}
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              লগ আউট - Logout
            </Button>
          </div>
        </div>

        {/* Doctor Profile Card */}
        <Card className="p-6 bg-white rounded-xl shadow-lg">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 medical-gradient-primary rounded-full flex items-center justify-center shadow-lg">
                <Stethoscope className="w-10 h-10 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
                <p className="text-gray-600">{user.specialty || 'General Physician'}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{user.phone}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-1 text-sm text-blue-600">
                    <MapPin className="w-4 h-4" />
                    <span>{user.location || 'Dhaka'}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-green-600">
                    <Heart className="w-4 h-4" />
                    <span>{user.hospital || 'Local Hospital'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Availability Toggle */}
            <div className="flex flex-col items-end space-y-2">
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">উপলব্ধতা - Availability:</span>
                <Switch
                  checked={isAvailable}
                  onCheckedChange={handleAvailabilityToggle}
                  className={isAvailable ? 'bg-green-500' : 'bg-gray-400'}
                />
              </div>
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
                isAvailable 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {isAvailable ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-medium">Available Now</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4" />
                    <span className="font-medium">Offline</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700">আজকের অ্যাপয়েন্টমেন্ট</p>
                <p className="text-sm text-blue-600">Today's Appointments</p>
                <p className="text-3xl font-bold text-blue-800 mt-2">{stats.todayAppointments}</p>
              </div>
              <Calendar className="w-12 h-12 text-blue-500 opacity-50" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700">সাপ্তাহিক রোগী</p>
                <p className="text-sm text-green-600">Weekly Patients</p>
                <p className="text-3xl font-bold text-green-800 mt-2">{stats.weeklyPatients}</p>
              </div>
              <Users className="w-12 h-12 text-green-500 opacity-50" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700">মাসিক আয়</p>
                <p className="text-sm text-purple-600">Monthly Revenue</p>
                <p className="text-3xl font-bold text-purple-800 mt-2">৳{stats.monthlyRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="w-12 h-12 text-purple-500 opacity-50" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-700">রেটিং</p>
                <p className="text-sm text-orange-600">Rating</p>
                <p className="text-3xl font-bold text-orange-800 mt-2">{stats.rating} ⭐</p>
              </div>
              <Activity className="w-12 h-12 text-orange-500 opacity-50" />
            </div>
          </Card>
        </div>

        {/* Fee Management Section */}
        <Card className="p-6 bg-white rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800">প্রোফাইল সেটিংস - Profile Settings</h3>
              <p className="text-sm text-gray-600">Manage your location, hospital and consultation fees</p>
            </div>
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                className="medical-gradient-primary text-white"
              >
                <Settings className="w-4 h-4 mr-2" />
                Edit Fee
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button
                  onClick={() => {
                    setIsEditing(false);
                    setConsultationFee(user.consultationFee?.toString() || '500');
                    setLocation(user.location || 'Dhaka');
                    setHospital(user.hospital || 'Local Hospital');
                  }}
                  variant="outline"
                  className="border-gray-300"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                  className="medical-gradient-success text-white"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {/* Location */}
              <div className="space-y-2">
                <Label className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>অবস্থান - Location</span>
                </Label>
                {isEditing ? (
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                ) : (
                  <p className="text-xl font-bold text-blue-600">{user.location || 'Dhaka'}</p>
                )}
              </div>

              {/* Hospital */}
              <div className="space-y-2">
                <Label className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-gray-500" />
                  <span>হাসপাতাল - Hospital/Clinic</span>
                </Label>
                {isEditing ? (
                  <Input
                    type="text"
                    value={hospital}
                    onChange={(e) => setHospital(e.target.value)}
                    placeholder="e.g., Square Hospital, DMCH"
                  />
                ) : (
                  <p className="text-xl font-bold text-green-600">{user.hospital || 'Local Hospital'}</p>
                )}
              </div>

              {/* Consultation Fee */}
              <div className="space-y-2">
                <Label className="flex items-center space-x-2">
                  <span>৳</span>
                  <span>পরামর্শ ফি - Consultation Fee (Taka)</span>
                </Label>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl font-bold text-gray-800">৳</span>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={consultationFee}
                      onChange={(e) => setConsultationFee(e.target.value)}
                      className="text-xl"
                      min="0"
                    />
                  ) : (
                    <span className="text-3xl font-bold text-green-600">
                      {user.consultationFee || 500}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-green-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-3">💡 Important Information:</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• <strong>Location:</strong> Patients in your city will see you first</li>
                <li>• <strong>Hospital:</strong> Let patients know where you practice</li>
                <li>• <strong>Fees:</strong> Average in Bangladesh: ৳300-1000</li>
                <li>• Specialist fees are typically higher (৳800-2000)</li>
                <li>• Update your profile to attract more patients</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6 bg-white rounded-xl shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4">দ্রুত ক্রিয়া - Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="medical-gradient-primary text-white py-6">
              <Calendar className="w-5 h-5 mr-2" />
              View Schedule
            </Button>
            <Button className="medical-gradient-success text-white py-6">
              <Users className="w-5 h-5 mr-2" />
              Patient List
            </Button>
            <Button className="medical-gradient-warning text-white py-6">
              <Activity className="w-5 h-5 mr-2" />
              Medical Records
            </Button>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6 bg-white rounded-xl shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4">সাম্প্রতিক কার্যকলাপ - Recent Activity</h3>
          <div className="space-y-4">
            {isLoadingAppointments ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading appointments...</p>
              </div>
            ) : appointments.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">📅</div>
                <h4 className="text-lg font-bold text-gray-800 mb-2">No appointments yet</h4>
                <p className="text-gray-600">Your appointments will appear here once patients start booking.</p>
              </div>
            ) : (
              appointments.slice(0, 5).map((appointment, index) => (
                <div key={appointment._id || index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 medical-gradient-primary rounded-full flex items-center justify-center">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{appointment.patientName}</p>
                      <p className="text-sm text-gray-600">
                        {appointment.service} • {appointment.date} at {appointment.time}
                      </p>
                      <p className="text-xs text-gray-500">৳{appointment.price}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      appointment.status === 'completed' 
                        ? 'bg-green-100 text-green-700' 
                        : appointment.status === 'confirmed'
                        ? 'bg-blue-100 text-blue-700'
                        : appointment.status === 'cancelled'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {appointment.status}
                    </span>
                    {appointment.status === 'pending' && (
                      <Button
                        size="sm"
                        onClick={() => updateAppointmentStatus(appointment._id, 'confirmed')}
                        className="bg-green-500 hover:bg-green-600 text-white"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
