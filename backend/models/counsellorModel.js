const mongoose = require("mongoose");

const counsellorSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    default: () => new mongoose.Types.ObjectId(),
  },
  name: { type: String, required: true },
  email: { type: String, required: true },
  appointments: [
    {
      appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Appointment",
      },
      appointmentDate: { type: Date, required: true },
      appointmentTime: { type: String, required: true },
    },
  ],
});

const Counsellor = mongoose.model("Counsellor", counsellorSchema);

module.exports = Counsellor;
