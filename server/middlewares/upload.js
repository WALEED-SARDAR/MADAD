const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10 // 10MB file size limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Please upload an image file"), false);
        }
    }
});

//error handling middleware
const errorHandler = (err, req, res, next) =>{
    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            success: false,
            message: "File size exceeds the limit of 10MB"
        });
    }
    next(err);
};

module.exports = {upload, errorHandler};