import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './style.css'; // Import styles

const NextPage = () => {
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [registerStatus, setRegisterStatus] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (values) => {
    if (values.password !== values.confirmPassword) {
      setRegisterStatus('warning');
      return; // Passwords don't match
    }

    try {
      const result = await axios.post('http://localhost:3000/auth/adminregister', values);
      if (result.data.registerStatus) {
        setRegisterStatus('success');
        navigate('/start'); // Redirect to start page after successful registration
      } else {
        setRegisterStatus('warning');
      }
    } catch (err) {
      setRegisterStatus('warning');
      console.error('Registration Error:', err.response ? err.response.data : err.message);
    }
  };

  return (
    <div className="next-page">
      <div className="form-container">
        <button onClick={() => setShowRegisterForm(true)} className="btn btn-primary">Register as Admin</button>
        <button onClick={() => navigate('/start')} className="btn btn-secondary">Go to Start Page</button>

        {showRegisterForm && (
          <div className="register-form">
            <h2>Admin Register</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const values = {
                email: formData.get('email'),
                password: formData.get('password'),
                confirmPassword: formData.get('confirmPassword')
              };
              handleRegister(values);
            }}>
              <div className='inputGroup'>
                <label htmlFor="email">Email</label>
                <input type="email" name='email' placeholder='Enter Email' className='inputField' required />
              </div>
              <div className='inputGroup'>
                <label htmlFor="password">Password</label>
                <input type="password" name='password' placeholder='Enter Password' className='inputField' required />
              </div>
              <div className='inputGroup'>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input type="password" name='confirmPassword' placeholder='Confirm Password' className='inputField' required />
              </div>
              <button type='submit' className='btn btn-primary'>Register</button>
              {registerStatus === 'success' && <p className="message success">Registration Successful!</p>}
              {registerStatus === 'warning' && <p className="message warning">Registration Failed.</p>}
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default NextPage;
