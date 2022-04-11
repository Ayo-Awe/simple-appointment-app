const express = require("express");
const app = express();
const appointmentRouter = require("./Routes/appointmentRoutes");
const adminRouter = require("./Routes/adminRoutes");
const port = process.env.PORT || 8080;
const cookieParser = require("cookie-parser");
const { ConfigureDB } = require("./db/index");

// To do
// push to github
// add db and store in db with minimum validation
// create xlxs file
// create admin login page
// incorporate authentication with jwt and bcrypt
// create admin page with simple download appointment info as xlsx file

// set template engine
app.set("view engine", "ejs");

// express middleware
app.use(cookieParser());
app.use(express.static("public"));
app.use(express.json());

// Appointment routes
app.use("/appointment", appointmentRouter);
app.use("/admin", adminRouter);

// routes
app.get("/", (req, res) => {
  res.redirect("/appointment");
});

ConfigureDB(() => {
  app.listen(port, () => {
    console.log(`listening on port ${port}...`);
  });
});
