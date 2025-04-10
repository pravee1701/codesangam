import express from "express";
import { verifyJWT, verifyPermission } from "../middleware/auth.middleware.js";
import { UserRolesEnum } from "../constants.js";
import { deleteBookmark, getBookmarksForUser, getUserBookmarks, toggleBookmark } from "../controllers/bookmark.controller.js";
import { mongoIdPathVariableValidator, mongoIdRequestBodyValidator } from "../common/mongodb.validators.js";



const router = express.Router();


router.route("/")
    .post(verifyJWT, mongoIdRequestBodyValidator("contestId"), toggleBookmark)
    .get(verifyJWT, getUserBookmarks);

router.route("/user/:userId")
    .get(verifyJWT,
        verifyPermission([UserRolesEnum.ADMIN]),
        mongoIdPathVariableValidator("userId"),
        getBookmarksForUser
    )

router.route("/:id")
    .delete(verifyJWT, mongoIdPathVariableValidator("id"), deleteBookmark);


export default router;