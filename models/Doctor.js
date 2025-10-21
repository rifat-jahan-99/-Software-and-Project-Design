import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const doctorSchema = new mongoose.Schema({
  // Basic Information
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  
  // Professional Information
  specialty: { type: String, required: true },
  hospital: { type: String, required: true },
  location: { type: String, required: true },
  experience: { type: Number, default: 0 },
  consultationFee: { type: Number, required: true },
  
  // Availability and Status
  isAvailable: { type: Boolean, default: true },
  isEmergencyAvailable: { type: Boolean, default: false },
  availability: { type: String, default: "9:00 AM - 5:00 PM" },
  
  // Profile Information
  image: { type: String, default: "" },
  about: { type: String, default: "" },
  qualifications: [{ type: String }],
  languages: [{ type: String, default: ["Bengali", "English"] }],
  
  // Ratings and Reviews
  rating: { type: Number, default: 5.0 },
  reviews: { type: Number, default: 0 },
  
  // Medical Information
  treatableSymptoms: [{ type: String }],
  treatableConditions: [{ type: String }],
  specializations: [{ type: String }],
  
  // Account Status
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Hash password before saving
doctorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
doctorSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Update timestamp on save
doctorSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("Doctor", doctorSchema);
