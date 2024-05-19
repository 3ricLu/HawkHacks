from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)
    name = db.Column(db.String(120))
    age = db.Column(db.Integer)
    tags = db.Column(db.ARRAY(db.String))
    bio = db.Column(db.Text)
    points = db.Column(db.Integer, default=0)
