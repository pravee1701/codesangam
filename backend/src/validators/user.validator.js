import { body, param } from 'express-validator';
import { AvailableUserRoles } from '../constants.js';

export const userRegisterValidator = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Email is invalid"),
    body("username")
        .trim()
        .notEmpty()
        .withMessage("Username is required")
        .isLowercase()
        .withMessage("Username should be in lowercase"),
    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password should be at least 6 characters long"),
    body("role")
        .optional()
        .isIn(AvailableUserRoles)
        .withMessage("Invalid user role"),
]

export const userLoginValidator = [

    body("email")
        .optional()
        .isEmail()
        .withMessage("Email is invalid"),
    body("username")
        .optional()
        .isLowercase()
        .withMessage("Username should be in lowercase"),
    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password should be at least 6 characters long"),

]

export const userChangeCurrentPasswordValidator = [
    body("oldPassword")
        .notEmpty()
        .withMessage("Old password is required")
        .isLength({ min: 6 })
        .withMessage("Old password should be at least 6 characters long"),
    body("newPassword")
        .notEmpty()
        .withMessage("New password is required")
        .isLength({ min: 6 })
        .withMessage("New password should be at least 6 characters long"),
];

export const userForgotPasswordValidator = [
    body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Email is invalid"),
];

export const userResetForgottenPasswordValidator = [
    body("newPassword")
        .notEmpty()
        .withMessage("New password is required")
        .isLength({ min: 6 })
        .withMessage("New password should be at least 6 characters long"),
];

export const userAssignRoleValidator = [
    body("role")
        .optional()
        .isIn(AvailableUserRoles)
        .withMessage("Invalid user role"),
]