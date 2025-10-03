const jwt = require("jsonwebtoken");

const generateToken = (user) =>{
    return jwt.sign({id: user._id}, process.env.JWT_SECRET, 
        {expiresIn: process.env.JWT_EXPIRE}
    )
};

const sendTokenResponse = (user, statusCode, res) =>{
    const token = generateToken(user);

    const options = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };

    res.status(statusCode)
    .cookie("token", token, options)
    .json({
        success: true,
        token,
        user:{
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar
        }
    });
};

module.exports = {generateToken, sendTokenResponse};

