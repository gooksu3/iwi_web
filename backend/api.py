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

@app.route("/api/10min", methods=["GET", "OPTIONS"])
def initial_api_calling():
    if request.method == "OPTIONS":
        response = make_response()
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Headers"] = "*"
        response.headers["Access-Control-Allow-Methods"] = "GET, OPTIONS"
        return response

    tm1=request.args.get("tm1")
    tm2=request.args.get("tm2")
    today=datetime.now().strftime("%Y%m%d")
    results={}
    url_kma_wind = 'https://apihub.kma.go.kr/api/typ01/cgi-bin/url/nph-aws2_min?'
    url_kma_vis = 'https://apihub.kma.go.kr/api/typ01/cgi-bin/url/nph-aws2_min_vis?'
    # url_maeam="https://apis.data.go.kr/1192136/surveySeafog/GetSurveySeafogApiService?"
    params_kma = {
                "authKey": "1oWYR_o-SnGFmEf6PlpxQQ",
                "tm1":tm1,
                "tm2":tm2,
                }
    # params_maeam={"serviceKey":"A/d2seUujJ6QE6I/syxLeO60f+KemMGQxK2/VhmbhG6EcG0y/c8JroKQn8j8e7QujsZIStjwl9IE6vGQy0EJ9g==",
    #               "type":"json",
    #               "obsCode":"SF_0010",
    #               "reqDate":today,
    #               "include":"obsrvnDt,rmyWspd,rmyWndrct,dtvsbM20kLen",
    #               "min":"1",
    #               "numOfRows":"65"}
    # 기상청 바람
    dict_wind_info={"간절곶":[],"울기":[],"장생포":[]}
    try:
        response_wind = requests.get(url_kma_wind,params=params_kma,timeout=10,stream=True)
        if response_wind.status_code == 200:
            for line in response_wind.iter_lines(decode_unicode=True):
                if not line:
                    continue
                parts = line.split()
                if len(parts) > 1 and parts[1] in ["898", "901", "924"]:
                    info={"time":parts[0],"windSpeed":parts[5]}
                    if parts[1]=="898":
                        dict_wind_info["장생포"].append(info)
                    elif parts[1]=="901":
                        dict_wind_info["울기"].append(info)
                    elif parts[1]=="924":
                        dict_wind_info["간절곶"].append(info)
        results["kmaWind"] = dict_wind_info
        # if response_wind.status_code == 200:
        #     list_info_text=response_wind.text.split("\n")[3:-2]
        #     list_wind_info_1=[]
        #     for t in list_info_text:
        #         list_wind_info_1.append(t.split())
        #     list_wind_info_2=[i for i in list_wind_info_1 if i[1] in ["898","901","924"]]
        #     dict_wind_info={"간절곶":[],"울기":[],"장생포":[]}
        #     for i in list_wind_info_2:
        #         info={"time":i[0],"windSpeed":i[5]}
        #         if i[1]=="898":
        #             dict_wind_info["장생포"].extend(info)
        #         elif i[1]=="901":
        #             dict_wind_info["울기"].extend(info)
        #         elif i[1]=="924":
        #             dict_wind_info["간절곶"].extend(info)
        #     results["kmaWind"].extend(dict_wind_info)
    except Exception as e:
        results["kmaWind"].append(str(e))
        # 기상청 시정
        # try:
        #     response_vis = session.get(url_kma_vis,params=params_kma,timeout=10,stream=True)
        #     if response_vis.status_code == 200:
        #         list_info_text=response_vis.text.split("\n")[3:-2]
        #         list_vis_info_1=[]
        #         for t in list_info_text:
        #             list_vis_info_1.append(t.split())
        #         list_vis_info_2=[i for i in list_wind_info_1 if i[1] in ["898","901","924"]]
        #         dict_vis_info={"간절곶":[],"울기":[],"장생포":[]}
        #         for i in list_vis_info_2:
        #             info={"time":i[0],"vis":i[5]}
        #             if i[1]=="898":
        #                 dict_vis_info["장생포"].extend(info)
        #             elif i[1]=="901":
        #                 dict_vis_info["울기"].extend(info)
        #             elif i[1]=="924":
        #                 dict_vis_info["간절곶"].extend(info)
        #         results["kmaVis"].extend(dict_vis_info)
        # except Exception as e:
        #     results["kmaVis"].append(str(e))
        # current = next_time
    # 매암
    # try:
    #     response_maeam = requests.get(url_maeam,params=params_maeam,timeout=10)
    #     results["maeam"] = response_maeam.json()
    # except Exception as e:
    #     results["maeam"] = str(e)
    # session.close()
    response = make_response(jsonify(results))

    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, OPTIONS"

    return response

if __name__ == "__main__":
    app.run()