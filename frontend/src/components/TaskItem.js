
import React from 'react';
import './TaskItem.css';

const TaskItem = ({ task, onEdit, onDelete }) => {
  const getStatusDisplay = (status) => {
    switch (status) {
      case 'completed': return { class: 'status-completed', text: 'Completed' };
      case 'in_progress': return { class: 'status-in-progress', text: 'In Progress' };
      case 'pending': return { class: 'status-pending', text: 'Not Started' };
      default: return { class: '', text: status };
    }
  };

  const getCategoryDisplay = (category) => {
    switch (category) {
      case 'assignment': return 'Assignment';
      case 'exam_prep': return 'Exam Prep';
      case 'project': return 'Project';
      case 'reading': return 'Reading';
      default: return 'Task';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No Date';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isOverdue = (dateString) => {
    if (!dateString || task.status === 'completed') return false;
    return new Date(dateString) < new Date();
  };

  const statusInfo = getStatusDisplay(task.status);
  const categoryText = getCategoryDisplay(task.category);
  const overdueAlert = isOverdue(task.dueDate);

  return (
    <div className={`task-card ${overdueAlert ? 'task-overdue' : ''}`}>
      <div className="task-header">
        <div className="task-titles">
          <span className="task-subject">{task.subject || 'General'}</span>
          <h3>{task.title}</h3>
        </div>
        <span className={`status-badge ${statusInfo.class}`}>
          {statusInfo.text}
        </span>
      </div>
      
      <div className="task-tags">
        <span className="task-category">
          {categoryText}
        </span>
        <span className={`task-due-date ${overdueAlert ? 'text-danger' : ''}`}>
          Due: {formatDate(task.dueDate)} {overdueAlert && ' (Overdue)'}
        </span>
      </div>

      <p className="task-description">
        {task.description || <span className="text-muted">No additional notes provided.</span>}
      </p>
      
      <div className="task-footer">
        <div className="task-actions-left">
          <button onClick={onEdit} className="btn-text btn-edit" title="Edit Task">
             Edit
          </button>
        </div>
        
        <div className="task-actions-right">
          <button onClick={() => onDelete(task.id)} className="btn-text btn-delete" title="Delete Task">
             Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;