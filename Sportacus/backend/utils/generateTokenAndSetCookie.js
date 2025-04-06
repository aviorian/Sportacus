import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY,
    {expiresIn: "7d", 
    })


res.cookie("token", token, { //bottom part is for security
    httpOnly: true, // XSS attacks
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", //csrf attacks
    maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
})

return token;
}