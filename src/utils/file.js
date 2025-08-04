const fs = require("fs");

const deleteFile = (filePath) => {
  if (!filePath) return;
  fs.unlink(filePath, (err) => {
    throw err;
  });
};

exports.deleteFile = deleteFile;
