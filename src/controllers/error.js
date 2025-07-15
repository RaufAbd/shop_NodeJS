exports.notFound = (req, res, next) => {
  res.status(404).render("404", {
    pageTitle: "Page Not Found!",
    url: "/404",
  });
};

exports.get500 = (req, res, next) => {
  res.status(500).render("500", {
    pageTitle: "Error!",
    url: "/500",
  });
};
