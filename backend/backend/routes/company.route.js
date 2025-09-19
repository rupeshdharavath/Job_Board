import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { registerCompany, getCompanyById, getCompany, updateCompany } from "../controllers/company.controller.js";
import { singleUpload } from "../middlewares/mutler.js"; // ✅ Import multer middleware

const router = express.Router();

// Register a company
router.post("/register", isAuthenticated, registerCompany); // router-1

// Get all companies for the logged-in user
router.get("/get", isAuthenticated, getCompany); // router-2

// Get a company by ID
router.get("/get/:id", isAuthenticated, getCompanyById); // router-3

// Update company info (with logo upload)
router.put("/update/:id", isAuthenticated, singleUpload, updateCompany); // router-4 ✅ multer added here

export default router;
