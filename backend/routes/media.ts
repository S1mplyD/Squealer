import multer from "multer";
import express from "express";
import { resolve, join } from "path";
import { User } from "../util/types";
import fs from "fs";

const publicUploadPath = resolve(__dirname, "../..", "public/");

export const router = express.Router();

/**
 * Salva un file su disco con un nome casuale
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, publicUploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname +
        "-" +
        uniqueSuffix +
        "." +
        file.originalname.split(".").pop(),
    );
  },
});

const upload = multer({ storage: storage });

/**
 * POST
 * carica un media sul server e manda in response il nome del file caricato
 */
router.route("/").post(upload.single("file"), (req, res) => {
  try {
    if (
      req.user &&
      ((req.user as User).status !== "ban" ||
        (req.user as User).status !== "block")
    )
      res.status(201).send(req.file?.filename);
    else {
      fs.unlink(join(publicUploadPath, req.file!.filename), (err) => {
        if (err) console.log(err);
      });
      res.sendStatus(401);
    }
  } catch (error: any) {
    res.status(500).send(error);
  }
});
