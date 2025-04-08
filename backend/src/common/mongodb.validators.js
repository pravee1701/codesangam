import { body, param } from "express-validator";

export const mongoIdPathVariableValidator = [
    param("userId").notEmpty().isMongoId().withMessage(`Invalid userId`)
];