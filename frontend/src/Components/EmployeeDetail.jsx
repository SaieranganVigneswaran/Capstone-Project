import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EmployeeDetail = () => {
    const [employee, setEmployee] = useState({});
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:3000/employee/detail/' + id)
            .then(result => {
                setEmployee(result.data[0]);
            })
            .catch(err => console.log(err));
        
        axios.get('http://localhost:3000/employee/project_detail/' + id)
            .then(result => {
                setProjects(result.data);
            })
            .catch(err => console.log(err));
        
        axios.get('http://localhost:3000/employee/task_detail/' + id)
            .then(result => {
                setTasks(result.data);
            })
            .catch(err => console.log(err));
    }, [id]);

    const handleLogout = () => {
        axios.get('http://localhost:3000/employee/logout')
            .then(result => {
                if (result.data.Status) {
                    localStorage.removeItem("valid");
                    navigate('/');
                }
            }).catch(err => console.log(err));
    }

    const getTasksByProjectId = (projectId) => {
        return tasks.filter(task => task.project_id === projectId);
    }

    return (
        <div>
            <div className="p-2 d-flex justify-content-center shadow">
                <h4>Employee Management System</h4>
            </div>
            <div className='d-flex justify-content-center flex-column align-items-center mt-3'>
                <img src={`http://localhost:3000/Images/${employee.image}`} className='emp_det_image' alt='Employee' />
                <div className='d-flex align-items-center flex-column mt-5'>
                    <h3>Name: {employee.name}</h3>
                    <h3>Email: {employee.email}</h3>
                    <h3>Salary: ${employee.salary}</h3>
                </div>
                <div>
                    <button className='btn btn-primary me-2'>Edit</button>
                    <button className='btn btn-danger' onClick={handleLogout}>Logout</button>
                </div>
            </div>
            <div className='d-flex justify-content-center flex-column align-items-center mt-3'>
                <h4>Projects and Tasks</h4>
                {projects.length > 0 ? (
                    <ul className='list-group'>
                        {projects.map((project) => (
                            <li key={project.id} className='list-group-item'>
                                <h5>Project Name: {project.name}</h5>
                                <p>Description: {project.description}</p>
                                <p>Start Date: {project.start_date}</p>
                                <p>End Date: {project.end_date}</p>
                                <h6>Tasks:</h6>
                                {getTasksByProjectId(project.id).length > 0 ? (
                                    <ul className='list-group'>
                                        {getTasksByProjectId(project.id).map((task) => (
                                            <li key={task.id} className='list-group-item'>
                                                <h5>Task Name: {task.title}</h5>
                                                <p>Description: {task.description}</p>
                                                <p>Start Date: {task.start_date}</p>
                                                <p>End Date: {task.end_date}</p>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No tasks assigned to this project.</p>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No projects assigned.</p>
                )}
            </div>
        </div>
    );
};

export default EmployeeDetail;
