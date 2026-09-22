import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './TaskForm.css';

const TaskForm = ({ onCreateTask, onUpdateTask }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const editingTask = location.state?.task || null; 

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('assignment');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setSubject(editingTask.subject || '');
      setCategory(editingTask.category || 'assignment');
      setDueDate(editingTask.dueDate ? editingTask.dueDate.split('T')[0] : '');
      setDescription(editingTask.description || '');
      setStatus(editingTask.status || 'pending');
    } else {
      setTitle('');
      setSubject('');
      setCategory('assignment');
      setDueDate('');
      setDescription('');
      setStatus('pending');
    }
  }, [editingTask]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !subject.trim()) {
      alert('Title and Subject are required!');
      return;
    }

    const taskData = {
      title: title.trim(),
      subject: subject.trim(),
      category: category,
      dueDate: dueDate,
      description: description.trim(),
      status: status
    };

    
    if (editingTask) {
      onUpdateTask(editingTask.id, taskData);
    } else {
      onCreateTask(taskData);
    }
    
    navigate('/'); 
  };

  const handleCancel = () => navigate('/'); 

  return (
    <div className="page-container">
      <div className="task-form-container">
        <h2>
          {editingTask ? 'Edit Study Task' : 'Add Study Task'}
        </h2>
        <form onSubmit={handleSubmit} className="task-form">
          
          <div className="form-group full-width">
            <label htmlFor="title">Task Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Write Essay on AI"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group half-width">
              <label htmlFor="subject">Subject / Course</label>
              <input
                type="text"
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., Computer Science 101"
                required
              />
            </div>
            
            <div className="form-group half-width">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="assignment">Assignment / Homework</option>
                <option value="exam_prep">Exam Preparation</option>
                <option value="project">Project / Presentation</option>
                <option value="reading">Reading</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group half-width">
              <label htmlFor="dueDate">Due Date</label>
              <input
                type="date"
                id="dueDate"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group half-width">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="pending">Not Started</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          
          <div className="form-group full-width">
            <label htmlFor="description">Details & Notes</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add important notes, links, or instructions..."
              rows="4"
            />
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn btn-primary form-btn">
              {editingTask ? 'Save Changes' : 'Create Task'}
            </button>
            <button type="button" onClick={handleCancel} className="btn btn-secondary form-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;