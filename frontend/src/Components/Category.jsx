import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Category = () => {
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    owner_id: ''
  });

  useEffect(() => {
    // Fetch projects and employees
    const fetchData = async () => {
      try {
        const [projectsResponse, employeesResponse] = await Promise.all([
          axios.get('http://localhost:3000/auth/projects'),
          axios.get('http://localhost:3000/auth/employees')
        ]);

        if (projectsResponse.data.Status) {
          setProjects(projectsResponse.data.Result);
        } else {
          alert(projectsResponse.data.Error);
        }

        if (employeesResponse.data.Status) {
          setEmployees(employeesResponse.data.Result);
        } else {
          alert(employeesResponse.data.Error);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setNewProject({ ...newProject, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3000/auth/add_project', newProject)
      .then(result => {
        if(result.data.Status) {
          setProjects([...projects, newProject]);
        } else {
          alert(result.data.Error);
        }
      }).catch(err => console.log(err));
  };

  return (
    <div className='px-5 mt-3'>
      <div className='d-flex justify-content-center'>
        <h3>PROJECT LIST</h3>
      </div>
      <Link to="/dashboard/add_project" className='btn btn-success'>Add Project</Link>
      <div className='mt-3'>
        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label>Name</label>
            <input type='text' name='name' className='form-control' value={newProject.name} onChange={handleChange} />
          </div>
          <div className='form-group'>
            <label>Description</label>
            <textarea name='description' className='form-control' value={newProject.description} onChange={handleChange}></textarea>
          </div>
          <div className='form-group'>
            <label>Start Date</label>
            <input type='date' name='start_date' className='form-control' value={newProject.start_date} onChange={handleChange} />
          </div>
          <div className='form-group'>
            <label>End Date</label>
            <input type='date' name='end_date' className='form-control' value={newProject.end_date} onChange={handleChange} />
          </div>
          <div className='form-group'>
            <label>Owner</label>
            <select name='owner_id' className='form-control' value={newProject.owner_id} onChange={handleChange}>
              <option value=''>Select Employee</option>
              {employees.map(employee => (
                <option key={employee.id} value={employee.id}>{employee.name}</option>
              ))}
            </select>
          </div>
          <button type='submit' className='btn btn-primary'>Add Project</button>
        </form>
        <table className='table mt-3'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Owner</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(p => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.description}</td>
                <td>{p.start_date}</td>
                <td>{p.end_date}</td>
                <td>{p.owner_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Category;
