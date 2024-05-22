const Appointment = require("../models/appointmentModel");
const User = require("../models/userModel");
const Counsellor = require("../models/counsellorModel");

const addAppointment = async (req, res) => {
  try {
    const appointment = new Appointment({
      name: req.body.name,
      rollNumber: req.body.rollNumber,
      programme: req.body.programme,
      department: req.body.department,
      hall: req.body.hall,
      roomNumber: req.body.roomNumber,
      phone: req.body.phone,
      counsellor: req.body.counsellor,
      appointmentDate: req.body.appointmentDate,
      appointmentTime: req.body.appointmentTime,
      visit: req.body.visit,
      lastVisitDate: req.body.lastVisitDate,
      comments: req.body.comments,
    });

    await appointment.save();

    const username = req.params.username;

    let user = await User.findOne({ username: username });

    if (!user) {
      user = new User({
        username: username,
        appointments: [appointment._id],
      });
      await user.save();
    } else {
      user.appointments.push(appointment._id);
      await user.save();
    }

    let counsellor = await Counsellor.findOne({ name: req.body.counsellor });

    if (!counsellor) {
      res.status(404).json({ error: "Counsellor not found" });
    }

    counsellor.appointments.push({
      appointmentId: appointment._id,
      appointmentDate: req.body.appointmentDate,
      appointmentTime: req.body.appointmentTime,
    });

    await counsellor.save();

    res.status(200).json({ message: "Appointment added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAppointments = async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ username }).populate("appointments");

    if (!user) {
      user = new User({
        username: username,
        appointments: [],
      });
      await user.save();

      return res.status(200).json({ appointments: [] });
    }

    const sortedAppointments = user.appointments.sort((a, b) => {
      if (new Date(a.appointmentDate) === new Date(b.appointmentDate)) {
        var t1 = a.appointmentTime.split(" - ");
        var t2 = b.appointmentTime.split(" - ");
        var time1 = t1.split(":");
        var time2 = t2.split(":");

        var date1 = new Date(0, 0, 0, time1[0], time1[1]);
        var date2 = new Date(0, 0, 0, time2[0], time2[1]);

        return date1 - date2;
      }
      return -(new Date(a.appointmentDate) - new Date(b.appointmentDate));
    });

    res.status(200).json({ appointments: sortedAppointments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAvailableAppointmentTimes = async (req, res) => {
  try {
    const counsellor = req.body.counsellor;
    const dt = new Date(req.body.date);

    const date = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());

    const appointments = await Appointment.find({
      counsellor: counsellor,
      appointmentDate: date,
    });

    const uniqueTimes = [
      ...new Set(
        appointments.map((appointment) => appointment.appointmentTime)
      ),
    ];

    const appointmentTimeOptions = [
      "10:00 - 11:00",
      "11:00 - 12:00",
      "12:00 - 13:00",
      "13:00 - 14:00",
      "14:00 - 15:00",
      "15:00 - 16:00",
      "16:00 - 17:00",
      "17:00 - 18:00",
    ];

    const availableAppointmentTimes = appointmentTimeOptions.filter(
      (time) => !uniqueTimes.includes(time)
    );
    res.status(200).json({ availableTimes: availableAppointmentTimes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    const username = req.params.username;

    let user = await User.findOne({
      username: username,
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.appointments = user.appointments.filter(
      (appointment) => appointment._id !== appointmentId
    );

    await user.save();

    await Appointment.deleteOne({ _id: appointmentId });

    res.status(200).json({ message: "Appointment deleted successfully" });
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }

}

module.exports = {
  addAppointment,
  getAppointments,
  getAvailableAppointmentTimes,
  deleteAppointment,
};
