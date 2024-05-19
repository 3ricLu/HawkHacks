from flask import Flask, request, jsonify, session, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from sqlalchemy.exc import IntegrityError
from dotenv import load_dotenv
from flask_session import Session
from flask_migrate import Migrate
from flask_login import LoginManager, UserMixin, login_user, logout_user, current_user, login_required
from sqlalchemy import text  # Import the text function from SQLAlchemy
import os

load_dotenv()

app = Flask(__name__)

CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://hawkhacks:123abc@localhost:5432/hawk_hacks_user'
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SECRET_KEY"] = "your_secret_key"
app.config["SESSION_TYPE"] = "filesystem"
app.config['UPLOAD_FOLDER'] = 'uploads/'  # Folder to store uploaded resumes
Session(app)

db = SQLAlchemy(app)
migrate = Migrate(app, db)
# Initialize Flask-Login
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

# Create the uploads directory if it does not exist
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

# Serve files from the uploads directory
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# Logging out
@app.route('/api/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'message': 'Logout successful'}), 200

class User(UserMixin, db.Model):
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

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

class Listing(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    people_needed = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Integer, nullable=False)
    elo = db.Column(db.Integer, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    members = db.Column(db.ARRAY(db.String), default=[])

    user = db.relationship('User', backref=db.backref('listings', lazy=True))

with app.app_context():
    db.create_all()

# Delete all data
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




# Create a listing
@app.route('/api/listings', methods=['POST'])
@login_required
def create_listing():
    try:
        data = request.get_json()
        app.logger.info(f"Received listing data: {data}")

        required_fields = ['title', 'description', 'people_needed', 'price', 'elo']
        missing_fields = [field for field in required_fields if field not in data or not data[field]]

        if missing_fields:
            return jsonify({'errors': {field: f'{field} is required' for field in missing_fields}}), 400

        new_listing = Listing(
            title=data['title'],
            description=data['description'],
            people_needed=int(data['people_needed']),
            price=int(data['price']),
            elo=int(data['elo']),
            user_id=current_user.id
        )

        db.session.add(new_listing)
        db.session.commit()

        return jsonify({'message': 'Listing created successfully', 'listing': new_listing.id}), 201
    except Exception as e:
        app.logger.error(f"Error: {e}")
        return jsonify({'errors': {'general': 'An error occurred while creating the listing'}}), 500




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
            login_user(user)  # Set the user as logged in using Flask-Login
            session['user_id'] = user.id  # Explicitly set the user ID in session if needed
            return jsonify({'message': 'Login successful'}), 200
        else:
            return jsonify({'errors': {'general': 'Invalid username or password'}}), 400
    except Exception as e:
        app.logger.error(f"Error: {e}")
        return jsonify({'errors': {'general': 'An error occurred during login'}}), 500






# Update profile
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
# Fetch all listings
@app.route('/api/listings', methods=['GET'])
def get_listings():
    try:
        listings = Listing.query.all()
        listings_data = [
            {
                'listingID': listing.id,
                'title': listing.title,
                'description': listing.description,
                'people_needed': listing.people_needed,
                'price': listing.price,
                'elo': listing.elo,
                'members': listing.members,
                'listingOwner': listing.user.username
            }
            for listing in listings
        ]
        return jsonify({'listings': listings_data}), 200
    except Exception as e:
        app.logger.error(f"Error: {e}")
        return jsonify({'errors': {'general': 'An error occurred while fetching listings'}}), 500



@app.route('/api/listings/join/<int:listing_id>', methods=['POST'])
@login_required
def join_listing(listing_id):
    try:
        listing = Listing.query.get(listing_id)
        if not listing:
            app.logger.error(f"Listing ID: {listing_id} not found")
            return jsonify({'errors': {'general': 'Listing not found'}}), 404

        username = current_user.username
        app.logger.info(f"User '{username}' is attempting to join listing ID: {listing_id}")

        # Check if the current user is the creator of the listing
        if current_user.id == listing.user_id:
            app.logger.warning(f"User '{username}' cannot join their own listing ID: {listing_id}")
            return jsonify({'errors': {'general': 'You cannot join your own listing'}}), 400

        if listing.members is None:
            listing.members = []

        app.logger.info(f"Current members: {listing.members}")

        if username not in listing.members:
            try:
                db.session.execute(
                    text("UPDATE listing SET members = array_append(members, :username) WHERE id = :listing_id"),
                    {'username': username, 'listing_id': listing_id}
                )
                db.session.commit()
                app.logger.info(f"Successfully committed changes to DB")
            except Exception as e:
                app.logger.error(f"Error committing changes: {e}")
                db.session.rollback()
                return jsonify({'errors': {'general': 'An error occurred while committing the changes'}}), 500

            # Verify the change in the database
            updated_listing = Listing.query.get(listing_id)
            app.logger.info(f"Updated members in DB: {updated_listing.members}")

            return jsonify({'message': 'Joined successfully'}), 200
        else:
            app.logger.warning(f"User '{username}' is already a member of listing ID: {listing_id}")
            return jsonify({'errors': {'general': 'User already a member'}}), 400
    except Exception as e:
        app.logger.error(f"Error: {e}")
        db.session.rollback()
        return jsonify({'errors': {'general': 'An error occurred while joining the listing'}}), 500










    


@app.route('/api/profile', methods=['GET'])
@login_required
def get_profile():
    try:
        user_id = current_user.id  # Use Flask-Login to get the current user ID
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


@app.route('/api/delete-all-listings', methods=['POST'])
@login_required
def delete_all_listings():
    try:
        db.session.query(Listing).delete()
        db.session.commit()
        return jsonify({'message': 'All listings deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error: {e}")
        return jsonify({'errors': {'general': 'An error occurred while deleting listings'}}), 500
# Register user
@app.route('/api/register', methods=['POST'])
def register_user():
    try:
        data = request.form.to_dict()
        resume = request.files.get('resume')
        app.logger.info(f"Received data: {data}")

        required_fields = ['username', 'password', 'name', 'surname', 'email', 'age', 'headline', 'bio']
        missing_fields = [field for field in required_fields if field not in data or not data[field]]

        if missing_fields:
            return jsonify({'errors': {field: f'{field} is required' for field in missing_fields}}), 400

        if not data['age'].isdigit() or not 1 <= int(data['age']) <= 150:
            return jsonify({'errors': {'age': 'Age must be an integer between 1 and 150'}}), 400

        tags = request.form.getlist('tags')

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
