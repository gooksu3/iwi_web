from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return "Flask server running"

@app.route("/test")
def test():
    return {
        "message": "success"
    }

if __name__ == "__main__":
    app.run()