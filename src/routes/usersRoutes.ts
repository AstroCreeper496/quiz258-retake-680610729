import { Router, type Request, type Response } from "express";
import token from "jsonwebtoken";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config();

import type { User, CustomRequest } from "../libs/types.js";

// import authentication middleware
import { authenticateToken } from "../middlewares/authenMiddleware.ts";

// import database
import { users } from "../db/db.ts";

const router = Router();
const jwt_secret = process.env.JWT_SECRET || "qp@0d$u8e^dfh4i(sh73U*r4iH(fh4lnncp_dl]3;;";

// POST /api/vXXX/auth/login
router.post("/api/v729/login", (req: Request, res: Response) => {
  try { 
      
    // 1. get username and password from body
    const { username, password } = req.body;


    if(!req.body){
        return res.status(400).json({success: false, message: 'Request Body is missing!'});
    }


    if (!username || !password) {
      return res.status(400).json({success: false, message: 'Username and password are required'});
    }


    // 2. check if user exists (search with username)
    const foundUser = users.find((u) => u.username === username);


    if (!foundUser) {
      return res.status(404).json({success: false, message: 'Username not found. please sign in.'});
    }

    // 3. check if password matches
    if (foundUser.password !== password) {
      return res.status(401).json({success: false, message: 'Incorrect Password'});
    }

    // Create JWT Payload dynamically using found user details
    const token = jwt.sign(
      {username: foundUser.username,
        password: foundUser.password || null,
        userId: foundUser.userId || 'USER',
        ip_address: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      },
      jwt_secret,{ expiresIn: '10m' });

    // 4. send HTTP response with JWT token
    return res.status(200).json({success: true, message: 'Login successful', token: token});;

  } catch (err) {return res.status(500).json({success: false, message: "Something is wrong, please try again", error: err,});}
});

// POST /api/vXXX/auth/logout
router.post("/logout", authenticateToken, (req: Request, res: Response) => {
  try {
    const payload = (req as any).user;
    const token = (req as any).token;

    // find user by payload.username

    const user = users.find((u: User) => u.username === payload.username);

    if (!user) {
      return res.status(401).json({success: false, message: "User not found"});
    }
    // check if token exists in user.tokens

    if (!user.tokens || !user.tokens.includes(token)) {
      return res.status(401).json({success: false, message: "Invalid token"});
    }

    // if token exists, remove the token from user.tokens
    user.tokens = user.tokens?.filter((t) => t !== token);

    return res.status(200).json({success: true, message: "Logout successful"});
  } catch (err) {
    return res.status(500).json({success: false, message: "Something is wrong, please try again", error: err,});
  }
});

// POST /api/vXXX/auth/reset
// router.post("/reset", (req: Request, res: Response) => {
//   try {
//     reset_users();
//     return res.status(200).json({
//       success: true,
//       message: "User database has been reset",
//     });
//   } catch (err) {
//     return res.status(500).json({
//       success: false,
//       message: "Something is wrong, please try again",
//       error: err,
//     });
//   }
// });

export default router;