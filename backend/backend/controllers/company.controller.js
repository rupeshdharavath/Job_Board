import { Company } from "../models/company.model.js";
import mongoose from "mongoose";
import getDataUri from "../utiles/datauri.js";
import cloudinary from "../utiles/cloudinary.js";
//registring a company
export const registerCompany = async (req, res) => {
  try {
    const { companyName } = req.body;
    if (!companyName) {
      return res.status(400).json({
        message: "Company name is required",
        success: false,
      });
    }
    //finding the company in the database
    let company = await Company.findOne({ name: companyName });
    if (company) {
      return res.status(400).json({
        message: "You can't register same company.",
        success: false,
      });
    }
    console.log("Registering new comapny..");
    console.log("User ID from request:", req.id); //creating a new company if not found
    company = await Company.create({
      name: companyName,
      userId: req.id,
    });
    return res.status(201).json({
      message: "Company registered successfully.",
      success: true,
      company,
    });
  } catch (error) {
    console.log("Error in registerCompany", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

//get company by id and update company
export const updateCompany = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;
    const file = req.file;

    const updateData = { name, description, website, location };

    // Upload to cloudinary if file is provided
    if (file) {
      const fileUri = getDataUri(file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      updateData.logo = cloudResponse.secure_url; // save Cloudinary URL
    }

    const company = await Company.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Company information updated successfully.",
      success: true,
      company,
    });
  } catch (error) {
    console.error("Error updating company:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// Get all companies
export const getCompany = async (req, res) => {
  try {
    const userId = req.id; //logged in user id
    const companies = await Company.find({ userId });
    if (!companies || companies.length === 0) {
      return res.status(404).json({
        message: "Companies not found",
        success: false,
      });
    }
    return res.status(200).json({
      companies,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
// Get company by ID
// filepath: c:\Users\chand\OneDrive\Desktop\JobBoard\backend\controllers\company.controller.js

// Get a company by ID
export const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid company ID",
        success: false,
      });
    }

    // Fetch company by ID
    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).json({
        message: "Company not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Company fetched successfully",
      success: true,
      company,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
