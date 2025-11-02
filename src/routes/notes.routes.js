import { Router } from "express";
import { uploadNotes } from "../controllers/notes.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const notesRouter = Router()

notesRouter.route("/notes").get(verifyJWT,uploadNotes)

export default notesRouter