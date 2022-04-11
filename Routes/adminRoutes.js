const router = require("express").Router();
const {
  get_admin,
  get_admin_login,
  post_admin_login,
  post_admin_register,
  get_admin_download,
} = require("../Controllers/adminController");
const { requireAuth } = require("../Middleware/authMiddleware");

router.get("/login", get_admin_login);

router.get("/", requireAuth, get_admin);

router.post("/login", post_admin_login);

router.post("/register", post_admin_register);

router.get("/download", requireAuth, get_admin_download);

module.exports = router;
