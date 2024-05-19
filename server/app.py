import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash
from sqlalchemy.exc import IntegrityError

load_dotenv()

app = Flask(__name__)
CORS(app)
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)  # Updated length to 255
    name = db.Column(db.String(120))
    age = db.Column(db.Integer)
    tags = db.Column(db.ARRAY(db.String))
    bio = db.Column(db.Text)

with app.app_context():
    db.create_all()

@app.route('/api/register', methods=['POST'])
def register_user():
    try:
        data = request.get_json()
        app.logger.info(f"Received data: {data}")

        required_fields = ['username', 'password', 'name', 'age', 'tags', 'bio']
        missing_fields = [field for field in required_fields if field not in data or not data[field]]

        if missing_fields:
            return jsonify({'errors': {field: f'{field} is required' for field in missing_fields}}), 400

        if not isinstance(data['age'], int):
            return jsonify({'errors': {'age': 'Age must be an integer'}}), 400
        if data['age'] < 1 or data['age'] > 150:
            return jsonify({'errors': {'age': 'Age must be between 1 and 150'}}), 400
        if not isinstance(data['tags'], list):
            return jsonify({'errors': {'tags': 'Tags must be an array'}}), 400

        hashed_password = generate_password_hash(data['password'])
        new_user = User(
            username=data['username'],
            password_hash=hashed_password,
            name=data['name'],
            age=data['age'],
            tags=data['tags'],
            bio=data['bio']
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
