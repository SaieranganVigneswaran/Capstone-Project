import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './style.css';

const AdminRegister = () => {
    const [values, setValues] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState(null);
    const [registerStatus, setRegisterStatus] = useState(null);
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    const handleSubmit = (event) => {
        event.preventDefault();
        if (values.password !== values.confirmPassword) {
            setRegisterStatus('warning');
            setError('Passwords do not match.');
            return;
        }

        axios.post('http://localhost:3000/auth/adminregister', values)
            .then(result => {
                if (result.data.registerStatus) {
                    setRegisterStatus('success');
                    navigate('/adminlogin'); // Redirect to login page after successful registration
                } else {
                    setRegisterStatus('warning');
                    setError(result.data.Error);
                }
            })
            .catch(err => {
                setRegisterStatus('warning');
                setError('An error occurred. Please try again.');
                console.log(err);
            });
    }

    return (
        <div className={`loginPage ${registerStatus}`}>
            <div className='loginForm'>
                <div className={`message ${registerStatus}`}>
                    {registerStatus === 'warning' && <p>{error}</p>}
                    {registerStatus === 'success' && <p>Registration Successful!</p>}
                </div>
                <h2>Admin Register</h2>
                <form onSubmit={handleSubmit}>
                    <div className='inputGroup'>
                        <label htmlFor="email">Email</label>
                        <input type="email" name='email' autoComplete='off' placeholder='Enter Email'
                            onChange={(e) => setValues({ ...values, email: e.target.value })}
                            className='inputField' />
                    </div>
                    <div className='inputGroup'>
                        <label htmlFor="password">Password</label>
                        <input type="password" name='password' placeholder='Enter Password'
                            onChange={(e) => setValues({ ...values, password: e.target.value })}
                            className='inputField' />
                    </div>
                    <div className='inputGroup'>
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input type="password" name='confirmPassword' placeholder='Confirm Password'
                            onChange={(e) => setValues({ ...values, confirmPassword: e.target.value })}
                            className='inputField' />
                    </div>
                    <button className='btn btn-primary'>Register</button>
                </form>
                <button className='btn btn-secondary' onClick={() => navigate('/adminlogin')}>Direct to Login</button>
            </div>
        </div>
    );
}

export default AdminRegister;
