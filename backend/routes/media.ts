import multer from "multer";
import express from "express";
import { resolve } from "path";
import { catchError, unauthorized } from "../util/errors";
import { User } from "../util/types";

const publicUploadPath = resolve(__dirname, "../..", "public/uploads/");

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
        file.originalname.split(".").pop()
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
      res.send(req.file?.filename);
    else res.send(unauthorized);
  } catch (error: any) {
    catchError(error);
  }
});
