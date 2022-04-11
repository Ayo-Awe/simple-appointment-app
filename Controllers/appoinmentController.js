const Appointment = require("../Models/AppointmentModel");
const maxAge = 60 * 60 * 1000; // one hour in millisecond i.e

module.exports.post_appointment = async (req, res) => {
  // destruct data from the request body
  const { name, phoneNumber, email, area, city, state, postalCode, date } =
    req.body;

  try {
    // remove previous success cookie if any
    res.clearCookie("success");

    // find all booked appointments by this user @email
    const userAppointments = await Appointment.find({ email });

    if (userAppointments.length !== 0) {
      // returns a booking if a user already has a booking for the specified date
      // and returns undefined if otherwise
      const clashingBooking = userAppointments.find((appointment) => {
        const bookingDate = new Date(date);
        return appointment.date.getTime() === bookingDate.getTime();
      });

      if (clashingBooking) {
        throw Error(
          `Booking failed, you already have an appoinment for ${date}`
        );
      }
    }

    const appointment = await Appointment.create({
      name,
      phoneNumber,
      email,
      area,
      city,
      state,
      postalCode,
      date,
    });

    if (appointment) {
      // implement a success cookie then redirect to '/success'
      res.cookie("date", date, { maxAge });
      res.status(200).json({
        success: "ok",
        message: "Appointment successfully booked",
        location: `/appointment/success`,
        appointment,
      });
    }
  } catch (error) {
    res.status(400).json({ success: "false", message: error.message });
  }
};

module.exports.get_appointment = (req, res) => {
  res.render("index");
};

module.exports.get_success = (req, res) => {
  // render page if request body has a cookie, else redirect to '/appointment'
  const { date } = req.cookies;
  if (date) {
    res.render("success", { date });
  } else {
    res.redirect("/appointment");
  }
};

// add some validation
