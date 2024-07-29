// Attendance.js
import React, { useState, useEffect } from 'react';
import './Attendance.css'; // Import your CSS file

const Attendance = () => {
    const [attendanceStatus, setAttendanceStatus] = useState('present'); // Default status
    const [totalAttendance, setTotalAttendance] = useState(0);

    // Fetch total attendance from the server (You can replace this with your actual API call)
    useEffect(() => {
        const fetchAttendance = async () => {
            const response = await fetch('/api/attendance/total'); // Update with your endpoint
            const data = await response.json();
            setTotalAttendance(data.totalAttendance);
        };
        fetchAttendance();
    }, []);

    // Handle attendance submission
    const handleAttendanceSubmit = async () => {
        const response = await fetch('/api/attendance/mark', { // Update with your endpoint
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: attendanceStatus }),
        });

        if (response.ok) {
            alert('Attendance marked successfully!');
            // Optionally, refresh total attendance here
        } else {
            alert('Failed to mark attendance');
        }
    };

    return (
        <div className="attendance-container">
            <h2>Total Attendance: {totalAttendance}</h2>
            <button
                onClick={() => setAttendanceStatus('present')}
                className="attendance-button present"
            >
                Mark Present
            </button>
            <button
                onClick={() => setAttendanceStatus('absent')}
                className="attendance-button absent"
            >
                Mark Absent
            </button>
            <button onClick={handleAttendanceSubmit} className="attendance-button submit">
                Submit Attendance
            </button>
        </div>
    );
};

export default Attendance;
