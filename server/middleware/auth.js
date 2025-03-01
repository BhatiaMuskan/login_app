

import jwt from 'jsonwebtoken';
import ENV from '../config.js';

/**auth middleware */

export default async function Auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authorization header missing or invalid" });
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = await jwt.verify(token, ENV.JWT_SECRET);

    req.user = decodedToken;

    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized", details: error.message });
  }
}

export function localVariables(req,res,next){
  req.app.locals={
    OTP:null,
    resetSession:false,
  }
  next();
}
