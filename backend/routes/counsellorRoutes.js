const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();

router.use(bodyParser.json());

const { addCounsellor, getCounsellorAppointments } = require("../controllers/counsellorController");

router.route("/add").post(addCounsellor);
router.route("/get/:username").get(getCounsellorAppointments);

module.exports = router;
