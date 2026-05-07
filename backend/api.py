from flask import Flask,jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/api/1min")
def home():
    return jsonify("Flask server running")

@app.route("/test")
def test():
    return {
        "message": "success"
    }

if __name__ == "__main__":
    app.run()