import React, { useState } from "react";
import { Card, CardContent, Typography, Button, Dialog, DialogTitle, DialogContent, Box, Divider } from "@mui/material";

const AppointmentCard = ({ appointment }) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const photoURL = `https://oa.cc.iitk.ac.in/Oa/Jsp/Photo/${appointment.rollNumber}_0.jpg`;

  return (
    <>
      <Card variant="outlined" style={{ marginBottom: "10px", border: "2px solid #000", display: "flex" }}>
        <div style={{ flex: "20%", minWidth: "80px" }}>
          <img src={photoURL} alt="Student" style={{ width: "100%", height: "100%" }} />
        </div>
        <div style={{ flex: "100%" }}>
          <CardContent style={{ padding: "20px", display: "flex", justifyContent: "space-between" }}>
            <div style={{ flex: "1" }}>
              <Typography variant="h6" component="div" fontWeight="bold" style={{ marginBottom: "10px" }}>
                {appointment.name}
              </Typography>
              <Typography variant="body1" component="div" style={{ marginBottom: "5px" }}>
                Date: {new Date(appointment.appointmentDate).toLocaleDateString()}
              </Typography>
              <Typography variant="body1" component="div" style={{ marginBottom: "5px" }}>
                Time: {appointment.appointmentTime}
              </Typography>
              <Button onClick={handleClickOpen} variant="outlined" size="small">
                Click for More
              </Button>
            </div>
            <div style={{ flex: "1", marginLeft: "20px" }}>
              <Typography variant="body1" component="div" fontWeight="bold">
                Comments:
              </Typography>
              <Typography variant="body1" component="div">
                {appointment.comments || "N/A"}
              </Typography>
            </div>
          </CardContent>
        </div>
      </Card>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Appointment Details</DialogTitle>
        <DialogContent>
          <Typography variant="h6" component="div" fontWeight="bold">
            {appointment.name}
          </Typography>
          <Typography variant="body1" component="div">
            <strong>Date:</strong> {new Date(appointment.appointmentDate).toLocaleDateString()}
          </Typography>
          <Typography variant="body1" component="div">
            <strong>Time:</strong> {appointment.appointmentTime}
          </Typography>
          <Typography variant="body1" component="div">
            <strong>Roll Number:</strong> {appointment.rollNumber}
          </Typography>
          <Typography variant="body1" component="div">
            <strong>Programme:</strong> {appointment.programme}
          </Typography>
          <Typography variant="body1" component="div">
            <strong>Department:</strong> {appointment.department}
          </Typography>
          <Typography variant="body1" component="div">
            <strong>Hall:</strong> {appointment.hall}
          </Typography>
          <Typography variant="body1" component="div">
            <strong>Room Number:</strong> {appointment.roomNumber}
          </Typography>
          <Typography variant="body1" component="div">
            <strong>Phone:</strong> {appointment.phone}
          </Typography>
          <Typography variant="body1" component="div">
            <strong>Counsellor:</strong> {appointment.counsellor}
          </Typography>
          <Typography variant="body1" component="div">
            <strong>Visit:</strong> {appointment.visit}
          </Typography>
          <Divider style={{ margin: "10px 0" }} />
          <Box>
            <Typography variant="body1" component="div" fontWeight="bold">
              Last Visit Date:
            </Typography>
            <Typography variant="body1" component="div">
              {appointment.lastVisitDate ? new Date(appointment.lastVisitDate).toLocaleDateString() : "N/A"}
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AppointmentCard;