const router = require("express").Router();
const {
  post_appointment,
  get_appointment,
  get_success,
} = require("../Controllers/appoinmentController");

router.get("/", get_appointment);

router.post("/", post_appointment);

router.get("/success", get_success);

module.exports = router;
