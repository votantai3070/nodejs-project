var express = require("express");
const userController = require("../controllers/userController");
const orchidsController = require("../controllers/orchidsController");
const { ensureAuthenticated } = require("../config/auth");
const categoryController = require("../controllers/categoryController");
var userRouter = express.Router();

userRouter
  .route("/register")
  .get(userController.index)
  .post(userController.register);
userRouter
  .route("/login")
  .get(userController.login)
  .post(userController.signin);
userRouter.route("/logout").get(userController.signout);
userRouter
  .route("/edit/:accountId")
  .get(ensureAuthenticated, userController.renderEditForm)
  .post(ensureAuthenticated, userController.updateUser);
userRouter
  .route("/orchids")
  .get(ensureAuthenticated, orchidsController.index)
  .post(ensureAuthenticated, orchidsController.create);
userRouter
  .route("/orchid/update/:orchidId")
  .get(ensureAuthenticated, orchidsController.formEdit)
  .post(ensureAuthenticated, orchidsController.edit);
userRouter
  .route("/orchids/detail/:orchidId")
  .get(orchidsController.getOrchidDetail);
userRouter.route("/orchids/comment").post(orchidsController.submitComment);
userRouter
  .route("/delete/:orchidId")
  .get(ensureAuthenticated, orchidsController.remove);
userRouter
  .route("/change-password/:userId")
  .post(ensureAuthenticated, userController.changePassword);
userRouter
  .route("/categories")
  .get(ensureAuthenticated, categoryController.index)
  .post(ensureAuthenticated, categoryController.create);
userRouter
  .route("/categories/update/:categoriesId")
  .get(ensureAuthenticated, categoryController.formEdit)
  .post(ensureAuthenticated, categoryController.edit);
userRouter
  .route("/category/delete/:categoriesId")
  .get(ensureAuthenticated, categoryController.remove);
userRouter.route("/profile").get(ensureAuthenticated, userController.profile);
module.exports = userRouter;
