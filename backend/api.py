from flask import Flask,jsonify,request, make_response
from flask_cors import CORS
import requests
from datetime import datetime,timedelta

app = Flask(__name__)
CORS(app)
@app.route("/login")
def test():
    return {
        "message": "success"
    }

@app.route("/api/initial", methods=["GET", "OPTIONS"])
def initial_api_calling():
    if request.method == "OPTIONS":
        response = make_response()
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Headers"] = "*"
        response.headers["Access-Control-Allow-Methods"] = "GET, OPTIONS"
        return response

    tm1=request.args.get("tm1")
    tm2=request.args.get("tm2")
    tm1_datetime=datetime.strptime(tm1,"%Y%m%d%H%M")
    tm2_datetime=datetime.strptime(tm2,"%Y%m%d%H%M")
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
                  "min":"1",
                  "numOfRows":"65"}
    current=tm1_datetime
    while current < tm2_datetime:
        next_time = current + timedelta(minutes=10)
        if next_time > tm2_datetime:
            next_time = tm2_datetime
        try:
            response_wind = requests.get(url_kma_wind,params=params_kma,timeout=5)
            response_vis=requests.get(url_kma_vis,params=params_kma,timeout=5)
            results["kmaWind"]=response_wind.text.split("\n")[3:-2]
            results["kmaVis"]=response_vis.text.split("\n")[3:-2]
        except Exception as e:
            print(e)
        current = next_time
    response_maeam=requests.get(url_maeam,params=params_maeam,timeout=5)
    results["maeam"]=response_maeam.json()
    return jsonify(results)

if __name__ == "__main__":
    app.run()