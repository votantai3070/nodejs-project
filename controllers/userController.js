const User = require("../models/users");
const bcrypt = require("bcrypt");
const passport = require("passport");
const Users = require("../models/users");
class UserController {
  index(req, res) {
    res.render("register");
  }
  register(req, res, next) {
    const { username, password, name, yob, admin } = req.body;
    let errors = [];
    if (!username || !password || !name || !yob) {
      errors.push({ msg: "Please enter all fields" });
    }
    if (password.length < 6) {
      errors.push({ msg: "Password must be at least 6 characters" });
    }
    // Validate YOB (Year of Birth), for example, check if it's a valid year
    const currentYear = new Date().getFullYear();
    if (yob < 1900 || yob > currentYear) {
      errors.push({ msg: "Please enter a valid year of birth" });
    }
    if (errors.length > 0) {
      res.render("register", {
        errors,
        username,
        password,
        name,
        yob,
      });
    } else {
      User.findOne({ username: username }).then((user) => {
        if (user) {
          errors.push({ msg: "Username already exists" });
          res.render("register", {
            errors,
            username,
            password,
            name,
            yob,
          });
        } else {
          const newUser = new User({
            username,
            password,
            name,
            YOB: yob,
            isAdmin: admin === "on",
          });
          // Hash password
          bcrypt.hash(newUser.password, 10, function (err, hash) {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then((user) => {
                res.redirect("/users/login");
              })
              .catch(next);
          });
        }
      });
    }
  }

  login(req, res) {
    res.render("login");
  }
  signin(req, res, next) {
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/users/login",
      failureFlash: true,
    })(req, res, next);
  }
  signout(req, res, next) {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      req.flash("success_msg", "You are logged out");
      res.redirect("/");
    });
  }

  dashboard(req, res) {
    Users.find({}).then((users) => {
      res.render("account", {
        title: "List of Users",
        userData: users,
        currentUser: req.user,
      });
    });
  }

  renderEditForm(req, res) {
    const { accountId } = req.params;
    User.findById(accountId, (err, user) => {
      if (err) {
        return res.status(500).send("Internal Server Error");
      }
      if (!user) {
        return res.status(404).send("User not found");
      }
      if (user._id.toString() !== req.user._id.toString()) {
        return res.status(403).send("Unauthorized");
      }
      res.render("editAccount", { user });
    });
  }

  updateUser(req, res) {
    try {
      const { accountId } = req.params;
      const { username, name, YOB, isAdmin } = req.body;
      console.log("update body", req.body);

      const yearOfBirth = parseInt(YOB);

      const isAdminUser = isAdmin === "on";

      User.findByIdAndUpdate(
        accountId,
        { username, name, YOB: yearOfBirth, isAdmin: isAdminUser },
        { new: true }
      ).then(() => {
        res.redirect("/accounts");
      });
    } catch (error) {
      return res.status(500).send({
        err: error.message,
      });
    }
  }
  changePassword = async (req, res) => {
    const userId = req.params.userId;
    const { newPassword, confirmPassword } = req.body;

    try {
      if (newPassword !== confirmPassword) {
        return res
          .status(400)
          .json({ message: "New password and confirm password do not match." });
      }

      if (newPassword.length < 6) {
        return res
          .status(400)
          .json({ message: "Password must be at least 6 characters long." });
      }

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      user.password = hashedPassword;
      await user.save();

      res.status(200).json({ message: "Password updated successfully." });
    } catch (error) {
      console.error("Error changing password:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  };
}
module.exports = new UserController();
