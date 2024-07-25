import React, { useState } from 'react';
import './style.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [values, setValues] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState(null);
    const [loginStatus, setLoginStatus] = useState(null); // For handling success and warning effects
    const [isAnimating, setIsAnimating] = useState(false); // For handling button animation state
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:3000/auth/adminlogin', values)
            .then(result => {
                if (result.data.loginStatus) {
                    if (result.data.token) {
                        localStorage.setItem("token", result.data.token);
                    }
                    localStorage.setItem("valid", true);
                    setLoginStatus('success');
                    setIsAnimating(false); // Stop animation
                    navigate('/dashboard');
                } else {
                    setLoginStatus('warning');
                    setError(result.data.Error);
                    setIsAnimating(true); // Start animation
                }
            })
            .catch(err => {
                setLoginStatus('warning');
                setError('An error occurred. Please try again.');
                setIsAnimating(true); // Start animation
                console.log(err);
            });
    }

    return (
        <div className={`loginPage ${loginStatus}`}>
            <div className='loginForm'>
                <div className={`message ${loginStatus}`}>
                    {loginStatus === 'warning' && <p>{error}</p>}
                    {loginStatus === 'success' && <p>Login Successful!</p>}
                </div>
                <h2>Login</h2>
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
                    <button
                        className={`btn btn-primary ${isAnimating ? 'animate' : ''}`}
                        type="submit" // Change from onClick to type="submit"
                        onAnimationEnd={() => setIsAnimating(false)}>
                        Log in
                    </button>
                    <div className='terms'>
                        <input type="checkbox" name="tick" id="tick" />
                        <label htmlFor="tick">I agree with the terms & conditions</label>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
