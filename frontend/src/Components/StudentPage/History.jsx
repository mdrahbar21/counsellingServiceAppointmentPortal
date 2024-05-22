import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Divider,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import RefreshIcon from "@mui/icons-material/Refresh";
import { toast } from "react-toastify";

function getStatus(appointment) {
  const { appointmentDate, appointmentTime } = appointment;
  const [start, end] = appointmentTime.split(" - ");
  const [startHour, startMin] = start.split(":").map(Number);
  const [endHour, endMin] = end.split(":").map(Number);

  const currentDate = new Date();
  const curr = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate()
  );
  const ap = new Date(
    appointmentDate.getFullYear(),
    appointmentDate.getMonth(),
    appointmentDate.getDate()
  );

  if (curr > ap) {
    return "past";
  } else if (curr < ap) {
    return "future";
  } else {
    const currentHour = currentDate.getHours();
    const currentMin = currentDate.getMinutes();
    if (
      currentHour > endHour ||
      (currentHour === endHour && currentMin > endMin)
    ) {
      return "past";
    } else if (
      currentHour < startHour ||
      (currentHour === startHour && currentMin < startMin)
    ) {
      return "future";
    } else {
      return "ongoing";
    }
  }
}

function formatDate(date) {
  const options = { month: "2-digit", day: "2-digit", year: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

function History({ appointments, fetchAppointments, username }) {
  const futureAppointments = [];
  const ongoingAppointments = [];
  const pastAppointments = [];

  useEffect(() => {
    fetchAppointments();
  }, []);

  appointments.forEach((appointment) => {
    const date = new Date(appointment.appointmentDate);
    appointment.appointmentDate = date;
    const status = getStatus(appointment);
    switch (status) {
      case "future":
        futureAppointments.push(appointment);
        break;
      case "ongoing":
        ongoingAppointments.push(appointment);
        break;
      case "past":
        pastAppointments.push(appointment);
        break;
      default:
        break;
    }
  });

  const handleRefresh = async () => {
    await fetchAppointments();
  };

  const handleDelete = async (ID) => {
    try {
      const res = await fetch(
        `http://localhost:8080/user/appointment/delete/${username}/${ID}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error("An error occurred. Please try again later.");
      }

      toast.success("Appointment deleted successfully.", {
        position: "top-center",
        autoClose: 2000,
      });

      fetchAppointments();
    } catch (error) {
      toast.error("An error occurred. Please try again later.", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  return (
    <Container maxWidth="lg" style={{ height: "100%" }}>
      <Divider style={{ margin: "20px 0" }}>
        <IconButton onClick={handleRefresh}>
          <RefreshIcon />
        </IconButton>
      </Divider>
      {futureAppointments.length === 0 &&
        ongoingAppointments.length === 0 &&
        pastAppointments.length === 0 && (
          <Typography
            variant="h5"
            style={{ marginTop: "20px", textAlign: "center" }}
          >
            No appointments found.
          </Typography>
        )}

      {futureAppointments.length > 0 && (
        <>
          <Typography variant="h6" gutterBottom>
            Future Appointments
          </Typography>
          {futureAppointments.map((appointment, index) => (
            <Card key={index} style={{ marginBottom: "10px" }}>
              <CardContent style={{ display: "flex" }}>
                <Box style={{ flex: "80%" }}>
                  <Typography variant="h4" component="div" fontWeight="bold">
                    {appointment.counsellor}
                  </Typography>
                  <Typography variant="body1" component="div">
                    {formatDate(appointment.appointmentDate)} at{" "}
                    {appointment.appointmentTime}
                  </Typography>
                </Box>
                <Box
                  style={{
                    flex: "20%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgb(255, 59, 48)",
                    minHeight: "100%",
                    flex: 1,
                    marginBottom: "-25px",
                    marginTop: "-25px",
                    marginRight: "-17px",
                  }}
                >
                  <IconButton
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      handleDelete(appointment._id);
                    }}
                  >
                    <DeleteOutlineIcon style={{ color: "white" }} />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          ))}
        </>
      )}

      {ongoingAppointments.length > 0 && (
        <>
          <Divider style={{ margin: "20px 0" }} />
          <Typography variant="h6" gutterBottom>
            Ongoing Appointments
          </Typography>
          {ongoingAppointments.map((appointment, index) => (
            <Card key={index} style={{ marginBottom: "10px" }}>
              <CardContent style={{ display: "flex" }}>
                <Box style={{ flex: "80%" }}>
                  <Typography variant="h4" component="div" fontWeight="bold">
                    {appointment.counsellor}
                  </Typography>
                  <Typography variant="body1" component="div">
                    {formatDate(appointment.appointmentDate)} at{" "}
                    {appointment.appointmentTime}
                  </Typography>
                </Box>
                <Box
                  style={{
                    flex: "20%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgb(255, 204, 0)",
                    minHeight: "100%",
                    flex: 1,
                    marginBottom: "-25px",
                    marginTop: "-25px",
                    marginRight: "-17px",
                  }}
                >
                  <IconButton disabled>
                    <FiberManualRecordIcon style={{ color: "white" }} />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          ))}
        </>
      )}

      {pastAppointments.length > 0 && (
        <>
          <Divider style={{ margin: "20px 0" }} />
          <Typography variant="h6" gutterBottom>
            Past Appointments
          </Typography>
          {pastAppointments.map((appointment, index) => (
            <Card key={index} style={{ marginBottom: "10px" }}>
              <CardContent style={{ display: "flex" }}>
                <Box style={{ flex: "80%" }}>
                  <Typography variant="h4" component="div" fontWeight="bold">
                    {appointment.counsellor}
                  </Typography>
                  <Typography variant="body1" component="div">
                    {formatDate(appointment.appointmentDate)} at{" "}
                    {appointment.appointmentTime}
                  </Typography>
                </Box>
                <Box
                  style={{
                    flex: "20%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgb(76, 217, 100)",
                    minHeight: "100%",
                    flex: 1,
                    marginBottom: "-25px",
                    marginTop: "-25px",
                    marginRight: "-17px",
                  }}
                >
                  <IconButton disabled>
                    <CheckCircleOutlineIcon style={{ color: "white" }} />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          ))}
        </>
      )}
    </Container>
  );
}

export default History;
