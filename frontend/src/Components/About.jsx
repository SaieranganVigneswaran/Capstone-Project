import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './About.css';

const About = () => {
    const { id } = useParams();
    const [employee, setEmployee] = useState({});

    useEffect(() => {
        // Fetch employee details
        axios.get(`http://localhost:3000/employee/detail/${id}`)
            .then(result => {
                setEmployee(result.data[0]);
            })
            .catch(err => console.log(err));
    }, [id]);

    return (
        <div className="about-container">
            <h2 className="heading">About Employee</h2>
            <div className="employee-card">
                <img src={`http://localhost:3000/Images/${employee.image}`} className='employee-image' alt='Employee' />
                <div className='details'>
                    <h3 className="employee-name">Name: {employee.name}</h3>
                    <h3 className="employee-email">Email: {employee.email}</h3>
                    <h3 className="employee-salary">Salary: ${employee.salary}</h3>
                </div>
            </div>
            <div className="note">
                <p>For profile changes, send an email to <a href="mailto:saierangan.vigne@tigeranalytics.com">saierangan.vigne@tigeranalytics.com</a>.</p>
            </div>
        </div>
    );
};

export default About;
