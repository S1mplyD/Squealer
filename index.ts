import express from "express";
import cors from "cors";
import { config } from "dotenv";
import session from "express-session";
import mongoose from "mongoose";
import passport = require("passport");
import path from "path";
import { router } from "./backend/routes/authentication";

config();

const maxAge: number = 24 * 60 * 60 * 1000;
const app = express();
const uri: string = process.env.MONGO_TEST!;
const port: any = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(
  session({
    secret: process.env.COOKIE_KEY!,
    cookie: { maxAge: maxAge },
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", router);
mongoose.set("strictQuery", false);
mongoose.connect(uri);

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
