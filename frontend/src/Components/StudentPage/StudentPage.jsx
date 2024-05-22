import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Grid, Divider } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import AppointmentForm from "./AppointmentForm";
import History from "./History";

const StudentPage = () => {
  const { username } = useParams();
  const [appointments, setAppointments] = useState([]);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const fetchAppointments = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/user/appointment/get/${username}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("An error occurred. Please try again later.");
      }

      const data = await response.json();
      if (data && data.appointments) {
        setAppointments(data.appointments);
      } else {
        setAppointments([]);
      }
    } catch (error) {
      toast.error("Error fetching appointments, Please refresh the page.", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      {isMobile ? (
        <>
          <AppointmentForm />
        </>
      ) : (
        <Grid container style={{ height: "auto" }}>
          <Grid item xs={2} />
          <Grid item xs={5}>
            <AppointmentForm
              fetchAppointments={fetchAppointments}
              username={username}
            />
          </Grid>
          <Divider orientation="vertical" style={{ height: "auto" }} />
          <Grid item xs={3}>
            <History
              appointments={appointments}
              fetchAppointments={fetchAppointments}
              username={username}
            />
          </Grid>
          <Grid item xs={2} />
        </Grid>
      )}
      <ToastContainer />
    </>
  );
};

export default StudentPage;
