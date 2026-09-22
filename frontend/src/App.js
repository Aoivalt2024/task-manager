import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Navbar';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import './App.css';

const API_URL = 'http://localhost:5000/api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch (err) {
      setError('Failed to fetch tasks: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async (taskData) => {
    try {
      const response = await axios.post(API_URL, taskData);
      setTasks(currentTasks => [response.data, ...currentTasks]);
    } catch (err) {
      setError('Failed to create task: ' + err.message);
    }
  };

  const handleUpdateTask = async (taskId, taskData) => {
  
    setTasks(currentTasks => 
      currentTasks.map(task => 
        task.id === taskId ? { ...task, ...taskData } : task
      )
    );

  
    try {
      const response = await axios.put(`${API_URL}/${taskId}`, taskData);
      
    
      setTasks(currentTasks => 
        currentTasks.map(task => 
          task.id === taskId ? response.data : task
        )
      );
    } catch (err) {
      setError('Failed to update task: ' + err.message);
      fetchTasks(); 
    }
  };

  const handleDeleteTask = async (taskId) => {
    
    setTasks(currentTasks => currentTasks.filter(task => task.id !== taskId));

   
    try {
      await axios.delete(`${API_URL}/${taskId}`);
    } catch (err) {
      setError('Failed to delete task: ' + err.message);
      fetchTasks(); 
    }
  };

  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="main-content">
          {error && <div className="error-message">{error}</div>}
          
          <Routes>
            <Route 
              path="/" 
              element={
                loading ? (
                  <div className="loading">
                    <div className="spinner"></div>
                    <p>Loading tasks...</p>
                  </div>
                ) : (
                  <TaskList 
                    tasks={tasks} 
                    onDelete={handleDeleteTask} 
                  />
                )
              } 
            />
            <Route 
              path="/form" 
              element={
                <TaskForm 
                  onCreateTask={handleCreateTask} 
                  onUpdateTask={handleUpdateTask} 
                />
              } 
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;