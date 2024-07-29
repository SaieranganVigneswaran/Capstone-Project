import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './Profile.css';

const Profile = () => {
  const [admin, setAdmin] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    project_id: '',
    employee_id: '',
    start_date: '',
    end_date: '',
    status: 'new' // Default status
  });
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [editTask, setEditTask] = useState(null);

  const getToken = () => {
    return localStorage.getItem('token');
  };

  const fetchAdminDetails = async () => {
    try {
      const token = getToken();
      if (!token) throw new Error('No authentication token found');

      const response = await axios.get('http://localhost:3000/auth/admin', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.Status) {
        setAdmin(response.data.admin);
        fetchTasks(response.data.admin.id);
      } else {
        throw new Error(response.data.Error || 'Failed to fetch admin details');
      }
    } catch (err) {
      console.error('Error fetching admin details:', err.message);
    }
  };

  const fetchTasks = async (adminId) => {
    try {
      const token = getToken();
      if (!token) throw new Error('No authentication token found');

      const response = await axios.get(`http://localhost:3000/auth/tasks/${adminId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.Status) {
        setTasks(response.data.Result);
      } else {
        throw new Error(response.data.Error || 'Failed to fetch tasks');
      }
    } catch (err) {
      console.error('Error fetching tasks:', err.message);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://localhost:3000/auth/projects');
      if (response.data.Status) {
        setProjects(response.data.Result);
      } else {
        throw new Error(response.data.Error || 'Failed to fetch projects');
      }
    } catch (err) {
      console.error('Error fetching projects:', err.message);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:3000/auth/employee');
      if (response.data.Status) {
        setEmployees(response.data.Result);
      } else {
        throw new Error(response.data.Error || 'Failed to fetch employees');
      }
    } catch (err) {
      console.error('Error fetching employees:', err.message);
    }
  };

  useEffect(() => {
    fetchAdminDetails();
    fetchProjects();
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      const token = getToken();
      if (!token) throw new Error('No authentication token found');

      const response = await axios.put(`http://localhost:3000/auth/update_task_status/${taskId}`, { status }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.Status) {
        if (admin && admin.id) {
          await fetchTasks(admin.id);
        }
      } else {
        alert(response.data.Error);
      }
    } catch (err) {
      console.error('Error updating task status:', err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = getToken();
      if (!token) throw new Error('No authentication token found');

      let response;
      if (editTask) {
        response = await axios.put(`http://localhost:3000/auth/edit_task/${editTask.id}`, newTask, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } else {
        response = await axios.post('http://localhost:3000/auth/add_task', newTask, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }

      if (response.data.Status) {
        if (admin && admin.id) {
          await fetchTasks(admin.id);
          resetForm();
        }
      } else {
        alert(response.data.Error);
      }
    } catch (err) {
      console.error('Error adding/updating task:', err.message);
    }
  };

  const handleEdit = (task) => {
    setEditTask(task);
    setNewTask({
      title: task.title,
      description: task.description,
      project_id: task.project_id,
      employee_id: task.employee_id,
      start_date: task.start_date,
      end_date: task.end_date,
      status: task.status // Include status in the edit
    });
  };

  const handleDelete = async (taskId) => {
    try {
      const token = getToken();
      if (!token) throw new Error('No authentication token found');

      const response = await axios.delete(`http://localhost:3000/auth/delete_task/${taskId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.Status) {
        if (admin && admin.id) {
          await fetchTasks(admin.id);
        }
      } else {
        alert(response.data.Error);
      }
    } catch (err) {
      console.error('Error deleting task:', err.message);
    }
  };

  const resetForm = () => {
    setNewTask({
      title: '',
      description: '',
      project_id: '',
      employee_id: '',
      start_date: '',
      end_date: '',
      status: 'new' // Reset status to default
    });
    setEditTask(null);
  };

  return (
    <div className="profile-container">
      <div className='header'>
        <h2>{editTask ? 'Edit Task' : 'Add New Task'}</h2>
      </div>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label>Title</label>
            <input type='text' name='title' className='form-input' value={newTask.title} onChange={handleChange} />
          </div>
          <div className='form-group'>
            <label>Description</label>
            <textarea name='description' className='form-textarea' value={newTask.description} onChange={handleChange}></textarea>
          </div>
          <div className='form-group'>
            <label>Project</label>
            <select name='project_id' className='form-select' value={newTask.project_id} onChange={handleChange}>
              <option value=''>Select Project</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
          </div>
          <div className='form-group'>
            <label>Employee</label>
            <select name='employee_id' className='form-select' value={newTask.employee_id} onChange={handleChange}>
              <option value=''>Select Employee</option>
              {employees.map(employee => (
                <option key={employee.id} value={employee.id}>{employee.name}</option>
              ))}
            </select>
          </div>
          <div className='form-group'>
            <label>Start Date</label>
            <input type='date' name='start_date' className='form-input' value={newTask.start_date} onChange={handleChange} />
          </div>
          <div className='form-group'>
            <label>End Date</label>
            <input type='date' name='end_date' className='form-input' value={newTask.end_date} onChange={handleChange} />
          </div>
          <button type='submit' className='submit-button'>
            {editTask ? 'Update Task' : 'Add Task'}
          </button>
          {editTask && (
            <button type='button' className='cancel-button' onClick={resetForm}>
              Cancel
            </button>
          )}
        </form>
      </div>
      <div className='table-container'>
        <table className='tasks-table'>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Project</th>
              <th>Employee</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length > 0 ? (
              tasks.map(task => {
                const project = projects.find(p => p.id === task.project_id);
                const employee = employees.find(e => e.id === task.employee_id);
                return (
                  <tr key={task.id}>
                    <td>{task.title}</td>
                    <td>{task.description}</td>
                    <td>{project ? project.name : 'N/A'}</td>
                    <td>{employee ? employee.name : 'N/A'}</td>
                    <td>{task.start_date}</td>
                    <td>{task.end_date}</td>
                    <td>
                      <select value={task.status} onChange={(e) => handleStatusChange(task.id, e.target.value)}>
                        <option value="new">New</option>
                        <option value="in progress">In Progress</option>
                        <option value="completed">Completed</option>
                        {admin && <option value="approved">Approved</option>}
                      </select>
                    </td>
                    <td>
                      <button onClick={() => handleEdit(task)} className='edit-button'>Edit</button>
                      <button onClick={() => handleDelete(task.id)} className='delete-button'>Delete</button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8">No tasks available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Profile;
