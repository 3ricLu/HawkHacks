import os
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash
from werkzeug.utils import secure_filename
from sqlalchemy.exc import IntegrityError
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config['UPLOAD_FOLDER'] = 'uploads/'  # Folder to store uploaded resumes

db = SQLAlchemy(app)

# Create the uploads directory if it does not exist
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

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
