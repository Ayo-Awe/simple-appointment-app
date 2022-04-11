const Admin = require("../Models/AdminModel");
const Appointment = require("../Models/AppointmentModel");
const jwt = require("jsonwebtoken");
const exceljs = require("exceljs");
require("dotenv").config();
const maxAge = 24 * 60 * 60; // a day in seconds

module.exports.get_admin_login = (req, res) => {
  res.render("adminLogin");
};
module.exports.get_admin = async (req, res) => {
  const appointments = await Appointment.find();
  res.render("admin", { appointments });
};

module.exports.post_admin_login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // authenticates user
    const match = await Admin.AdminLogin(username, password);
    if (match) {
      const token = createToken({ username, password });
      res.cookie("jwt", token, {
        maxAge: maxAge * 1000,
        httpOnly: true,
      });
      res.status(200).json({
        success: "ok",
        message: "You are successfully logged in",
        username,
        location: "/admin",
      });
    }
  } catch (error) {
    console.debug(error);
    res.status(400).json({ success: "false", message: error.message });
  }
};

module.exports.post_admin_register = async (req, res) => {
  const { username, password } = req.body;
  try {
    // create new user
    const user = await Admin.create({ username, password });

    //check if user was successfully create and send response
    if (user) {
      res.status(200).json({
        success: "ok",
        message: "Successfully created user",
        user: user.username,
      });
    }
  } catch (error) {
    res.status(300).json({ success: "false", message: error.message });
  }
};

module.exports.get_admin_download = async (req, res) => {
  try {
    const appointments = await Appointment.find();
    // create excel workbook file
    const workbook = new exceljs.Workbook();

    // set workbook properties
    workbook.creator = "My startup";
    workbook.created = new Date(Date.now());

    // add worksheet to workbook
    const sheet = workbook.addWorksheet("Booked Appointments");

    // set worksheet headers
    sheet.columns = [
      { header: "Name", key: "name", width: 25 },
      { header: "Email", key: "email", width: 25 },
      { header: "Phone Number", key: "phoneNumber", width: 20 },
      { header: "Date", key: "date", width: 16 },
      { header: "Area", key: "area", width: 25 },
      { header: "City", key: "city", width: 25 },
      { header: "State", key: "state", width: 25 },
      { header: "Postal Code", key: "postalCode", width: 16 },
    ];

    const headerRow = sheet.getRow(1);
    headerRow.alignment = { vertical: "middle", horizontal: "center" };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "4BE159" },
    };
    headerRow.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    // store each db data in it's own row
    const rows = sheet.getRows(2, appointments.length);
    for (let i = 0; i < appointments.length; i++) {
      const { name, email, phoneNumber, date, area, city, state, postalCode } =
        appointments[i];
      rows[i].values = {
        name,
        email,
        phoneNumber,
        date,
        area,
        city,
        state,
        postalCode,
      };
      rows[i].alignment = { vertical: "middle", horizontal: "center" };
    }
    res.attachment("Appointments.xlsx");
    await workbook.xlsx.write(res);
  } catch (error) {
    console.debug(error);
  }
};

const createToken = (data) => {
  return jwt.sign(data, process.env.JWT_SECRET, {
    expiresIn: maxAge,
  });
};
