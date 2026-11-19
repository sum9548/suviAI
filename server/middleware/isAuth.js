import jwt from "jsonwebtoken"


export const isAuth = (req, res, next) => {
  try {

    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Not logged in" });
    }
    const verifyToken = jwt.verify(token , process.env.JWT_SECRET)
    
     req.userId = verifyToken.userId
     return next()
  } catch (error) {
    return res.status(401).json({message:`Invalid or expired token`})
  }
};
