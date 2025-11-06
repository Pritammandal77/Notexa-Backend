import { Router } from "express";
import { getAllNotes, uploadNotes } from "../controllers/notes.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";


const notesRouter = Router()

notesRouter.route("/upload-notes").post(
    verifyJWT,
    upload.fields([
        { name: "notesFile", maxCount: 1 },
        { name: "samples", maxCount: 2 },
    ]),
    uploadNotes)

notesRouter.route("/all-notes").get(getAllNotes)
export default notesRouter