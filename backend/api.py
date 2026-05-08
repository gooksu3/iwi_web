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
    results={"kmaWind":[],"kmaVis":[],"maeam":[]}
    url_kma_wind = 'https://apihub.kma.go.kr/api/typ01/cgi-bin/url/nph-aws2_min?'
    url_kma_vis = 'https://apihub.kma.go.kr/api/typ01/cgi-bin/url/nph-aws2_min_vis?'
    url_maeam="https://apis.data.go.kr/1192136/surveySeafog/GetSurveySeafogApiService?"

    params_maeam={"serviceKey":"A/d2seUujJ6QE6I/syxLeO60f+KemMGQxK2/VhmbhG6EcG0y/c8JroKQn8j8e7QujsZIStjwl9IE6vGQy0EJ9g==",
                  "type":"json",
                  "obsCode":"SF_0010",
                  "reqDate":today,
                  "include":"obsrvnDt,rmyWspd,rmyWndrct,dtvsbM20kLen",
                  "min":"1",
                  "numOfRows":"65"}
    current=tm1_datetime
    session = requests.Session()
    while current < tm2_datetime:
        next_time = current + timedelta(minutes=10)
        if next_time > tm2_datetime:
            next_time = tm2_datetime
        params_kma = {
            "authKey": "1oWYR_o-SnGFmEf6PlpxQQ",
            "tm1":current.strftime("%Y%m%d%H%M"),
            "tm2":next_time.strftime("%Y%m%d%H%M"),
            }
        # 기상청 바람
        try:
            response_wind = session.get(url_kma_wind,params=params_kma,timeout=10)
            if response_wind.status_code == 200:
                results["kmaWind"].extend(response_wind.text.split("\n")[3:-2])
        except Exception as e:
            results["kmaWind"].extend(str(e))
        # 기상청 시정
        try:
            response_vis = session.get(url_kma_vis,params=params_kma,timeout=10)
            if response_vis.status_code == 200:
                results["kmaVis"].extend(response_vis.text.split("\n")[3:-2])
        except Exception as e:
            results["kmaVis"].extend(str(e))
        current = next_time
    # 매암
    try:
        response_maeam = requests.get(url_maeam,params=params_maeam,timeout=10)
        results["maeam"] = response_maeam.json()
    except Exception as e:
        results["maeam"] = str(e)
    return jsonify(results)

if __name__ == "__main__":
    app.run()