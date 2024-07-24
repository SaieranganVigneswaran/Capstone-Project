import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditAdmin = () => {
    const { id } = useParams();
    const [admin, setAdmin] = useState({
        email: '',
        // Add other fields as necessary
    });
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:3000/auth/admin/${id}`)
            .then(result => {
                if (result.data.Status) {
                    setAdmin(result.data.Result[0]);
                } else {
                    alert(result.data.Error);
                }
            })
            .catch(err => console.error('Error fetching admin details:', err));
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:3000/auth/edit_admin/${id}`, admin)
            .then(result => {
                if (result.data.Status) {
                    navigate('/dashboard');
                } else {
                    alert(result.data.Error);
                }
            })
            .catch(err => console.error('Error updating admin:', err));
    };

    return (
        <div className="d-flex justify-content-center align-items-center mt-3">
            <div className="p-3 rounded w-50 border">
                <h3 className="text-center">Edit Admin</h3>
                <form className="row g-1" onSubmit={handleSubmit}>
                    <div className="col-12">
                        <label htmlFor="inputEmail" className="form-label">
                            Email
                        </label>
                        <input
                            type="email"
                            className="form-control rounded-0"
                            id="inputEmail"
                            placeholder="Enter Email"
                            autoComplete="off"
                            value={admin.email || ''}
                            onChange={(e) => setAdmin({ ...admin, email: e.target.value })}
                        />
                    </div>
                    {/* Add other fields as necessary */}
                    <div className="col-12">
                        <button type="submit" className="btn btn-primary w-100">
                            Edit Admin
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditAdmin;
