import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addMonths, subDays } from "date-fns";

const appointmentSchema = {
  name: "",
  rollNumber: "",
  programme: "",
  department: "",
  hall: "",
  roomNumber: "",
  phone: "",
  counsellor: "",
  appointmentDate: null,
  appointmentTime: "",
  visit: "",
  lastVisitDate: null,
  comments: "",
};

const counsellorOptions = ["Counsellor 1", "Counsellor 2", "Counsellor 3"];
const visitOptions = ["First Visit", "Follow-up Visit"];

const AppointmentForm = ({ fetchAppointments, username }) => {
  const [appointment, setAppointment] = useState(appointmentSchema);
  const [appointmentTimeOptions, setAppointmentTimeOptions] = useState([
    "10:00 - 11:00",
    "11:00 - 12:00",
    "12:00 - 13:00",
    "13:00 - 14:00",
    "14:00 - 15:00",
    "15:00 - 16:00",
    "16:00 - 17:00",
    "17:00 - 18:00",
  ]);

  const handleInputChange = (e) => {
    setAppointment({ ...appointment, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date, name) => {
    setAppointment({ ...appointment, [name]: date });
  };

  const handleAppointmentTimeChange = (e) => {
    setAppointment({ ...appointment, appointmentTime: e.target.value });
  };

  const handleCounsellorChange = (e) => {
    setAppointment({ ...appointment, counsellor: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (appointment.appointmentDate === null) {
      toast.error("Please select an appointment date.", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    if (
      appointment.visit === "Follow-up Visit" &&
      appointment.lastVisitDate === null
    ) {
      toast.error("Please select the last visit date.", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/user/appointment/add/${username}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: appointment.name,
            rollNumber: appointment.rollNumber,
            programme: appointment.programme,
            department: appointment.department,
            hall: appointment.hall,
            roomNumber: appointment.roomNumber,
            phone: appointment.phone,
            counsellor: appointment.counsellor,
            appointmentDate: appointment.appointmentDate,
            appointmentTime: appointment.appointmentTime,
            visit: appointment.visit,
            lastVisitDate: appointment.lastVisitDate,
            comments: appointment.comments,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("An error occurred. Please try again later.");
      }

      setAppointment(appointmentSchema);
      toast.success("Appointment submitted successfully.", {
        position: "top-center",
        autoClose: 2000,
      });
    } catch (error) {
      toast.error("An error occurred. Please try again later.", {
        position: "top-center",
        autoClose: 2000,
      });
    }

    fetchAppointments();
  };

  useEffect(() => {
    const func = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/user/appointment/get/available-times`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              counsellor: appointment.counsellor,
              date: appointment.appointmentDate,
            }),
          }
        );

        if (!res.ok) {
          throw new Error("An error occurred. Please try again later.");
        }

        const data = await res.json();
        const availableTimes = data.availableTimes;
        if (availableTimes) {
          setAppointmentTimeOptions(availableTimes);
        } else {
          setAppointmentTimeOptions([]);
        }
      } catch (error) {
        toast.error("An error occurred. Please refresh the page", {
          position: "top-center",
          autoClose: 2000,
        });
      }
    };

    if (appointment.counsellor !== "" && appointment.appointmentDate !== null) {
      func();
    }
  }, [appointment]);

  return (
    <Container
      maxWidth="md"
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignContent: "center",
        alignItems: "center",
      }}
    >
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Appointment Form
        </Typography>
        <form
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <TextField
            name="name"
            label="Name"
            fullWidth
            margin="dense"
            value={appointment.name}
            onChange={handleInputChange}
            required
          />
          <TextField
            name="rollNumber"
            label="Roll Number"
            fullWidth
            margin="dense"
            value={appointment.rollNumber}
            onChange={handleInputChange}
            required
          />
          <TextField
            name="programme"
            label="Programme"
            fullWidth
            margin="dense"
            value={appointment.programme}
            onChange={handleInputChange}
            required
          />
          <TextField
            name="department"
            label="Department"
            fullWidth
            margin="dense"
            value={appointment.department}
            onChange={handleInputChange}
            required
          />
          <TextField
            name="hall"
            label="Hall"
            fullWidth
            margin="dense"
            value={appointment.hall}
            onChange={handleInputChange}
            required
          />
          <TextField
            name="roomNumber"
            label="Room Number"
            fullWidth
            margin="dense"
            value={appointment.roomNumber}
            onChange={handleInputChange}
            required
          />
          <TextField
            name="phone"
            label="Phone"
            fullWidth
            margin="dense"
            value={appointment.phone}
            onChange={handleInputChange}
            required
          />
          <FormControl fullWidth margin="dense" required variant="outlined">
            <InputLabel
              fullWidth
              variant="outlined"
              margin="dense"
              style={{ paddingLeft: "8px", backgroundColor: "#fff" }}
            >
              Counsellor
            </InputLabel>
            <Select
              value={appointment.counsellor}
              onChange={handleCounsellorChange}
              name="counsellor"
            >
              {counsellorOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Appointment Date"
              value={appointment.appointmentDate}
              onChange={(date) => handleDateChange(date, "appointmentDate")}
              minDate={new Date()}
              maxDate={addMonths(new Date(), 1)}
              slotProps={{
                textField: {
                  required: true,
                },
              }}
            />
          </LocalizationProvider>
          <FormControl fullWidth margin="dense" required variant="outlined">
            {appointmentTimeOptions.length === 0 ? (
              <>
                <InputLabel
                  fullWidth
                  variant="outlined"
                  margin="dense"
                  style={{
                    paddingLeft: "8px",
                    backgroundColor: "#fff",
                    color: "rgb(255, 59, 48)",
                  }}
                >
                  No slots available on selected date for selected counsellor
                </InputLabel>
                <Select
                  value={appointment.appointmentTime}
                  onChange={handleAppointmentTimeChange}
                  name="appointmentTime"
                  disabled
                ></Select>
              </>
            ) : (
              <>
                <InputLabel
                  fullWidth
                  variant="outlined"
                  margin="dense"
                  style={{ paddingLeft: "8px", backgroundColor: "#fff" }}
                >
                  Appointment Time
                </InputLabel>
                <Select
                  value={appointment.appointmentTime}
                  onChange={handleAppointmentTimeChange}
                  name="appointmentTime"
                >
                  {appointmentTimeOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </>
            )}
          </FormControl>
          <FormControl fullWidth margin="dense" required variant="outlined">
            <InputLabel
              fullWidth
              variant="outlined"
              margin="dense"
              style={{ paddingLeft: "8px", backgroundColor: "#fff" }}
            >
              Visit
            </InputLabel>
            <Select
              value={appointment.visit}
              onChange={handleInputChange}
              name="visit"
            >
              {visitOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Last Visit Date(if any)"
              value={appointment.lastVisitDate}
              onChange={(date) => handleDateChange(date, "lastVisitDate")}
              maxDate={subDays(new Date(), 1)}
            />
          </LocalizationProvider>
          <TextField
            name="comments"
            label="Comments"
            fullWidth
            multiline
            rows={4}
            margin="dense"
            value={appointment.comments}
            onChange={handleInputChange}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
          >
            Submit
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default AppointmentForm;
