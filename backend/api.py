from flask import Flask,jsonify,request
from flask_cors import CORS
import requests
from datetime import datetime

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
    today=datetime.now().strftime("%Y%m%d")
    results={}
    url_kma_wind = 'https://apihub.kma.go.kr/api/typ01/cgi-bin/url/nph-aws2_min?'
    url_kma_vis = 'https://apihub.kma.go.kr/api/typ01/cgi-bin/url/nph-aws2_min_vis?'
    url_maeam="https://apis.data.go.kr/1192136/surveySeafog/GetSurveySeafogApiService?"
    params_kma = {
    "authKey": "1oWYR_o-SnGFmEf6PlpxQQ",
    "tm1":tm1,
    "tm2":tm2,
    }
    params_maeam={"serviceKey":"A/d2seUujJ6QE6I/syxLeO60f+KemMGQxK2/VhmbhG6EcG0y/c8JroKQn8j8e7QujsZIStjwl9IE6vGQy0EJ9g==",
                  "type":"json",
                  "obsCode":"SF_0010",
                  "reqDate":today,
                  "include":"obsrvnDt,rmyWspd,rmyWndrct,dtvsbM20kLen",
                  "min":"1"}
    response_wind = requests.get(url_kma_wind,params=params_kma)
    response_vis=requests.get(url_kma_vis,params=params_kma)
    response_maeam=requests.get(url_maeam,params=params_maeam)
    results["kmaWind"]=response_wind.text
    results["kmaVis"]=response_vis.text
    results["maeam"]=response_maeam.json()
    return jsonify(results)

if __name__ == "__main__":
    app.run()