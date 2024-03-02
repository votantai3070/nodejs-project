const Category = require("../models/categories");
const Orchid = require("../models/orchids");
const Users = require("../models/users");

class OrchidController {
  async index(req, res) {
    try {
      const orchids = await Orchid.find({}).populate({
        path: "category",
        select: "categoryName",
      });
      const categories = await Category.find({});
      res.render("orchidsList", {
        title: "List of Orchids",
        orchidData: orchids,
        categories,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error while retrieving data");
    }
  }
  create(req, res) {
    if (!req.user.isAdmin) {
      return res
        .status(403)
        .send("Bạn không có quyền thực hiện hành động này.");
    }

    const orchid = new Orchid({
      ...req.body,
      category: req.body.category,
    });

    orchid
      .save()
      .then(() => res.redirect("/users/orchids"))
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error while saving the orchid.");
      });
  }

  edit(req, res) {
    if (!req.user.isAdmin) {
      return res
        .status(403)
        .send("Bạn không có quyền thực hiện hành động này.");
    }

    Orchid.updateOne({ _id: req.params.orchidId }, { $set: req.body }).then(
      () => {
        res.redirect("/users/orchids");
      }
    );
  }

  remove(req, res) {
    // Kiểm tra xem người dùng có quyền isAdmin không
    if (!req.user.isAdmin) {
      return res
        .status(403)
        .send("Bạn không có quyền thực hiện hành động này.");
    }

    Orchid.deleteOne({ _id: req.params.orchidId }).then(() => {
      res.redirect("/users/orchids");
    });
  }

  formEdit(req, res, next) {
    const orchidId = req.params.orchidId;

    Orchid.findById(orchidId)
      .populate("category", "categoryName")
      .then((orchid) => {
        if (!orchid) {
          return next(new Error("Orchid not found"));
        }
        Category.find({})
          .then((categories) => {
            res.render("editOrchids", {
              title: "The detail of Orchid",
              orchid: orchid,
              categories: categories,
            });
          })
          .catch(next);
      })
      .catch(next);
  }

  getOrchidDetail = async (req, res, next) => {
    try {
      const orchid = await Orchid.findById(req.params.orchidId)
        .populate("comments.author", "username")
        .populate("category", "categoryName");

      if (!orchid) {
        res.status(404).send("Hoa lan không tồn tại!");
        return;
      }

      const isAuthenticated = req.isAuthenticated();

      let userData = null;
      if (isAuthenticated) {
        userData = await Users.findById(req.user);
      }

      console.log("orchidDetail ", orchid);
      console.log("user ", userData);

      res.render("orchidDetail", {
        title: "Chi tiết hoa lan",
        orchidData: orchid,
        isAuthenticated,
        userData,
      });
    } catch (err) {
      console.log("err", err);
      res.render("error");
    }
  };

  async submitComment(req, res) {
    try {
      const { orchidId, comment } = req.body;

      const orchid = await Orchid.findById(orchidId);
      if (!orchid) {
        return res.status(404).send("Hoa lan không tồn tại!");
      }

      const user = req.user;
      console.log("userId", user);

      const existingComment = orchid.comments.find(
        (comment) => comment.author && comment.author.equals(user._id)
      );

      if (existingComment) {
        return res
          .status(400)
          .json({ success: false, message: "Bạn đã comment trước đó!" });
      }

      const newComment = {
        comment: comment,
        author: user,
        username: user.username,
      };

      orchid.comments.push(newComment);
      await orchid.save();
      res.redirect(`/users/orchids/detail/${orchidId}`);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Failed to add comment" });
    }
  }
}

module.exports = new OrchidController();
