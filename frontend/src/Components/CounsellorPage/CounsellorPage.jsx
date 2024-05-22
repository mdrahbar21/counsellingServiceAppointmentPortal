import React, { useEffect, useState } from "react";
import { Container, Typography, IconButton, Divider, Box, Grid } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import AppointmentCard from "./AppointmentCard";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import moment from "moment";
import Schedule from "./Schedule";

const CounsellorPage = () => {
  const [appointments, setAppointments] = useState([]);
  const { username } = useParams();
  const [numAppointments, setNumAppointments] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    fetchAppointments();
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch(`http://localhost:8080/counsellor/get/${username}`);
      if (!response.ok) {
        throw new Error("An error occurred while fetching appointments.");
      }
      const data = await response.json();
      setAppointments(data.appointments);
      setNumAppointments(data.appointments.length);
    } catch (error) {
      console.error("Error fetching appointments:", error.message);
      toast.error("Error fetching appointments, Please refresh the page.", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  const handleRefresh = () => {
    fetchAppointments();
  };

  return (
    <Container maxWidth="lg">
      <ToastContainer />
      <Grid container>
        <Grid item xs={isMobile ? 12 : 9}>
          <Box display="flex" alignItems="center" marginBottom="20px">
            <img src="/counsellor.jpeg" alt="Counsellor" style={{ maxWidth: "100%", height: "auto", border: "1px solid #ccc", borderRadius: "5px", marginRight: "20px" }} />
            <Box>
              <Typography variant="body1" style={{ fontWeight: "bold", marginBottom: "8px", fontSize: "16px", fontFamily: "Arial, sans-serif" }}>Username: <span style={{ fontWeight: "normal" }}>{username}</span></Typography>
              <Typography variant="body2" style={{ fontWeight: "bold", marginBottom: "8px", fontSize: "16px", fontFamily: "Arial, sans-serif" }}>Today's Date: <span style={{ fontWeight: "normal" }}>{moment().format("MMMM DD, YYYY")} ({moment().format("dddd")})</span></Typography>
              <Typography variant="body2" style={{ fontWeight: "bold", fontSize: "16px", fontFamily: "Arial, sans-serif" }}>No of Appointments: <span style={{ fontWeight: "normal" }}>{numAppointments}</span></Typography>
            </Box>
          </Box>
          <Divider style={{ marginBottom: "20px" }} />
          <Typography variant="h5" gutterBottom>
            Upcoming Appointments
            <IconButton onClick={handleRefresh}>
              <RefreshIcon />
            </IconButton>
          </Typography>
          {appointments.length === 0 ? (
            <Typography variant="body1">No upcoming appointments.</Typography>
          ) : (
            appointments.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))
          )}
        </Grid>
        {!isMobile && (
          <Grid item xs={3}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Typography variant="h6" gutterBottom>Today's Schedule</Typography>
              <Schedule appointments={appointments} />
            </Box>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default CounsellorPage;