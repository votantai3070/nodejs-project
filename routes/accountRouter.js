var express = require("express");
const userController = require("../controllers/userController");

const { ensureAuthenticated } = require("../config/auth");
var accountRouter = express.Router();

accountRouter.route("/").get(ensureAuthenticated, userController.dashboard);

module.exports = accountRouter;
