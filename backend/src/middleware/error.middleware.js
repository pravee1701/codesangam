import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose"; 

const errorHandler = (err, req, res, next) => {
    let error = err;

    if (!(error instanceof Error)) {
        const statusCode = error.statusCode || (error instanceof mongoose.Error ? 400 : 500);
        const message = error.message || "Something went wrong";
        error = new ApiError(statusCode, message, error?.errors || []);
    }

    const statusCode = error.statusCode || 500;

    const response = {
        message: error.message,
        ...(process.env.NODE_ENV === "development" && { stack: error.stack }), 
    };

    console.error(`[Error]: ${error.message}`);

    return res.status(statusCode).json(response);
};

export { errorHandler };