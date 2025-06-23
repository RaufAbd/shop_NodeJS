exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login",
    url: "/login",
    error: "",
  });
};

exports.postLogin = (req, res, next) => {
  req.session.isLoggedIn = true;
  res.redirect("/products");
};
