import passport from "passport";
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
import './config/passport.js';

const app = express();

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))

app.use(express.json({
    limit: "16kb"
}))

console.log(process.env.ACCESS_TOKEN_SECRET)

app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}))

app.use(express.static("public"))

app.use(cookieParser())

app.use(passport.initialize());

import authRoutes from './routes/auth.js'
import notesRouter from "./routes/notes.routes.js";

app.use('/api/auth', authRoutes);

app.use("/api/v1/notes", notesRouter)

app.get("/hello", (req, res) => {
    return res
        .json(
            "Hello World"
        )
})

export { app }