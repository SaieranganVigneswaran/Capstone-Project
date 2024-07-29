import express from 'express'
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'

const router = express.Router()

router.post("/employee_login", (req, res) => {
    const sql = "SELECT * from employee Where email = ?";
    con.query(sql, [req.body.email], (err, result) => {
      if (err) return res.json({ loginStatus: false, Error: "Query error" });
      if (result.length > 0) {
        bcrypt.compare(req.body.password, result[0].password, (err, response) => {
            if (err) return res.json({ loginStatus: false, Error: "Wrong Password" });
            if(response) {
                const email = result[0].email;
                const token = jwt.sign(
                    { role: "employee", email: email, id: result[0].id },
                    "jwt_secret_key",
                    { expiresIn: "1d" }
                );
                res.cookie('token', token)
                return res.json({ loginStatus: true, id: result[0].id });
            }
        })

      } else {
          return res.json({ loginStatus: false, Error:"wrong email or password" });
      }
    });
  });

router.get('/detail/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM employee where id = ?"
    con.query(sql, [id], (err, result) => {
        if(err) return res.json({Status: false});
        return res.json(result)
    })
})

router.get('/project_detail/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM projects where owner_id = ?"
    con.query(sql, [id], (err, result) => {
        if(err) return res.json({Status: false});
        return res.json(result)
    })
})

router.get('/task_detail/:id', (req, res) => {
    const id = req.params.id;
    const sql = `
        SELECT t.*, p.name AS project_name
        FROM tasks t
        LEFT JOIN projects p ON t.project_id = p.id
        WHERE t.employee_id = ?
    `;
    con.query(sql, [id], (err, result) => {
        if(err) return res.json({Status: false, Error: err.message});
        return res.json({Status: true, Result: result})
    })
})

router.get('/logout', (req, res) => {
    res.clearCookie('token')
    return res.json({Status: true})
})

router.put('/update_task_status/:id', (req, res) => {
    const id = req.params.id;
    const { status } = req.body;

    const validStatuses = ['new', 'in progress', 'completed'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ Status: false, Error: 'Invalid status value.' });
    }

    const sql = 'UPDATE tasks SET status = ? WHERE id = ?';
    con.query(sql, [status, id], (err, result) => {
        if (err) return res.json({ Status: false, Error: 'Query Error' + err });

        if (result.affectedRows === 0) {
            return res.status(404).json({ Status: false, Error: 'Task not found' });
        }

        return res.json({ Status: true });
    });
});

export {router as EmployeeRouter}