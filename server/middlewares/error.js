const errorHandler = (err, req, res, next) => {
    let error = {
        ...err,
        message: err.message || "Server Error",
        statusCode: err.statusCode || 500,
    };
    console.log("Error:", error);


    if(err.name === "CastError"){
        error.message = `Resource not found`;
        error.statusCode = 404;
    }
    if(err.name === "ValidationError"){
        error.message = Object.values(err.errors).map((val) => val.message);
        error.statusCode = 400;
    }
    if(err.code === 11000){
        error.message = "Duplicate field value entered";
        error.statusCode = 400;
    }
    if(err.name === "JsonWebTokenError"){
        error.message = "Invalid token";
        error.statusCode = 401;
    }
    if(err.name === "TokenExpiredError"){
        error.message = "Token expired";
        error.statusCode = 401;
    }
    if(error.name === "MulterError"){
        error.message = "File size exceeds the limit of 10MB";
        error.statusCode = 400;
    }
    res.status(error.statusCode).json({
        success: false,
        message: error.message
    });
};

module.exports = errorHandler;