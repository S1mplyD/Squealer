import express from "express";
import cors from "cors";
import { config } from "dotenv";
import session from "express-session";
import mongoose from "mongoose";
import passport = require("passport");

config();

const maxAge: number = 24 * 60 * 60 * 1000;
const app = express();
const uri: string = process.env.MONGO_TEST!;
const port: any = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(
  session({
    secret: process.env.COOKIE_KEY!,
    cookie: { maxAge: maxAge },
    resave: false,
    saveUninitialized: false,
  })
);
app.use(express.static(path.join(__dirname, "public")));

mongoose.set("strictQuery", false);
mongoose.connect(uri);

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
