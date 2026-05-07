from flask import Flask,jsonify,request
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)
@app.route("/login")
def test():
    return {
        "message": "success"
    }

@app.route("/api/initial", methods=["GET", "OPTIONS"])
def initial_api_calling():

    tm1=request.args.get("tm1")
    tm2=request.args.get("tm2")
    results={}
    url_wind = 'https://apihub.kma.go.kr/api/typ01/cgi-bin/url/nph-aws2_min?'
    url_vis = 'https://apihub.kma.go.kr/api/typ01/cgi-bin/url/nph-aws2_min_vis?'
    params = {
    "authKey": "1oWYR_o-SnGFmEf6PlpxQQ",
    "tm1":tm1,
    "tm2":tm2,
    }
    response_wind = requests.get(url_wind,params=params)
    response_vis=requests.get(url_vis,params=params)
    results["kmaWind"]=response_wind.text
    results["kmaVis"]=response_vis.text

    return jsonify(results)


if __name__ == "__main__":
    app.run()