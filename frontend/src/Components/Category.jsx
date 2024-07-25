import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Category.css'; // Import a separate CSS file for styling

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
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token'); // Get the token from local storage

        const [projectsResponse, employeesResponse] = await Promise.all([
          axios.get('http://localhost:3000/auth/projects', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:3000/auth/employee', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        if (projectsResponse.data.Status) {
          setProjects(projectsResponse.data.Result);
        } else {
          alert(`Failed to fetch projects: ${projectsResponse.data.Error}`);
        }

        if (employeesResponse.data.Status) {
          setEmployees(employeesResponse.data.Result);
        } else {
          alert(`Failed to fetch employees: ${employeesResponse.data.Error}`);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        alert('An error occurred while fetching data.');
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setNewProject({ ...newProject, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); // Get the token from local storage

    axios.post('http://localhost:3000/auth/add_project', newProject, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(result => {
        if (result.data.Status) {
          setProjects([...projects, newProject]);
          setNewProject({
            name: '',
            description: '',
            start_date: '',
            end_date: '',
            owner_id: ''
          });
        } else {
          alert(`Failed to add project: ${result.data.Error}`);
        }
      }).catch(err => {
        console.error('Error adding project:', err);
        alert('An error occurred while adding the project.');
      });
  };

  return (
    <div className='container'>
      <div className='header'>
        <h3>Project List</h3>
      </div>
      <div className='form-container'>
        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label>Name</label>
            <input
              type='text'
              name='name'
              className='form-input'
              value={newProject.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className='form-group'>
            <label>Description</label>
            <textarea
              name='description'
              className='form-input'
              value={newProject.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className='form-group'>
            <label>Start Date</label>
            <input
              type='date'
              name='start_date'
              className='form-input'
              value={newProject.start_date}
              onChange={handleChange}
              required
            />
          </div>
          <div className='form-group'>
            <label>End Date</label>
            <input
              type='date'
              name='end_date'
              className='form-input'
              value={newProject.end_date}
              onChange={handleChange}
              required
            />
          </div>
          <div className='form-group'>
            <label>Owner</label>
            <select
              name='owner_id'
              className='form-input'
              value={newProject.owner_id}
              onChange={handleChange}
              required
            >
              <option value=''>Select Employee</option>
              {employees.map(employee => (
                <option key={employee.id} value={employee.id}>
                  {employee.name}
                </option>
              ))}
            </select>
          </div>
          <button type='submit' className='submit-button'>Add Project</button>
        </form>
      </div>
      <div className='table-container'>
        <table className='projects-table'>
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
                <td>{employees.find(emp => emp.id === p.owner_id)?.name || 'Unknown'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Category;
