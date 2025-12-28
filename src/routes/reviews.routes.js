import { Router } from "express";
import { deleteReview } from "../controllers/review.controller.js";

const reviewRouter = Router()

reviewRouter.route("/delete-review/:id").delete(deleteReview)

export default reviewRouter