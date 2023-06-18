import multer from "multer";
import express from "express";
import { resolve } from "path";

const publicUploadPath = resolve(__dirname, "../..", "public/uploads/");

console.log(publicUploadPath);

export const router = express.Router();

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

router.route("/media").post(upload.single("file"), (req, res) => {
  res.send(req.file?.filename);
});
