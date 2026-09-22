from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone

db = SQLAlchemy()

def get_utc_now():
    return datetime.now(timezone.utc)

class Task(db.Model):
    __tablename__ = 'tasks'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    subject = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(50), nullable=False, default='assignment')
    description = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(20), nullable=False, default='pending')
    due_date = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=get_utc_now)
    updated_at = db.Column(db.DateTime, default=get_utc_now, onupdate=get_utc_now)
    
    def __init__(self, title, subject, category='assignment', description=None, status='pending', due_date=None):
        self.title = title
        self.subject = subject
        self.category = category
        self.description = description
        self.status = status
        self.due_date = due_date
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'subject': self.subject,
            'category': self.category,
            'description': self.description,
            'status': self.status,
            'dueDate': self.due_date.isoformat() if self.due_date else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def update(self, data):
        if 'title' in data:
            self.title = data['title']
        if 'subject' in data:
            self.subject = data['subject']
        if 'category' in data:
            self.category = data['category']
        if 'description' in data:
            self.description = data['description']
        if 'status' in data:
            self.status = data['status']
        if 'dueDate' in data and data['dueDate']:
            self.due_date = datetime.fromisoformat(data['dueDate'])

def init_db(app):
    db.init_app(app)
    with app.app_context():
        db.create_all()