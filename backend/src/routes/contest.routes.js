import express from "express";
import { verifyJWT, verifyPermission } from "../middleware/auth.middleware.js";
import { UserRolesEnum } from "../constants.js";
import { validate } from "../validators/validate.js";
import { validateSolutionLink } from "../validators/contest.validator.js";
import { addSolutionLink, filterContestsByPlatform, getContestById, getPastContests, getUpcomingContests, updateSolutionLinksManually } from "../controllers/contest.controller.js";



const router = express.Router();

router.route("/upcoming").get(getUpcomingContests);
router.route("/past").get(getPastContests);
router.route("/filter").get(filterContestsByPlatform);
router.route("/:contestId").get(getContestById);

router.route("/solution").post(
    verifyJWT,
    verifyPermission([UserRolesEnum.ADMIN]),
    validateSolutionLink,
    validate,
    addSolutionLink
)

router.route("/update-solution-links").post(
    verifyJWT,
    verifyPermission([UserRolesEnum.ADMIN]),
    updateSolutionLinksManually
)

export default router;