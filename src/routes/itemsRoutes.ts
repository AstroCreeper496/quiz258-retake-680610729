import { Router, type Request, type Response } from "express";
import {zUserId, zItemId, zItemPostBody, zItemPutBody, zItemDeleteBody, zVerificationBody} from "../libs/zodValidators.js"; // import Zod validators
import type { Item, User} from "../libs/types.ts"; // import types
import { items } from "../db/db.ts"; // import database
import { v4 as uuidv4 } from 'uuid'; //import uuid
import {readUserDataFile, writeUserDataFile} from "../db/db_transactions.ts";
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { verify } from "node:crypto";

const router = Router();
const jwt_secret = process.env.JWT_SECRET || "qp@0d$u8e^dfh4i(sh73U*r4iH(fh4lnncp_dl]3;;";

// GET /api/vXXX/items/:userId 

router.get("/api/v729/cart/:userId", async (req: Request, res: Response) => {
    try {
    const users = await readUserDataFile();
    const token = req.body.token;
    const userId = req.params.userId;
    const result = zUserId.safeParse(userId);
    const VerificationParseResult = zVerificationBody.safeParse({token});

    if (!VerificationParseResult.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error?.issues[0].message,
      });
    }

    interface ReqData{userId : string}

    let reqData: ReqData;

    try {
      reqData = jwt.verify(token as string, jwt_secret) as ReqData; //undefined
    } catch (jwtErr) {
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }

    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.issues[0]?.message,
      });
    }

    if(reqData.userId != userId){
      return res.status(403).json({success: false, message: "Forbidden access"});
    }
    const foundItems = items.filter(item => (item.userId === userId));


    if (foundItems.length === 0) {
      return res.status(404).json({success: false, message: "Items for user " + userId + " not found"});
    }


    res.json({success: true, data: foundItems});

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something is wrong, please try again",
      error: err,
    });
  }
});

// POST /api/vXXX/items/:userId, body = {new item data}
// add a new Item for userId
router.post("/",async (req: Request, res: Response) => {
  
  res.status(201).json({
    success: true,
  });
  
});

// Delete /api/vXXX/items/:userId


export default router;