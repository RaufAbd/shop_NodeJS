exports.notFound = (req, res, next) => {
  res.render("404", {
    pageTitle: "Not Found!",
    url: "",
    isAuthenticated: req.session.isLoggedIn,
  });
};
