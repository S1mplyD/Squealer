import express from "express";
import cors from "cors";
import { config } from "dotenv";
import session from "express-session";
import mongoose from "mongoose";
import passport from "passport";
import path from "path";
import { router as authRoute } from "./routes/authentication";
import { startAllTimer } from "./API/timers";
import { router as channelRoute } from "./routes/channels";
import { router as squealsRoute } from "./routes/squeals";
import { router as squealMediaRoute } from "./routes/squealMedia";
import { router as squealGeoRoute } from "./routes/squealGeo";
import { router as squealTimedRoute } from "./routes/timedSqueal";
import { router as mediaRoute } from "./routes/media";
import { router as userRoute } from "./routes/users";
import { router as analyticsRoute } from "./routes/analytics";
import { router as followRoute } from "./routes/follow";
import { router as TimedGeoRoute } from "./routes/timedSquealGeo";
import { router as TextSquealRoute } from "./routes/squealsText";
import fs from "fs";
import { updateAnalyticTimer } from "./database/querys/analytics";
import { SquealerError } from "./util/errors";
import { resetCharactersScheduler } from "./API/characters";

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

//Controllo se la cartella per gli uploads esiste altrimenti la creo
fs.readdir(path.resolve(__dirname, "..", "public"), (err, files) => {
  if (err) console.log(err);
  if (!files.includes("uploads")) {
    fs.mkdir("public/uploads", (err) => {
      if (err) console.log(err);
    });
  }
});

app.use(passport.initialize());
app.use(passport.session());

//IMMAGINI PUBBLICHE
app.use(express.static(path.join(__dirname, "public")));

// pagina principale APP
app.use(
  "/",
  express.static(
    path.join(__dirname, "../frontend/squealer-fo/dist/squealer-fo")
  )
);

//SMM dashboard
app.use("/smm", express.static(path.join(__dirname, "../smm_dashboard/dist")));
// Funzione che ricarica il file statico della pagina corrente
app.get("/smm", (req, res) => {
  res.sendFile(__dirname + "/smm_dashboard/dist/index.html");
});

//TEST
app.use("/test", express.static(path.join(__dirname, "../frontend")));

//BACKOFFICE
app.use(
  "/backoffice",
  express.static(path.join(__dirname, "../frontend/squealer-bo"))
);

// ENDPOINT DELLE API
app.use("/api/auth", authRoute);
app.use("/api/channels", channelRoute);
app.use("/api/squeals", squealsRoute);
app.use("/api/text", TextSquealRoute);
app.use("/api/media", squealMediaRoute);
app.use("/api/geo", squealGeoRoute);
app.use("/api/timed", squealTimedRoute);
app.use("/api/timedgeo", TimedGeoRoute);
app.use("/api/mediaupload", mediaRoute);
app.use("/api/users", userRoute);
app.use("/api/analytics", analyticsRoute);
app.use("/api/follow", followRoute);

// Funzione che ricarica il file statico della pagina corrente
// app.get("*", (req, res) => {
//   res.sendFile(__dirname + "/frontend/squealer-fo/dist/index.html");
// });

mongoose.set("strictQuery", false);
mongoose.connect(uri).then(async () => {
  console.log("[CONNECTED TO MONGOOSE]");
  const ret: SquealerError | undefined = await startAllTimer();
  console.log(ret);
  await updateAnalyticTimer();
  await resetCharactersScheduler();
});

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
