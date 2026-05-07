from flask import Flask,jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
@app.route("/login")
def test():
    return {
        "message": "success"
    }

@app.route("/api/initial")
def home():
    return jsonify("Flask server running")


if __name__ == "__main__":
    app.run()