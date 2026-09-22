from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, Task, init_db
from datetime import datetime
import os
from dotenv import load_dotenv
import werkzeug

# Ensure werkzeug.__version__ is populated for compatibility
if not hasattr(werkzeug, '__version__'):
    import importlib.metadata
    try:
        werkzeug.__version__ = importlib.metadata.version('werkzeug')
    except Exception:
        werkzeug.__version__ = "3.1.8"

load_dotenv()

app = Flask(__name__)
CORS(app)

db_url = os.getenv('DATABASE_URL')
if not db_url:
    db_url = 'sqlite:///tasks.db'
app.config['SQLALCHEMY_DATABASE_URI'] = db_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

init_db(app)

@app.route('/', methods=['GET'])
def index():
    return jsonify({
        'status': 'online',
        'message': 'Task Manager API is running',
        'endpoints': {
            'GET /api/tasks': 'List all tasks',
            'POST /api/tasks': 'Create a new task',
            'GET /api/tasks/<id>': 'Get a specific task',
            'PUT /api/tasks/<id>': 'Update a task',
            'DELETE /api/tasks/<id>': 'Delete a task',
            'GET /api/tasks/filter/<category>': 'Filter tasks by category',
            'GET /api/tasks/status/<status>': 'Filter tasks by status'
        }
    })

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    try:
        tasks = Task.query.order_by(Task.created_at.desc()).all()
        return jsonify([task.to_dict() for task in tasks])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/tasks/<int:task_id>', methods=['GET'])
def get_task(task_id):
    try:
        task = db.session.get(Task, task_id)
        if not task:
            return jsonify({'error': 'Task not found'}), 404
        return jsonify(task.to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/tasks', methods=['POST'])
def create_task():
    try:
        data = request.get_json(silent=True)
        if not data:
            return jsonify({'error': 'Invalid JSON body'}), 400
        
        if not data.get('title') or not data.get('subject'):
            return jsonify({'error': 'Title and Subject are required'}), 400
        
        due_date = None
        if 'dueDate' in data and data['dueDate']:
            try:
                due_date = datetime.fromisoformat(data['dueDate'])
            except ValueError:
                return jsonify({'error': 'Invalid date format for dueDate. Expected ISO format.'}), 400
        
        task = Task(
            title=data['title'].strip(),
            subject=data['subject'].strip(),
            category=data.get('category', 'assignment'),
            description=data.get('description', ''),
            status=data.get('status', 'pending'),
            due_date=due_date
        )
        
        db.session.add(task)
        db.session.commit()
        
        return jsonify(task.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    try:
        task = db.session.get(Task, task_id)
        if not task:
            return jsonify({'error': 'Task not found'}), 404
            
        data = request.get_json(silent=True)
        if not data:
            return jsonify({'error': 'Invalid JSON body'}), 400
            
        task.title = data.get('title', task.title)
        task.subject = data.get('subject', task.subject)
        task.category = data.get('category', task.category)
        task.description = data.get('description', task.description)
        task.status = data.get('status', task.status)
        
        if 'dueDate' in data:
            if data['dueDate']:
                try:
                    task.due_date = datetime.fromisoformat(data['dueDate'])
                except ValueError:
                    return jsonify({'error': 'Invalid date format for dueDate. Expected ISO format.'}), 400
            else:
                task.due_date = None
            
        db.session.commit()
        
        return jsonify(task.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    try:
        task = db.session.get(Task, task_id)
        if not task:
            return jsonify({'error': 'Task not found'}), 404
            
        db.session.delete(task)
        db.session.commit()
        
        return jsonify({'message': 'Task deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/tasks/filter/<category>', methods=['GET'])
def get_tasks_by_category(category):
    try:
        tasks = Task.query.filter_by(category=category).order_by(Task.created_at.desc()).all()
        return jsonify([task.to_dict() for task in tasks])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/tasks/status/<status>', methods=['GET'])
def get_tasks_by_status(status):
    try:
        tasks = Task.query.filter_by(status=status).order_by(Task.created_at.desc()).all()
        return jsonify([task.to_dict() for task in tasks])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)