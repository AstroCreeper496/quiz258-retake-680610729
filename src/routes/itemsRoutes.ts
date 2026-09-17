import { Router, type Request, type Response } from "express";
import {zUserId, zItemId, zItemPostBody, zItemPutBody, zItemDeleteBody} from "../libs/zodValidators.js"; // import Zod validators
import type { Item, User} from "../libs/types.ts"; // import types
import { items } from "../db/db.ts"; // import database
import { v4 as uuidv4 } from 'uuid'; //import uuid
import {readUserDataFile, writeUserDataFile} from "../db/db_transactions.ts";

const router = Router();

// GET /api/vXXX/items/:userId 

router.get("/api/v729/items/:userId", async (req: Request, res: Response) => {
    try {
    const users = await readUserDataFile();

    const userId = req.params.userId;
    const result = zUserId.safeParse(userId);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.issues[0]?.message,
      });
    }

    const foundItems = items.filter(item => (item.userId === userId));


    if (foundItems.length === 0) {
      return res.status(404).json({success: false, message: "Items for user " + userId + " not found"});
    }


    res.json({success: true, data: foundItems});

  } catch (err) {
    return res.json({
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