from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from config import Config  # Import your Config class
from model import db, User # Import your User class

app = Flask(__name__)
app.config.from_object(Config)  # Load configuration from Config

db.init_app(app)  # Initialize SQLAlchemy with your app
# Create tables if they don't exist
with app.app_context():
    db.create_all()


@app.route('/')
def hello():
    return 'Hello from Flask!'
from flask import request, jsonify
from werkzeug.security import generate_password_hash

@app.route('/api/register', methods=['POST'])
def register_user():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    name = data.get('name')
    age = data.get('age')
    tags = data.get('tags')
    bio = data.get('bio')


    if not username or not password:
        return jsonify({'error': 'Username and password are required'}), 400

    # Check if the username already exists
    if User.query.filter_by(username=username).first() is not None:
        return jsonify({'error': 'Username already exists'}), 400

    # Hash the password for security
    hashed_password = generate_password_hash(password)

    # Create a new user object
    new_user = User(
        username=username,
        password_hash=hashed_password,
        name=name, 
        age=age,
        tags=tags,
        bio=bio
    )

    # Add the user to the database and commit
    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'User registered successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'An error occurred during registration'}), 500
    
if __name__ == '__main__':
    app.run(debug=True) 
