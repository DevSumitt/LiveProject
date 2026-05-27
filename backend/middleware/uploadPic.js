const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        const UniqueName = Date.now() + "-" + file.originalname;
        cb(null, UniqueName);
    }
})

const filefilter = (req, file, cb) => {
    const allowedTypes = /jpg|jpeg|png|webp/;
    const ext = allowedTypes.test(path.extname(file.originalname).toLocaleLowerCase());
    if (ext) {
        cb(null, true);
    } else {
        cb("only images allowed");
    }
};

const Upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    filefilter: filefilter
})

module.exports = Upload;