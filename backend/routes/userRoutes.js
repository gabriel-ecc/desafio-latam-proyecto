import { Router } from "express";
import {
  registerUser,
  getUsers,
  lockUser,
} from "../src/controllers/usersControllers.js";
import { createUserMiddleware } from "../middleware/userMiddleware.js";

const router = Router();

router.post("/users", createUserMiddleware, registerUser);
router.get("/users", getUsers);
router.put("/lockuser", lockUser);

export default router;
