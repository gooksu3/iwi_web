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

    # tm1=request.args.get("tm1")
    # tm2=request.args.get("tm2")
    # results={}
    # url_kma_wind = 'https://apihub.kma.go.kr/api/typ01/cgi-bin/url/nph-aws2_min?'
    # url_kma_vis = 'https://apihub.kma.go.kr/api/typ01/cgi-bin/url/nph-aws2_min_vis?'
    # params_kma = {
    # "authKey": "1oWYR_o-SnGFmEf6PlpxQQ",
    # "tm1":tm1,
    # "tm2":tm2,
    # }
    # url_maeam="https://apis.data.go.kr/1192136/surveySeafog/GetSurveySeafogApiService?"
    # params_maeam={"serviceKey":"A/d2seUujJ6QE6I/syxLeO60f+KemMGQxK2/VhmbhG6EcG0y/c8JroKQn8j8e7QujsZIStjwl9IE6vGQy0EJ9g==",
    #               "type":"json",
    #               "obsCode":"SF_0010",
    #               "reqDate":"20260407",
    #               "include":"obsrvnDt,rmyWspd,rmyWndrct,dtvsbM20kLen",
    #               "min":"1"}
    # key_east_break="FA799FE5-BF35-4BB6-B58F-ED803D58056B"
    # today=datetime.now().strftime("%Y%m%d")
    # response_wind = requests.get(url_kma_wind,params=params_kma)
    # response_vis=requests.get(url_kma_vis,params=params_kma)
    # response_maeam=requests.get(url_maeam,params=params_maeam)
    # results["kmaWind"]=response_wind.text
    # results["kmaVis"]=response_vis.text
    # results["maeam"]=response_maeam.json()
    try:

        tm1 = request.args.get("tm1")
        tm2 = request.args.get("tm2")

        results = {}

        mmaf = 104
        east_break_water = 1041519

        key_east_break = "FA799FE5-BF35-4BB6-B58F-ED803D58056B"

        today = datetime.now().strftime("%Y%m%d")

        url_east_break = (
            f"http://marineweather.nmpnt.go.kr:8001/openWeatherDate.do"
            f"?serviceKey={key_east_break}"
            f"&resultType=json"
            f"&date={today}"
            f"&mmaf={mmaf}"
            f"&mmsi={east_break_water}"
            f"&dataType=2"
        )

        try:
            response_east_break = requests.get(
                url_east_break,
                timeout=10
            )

            results["east_break"] = {
                "status": response_east_break.status_code,
                "text": response_east_break.text[:200]
            }

        except Exception as e:
            results["east_break"] = {
                "error": str(e)
            }

        return jsonify(results)

    except Exception as e:

        return jsonify({
            "server_error": str(e)
        }), 500
    # return jsonify(results)

if __name__ == "__main__":
    app.run()