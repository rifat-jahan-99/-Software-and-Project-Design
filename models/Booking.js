import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  // Patient Information
  patientName: { type: String, required: true },
  patientId: { type: String, required: true },
  patientEmail: { type: String },
  patientPhone: { type: String },
  
  // Doctor Information
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  doctorName: { type: String, required: true },
  doctorEmail: { type: String },
  
  // Appointment Details
  date: { type: String, required: true },
  time: { type: String, required: true },
  service: { type: String, required: true }, // consultation, voice, chat, visit
  price: { type: Number, required: true },
  duration: { type: String },
  
  // Status and Notes
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no-show'],
    default: "pending" 
  },
  notes: { type: String },
  patientNotes: { type: String }, // Notes from patient
  doctorNotes: { type: String }, // Notes from doctor
  
  // Payment Information
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'refunded'],
    default: "pending" 
  },
  paymentMethod: { type: String },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Update timestamp on save
bookingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
