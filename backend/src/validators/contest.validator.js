import { body } from "express-validator";

export const validateSolutionLink = [
    body('contestId').isMongoId().withMessage('Invalid contest id'),
    body('solutionLink').isURL().withMessage('Invalid solution link')
]