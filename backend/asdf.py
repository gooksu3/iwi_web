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