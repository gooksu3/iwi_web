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
    tm1 = request.json['tm1']
    tm2 = request.json['tm2']
    url_wind = 'https://apihub.kma.go.kr/api/typ01/cgi-bin/url/nph-aws2_min?'
    # url_vis = 'https://apihub.kma.go.kr/api/typ01/cgi-bin/url/nph-aws2_min_vis?'
    params = {
    "authKey": "1oWYR_o-SnGFmEf6PlpxQQ",
    "tm1":tm1,
    "tm2":tm2,
    }
    response = requests.get(url_wind,params=params)
    # response = requests.get(url_vis,params=params)
    # row=0
    # list_info=[i.split() for i in response.text.split("\n")[3:-2]]
    # list_info_ganjulgot=[i for i in list_info if i[1]=="924"] # 간절곶
    # list_info_ulgi=[i for i in list_info if i[1]=="901"] # 울기
    # list_info_jangsaengpo=[i for i in list_info if i[1]=="898"] # 장생포
    # print(list_info_ganjulgot)
    # print(list_info_ulgi)
    # print(list_info_jangsaengpo)
    return jsonify(response.text)


if __name__ == "__main__":
    app.run()