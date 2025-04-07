import jwt from "jsonwebtoken";
import User from "../models/user.js";

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

export const getUserFromToken = async (token) => {
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // Verify the token
        const userId = decoded.userId; // Extract the userId from the token
        const user = await User.findById(userId); // Find the user in the database
        return user; // Return the user object
    } catch (err) {
        console.error("Error in getUserFromToken:", err);
        return null; // Return null if the token is invalid or the user is not found
    }



    /*
    jwt.verify returns the payload {userId} as 
        {
        userId: "12345",
        iat: 1681234567,
        exp: 1681834567
        }
    then we use .userId to get just that if our payload was named mukus it would be .mukus
    */

    
    //exact same code, left it because I wanna remember
    /* 
    jwt.verify(token, process.env.JWT_SECRET_KEY) = async (err, decoded) => {
      if(err){
        return res.status(401).json({message: "Unauthorized or the token is expired or invalid"});
      }
      const userId = decoded.userId; // Extract the userId from the decoded token
      const user = await User.findById(userId); // Find the user by ID
      return user; // Return the user object
    }
    
    
    */
  
    

};