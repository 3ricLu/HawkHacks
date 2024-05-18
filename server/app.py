import os
from flask import Flask, request, jsonify, session, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from sqlalchemy.exc import IntegrityError
from dotenv import load_dotenv
from flask_session import Session

load_dotenv()

app = Flask(__name__)
CORS(app)
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SECRET_KEY"] = "your_secret_key"
app.config["SESSION_TYPE"] = "filesystem"
app.config['UPLOAD_FOLDER'] = 'uploads/'  # Folder to store uploaded resumes
Session(app)

db = SQLAlchemy(app)

# Create the uploads directory if it does not exist
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

# Serve files from the uploads directory
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)




#logging out
@app.route('/api/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'message': 'Logout successful'}), 200

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(120))
    surname = db.Column(db.String(120))
    email = db.Column(db.String(120))
    age = db.Column(db.Integer)
    tags = db.Column(db.ARRAY(db.String))
    headline = db.Column(db.String(255))
    bio = db.Column(db.Text)
    resume = db.Column(db.String(255))  # Path to the uploaded resume file

with app.app_context():
    db.create_all()

#delete all data
@app.route('/api/delete-all-users', methods=['POST'])
def delete_all_users():
    try:
        db.session.query(User).delete()
        db.session.commit()
        return jsonify({'message': 'All user data deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error: {e}")
        return jsonify({'errors': {'general': 'An error occurred while deleting data'}}), 500


# Create account endpoint
@app.route('/api/create-account', methods=['POST'])
def create_account():
    try:
        data = request.get_json()
        app.logger.info(f"Received data: {data}")

        required_fields = ['username', 'password']
        missing_fields = [field for field in required_fields if field not in data or not data[field]]

        if missing_fields:
            return jsonify({'errors': {field: f'{field} is required' for field in missing_fields}}), 400

        hashed_password = generate_password_hash(data['password'])
        new_user = User(
            username=data['username'],
            password_hash=hashed_password
        )

        db.session.add(new_user)
        db.session.commit()

        return jsonify({'message': 'Account created successfully'}), 201
    except IntegrityError as e:
        db.session.rollback()
        app.logger.error(f"IntegrityError: {e}")
        if 'duplicate key value violates unique constraint' in str(e):
            return jsonify({'errors': {'username': 'Username already exists'}}), 400
        return jsonify({'errors': {'general': 'An error occurred during account creation'}}), 500
    except Exception as e:
        app.logger.error(f"Error: {e}")
        return jsonify({'errors': {'general': 'An error occurred during account creation'}}), 500

# Login endpoint
@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        app.logger.info(f"Received data: {data}")

        required_fields = ['username', 'password']
        missing_fields = [field for field in required_fields if field not in data or not data[field]]

        if missing_fields:
            return jsonify({'errors': {field: f'{field} is required' for field in missing_fields}}), 400

        user = User.query.filter_by(username=data['username']).first()
        if user and check_password_hash(user.password_hash, data['password']):
            # Login successful, set session or token here
            session['user_id'] = user.id
            return jsonify({'message': 'Login successful'}), 200
        else:
            return jsonify({'errors': {'general': 'Invalid username or password'}}), 400
    except Exception as e:
        app.logger.error(f"Error: {e}")
        return jsonify({'errors': {'general': 'An error occurred during login'}}), 500


@app.route('/api/profile', methods=['POST'])
def update_profile():
    try:
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'errors': {'general': 'User not authenticated'}}), 401

        user = User.query.get(user_id)
        if not user:
            return jsonify({'errors': {'general': 'User not found'}}), 404

        data = request.form.to_dict()
        resume = request.files.get('resume')
        app.logger.info(f"Received data: {data}")

        user.name = data.get('name', user.name)
        user.surname = data.get('surname', user.surname)
        user.email = data.get('email', user.email)
        user.age = int(data.get('age', user.age))
        user.headline = data.get('headline', user.headline)
        user.bio = data.get('bio', user.bio)
        user.tags = request.form.getlist('tags')

        if resume:
            resume_filename = secure_filename(resume.filename)
            resume.save(os.path.join(app.config['UPLOAD_FOLDER'], resume_filename))
            user.resume = resume_filename

        db.session.commit()

        user_data = {
            'username': user.username,
            'name': user.name,
            'surname': user.surname,
            'email': user.email,
            'age': user.age,
            'tags': user.tags,
            'headline': user.headline,
            'bio': user.bio,
            'resume': user.resume
        }

        return jsonify({'message': 'Profile updated successfully', 'user': user_data}), 200
    except Exception as e:
        app.logger.error(f"Error: {e}")
        return jsonify({'errors': {'general': 'An error occurred during profile update'}}), 500

    
#Get method
@app.route('/api/profile', methods=['GET'])
def get_profile():
    try:
        # Authenticate the user
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'errors': {'general': 'User not authenticated'}}), 401

        user = User.query.get(user_id)
        if not user:
            return jsonify({'errors': {'general': 'User not found'}}), 404

        user_data = {
            'username': user.username,
            'name': user.name,
            'surname': user.surname,
            'email': user.email,
            'age': user.age,
            'tags': user.tags,
            'headline': user.headline,
            'bio': user.bio,
            'resume': user.resume
        }

        return jsonify({'user': user_data}), 200
    except Exception as e:
        app.logger.error(f"Error: {e}")
        return jsonify({'errors': {'general': 'An error occurred while fetching profile information'}}), 500




# Register endpoint (if needed)
@app.route('/api/register', methods=['POST'])
def register_user():
    try:
        # Handling form data and file upload
        data = request.form.to_dict()
        resume = request.files.get('resume')
        app.logger.info(f"Received data: {data}")

        required_fields = ['username', 'password', 'name', 'surname', 'email', 'age', 'headline', 'bio']
        missing_fields = [field for field in required_fields if field not in data or not data[field]]

        if missing_fields:
            return jsonify({'errors': {field: f'{field} is required' for field in missing_fields}}), 400

        if not data['age'].isdigit() or not 1 <= int(data['age']) <= 150:
            return jsonify({'errors': {'age': 'Age must be an integer between 1 and 150'}}), 400

        tags = request.form.getlist('tags')  # Get list of tags from form data

        hashed_password = generate_password_hash(data['password'])

        resume_filename = None
        if resume:
            resume_filename = secure_filename(resume.filename)
            resume.save(os.path.join(app.config['UPLOAD_FOLDER'], resume_filename))

        new_user = User(
            username=data['username'],
            password_hash=hashed_password,
            name=data['name'],
            surname=data['surname'],
            email=data['email'],
            age=int(data['age']),
            tags=tags,
            headline=data['headline'],
            bio=data['bio'],
            resume=resume_filename
        )

        db.session.add(new_user)
        db.session.commit()

        return jsonify({'message': 'User registered successfully'}), 201
    except IntegrityError as e:
        db.session.rollback()
        app.logger.error(f"IntegrityError: {e}")
        if 'duplicate key value violates unique constraint' in str(e):
            return jsonify({'errors': {'username': 'Username already exists'}}), 400
        return jsonify({'errors': {'general': 'An error occurred during registration'}}), 500
    except Exception as e:
        app.logger.error(f"Error: {e}")
        return jsonify({'errors': {'general': 'An error occurred during registration'}}), 500

if __name__ == '__main__':
    app.run(debug=True)
