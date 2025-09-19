//creating server
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utiles/db.js"; 
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import analyzerRoutes from "./routes/analyzer.js"

// ✅ Correct import
// Ensure the correct file extension (.js or .ts)

dotenv.config({});

// Initialize Express
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
    origin: ["http://localhost:5173", "https://jobboard-6o8p.vercel.app"], // Fixed typo from "orgin"
    credentials: true
};

app.use(cors(corsOptions));

const PORT = process.env.PORT || 5000;

//api's
app.use("/api/v1/analyze-resume", analyzerRoutes);
app.use("/api/v1/user",userRoute);
app.use("/api/v1/company",companyRoute);
app.use("/api/v1/job",jobRoute);
app.use("/api/v1/application",applicationRoute);

    app.listen(PORT, () => {
       connectDB();
        console.log(`✅ Server running at port ${PORT}`);
    });

