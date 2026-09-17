import express, { type Request, type Response } from "express";

import morgan from "morgan"; // import middlewares

import userRoutes from "../src/routes/usersRoutes.ts";
import itemsRoutes from "../src/routes/itemsRoutes.ts";

const app = express();
const port = 3000;

// body parser middleware
app.use(express.json());

// logger middleware
app.use(morgan("dev"));
// app.use(morgan("combined"));



// Endpoints
app.get("/", (req: Request, res: Response) => {
  res.send("Quiz #2 - API service");
});

app.get("/student", (req: Request, res: Response) => {
  res.status(200).json({success: true, message:"Student Information", data:{firstName:"Suthanakit", lastName:" Wongsrichan" , StudentId:"680610729", section:"001"}});});

app.use(userRoutes);
app.use(itemsRoutes);

app.listen(port, () => {console.log(`🚀 Server running on http://localhost:${port}`);});

// Export app for vercel deployment
export default app;
