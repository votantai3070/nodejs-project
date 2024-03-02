const Category = require("../models/categories");

class CategoryController {
  index(req, res, next) {
    Category.find({})
      .then((category) => {
        res.render("categoryList", {
          title: "Category Page",
          categoryData: category,
        });
      })
      .catch(next);
  }
  create(req, res) {
    // Kiểm tra xem người dùng có quyền isAdmin không
    if (!req.user.isAdmin) {
      return res
        .status(403)
        .send("Bạn không có quyền thực hiện hành động này.");
    }

    const category = new Category(req.body);

    console.log("category", category);

    category.save().then(() => res.redirect("/users/categories"));
  }

  edit(req, res) {
    // Kiểm tra xem người dùng có quyền isAdmin không
    if (!req.user.isAdmin) {
      return res
        .status(403)
        .send("Bạn không có quyền thực hiện hành động này.");
    }

    Category.updateOne(
      { _id: req.params.categoriesId },
      { $set: req.body }
    ).then(() => {
      res.redirect("/users/categories");
    });
  }

  remove(req, res) {
    // Kiểm tra xem người dùng có quyền isAdmin không
    if (!req.user.isAdmin) {
      return res
        .status(403)
        .send("Bạn không có quyền thực hiện hành động này.");
    }

    Category.deleteOne({ _id: req.params.categoriesId }).then(() => {
      res.redirect("/users/categories");
    });
  }

  formEdit(req, res, next) {
    const categoriesId = req.params.categoriesId;

    Category.findById(categoriesId)

      .then((category) => {
        if (!category) {
          return next(new Error("Category not found"));
        }
        res.render("editCategory", {
          title: "The detail of Category",
          category,
        });
      })
      .catch(next);
  }
}

module.exports = new CategoryController();
