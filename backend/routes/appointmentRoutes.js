const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();

router.use(bodyParser.json());

const {
  addAppointment,
  getAppointments,
  getAvailableAppointmentTimes,
  deleteAppointment,
} = require("../controllers/appointmentController");

router.route("/add/:username").post(addAppointment);
router.route("/get/:username").get(getAppointments);
router.route("/get/available-times").post(getAvailableAppointmentTimes);
router.route("/delete/:username/:id").post(deleteAppointment);

module.exports = router;
