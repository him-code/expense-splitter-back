const {
  signup,
  login,
  forgetPassword,
} = require("../controllers/userController");
const { authenticate } = require("../middlewares/authenticate");

module.exports = function (app) {
  // open routes
  app.post("/signup", signup);
  app.post("/login", login);
  app.post("/forgetpassword", forgetPassword);

  // authenticated user
  app.get("/dashboard", authenticate, dashboard )
};
