import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
    const [adminTotal, setAdminTotal] = useState(0);
    const [employeeTotal, setEmployeeTotal] = useState(0);
    const [salaryTotal, setSalaryTotal] = useState(0);
    const [admins, setAdmins] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        adminCount();
        employeeCount();
        salaryCount();
        AdminRecords();
    }, []);

    const AdminRecords = () => {
        axios.get('http://localhost:3000/auth/admin_records')
            .then(result => {
                if (result.data.Status) {
                    setAdmins(result.data.Result);
                } else {
                    alert(result.data.Error);
                }
            })
            .catch(err => console.error('Error fetching admin records:', err));
    };

    const adminCount = () => {
        axios.get('http://localhost:3000/auth/admin_count')
            .then(result => {
                if (result.data.Status) {
                    setAdminTotal(result.data.Result[0].admin);
                }
            })
            .catch(err => console.error('Error fetching admin count:', err));
    };

    const employeeCount = () => {
        axios.get('http://localhost:3000/auth/employee_count')
            .then(result => {
                if (result.data.Status) {
                    setEmployeeTotal(result.data.Result[0].employee);
                }
            })
            .catch(err => console.error('Error fetching employee count:', err));
    };

    const salaryCount = () => {
        axios.get('http://localhost:3000/auth/salary_count')
            .then(result => {
                if (result.data.Status) {
                    setSalaryTotal(result.data.Result[0].salaryOFEmp);
                } else {
                    alert(result.data.Error);
                }
            })
            .catch(err => console.error('Error fetching salary count:', err));
    };

    const handleEdit = (adminId) => {
        navigate(`/dashboard/admin/edit/${adminId}`);
    };

    const handleDelete = (adminId) => {
        if (window.confirm('Are you sure you want to delete this admin?')) {
            axios.delete(`http://localhost:3000/auth/admin/${adminId}`)
                .then(result => {
                    if (result.data.Status) {
                        AdminRecords();
                    } else {
                        alert(result.data.Error);
                    }
                })
                .catch(err => console.error('Error deleting admin:', err));
        }
    };

    return (
        <div className="container">
            <div className='card-container'>
                <div className='card'>
                    <h4>Admin</h4>
                    <hr />
                    <div>Total: {adminTotal}</div>
                </div>
                <div className='card'>
                    <h4>Employee</h4>
                    <hr />
                    <div>Total: {employeeTotal}</div>
                </div>
                <div className='card'>
                    <h4>Salary</h4>
                    <hr />
                    <div>Total: ${salaryTotal}</div>
                </div>
            </div>
            <div className='table-container'>
                <h3>List of Admins</h3>
                <table className='table'>
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th className="actions-header">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            admins.map(a => (
                                <tr key={a.id}>
                                    <td>{a.email}</td>
                                    <td className="actions">
                                        <button
                                            className="btn btn-info btn-sm"
                                            onClick={() => handleEdit(a.id)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-warning btn-sm"
                                            onClick={() => handleDelete(a.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Home;
