const express = require("express");
const homeController = require("../controllers/homeController");
const homeRouter = express.Router();

homeRouter.route("/").get(homeController.index);
// homeRouter.get('/search', homeController.searchOrchids);

module.exports = homeRouter;
