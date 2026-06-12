import express from "express";
import multer from "multer";

const router = express.Router();

const storage = multer.diskStorage({

    destination(req, file, cb) {

        cb(
            null,
            "public/img"
        );

    },

    filename(req, file, cb) {

        cb(
            null,
            file.originalname
        );

    }

});

const upload =
    multer({
        storage
    });

router.post(
    "/",
    upload.single("map"),
    (req, res) => {

        res.json({
            path: `img/${req.file.filename}`
        });

    }
);

export default router;