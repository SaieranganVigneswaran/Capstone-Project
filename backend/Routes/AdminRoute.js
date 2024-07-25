import bcrypt from 'bcrypt';
import express from 'express';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import con from '../utils/db.js';

const router = express.Router();

// Admin login route
router.post('/adminlogin', (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM admin WHERE email = ?';
  con.query(sql, [email], (err, result) => {
    if (err) return res.status(500).json({ loginStatus: false, Error: 'Query Error' });

    if (result.length > 0) {
      const hashedPassword = result[0].password;

      bcrypt.compare(password, hashedPassword, (err, isMatch) => {
        if (err) return res.status(500).json({ loginStatus: false, Error: 'Comparison Error' });

        if (isMatch) {
          const token = jwt.sign(
            { role: 'admin', email: result[0].email, id: result[0].id },
            'jwt_secret_key',
            { expiresIn: '1d' }
          );
          res.cookie('token', token);
          return res.json({ loginStatus: true, token: token });
        } else {
          return res.json({ loginStatus: false, Error: 'Wrong email or password' });
        }
      });
    } else {
      return res.json({ loginStatus: false, Error: 'Wrong email or password' });
    }
  });
});

// Admin registration route
router.post('/adminregister', (req, res) => {
  const { email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ registerStatus: false, Error: 'Passwords do not match.' });
  }

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.status(500).json({ registerStatus: false, Error: 'Hashing error.' });

    const sql = 'INSERT INTO admin (email, password) VALUES (?, ?)';
    con.query(sql, [email, hash], (err, result) => {
      if (err) return res.status(500).json({ registerStatus: false, Error: 'Database error.' });
      return res.json({ registerStatus: true });
    });
  });
});

// Fetch categories
router.get('/category', (req, res) => {
  const sql = "SELECT * FROM category";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

// Add category
router.post('/add_category', (req, res) => {
  const sql = "INSERT INTO category (`name`) VALUES (?)";
  con.query(sql, [req.body.category], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true });
  });
});

// Image upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'Public/Images');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Add employee
router.post('/add_employee', upload.single('image'), (req, res) => {
  const sql = `INSERT INTO employee (name, email, password, address, salary, image, category_id) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) return res.json({ Status: false, Error: "Hashing Error" });
    const values = [
      req.body.name,
      req.body.email,
      hash,
      req.body.address,
      req.body.salary,
      req.file.filename,
      req.body.category_id
    ];
    con.query(sql, values, (err, result) => {
      if (err) return res.json({ Status: false, Error: err });
      return res.json({ Status: true });
    });
  });
});

// Fetch all employees
router.get('/employee', (req, res) => {
  const sql = "SELECT * FROM employee";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

// Fetch a specific employee
router.get('/employee/:id', (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM employee WHERE id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

// Update employee
router.put('/edit_employee/:id', (req, res) => {
  const id = req.params.id;
  const sql = `UPDATE employee SET name = ?, email = ?, salary = ?, address = ?, category_id = ? WHERE id = ?`;
  const values = [
    req.body.name,
    req.body.email,
    req.body.salary,
    req.body.address,
    req.body.category_id
  ];
  con.query(sql, [...values, id], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" + err });
    return res.json({ Status: true, Result: result });
  });
});

// Delete employee
router.delete('/delete_employee/:id', (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM employee WHERE id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" + err });
    return res.json({ Status: true, Result: result });
  });
});

// Count admin users
router.get('/admin_count', (req, res) => {
  const sql = "SELECT COUNT(id) AS admin FROM admin";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" + err });
    return res.json({ Status: true, Result: result });
  });
});

// Count employees
router.get('/employee_count', (req, res) => {
  const sql = "SELECT COUNT(id) AS employee FROM employee";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" + err });
    return res.json({ Status: true, Result: result });
  });
});

// Sum of employee salaries
router.get('/salary_count', (req, res) => {
  const sql = "SELECT SUM(salary) AS salaryOFEmp FROM employee";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" + err });
    return res.json({ Status: true, Result: result });
  });
});

// Get all admin records
router.get('/admin_records', (req, res) => {
  const sql = "SELECT * FROM admin";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" + err });
    return res.json({ Status: true, Result: result });
  });
});

// Admin logout
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  return res.json({ Status: true });
});

// Edit Admin
router.put('/admin/:id', (req, res) => {
  const id = req.params.id;
  const { email } = req.body;
  const sql = 'UPDATE admin SET email = ? WHERE id = ?';
  con.query(sql, [email, id], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true });
  });
});

// Delete Admin
router.delete('/admin/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM admin WHERE id = ?';
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true });
  });
});

// Get all projects
router.get('/projects', (req, res) => {
  const sql = "SELECT * FROM Projects";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

// Add a new project
router.post('/add_project', (req, res) => {
  const { name, description, start_date, end_date, owner_id } = req.body;
  const sql = "INSERT INTO Projects (name, description, start_date, end_date, owner_id) VALUES (?, ?, ?, ?, ?)";
  con.query(sql, [name, description, start_date, end_date, owner_id], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true });
  });
});

// Fetch tasks for a specific employee
router.get('/tasks/:employeeId', (req, res) => {
  const employeeId = req.params.employeeId;
  const sql = `SELECT * FROM tasks WHERE employee_id = ?`;
  con.query(sql, [employeeId], (err, result) => {
    if (err) return res.json({ Status: false, Error: 'Query Error' });
    return res.json({ Status: true, Result: result });
  });
});

// Add a new task
router.post('/add_task', (req, res) => {
  const { title, description, project_id, employee_id, start_date, end_date } = req.body;
  const sql = `INSERT INTO tasks (title, description, project_id, employee_id, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?)`;
  con.query(sql, [title, description, project_id, employee_id, start_date, end_date], (err, result) => {
    if (err) return res.json({ Status: false, Error: 'Query Error' });
    return res.json({ Status: true });
  });
});

export { router as adminRouter };

