import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import requestIp from "request-ip";
import { rateLimit } from "express-rate-limit";
import session from "express-session";
import passport from "passport";
import userRoutes from "./routes/user.routes.js";
import contestRoutes from "./routes/contest.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { ApiError } from "./utils/ApiError.js";

dotenv.config();


const app = express();

app.use(requestIp.mw());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    keyGenerator: (req, res ) => {
        return req.clientIp;
    },
    handler: (_, __, ___, options) =>{
        throw new ApiError(options.statusCode || 500, `There are too many requests. You are only allowed ${options.max} requests every ${options.windowMs / 60000} minutes`);
    },
});

app.use(limiter);

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cors({
    origin: "*",
    credentials: true,
}));
app.use(cookieParser());

// required for passport
app.use(
    session({
        secret: process.env.EXPRESS_SESSION_SECRET,
        resave: true,
        saveUninitialized: true,
    })
);
// session secret

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/contest/",contestRoutes);
app.use(errorHandler);

export default app;