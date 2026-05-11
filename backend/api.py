from flask import Flask,jsonify,request, make_response
from flask_cors import CORS
import requests
from datetime import datetime,timedelta

app = Flask(__name__)
CORS(
    app,
    resources={r"/*": {"origins": "*"}}
)

@app.route("/login")
def test():
    return {
        "message": "success"
    }

@app.route("/api/kmaWind", methods=["GET", "OPTIONS"])
def kma_wind_api_calling_10min():
    if request.method == "OPTIONS":
        response = make_response()
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Headers"] = "*"
        response.headers["Access-Control-Allow-Methods"] = "GET, OPTIONS"
        return response

    tm1=request.args.get("tm1")
    tm2=request.args.get("tm2")
    results={}
    url_kma_wind = 'https://apihub.kma.go.kr/api/typ01/cgi-bin/url/nph-aws2_min?'
    params_kma = {
                "authKey": "1oWYR_o-SnGFmEf6PlpxQQ",
                "tm1":tm1,
                "tm2":tm2,
                }
    # 기상청 바람
    dict_wind_info={"간절곶":[],"울기":[],"장생포":[]}
    try:
        response_wind = requests.get(url_kma_wind,params=params_kma,timeout=10)
        if response_wind.status_code == 200:
            lines = response_wind.text.split("\n")
            for line in lines[3:-2]:
                parts = line.split()
                if len(parts) > 5 and parts[1] in ["898", "901", "924"]:
                    info = {
                        "time": parts[0],
                        "windSpeed": parts[5],
                        "windDir":parts[4]
                    }
                    if "898" in parts[1] and parts[5]!="-99.9":
                        dict_wind_info["장생포"].append(info)
                    elif "901" in parts[1] and parts[5]!="-99.9":
                        dict_wind_info["울기"].append(info)
                    elif "924" in parts[1] and parts[5]!="-99.9":
                        dict_wind_info["간절곶"].append(info)
    except Exception as e:
        results["kmaWind"]=str(e)
    results["kmaWind"]=dict_wind_info
    response = make_response(jsonify(results))

    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, OPTIONS"

    return response

@app.route("/api/kmaVis", methods=["GET", "OPTIONS"])
def kma_vis_api_calling_10min():
    if request.method == "OPTIONS":
        response = make_response()
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Headers"] = "*"
        response.headers["Access-Control-Allow-Methods"] = "GET, OPTIONS"
        return response

    tm1=request.args.get("tm1")
    tm2=request.args.get("tm2")
    results={}
    url_kma_vis = 'https://apihub.kma.go.kr/api/typ01/cgi-bin/url/nph-aws2_min_vis?'
    params_kma = {
                "authKey": "1oWYR_o-SnGFmEf6PlpxQQ",
                "tm1":tm1,
                "tm2":tm2,
                }
    # 기상청 바람
    dict_vis_info={"간절곶":[],"울기":[],"장생포":[]}
    try:
        response_vis = requests.get(url_kma_vis,params=params_kma,timeout=10)
        if response_vis.status_code == 200:
            lines = response_vis.text.split("\n")
            for line in lines[3:-2]:
                parts = line.split()
                if len(parts) > 5 and parts[1].strip() in ["898", "901", "924"]:
                    info = {
                        "time": parts[0],
                        "vis": parts[5]
                    }
                    if "898" in parts[1].strip() and parts[5].strip()!="-99.9":
                        dict_vis_info["장생포"].append(info)
                    elif "901" in parts[1].strip() and parts[5].strip()!="-99.9":
                        dict_vis_info["울기"].append(info)
                    elif "924" in parts[1].strip() and parts[5].strip()!="-99.9":
                        dict_vis_info["간절곶"].append(info)
    except Exception as e:
        results["kmaVis"]=str(e)
    results["kmaVis"]=dict_vis_info
    response = make_response(jsonify(results))

    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, OPTIONS"

    return response

@app.route("/api/maeam", methods=["GET", "OPTIONS"])
def maeam_wind_n_vis_today():
    today=request.args.get("today")
    pageNo=request.args.get("pageNo")
    url_maeam="https://apis.data.go.kr/1192136/surveySeafog/GetSurveySeafogApiService?"
    params_maeam={"serviceKey":"A/d2seUujJ6QE6I/syxLeO60f+KemMGQxK2/VhmbhG6EcG0y/c8JroKQn8j8e7QujsZIStjwl9IE6vGQy0EJ9g==",
                  "type":"json",
                  "obsCode":"SF_0010",
                  "reqDate":today,
                  "include":"obsrvnDt,rmyWspd,rmyWndrct,dtvsbM20kLen",
                  "min":"1",
                  "pageNo":pageNo}
    response_maeam=requests.get(url_maeam,params=params_maeam)
    if response_maeam.status_code==200:
        response = make_response(jsonify(response_maeam.json()['body']['items']['item']))
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Headers"] = "*"
        response.headers["Access-Control-Allow-Methods"] = "GET, OPTIONS"
        return response
    
if __name__ == "__main__":
    app.run()