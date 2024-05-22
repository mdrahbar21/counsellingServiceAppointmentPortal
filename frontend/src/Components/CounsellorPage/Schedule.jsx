import React, { useEffect, useState } from "react";
import { Container, Typography, Divider } from "@mui/material";

const timeIntervals = [
  "10:00 - 11:00",
  "11:00 - 12:00",
  "12:00 - 13:00",
  "13:00 - 14:00",
  "14:00 - 15:00",
  "15:00 - 16:00",
  "16:00 - 17:00",
  "17:00 - 18:00"
];

const Schedule = ({ appointments }) => {
  const [appointmentTimes, setAppointmentTimes] = useState([]);

  useEffect(() => {
    const times = appointments.map(appointment => appointment.appointmentTime.split(" - ")[0]);
    setAppointmentTimes(times);
  }, [appointments]);

  const getTimeSlotColor = (timeSlot) => {
    const startTime = timeSlot.split(" - ")[0];
    return appointmentTimes.includes(startTime) ? "#FF0000" : "#00FF00";
  };

  return (
    <Container maxWidth="sm">
      <Divider style={{ marginBottom: "10px" }} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", height: "500px", position: "relative" }}>
        {timeIntervals.map((interval, index) => {
          const color = getTimeSlotColor(interval);
          return (
            <div key={index} style={{ position: "absolute", top: `${index * 60}px`, width: "100%", height: "60px" }}>
              <div style={{ backgroundColor: color, width: "100%", height: "100%", border: "1px solid #000", opacity: "0.5" }}></div>
              <Typography style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", left: "10px", color: "#000" }}>{interval}</Typography>
            </div>
          );
        })}
      </div>
    </Container>
  );
};

export default Schedule;