import axios from 'axios';
import React, { useEffect, useState } from 'react';
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
  const [editProject, setEditProject] = useState(null); // For editing projects
  const [isEditing, setIsEditing] = useState(false); // Flag for editing mode
  const [loading, setLoading] = useState(true); // For loading state
  const [error, setError] = useState(null); // For error handling

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Set loading to true while fetching
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
          setError(`Failed to fetch projects: ${projectsResponse.data.Error}`);
        }

        if (employeesResponse.data.Status) {
          setEmployees(employeesResponse.data.Result);
        } else {
          setError(`Failed to fetch employees: ${employeesResponse.data.Error}`);
        }
      } catch (err) {
        setError('An error occurred while fetching data.');
      } finally {
        setLoading(false); // Set loading to false after fetching
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

    if (isEditing) {
      axios.put(`http://localhost:3000/auth/update_project/${editProject.id}`, newProject, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(result => {
        if (result.data.Status) {
          setProjects(projects.map(p => (p.id === editProject.id ? newProject : p)));
          resetForm();
        } else {
          setError(`Failed to update project: ${result.data.Error}`);
        }
      })
      .catch(err => {
        setError('An error occurred while updating the project.');
      });
    } else {
      axios.post('http://localhost:3000/auth/add_project', newProject, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(result => {
        if (result.data.Status) {
          setProjects([...projects, { ...newProject, id: Date.now() }]);
          resetForm();
        } else {
          setError(`Failed to add project: ${result.data.Error}`);
        }
      })
      .catch(err => {
        setError('An error occurred while adding the project.');
      });
    }
  };

  const handleEdit = (project) => {
    setNewProject({
      name: project.name,
      description: project.description,
      start_date: project.start_date,
      end_date: project.end_date,
      owner_id: project.owner_id
    });
    setEditProject(project);
    setIsEditing(true);
  };

  const handleDelete = (projectId) => {
    const token = localStorage.getItem('token'); // Get the token from local storage
    axios.delete(`http://localhost:3000/auth/delete_project/${projectId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(result => {
      if (result.data.Status) {
        setProjects(projects.filter(p => p.id !== projectId));
      } else {
        setError(`Failed to delete project: ${result.data.Error}`);
      }
    })
    .catch(err => {
      setError('An error occurred while deleting the project.');
    });
  };

  const resetForm = () => {
    setNewProject({
      name: '',
      description: '',
      start_date: '',
      end_date: '',
      owner_id: ''
    });
    setEditProject(null);
    setIsEditing(false);
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className='container'>
      <div className='header'>
        <h3>{isEditing ? 'Edit Project' : 'Add New Project'}</h3>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className='error'>{error}</p>}
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
          <button type='submit' className='submit-button'>{isEditing ? 'Update Project' : 'Add Project'}</button>
          {isEditing && <button type='button' className='cancel-button' onClick={resetForm}>Cancel</button>}
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(p => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.description}</td>
                <td>{formatDate(p.start_date)}</td>
                <td>{formatDate(p.end_date)}</td>
                <td>{employees.find(e => e.id === p.owner_id)?.name || 'N/A'}</td>
                <td>
                  <button onClick={() => handleEdit(p)} className='edit-button'>Edit</button>
                  <button onClick={() => handleDelete(p.id)} className='delete-button'>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Category;
