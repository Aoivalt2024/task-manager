import React from 'react';
import { useNavigate } from 'react-router-dom';
import TaskItem from './TaskItem';
import './TaskList.css';

const TaskList = ({ tasks, onDelete }) => {
  const navigate = useNavigate();

  const handleEdit = (task) => {
    navigate('/form', { state: { task } });
  };

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-circle">
          <span>0</span>
        </div>
        <h2>No tasks found</h2>
        <p>Your study schedule is completely clear. Enjoy your free time or add a new assignment to get started.</p>
        <button onClick={() => navigate('/form')} className="btn btn-primary mt-3">
          Add Your First Task
        </button>
      </div>
    );
  }

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const pendingTasks = tasks.length - completedTasks;

  return (
    <div className="page-container">
      <div className="dashboard-header">
        
        <div className="header-title">
          <h2>Your Study Dashboard</h2>
          <p>Track your assignments, exams, and projects all in one place.</p>
        </div>
        
        <div className="header-actions">
          <div className="task-stats">
            <div className="stat-badge total">
              <span>{tasks.length} Total</span>
            </div>
            <div className="stat-badge pending">
              <span>{pendingTasks} Pending</span>
            </div>
            <div className="stat-badge completed">
              <span>{completedTasks} Done</span>
            </div>
          </div>
          
          <button onClick={() => navigate('/form')} className="btn btn-primary new-task-btn">
            New Task
          </button>
        </div>

      </div>
      
      <div className="tasks-grid">
        {tasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            onEdit={() => handleEdit(task)}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskList;