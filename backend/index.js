import express from "express";
import cors from 'cors';
import { adminRouter } from "./Routes/AdminRoute.js";
import { EmployeeRouter } from "./Routes/EmployeeRoute.js";
import Jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const app = express();

// CORS configuration
app.use(cors({
    origin: "http://localhost:5173", // Adjust based on your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.static('Public')); // Ensure this path is correct and accessible

// Routes
app.use('/auth', adminRouter);
app.use('/employee', EmployeeRouter);

// Token verification middleware
const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        Jwt.verify(token, "jwt_secret_key", (err, decoded) => {
            if (err) return res.status(401).json({ Status: false, Error: "Invalid Token" });
            req.id = decoded.id;
            req.role = decoded.role;
            next();
        });
    } else {
        return res.status(401).json({ Status: false, Error: "Not authenticated" });
    }
};

// Verify route
app.get('/verify', verifyUser, (req, res) => {
    return res.json({ Status: true, role: req.role, id: req.id });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
