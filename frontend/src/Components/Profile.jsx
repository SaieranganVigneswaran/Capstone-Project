import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Profile = () => {
  const [admin, setAdmin] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    project_id: ''
  });

  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await axios.get('http://localhost:3000/auth/admin', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data.Status) {
          setAdmin(response.data.Result);
          fetchTasks(response.data.Result.id);
        } else {
          throw new Error(response.data.Error || 'Failed to fetch admin details');
        }
      } catch (err) {
        console.error('Error fetching admin details:', err.response ? err.response.data : err.message);
      }
    };

    const fetchTasks = async (adminId) => {
      try {
        const response = await axios.get(`http://localhost:3000/auth/tasks/${adminId}`);
        if (response.data.Status) {
          setTasks(response.data.Result);
        } else {
          throw new Error(response.data.Error || 'Failed to fetch tasks');
        }
      } catch (err) {
        console.error('Error fetching tasks:', err.message);
      }
    };

    fetchAdminDetails();
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
        if(result.data.Status) {
          setTasks([...tasks, newTask]);
        } else {
          alert(result.data.Error);
        }
      }).catch(err => console.log(err));
  };

  return (
    <div className="profile-container px-5 mt-3">
      <h1>Admin Profile</h1>
      {admin ? (
        <div className="profile-details">
          <p><strong>Name:</strong> {admin.name}</p>
          <p><strong>Email:</strong> {admin.email}</p>
          <p><strong>Address:</strong> {admin.address}</p>
          <p><strong>Salary:</strong> ${admin.salary}</p>
        </div>
      ) : (
        <div>No admin details available</div>
      )}
      <h2 className='mt-4'>Tasks</h2>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label>Title</label>
          <input type='text' name='title' className='form-control' value={newTask.title} onChange={handleChange} />
        </div>
        <div className='form-group'>
          <label>Description</label>
          <textarea name='description' className='form-control' value={newTask.description} onChange={handleChange}></textarea>
        </div>
        <div className='form-group'>
          <label>Project</label>
          <select name='project_id' className='form-control' value={newTask.project_id} onChange={handleChange}>
            <option value=''>Select Project</option>
            {/* Populate with available projects */}
          </select>
        </div>
        <button type='submit' className='btn btn-primary'>Add Task</button>
      </form>
      <div className='mt-3'>
        <table className='table'>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Project</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id}>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td>{task.project_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Profile;
