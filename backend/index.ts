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
import { router as mediaRoute } from "./routes/media";
import { router as userRoute } from "./routes/users";
import { router as analyticsRoute } from "./routes/analytics";
import { router as followRoute } from "./routes/follow";
import { updateAnalyticTimer } from "./database/queries/analytics";
import { resetCharactersScheduler } from "./API/characters";
import { updateUsersPopularity } from "./API/popularity";
import squealModel from "./database/models/squeals.model";
import { postRandomNews } from "./API/news";
import { postRandomArticle } from "./API/wikipedia";
import { postRouteSqueals } from "./API/bus";

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
    }),
);

app.use(passport.initialize());
app.use(passport.session());

// ENDPOINT DELLE API
app.use("/api/auth", authRoute);
app.use("/api/channels", channelRoute);
app.use("/api/squeals", squealsRoute);
app.use("/api/media", mediaRoute);
app.use("/api/users", userRoute);
app.use("/api/analytics", analyticsRoute);
app.use("/api/follow", followRoute);

//IMMAGINI PUBBLICHE
app.use(express.static(path.join(__dirname, "../public")));

// pagina principale APP
app.use(
    "/",
    express.static(
        path.join(__dirname, "../frontend/squealer-fo/dist/squealer-fo"),
    ),
);

app.use("/smm", express.static(path.join(__dirname, "../smm_dashboard/dist")));

app.use("/test", express.static(path.join(__dirname, "../test")));

//SMM dashboard
// Funzione che ricarica il file statico della pagina corrente
app.get("/smm/*", (_, res) => {
    res.sendFile(path.join(__dirname, "../smm_dashboard/dist/index.html"));
});

//BACKOFFICE
app.use(
    "/backoffice",
    express.static(path.join(__dirname, "../frontend/squealer-bo")),
);

app.get("/*", (_, res) => {
    res.sendFile(
        path.join(__dirname, "../frontend/squealer-fo/dist/squealer-fo/index.html"),
    );
});

mongoose.set("strictQuery", false);
mongoose
    .connect(uri)
    .then(async () => {
        console.log("[CONNECTED TO MONGOOSE]");
        await startAllTimer();
        // await fix();
        await updateAnalyticTimer();
        await resetCharactersScheduler();
        await updateUsersPopularity();
        await postRandomNews();
        await postRandomArticle();
        await postRouteSqueals();
    })
    .catch((e) => {
        console.error(e);
    });

app.listen(port, () => {
    console.log(`server started on port ${port}`);
});

const fix = async () => {
    await squealModel.deleteMany({
        $and: [{ originalSqueal: { $ne: "" } }, { time: { $gt: 0 } }],
    });
};
