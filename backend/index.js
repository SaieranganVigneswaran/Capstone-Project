import cookieParser from "cookie-parser";
import cors from 'cors';
import express from "express";
import Jwt from "jsonwebtoken";
import { adminRouter } from "./Routes/AdminRoute.js";
import { EmployeeRouter } from "./Routes/EmployeeRoute.js";
import con from './utils/db.js';

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

app.get('/auth/admin', verifyUser, (req, res) => {
    const adminId = req.id;  // This comes from your verifyUser middleware

    const sql = 'SELECT * FROM admin WHERE id = ?';  // Adjust fields as needed
    con.query(sql, [adminId], (err, result) => {
        if (err) {
            return res.status(500).json({ Status: false, Error: "Database query error" });
        }
        if (result.length > 0) {
            const adminData = result[0];
            // Remove sensitive information if any
            console.log(adminData);
            delete adminData.password;
            console.log(adminData);
            return res.json({ Status: true, admin: adminData });
        } else {
            return res.status(404).json({ Status: false, Error: "Admin not found" });
        }
    });
});

// Verify route
app.get('/verify', verifyUser, (req, res) => {
    return res.json({ Status: true, role: req.role, id: req.id });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


