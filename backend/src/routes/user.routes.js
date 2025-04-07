import express from 'express';
import { userLoginValidator, userRegisterValidator } from '../validators/user.validator';
import { validate } from '../validators/validate';
import { loginUser } from '../controllers/user.controllers';

const router = express.Router();


router.route("/register").post( userRegisterValidator, validate, registerUser);

router.route("/login").post(userLoginValidator, validate, loginUser);