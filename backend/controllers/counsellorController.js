const Counsellor = require("../models/counsellorModel");

const addCounsellor = async (req, res) => {
  try {
    const counsellor = new Counsellor({
      name: req.body.name,
      email: req.body.email,
      appointments: [],
    });

    await counsellor.save();

    res.status(200).json({ message: "Counsellor added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCounsellorAppointments = async (req, res) => {
  try {
    const username = req.params.username;
    const counsellor = await Counsellor.findOne({ name: username }).populate('appointments.appointmentId');
    if (!counsellor) {
      return res.status(404).json({ error: "Counselor not found" });
    }

    const appointments = counsellor.appointments.map(appointment => {
    const { name, rollNumber, programme, department, hall, roomNumber, phone, counsellor, appointmentDate, appointmentTime, visit, lastVisitDate, comments } = appointment.appointmentId;
      return {
        name,
        rollNumber,
        programme,
        department,
        hall,
        roomNumber,
        phone,
        counsellor,
        appointmentDate,
        appointmentTime,
        visit,
        lastVisitDate,
        comments
      };
    });

      res.status(200).json({ appointments });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { addCounsellor, getCounsellorAppointments };