const Category = require("../models/categories");
const Orchid = require("../models/orchids");

class HomeController {
  async index(req, res) {
    try {
      const orchids = await Orchid.find({}).populate({
        path: "category",
        select: "categoryName",
      });
      res.render("homepage", {
        title: "List of Orchids",
        orchidData: orchids,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error while retrieving data");
    }
  }
}

module.exports = new HomeController();
