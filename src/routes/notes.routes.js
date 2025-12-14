import { Router } from "express";
import { countNotesDownloads, deleteNotes, downloadNotes, getAllNotes, getCurrentUserNotes, getNotesById, uploadNotes } from "../controllers/notes.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { addNewReview } from "../controllers/review.controller.js";


const notesRouter = Router()

notesRouter.route("/upload-notes").post(
    verifyJWT,
    upload.fields([
        { name: "notesFile", maxCount: 1 },
        { name: "samples", maxCount: 2 },
    ]),
    uploadNotes)


notesRouter.route("/all-notes").get(getAllNotes)

notesRouter.route("/download/:id").get(downloadNotes)

notesRouter.route("/my-notes").get(
    verifyJWT,
    getCurrentUserNotes
);

notesRouter.route("/:id").get(getNotesById)

notesRouter.route("/delete-notes/:notesId").delete(deleteNotes)

notesRouter.route("/update-notes-downloads-count").patch(verifyJWT, countNotesDownloads)

notesRouter.route("/add-review").post(verifyJWT, addNewReview)

export default notesRouter