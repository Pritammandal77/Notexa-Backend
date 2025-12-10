import passport from "passport";
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
import './config/passport.js';

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({
    limit: "16kb"
}))


app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}))

app.use(express.static("public"))

app.use(cookieParser())

app.use(passport.initialize());

import authRoutes from './routes/auth.js'
import notesRoutes from "./routes/notes.routes.js";
import paymentRoutes from "./routes/payment.routes.js";

app.use('/api/auth', authRoutes);

app.use("/api/v1/notes", notesRoutes)

app.use('/api/v1/payments', paymentRoutes)

app.get("/hello", (req, res) => {
    return res
        .json(
            "Hello World"
        )
})

export { app }