import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './EmployeeDetail.css';

const EmployeeDetail = () => {
    const [employee, setEmployee] = useState({});
    const [tasks, setTasks] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch employee details
        axios.get(`http://localhost:3000/employee/detail/${id}`)
            .then(result => {
                setEmployee(result.data[0]);
            })
            .catch(err => console.log(err));

        // Fetch tasks associated with the employee
        axios.get(`http://localhost:3000/employee/task_detail/${id}`)
            .then(result => {
                if (result.data.Status) {
                    const filteredTasks = result.data.Result.filter(task => task.status !== 'approved');
                    console.log('Filtered Tasks:', filteredTasks); // Log filtered tasks
                    setTasks(filteredTasks);
                } else {
                    console.error(result.data.Error);
                }
            })
            .catch(err => console.log(err));
    }, [id]);

    const handleLogout = () => {
        axios.get('http://localhost:3000/employee/logout')
            .then(result => {
                if (result.data.Status) {
                    localStorage.removeItem("valid");
                    navigate('/');
                }
            }).catch(err => console.log(err));
    }

    const onDragEnd = (result) => {
        const { destination, source, draggableId } = result;

        // If the item is dropped outside a droppable area
        if (!destination) {
            return;
        }

        // If the item is dropped in the same place
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const newStatus = destination.droppableId;
        const taskId = parseInt(draggableId);

        // Update the task status locally
        setTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === taskId ? { ...task, status: newStatus } : task
            )
        );

        // Update task status on the server
        axios.put(`http://localhost:3000/employee/update_task_status/${taskId}`, { status: newStatus })
            .then(result => {
                if (!result.data.Status) {
                    alert(result.data.Error);
                }
            })
            .catch(err => console.log(err));
    }

    const toggleDropdown = () => {
        setShowDropdown(prev => !prev);
    };

    const employeeName = employee.name || 'Employee'; // Get employee name for tooltip

    return (
        <div className="profile-container">
            <div className="header">
                <h2>Employee Management System</h2>
                <div className="profile-icon" onClick={toggleDropdown} title={`Hi ${employeeName}`}>
                    <span>🧑‍💻</span>
                    {showDropdown && (
                        <div className="dropdown">
                            <a href={`/about/${id}`} className="dropdown-item">About</a>
                            <button className="dropdown-item" onClick={handleLogout}>Logout</button>
                        </div>
                    )}
                </div>
            </div>
            <div className='task-board mt-3'>
                <h4 className="tasks-heading">Your Tasks</h4> {/* Separate heading */}
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="task-columns">
                        {['new', 'in progress', 'completed'].map((status) => (
                            <Droppable droppableId={status} key={status}>
                                {(provided) => (
                                    <div
                                        className={`task-column ${status}`}
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                    >
                                        <h5>{status.toUpperCase()}</h5>
                                        {tasks
                                            .filter(task => task.status === status) // Ensure correct filtering
                                            .map((task, index) => (
                                                <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                                                    {(provided) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className="task-card"
                                                        >
                                                            <h6>{task.title}</h6>
                                                            <p>Project: {task.project_name}</p>
                                                            <p>Description: {task.description}</p>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        ))}
                    </div>
                </DragDropContext>
            </div>
        </div>
    );
};

export default EmployeeDetail;
