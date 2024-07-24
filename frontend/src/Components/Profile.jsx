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
    end_date: ''
  });
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        // Fetch admin details
        const adminResponse = await axios.get('http://localhost:3000/auth/admin', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (adminResponse.data.Status) {
          setAdmin(adminResponse.data.Result);
          // Fetch tasks
          await fetchTasks(adminResponse.data.Result.id);
        } else {
          throw new Error(adminResponse.data.Error || 'Failed to fetch admin details');
        }

        // Fetch projects
        const projectsResponse = await axios.get('http://localhost:3000/auth/projects', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (projectsResponse.data.Status) {
          setProjects(projectsResponse.data.Result);
        } else {
          throw new Error(projectsResponse.data.Error || 'Failed to fetch projects');
        }

        // Fetch employees
        const employeesResponse = await axios.get('http://localhost:3000/auth/employee', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (employeesResponse.data.Status) {
          setEmployees(employeesResponse.data.Result);
        } else {
          throw new Error(employeesResponse.data.Error || 'Failed to fetch employees');
        }

      } catch (err) {
        console.error('Error fetching data:', err.message);
      }
    };

    const fetchTasks = async (adminId) => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await axios.get(`http://localhost:3000/auth/tasks/${adminId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
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

    fetchData();
  }, []);

  const handleChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    axios.post('http://localhost:3000/auth/add_task', newTask, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(result => {
        if (result.data.Status) {
          // Refresh tasks after adding a new one
          fetchTasks(admin.id);
          setNewTask({
            title: '',
            description: '',
            project_id: '',
            employee_id: '',
            start_date: '',
            end_date: ''
          });
        } else {
          alert(result.data.Error);
        }
      }).catch(err => {
        console.error('Error adding task:', err.message);
      });
  };

  return (
    <div className="profile-container">
      <h2 className='mt-4'>Tasks</h2>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label>Title</label>
            <input
              type='text'
              name='title'
              className='form-input'
              value={newTask.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className='form-group'>
            <label>Description</label>
            <textarea
              name='description'
              className='form-textarea'
              value={newTask.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <div className='form-group'>
            <label>Project</label>
            <select
              name='project_id'
              className='form-select'
              value={newTask.project_id}
              onChange={handleChange}
              required
            >
              <option value=''>Select Project</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
          </div>
          <div className='form-group'>
            <label>Employee</label>
            <select
              name='employee_id'
              className='form-select'
              value={newTask.employee_id}
              onChange={handleChange}
              required
            >
              <option value=''>Select Employee</option>
              {employees.map(employee => (
                <option key={employee.id} value={employee.id}>{employee.name}</option>
              ))}
            </select>
          </div>
          <div className='form-group'>
            <label>Start Date</label>
            <input
              type='date'
              name='start_date'
              className='form-input'
              value={newTask.start_date}
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
              value={newTask.end_date}
              onChange={handleChange}
              required
            />
          </div>
          <button type='submit' className='submit-button'>Add Task</button>
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
            </tr>
          </thead>
          <tbody>
            {tasks.length > 0 ? (
              tasks.map(task => {
                const project = projects.find(p => p.id === Number(task.project_id));
                const employee = employees.find(e => e.id === Number(task.employee_id));

                return (
                  <tr key={task.id}>
                    <td>{task.title}</td>
                    <td>{task.description}</td>
                    <td>{project ? project.name : 'N/A'}</td>
                    <td>{employee ? employee.name : 'N/A'}</td>
                    <td>{new Date(task.start_date).toLocaleDateString()}</td>
                    <td>{new Date(task.end_date).toLocaleDateString()}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6">No tasks available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Profile;
