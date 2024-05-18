from flask import Flask
from models import db, User

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)
app = Flask(__name__)

@app.route('/')
def hello():
    return 'Hello from Flask!'

if __name__ == '__main__':
    app.run(debug=True)