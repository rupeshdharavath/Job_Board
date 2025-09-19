// routes/user.route.js
import express from "express";
import { register, login, logout, updateProfile } from "../controllers/user.controller.js";
import { singleUpload } from "../middlewares/mutler.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.post("/register",  singleUpload,register);
router.post("/login", login);
router.get("/logout", logout);
router.put("/profile/update",isAuthenticated, singleUpload, updateProfile);

export default router;
