import { useState, useRef, useEffect } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Area,
} from "recharts";
import CountUp from "react-countup";
import Clock from "./Clock.js";
import "./reset.css";
import "./ani.css";
import eye from "./img/eye.png";
import wind from "./img/wind.png";
import cloudy from "./img/cloudy.png";
import fog from "./img/fog.png";
import heavy_rainy from "./img/heavy_rainy.png";
import mostlyCloudy from "./img/mostlyCloudy.png";
import partlyCloudy from "./img/partlyCloudy.png";
import partlyCloudyAfterRaining from "./img/partlyCloudyAfterRaining.png";
import rainy from "./img/rainy.png";
import rainyNSnowy from "./img/rainyNSnowy.png";
import snowy from "./img/snowy.png";
import sunny from "./img/sunny.png";
import thunder from "./img/thunder.png";

function App() {
  // For Login
  const [token, setToken] = useState(sessionStorage.getItem("token"));
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const inputPWRef = useRef(null);
  // For API
  const arrayPoints = ["간절곶", "울기", "장생포"];
  const [kmaWindData, setKmaWindData] = useState(null);
  const [kmaVisData, setKmaVisData] = useState(null);
  const [windDirGanjulgot, setWindDirGanjulgot] = useState(null);
  const [windDirUlgi, setWindDirUlgi] = useState(null);
  const [windDirJangsaengpo, setWindDirJangsaengpo] = useState(null);
  const arrayKmaWindDir = [windDirGanjulgot, windDirUlgi, windDirJangsaengpo];
  const arraySetKmaWindDir = [
    setWindDirGanjulgot,
    setWindDirUlgi,
    setWindDirJangsaengpo,
  ];
  const [windSpdGanjulgot, setWindSpdGanjulgot] = useState(null);
  const [windSpdUlgi, setWindSpdUlgi] = useState(null);
  const [windSpdJangsaengpo, setWindSpdJangsaengpo] = useState(null);
  const arrayKmaWindSpd = [windSpdGanjulgot, windSpdUlgi, windSpdJangsaengpo];
  const arraySetKmaWindSpd = [
    setWindSpdGanjulgot,
    setWindSpdUlgi,
    setWindSpdJangsaengpo,
  ];
  const [visGanjulgot, setVisGanjulgot] = useState(null);
  const [visUlgi, setVisUlgi] = useState(null);
  const [visJangsaengpo, setVisJangsaengpo] = useState(null);
  const arrayKmaVis = [visGanjulgot, visUlgi, visJangsaengpo];
  const arraySetKmaVis = [setVisGanjulgot, setVisUlgi, setVisJangsaengpo];
  const [MaeamWindData, setMeamWindData] = useState([]);
  const [MaeamVisData, setMaeamVisData] = useState([]);
  const [windDirMaeam, setWindDirMaeam] = useState(null);
  const [windSpdMaeam, setWindSpdMaeam] = useState(null);
  const [visMaeam, setVisMaeam] = useState(null);
  const arrayRowColor = ["#2e86de", "#0abde3"];
  const graphWidth = "28vw";
  const graphHeight = "11vh";
  const [arrayDateForecast, setArrayDateForecast] = useState([]);
  const [shortForecastData, setShortForecastData] = useState([]);
  const objDirections = {
    0: "없음",
    1: "북",
    2: "북동",
    3: "동",
    4: "남동",
    5: "남",
    6: "남서",
    7: "서",
    8: "북서",
  };
  const [loadForecastTable, setLoadForecastTable] = useState(false);
  const [warningInfo, setWarningInfo] = useState({});
  const [showWarningInfo, setShowWarningInfo] = useState(false);
  const obj_pre_warning_report_time = {
    "0259": "새벽(00시~03시)",
    "0559": "새벽(03시~06시)",
    "0859": "아침(06시~09시)",
    1159: "오전(09시~12시)",
    1459: "낮(12시~15시)",
    1759: "늦은 오후(15시~18시)",
    2059: "저녁(18시~21시)",
    2359: "밤(21시~24시)",
    1158: "오전(06시~12시)",
    1758: "오후(12시~18시)",
    "0558": "새벽(00시~06시)",
    2358: "밤(18시~24시)",
    1458: "오후(12시~18시)",
  };
  const obj_wrn_lvl = { 1: "예비", 2: "주의보", 3: "경보" };
  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];
  const currentWarningReport = useRef("");
  let arrayInfoUlsanCoast = [];

  const degreesToCompass = (degrees) => {
    const directions = [
      "북",
      "북북동",
      "북동",
      "동북동",
      "동",
      "동남동",
      "남동",
      "남남동",
      "남",
      "남남서",
      "남서",
      "서남서",
      "서",
      "서북서",
      "북서",
      "북북서",
    ];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  };
  const formatDateToYYYYMMDDHHMM = (date) => {
    const yyyy = date.getFullYear();
    const MM = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const HH = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    return `${yyyy}${MM}${dd}${HH}${mm}`;
  };
  const formatToHHMM = (dateString) => {
    const dd = dateString.slice(6, 8);
    const HH = dateString.slice(8, 10);
    const mm = dateString.slice(10, 12);
    if (HH === "23" && 55 <= Number(mm) && Number(mm) <= "59") {
      return `${dd}/${HH}:${mm}`;
    } else if (HH === "00" && 0 <= Number(mm) && Number(mm) <= 5) {
      return `${dd}/${HH}:${mm}`;
    } else {
      return `${HH}:${mm}`;
    }
  };
  const formatYYYYMMDDHHMMToDate = (dateString) => {
    const yyyy = parseInt(dateString.slice(0, 4));
    const MM = parseInt(dateString.slice(4, 6)) - 1;
    const dd = parseInt(dateString.slice(6, 8));
    const HH = parseInt(dateString.slice(8, 10));
    const mm = parseInt(dateString.slice(10, 12));
    return new Date(yyyy, MM, dd, HH, mm);
  };
  const mToKm = (m) => {
    return (Math.round((m / 1000) * 10) / 10).toFixed(1);
  };
  const fetchDataForecast = async () => {
    setArrayDateForecast([]);
    setShortForecastData([]);
    setLoadForecastTable(true);
    const WORKER_URL = "https://uiwi.gooksu3.workers.dev/api/daily";
    try {
      const res = await fetch(WORKER_URL, {
        method: "GET",
        headers: { Authorization: token },
      });
      if (!res.ok) {
        throw new Error("네트워크 응답 실패");
      }
      const objInfoFromApi = await res.json();
      // 단기 예보
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(
        objInfoFromApi.UPAForecastInside,
        "application/xml",
      );
      const forecast = xmlDoc
        .getElementsByTagName("KWEATHER")[0]
        .getElementsByTagName("SHORT")[0].children;
      let array4DaysDate = [];
      let array4DaysForecast = [];
      for (let i = 0; i < 4; i++) {
        const dateNWeek = `${
          forecast[i].getElementsByTagName("DATE")[0].textContent
        }(${forecast[i].getElementsByTagName("WEEK")[0].textContent})`;
        array4DaysDate.push(dateNWeek);
        const hours = forecast[i].getElementsByTagName("HOUR")[0].children;
        for (let j = 0; j < hours.length; j++) {
          const time = hours[j].tagName.substring(1, 3);
          const icon = hours[j].getElementsByTagName("wcond")[0].textContent;
          const windDir = hours[j].getElementsByTagName("wdir")[0].textContent;
          const ws = hours[j].getElementsByTagName("ws")[0].textContent;
          const maxWs = hours[j].getElementsByTagName("maxws")[0].textContent;
          const maxWaveH = hours[j].getElementsByTagName("mpa")[0].textContent;
          const waveDir = hours[j].getElementsByTagName("padir")[0].textContent;
          const vis = hours[j].getElementsByTagName("ss")[0].textContent;
          array4DaysForecast.push({
            time: time,
            icon: icon,
            wdir: windDir,
            ws: ws,
            maxWs: maxWs,
            maxWaveH: maxWaveH,
            waveDir: waveDir,
            vis: vis,
          });
        }
      }
      const now = new Date();
      const hourNow = now.getHours();
      let startIndex = 0;
      let endIndex = 24;
      const startHour = hourNow - 6;
      if (startHour >= -6 && startHour <= -4) {
        startIndex = 5; // 18h
      } else if (startHour >= -3 && startHour <= -1) {
        startIndex = 6; // 21h
      } else if (startHour >= 0 && startHour <= 2) {
        startIndex = 7; // 24h
      } else {
        startIndex = Math.floor(startHour / 3) - 1;
      }
      if (startHour === 3) {
        setArrayDateForecast(
          array4DaysDate.slice(0, array4DaysDate.length - 1),
        );
      } else {
        setArrayDateForecast(array4DaysDate);
      }
      endIndex += startIndex;
      setShortForecastData(array4DaysForecast.slice(startIndex, endIndex));
    } catch (err) {
      console.error("데이터 불러오기 오류:", err);
    }
    setLoadForecastTable(false);
  };
  const fetchDataWData = async () => {
    const now = new Date();
    const twoMinutesAgo = new Date(now.getTime() - 2 * 60 * 1000);
    const tm2 = formatDateToYYYYMMDDHHMM(twoMinutesAgo);
    const tm1 = formatDateToYYYYMMDDHHMM(
      new Date(twoMinutesAgo.getTime() - 60 * 60 * 1000),
    );
    // Workers 프록시 URL (배포한 주소로 교체하세요)
    const WORKER_URL = `https://uiwi.gooksu3.workers.dev/api/5mins?tm1=${tm1}&tm2=${tm2}`;
    try {
      const res = await fetch(WORKER_URL, {
        method: "GET",
        headers: { Authorization: token },
      });
      if (!res.ok) {
        throw new Error("네트워크 응답 실패");
      }
      const objInfoFromApi = await res.json();
      // 간절곶:924,울기:901,장생포:898
      // index 1:1분 평균 풍향, index 2:1분 평균 풍속, index 3:최대 순간 풍향, index 4:최대 순간 풍속
      const arrayKmaWindInfoText = objInfoFromApi.kmaWind.split("\n");
      const arrayKW = arrayKmaWindInfoText
        .slice(3, arrayKmaWindInfoText.length - 2)
        .reduce(
          (acc, cur) => {
            const line = cur.split(/\s+/);
            if (line[1] == "924") {
              // 간절곶
              acc["간절곶"].push(line);
            } else if (line[1] == "901") {
              // 울기
              acc["울기"].push(line);
            } else if (line[1] == "898") {
              // 장생포
              acc["장생포"].push(line);
            }
            return acc;
          },
          { 간절곶: [], 울기: [], 장생포: [] },
        );
      const arrayKmaWind = arrayPoints.map((point, index) => {
        if (arrayKW[point].length > 0) {
          const arrayInfo = arrayKW[point];
          arraySetKmaWindDir[index](arrayInfo[arrayInfo.length - 1][4]);
          arraySetKmaWindSpd[index](arrayInfo[arrayInfo.length - 1][5]);
          let arrayTime = [];
          const baseDate = formatYYYYMMDDHHMMToDate(
            arrayInfo[arrayInfo.length - 1][0],
          );
          for (let diff = 0; diff <= 60; diff += 10) {
            const newDate = new Date(baseDate.getTime() - diff * 60000); // diff 분 전
            arrayTime.push(formatDateToYYYYMMDDHHMM(newDate));
          }
          return arrayInfo
            .filter((info) => arrayTime.includes(info[0]))
            .map((info) => {
              const time = formatToHHMM(info[0]);
              return { time: time, windSpeed: info[3] };
            });
        }
      });
      if (arrayKmaWind) {
        setKmaWindData(arrayKmaWind);
      }
      // 간절곶:924,울기:901,장생포:898
      const arrayKmaVisInfoText = objInfoFromApi.kmaVis.split("\n");
      const arrayKV = arrayKmaVisInfoText
        .slice(3, arrayKmaVisInfoText.length - 2)
        .reduce(
          (acc, cur) => {
            const line = cur.split(/\s+/);
            if (line[1] == "924") {
              // 간절곶
              acc["간절곶"].push(line);
            } else if (line[1] == "901") {
              // 울기
              acc["울기"].push(line);
            } else if (line[1] == "898") {
              // 장생포
              acc["장생포"].push(line);
            }
            return acc;
          },
          { 간절곶: [], 울기: [], 장생포: [] },
        );
      const arrayKmaVis = arrayPoints.map((point, index) => {
        if (arrayKV[point].length > 0) {
          const arrayInfo = arrayKV[point];
          arraySetKmaVis[index](mToKm(arrayInfo[arrayInfo.length - 1][5]));
          let arrayTime = [];
          const baseDate = formatYYYYMMDDHHMMToDate(
            arrayInfo[arrayInfo.length - 1][0],
          );
          for (let diff = 0; diff <= 60; diff += 10) {
            const newDate = new Date(baseDate.getTime() - diff * 60000); // diff 분 전
            arrayTime.push(formatDateToYYYYMMDDHHMM(newDate));
          }
          return arrayInfo
            .filter((info) => arrayTime.includes(info[0]))
            .map((info) => {
              const time = formatToHHMM(info[0]);
              return { time: time, vis: mToKm(info[5]) };
            });
        }
      });
      if (arrayKmaVis) {
        setKmaVisData(arrayKmaVis);
      }
      // 매암
      if (objInfoFromApi.maeam.body.items.item.length > 0) {
        const arrayInfoMaeam = objInfoFromApi.maeam.body.items.item;
        let latestInfoMaeam = null;
        for (let i = 0; i >= 0; i++) {
          if (arrayInfoMaeam[i].dtvsbM20kLen != null) {
            latestInfoMaeam = arrayInfoMaeam[i];
            break;
          }
        }
        setWindSpdMaeam(latestInfoMaeam.rmyWspd);
        setWindDirMaeam(latestInfoMaeam.rmyWndrct);
        setVisMaeam(mToKm(latestInfoMaeam.dtvsbM20kLen));
        const baseDate = formatYYYYMMDDHHMMToDate(
          latestInfoMaeam.obsrvnDt.replace(/[- :]/g, ""),
        );
        let arrayTime = [];
        for (let diff = 0; diff <= 60; diff += 10) {
          const newDate = new Date(baseDate.getTime() - diff * 60000); // diff 분 전
          arrayTime.push(formatDateToYYYYMMDDHHMM(newDate));
        }
        const arrayMaeam = arrayInfoMaeam
          .filter((info) => {
            const t = info.obsrvnDt.replace(/[- :]/g, "");
            return arrayTime.includes(t);
          })
          .map((info) => {
            const raw = info.obsrvnDt.replace(/[- :]/g, "");

            return {
              time: formatToHHMM(raw),
              wd: info.rmyWndrct,
              ws: info.rmyWspd,
              vis: mToKm(info.dtvsbM20kLen),
            };
          });
        if (arrayMaeam) {
          setMeamWindData(() => {
            const array = arrayMaeam
              .map((item) => ({ time: item.time, windSpeed: item.ws }))
              .sort((a, b) => {
                const toMinutes = (t) => {
                  const [h, m] = t.split(":").map(Number);
                  return h * 60 + m;
                };

                return toMinutes(a.time) - toMinutes(b.time);
              });

            return array;
          });
          setMaeamVisData(() => {
            const array = arrayMaeam
              .map((item) => ({ time: item.time, vis: item.vis }))
              .sort((a, b) => {
                const toMinutes = (t) => {
                  const [h, m] = t.split(":").map(Number);
                  return h * 60 + m;
                };

                return toMinutes(a.time) - toMinutes(b.time);
              });

            return array;
          });
        }
      }
    } catch (err) {
      console.error("데이터 불러오기 오류:", err);
    }
  };
  const fetchDataApproximateClearTime = async () => {
    const WORKER_URL = `https://uiwi.gooksu3.workers.dev/api/clearTime`;
    try {
      const res = await fetch(WORKER_URL, {
        method: "GET",
        headers: { Authorization: token },
      });
      if (!res.ok) {
        throw new Error("네트워크 응답 실패");
      }
      const textInfo = await res.json();
      let arrayInfo = textInfo.split("\n");
      arrayInfo = arrayInfo.map((item) =>
        item.split(",").map((part) => part.trim()),
      );
      const clearTime = arrayInfo.filter((item) =>
        item.includes("울산앞바다"),
      )[0][9];
      return clearTime;
    } catch (err) {
      console.error("데이터 불러오기 오류:", err);
    }
  };
  const fetchDataWeatherWarning = async () => {
    // cmd 특보명령 (1:발표, 2:대치, 3:해제, 4:대치해제(자동), 5:연장, 6:변경, 7:변경해제)
    // 1	발표	    새로운 특보가 처음으로 발표됨을 의미합니다.
    // 2	대치	    기존에 발표된 특보를 같은 등급 또는 다른 등급의 특보로 교체하는 경우입니다. 예: 주의보 → 경보 등.
    // 3	해제	    해당 지역에 대해 특보를 완전히 해제함을 의미합니다. 즉, 특보 종료.
    // 4	대치해제    (자동)	대치로 인해 발표된 특보가 자동으로 해제된 경우입니다. 즉, 대치되기 전 특보가 자동 해제된 것.
    // 5	연장	    기존 특보의 유효시간이 연장되었음을 의미합니다. 내용은 동일하지만 지속시간만 늘어납니다.
    // 6	변경	    특보의 내용(예: 대상 지역, 강수량 등 세부사항)이 변경되었지만, 특보 등급은 그대로 유지됩니다.
    // 7	변경해제	변경으로 인해 적용되었던 이전 특보 내용이 해제되었음을 알리는 자동 해제입니다. 주로 시스템적으로 이전 정보 무효화 처리 시 사용됩니다.
    const WORKER_URL = `https://uiwi.gooksu3.workers.dev/api/WWarning`;
    try {
      const res = await fetch(WORKER_URL, {
        method: "GET",
        headers: { Authorization: token },
      });
      if (!res.ok) {
        throw new Error("네트워크 응답 실패");
      }
      const textInfo = await res.json();
      const arrayInfo = textInfo.split("\n").slice(2, -2);
      arrayInfoUlsanCoast = arrayInfo.filter(
        (item) => item.includes("S1131100") && item.includes("V"),
      );
      arrayInfoUlsanCoast = arrayInfoUlsanCoast.map((item) => {
        return item.split(",").map((info) => info.trim());
      });
      // 특보 정보에는 발표(1), 해제(3)만 있음
      arrayInfoUlsanCoast = arrayInfoUlsanCoast.filter((item) =>
        ["1", "3"].includes(item[7]),
      );
      // warningInfo에 들어갈 정보: time_eff,warn_lvl,warn_type,time_clear
      if (Object.keys(arrayInfoUlsanCoast).length !== 0) {
        const latest_warning_report =
          arrayInfoUlsanCoast[arrayInfoUlsanCoast.length - 1];
        if (latest_warning_report[6] === "1") {
          // 풍랑예비
          if (latest_warning_report[7] === "3") {
            // 해제
            setShowWarningInfo(false);
          } else {
            setWarningInfo({
              timeEff: latest_warning_report[1],
              warnLvl: latest_warning_report[6],
              warnType: latest_warning_report[7],
              timeClear: "",
            });
            setShowWarningInfo(true);
          }
        } else {
          if (latest_warning_report[7] === "1") {
            // 발표
            const clearTime = await fetchDataApproximateClearTime();
            let arrayCurrentWarningReport = {
              timeEff: latest_warning_report[1],
              warnLvl: latest_warning_report[6],
              warnType: latest_warning_report[7],
              timeClear: clearTime,
            };
            if (typeof clearTime === "undefined") {
              arrayCurrentWarningReport = {
                timeEff: latest_warning_report[1],
                warnLvl: latest_warning_report[6],
                warnType: latest_warning_report[7],
                timeClear: "",
              };
            }
            setWarningInfo(arrayCurrentWarningReport);
            setShowWarningInfo(true);
            currentWarningReport.current = arrayCurrentWarningReport;
          } else if (latest_warning_report[7] === "3") {
            // 해제
            const year = parseInt(latest_warning_report[1].slice(0, 4), 10);
            const month =
              parseInt(latest_warning_report[1].slice(4, 6), 10) - 1; // JS에서는 0=1월
            const day = parseInt(latest_warning_report[1].slice(6, 8), 10);
            const hour = parseInt(latest_warning_report[1].slice(8, 10), 10);
            const minute = parseInt(latest_warning_report[1].slice(10, 12), 10);
            // Date 객체 생성
            const targetDate = new Date(year, month, day, hour, minute);
            const now = new Date();
            if (targetDate < now) {
              setWarningInfo({});
            } else {
              const weekDay =
                weekDays[
                  new Date(
                    `${latest_warning_report[1].slice(
                      0,
                      4,
                    )}-${latest_warning_report[1].slice(
                      4,
                      6,
                    )}-${latest_warning_report[1].slice(6, 8)}`,
                  ).getDay()
                ];
              const clearDateNTime =
                String(Number(latest_warning_report[1].slice(4, 6))) +
                "월" +
                String(Number(latest_warning_report[1].slice(6, 8))) +
                "일" +
                `(${weekDay}) ` +
                latest_warning_report[1].slice(8, 10) +
                ":" +
                latest_warning_report[1].slice(10, 12);
              const warningInfoEff =
                arrayInfoUlsanCoast[arrayInfoUlsanCoast.length - 2];
              setWarningInfo({
                timeEff: warningInfoEff[1],
                warnLvl: warningInfoEff[6],
                warnType: warningInfoEff[7],
                timeClear: clearDateNTime,
              });
              setShowWarningInfo(true);
            }
          } else if (latest_warning_report[7] === "2") {
          } else if (latest_warning_report[7] === "5") {
            // 연장
            const extended_warning_report =
              arrayInfoUlsanCoast[arrayInfoUlsanCoast.length - 2];
            const clearTime = await fetchDataApproximateClearTime();
            let arrayCurrentWarningReport = {
              timeEff: extended_warning_report[1],
              warnLvl: extended_warning_report[6],
              warnType: extended_warning_report[7],
              timeClear: clearTime,
            };
            if (typeof clearTime === "undefined") {
              arrayCurrentWarningReport = {
                timeEff: extended_warning_report[1],
                warnLvl: extended_warning_report[6],
                warnType: extended_warning_report[7],
                timeClear: "",
              };
            }
            setWarningInfo(arrayCurrentWarningReport);
            setShowWarningInfo(true);
            currentWarningReport.current = arrayCurrentWarningReport;
          } else if (latest_warning_report[7] === "6") {
            // 변경
            // 대치인데 변경으로 발표하는 경우가 있음. 해당 사항 구분하여 작동하도록 수정
            if (
              arrayInfoUlsanCoast[arrayInfoUlsanCoast.length - 2][6] ===
              latest_warning_report[6]
            ) {
              // 변경
              const clearTime = await fetchDataApproximateClearTime();
              let arrayCurrentWarningReport = {
                timeEff: latest_warning_report[1],
                warnLvl: latest_warning_report[6],
                warnType: latest_warning_report[7],
                timeClear: clearTime,
              };
              if (typeof clearTime === "undefined") {
                arrayCurrentWarningReport = {
                  timeEff: latest_warning_report[1],
                  warnLvl: latest_warning_report[6],
                  warnType: latest_warning_report[7],
                  timeClear: "",
                };
              }
              setWarningInfo(arrayCurrentWarningReport);
              setShowWarningInfo(true);
              currentWarningReport.current = arrayCurrentWarningReport;
            } else {
              // 대치인데 변경으로 나왔을 때
              const year = parseInt(latest_warning_report[1].slice(0, 4), 10);
              const month =
                parseInt(latest_warning_report[1].slice(4, 6), 10) - 1; // JS에서는 0=1월
              const day = parseInt(latest_warning_report[1].slice(6, 8), 10);
              const hour = parseInt(latest_warning_report[1].slice(8, 10), 10);
              const minute = parseInt(
                latest_warning_report[1].slice(10, 12),
                10,
              );
              // Date 객체 생성
              const targetDate = new Date(year, month, day, hour, minute);
              const now = new Date();
              if (targetDate < now) {
                // 대치 후
                const clearTime = await fetchDataApproximateClearTime();
                let arrayCurrentWarningReport = {
                  timeEff: latest_warning_report[1],
                  warnLvl: latest_warning_report[6],
                  warnType: "1",
                  timeClear: clearTime,
                };
                if (typeof clearTime === "undefined") {
                  arrayCurrentWarningReport = {
                    timeEff: latest_warning_report[1],
                    warnLvl: latest_warning_report[6],
                    warnType: "1",
                    timeClear: "",
                  };
                }
                setWarningInfo(arrayCurrentWarningReport);
                setShowWarningInfo(true);
                currentWarningReport.current = arrayCurrentWarningReport;
              } else {
                // 대치 전
                const weekDay =
                  weekDays[
                    new Date(
                      `${latest_warning_report[1].slice(
                        0,
                        4,
                      )}-${latest_warning_report[1].slice(
                        4,
                        6,
                      )}-${latest_warning_report[1].slice(6, 8)}`,
                    ).getDay()
                  ];
                const clearDateNTime =
                  String(Number(latest_warning_report[1].slice(4, 6))) +
                  "월" +
                  String(Number(latest_warning_report[1].slice(6, 8))) +
                  "일" +
                  `(${weekDay}) ` +
                  latest_warning_report[1].slice(8, 10) +
                  ":" +
                  latest_warning_report[1].slice(10, 12);
                const warningInfoEff = {
                  timeEff: arrayInfoUlsanCoast.at(-2)[1],
                  warnLvl: arrayInfoUlsanCoast.at(-2)[6],
                  warnType: arrayInfoUlsanCoast.at(-2)[7],
                  timeClear: clearDateNTime,
                };
                if (!currentWarningReport.current) {
                  currentWarningReport.current = warningInfoEff;
                }
                setWarningInfo({
                  timeEff: arrayInfoUlsanCoast.at(-1)[1],
                  warnLvl: arrayInfoUlsanCoast.at(-1)[6],
                  warnType: arrayInfoUlsanCoast.at(-1)[7],
                  timeClear: clearDateNTime,
                });
                setShowWarningInfo(true);
              }
            }
          }
        }
      } else {
        // 이 else는 체크를 위한 것. 문제 없으면 지우기
        console.log("기상특보 내용 없음");
      }
    } catch (err) {
      console.error("데이터 불러오기 오류:", err);
    }
  };
  function GraphWind({ data }) {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={450}
          height={100}
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          style={{ backgroundColor: "white", border: "1px solid #272727" }}
        >
          <XAxis
            dataKey="time"
            axisLine={{ stroke: "#272727", strokeWidth: 2 }}
            tick={{ fontSize: 15, fill: "#272727" }}
          />
          <YAxis
            domain={[0, 25]}
            ticks={[25]}
            axisLine={{ stroke: "#272727", strokeWidth: 2 }}
            tick={{ fontSize: 15, fontWeight: 500, fill: "#272727" }}
          />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="windSpeed"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
            label={{ position: "top", fontSize: 20, fill: "#272727" }}
            strokeWidth={3}
          />
          <Area type="monotone" dataKey="value" stroke={null} fill="white" />
        </LineChart>
      </ResponsiveContainer>
    );
  }
  function GraphVis({ data, varKma }) {
    let domain = [0, 50];
    let ticks = [25, 50];
    if (varKma === false) {
      domain = [0, 20];
      ticks = [10, 20];
    }
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={450}
          height={100}
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          style={{ backgroundColor: "white", border: "1px solid #272727" }}
        >
          <XAxis
            dataKey="time"
            axisLine={{ stroke: "#272727", strokeWidth: 2 }}
            tick={{ fontSize: 15, fill: "#272727" }}
          />
          <YAxis
            domain={domain}
            ticks={ticks}
            axisLine={{ stroke: "#272727", strokeWidth: 2 }}
            tick={{ fontSize: 15, fill: "#272727" }}
          />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="vis"
            stroke="#3498db"
            activeDot={{ r: 8 }}
            label={{ position: "top", fontSize: 20, fill: "#272727" }}
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  }
  const colorWindValue = ({ windSpd }) => {
    if (parseFloat(windSpd) >= 14.0) {
      return "#ee5253";
    } else {
      return "#EAF3FD";
    }
  };
  const colorVisValue = ({ vis }) => {
    if (parseFloat(vis) <= 0.5) {
      return "#ee5253";
    } else {
      return "#EAF3FD";
    }
  };
  // component
  function RowInWetherTable({
    point,
    source,
    backgroundColor,
    windDir,
    windSpd,
    vis,
    windData,
    visData,
    varKma = false,
  }) {
    const [finishedWindCountUP, setFinishedWindCountUP] = useState(false);
    const [finishedVisCountUp, setFinishedVisCountUp] = useState(false);
    return (
      <tr style={{ backgroundColor: backgroundColor, position: "relative" }}>
        <td style={{ ...valueStyle, fontWeight: "bold", width: "12vw" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-end",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0 1vw",
                width: "88%",
              }}
            >
              {Array.from(point).map((ch, i) => (
                <span key={i}>{ch}</span>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "0.6em",
                padding: "3px 1.2vw",
                width: "70%",
              }}
            >
              {Array.from(source).map((ch, i) => (
                <span key={i}>{ch}</span>
              ))}
            </div>
          </div>
        </td>
        <td style={{ ...valueStyle, width: "10vw" }}>{windDir}</td>
        <td style={{ ...valueStyle, width: "10vw" }}>
          {/* {typeof windData === "undefined" ? (
            <span
              style={{
                position: "absolute",
                display: "flex",
                flexDirection: "row",
                backgroundColor: "#272727",
                zIndex: 1,
                padding: "5px 20px",
                left: "24vw",
                fontSize: "3vw",
                top: "1vw",
              }}
            >
              데이터 미수신
            </span>
          ) : null} */}
          <div
            style={{
              display: "flex",
              justifyContent: "right",
              alignItems: "flex-end",
              gap: "5px",
              paddingRight: "0.5vw",
              color: colorWindValue({ windSpd }),
            }}
          >
            {windSpd ? (
              <CountUp
                start={0}
                end={windSpd}
                duration={1}
                decimals={1}
                useEasing={false}
                formattingFn={(windSpd) => windSpd.toFixed(1)}
                onEnd={() => setFinishedWindCountUP(true)}
              >
                {({ countUpRef }) => (
                  <span
                    ref={countUpRef}
                    className={
                      finishedWindCountUP && parseFloat(windSpd) >= 14.0
                        ? "highlight-text"
                        : ""
                    }
                  />
                )}
              </CountUp>
            ) : (
              <span></span>
            )}
            <span style={{ fontSize: "1.8vw" }}>m/s</span>
          </div>
        </td>
        <td style={graphBoxStyle}>
          <div style={{ width: graphWidth, height: graphHeight }}>
            <GraphWind data={windData} />
          </div>
        </td>
        <td style={{ ...valueStyle, width: "10vw" }}>
          {/* {typeof visData === "undefined" ? (
            <span
              style={{
                position: "absolute",
                display: "flex",
                flexDirection: "row",
                backgroundColor: "#272727",
                zIndex: 1,
                padding: "5px 20px",
                right: "15vw",
                fontSize: "3vw",
                top: "1vw",
              }}
            >
              데이터 미수신
            </span>
          ) : null} */}
          <div
            style={{
              display: "flex",
              justifyContent: "right",
              alignItems: "flex-end",
              gap: "5px",
              paddingRight: "0.5vw",
              color: colorVisValue({ vis }),
            }}
          >
            {vis ? (
              <CountUp
                start={0}
                end={vis}
                duration={1}
                decimals={1}
                useEasing={false}
                formattingFn={(vis) => vis.toFixed(1)}
                onEnd={() => setFinishedVisCountUp(true)}
              >
                {({ countUpRef }) => (
                  <span
                    ref={countUpRef}
                    className={
                      finishedVisCountUp && parseFloat(vis) <= 0.5
                        ? "highlight-text"
                        : ""
                    }
                  />
                )}
              </CountUp>
            ) : (
              <span></span>
            )}
            <span style={{ fontSize: "1.8vw" }}>km</span>
          </div>
        </td>
        <td style={graphBoxStyle}>
          <div style={{ width: graphWidth, height: graphHeight }}>
            <GraphVis data={visData} varKma={varKma} />
          </div>
        </td>
      </tr>
    );
  }
  function WeatherIcon({ iconNum }) {
    const objNumNIcon = {
      1: sunny,
      2: partlyCloudy,
      3: mostlyCloudy,
      4: cloudy,
      5: rainy,
      6: snowy,
      7: partlyCloudyAfterRaining,
      8: heavy_rainy,
      9: rainyNSnowy,
      10: rainyNSnowy,
      11: thunder,
      12: fog,
    };
    const icon = objNumNIcon[iconNum];
    return (
      <img
        src={icon}
        alt="icon"
        style={{ width: "3vw", height: "3.5vh" }}
      ></img>
    );
  }
  function WindAndVisTable({ kmaWindData, kmaVisData }) {
    const [isFirstRender, setIsFirstRender] = useState(true);
    useEffect(() => {
      // 마운트 직후 한 번만 실행됨
      setIsFirstRender(false);
    }, []);
    if (!kmaWindData || !kmaVisData) return <p>불러오는 중...</p>;
    return (
      <table
        key="windNVis"
        style={tableStyle}
        className={isFirstRender ? "wind-vis-fade-in" : ""}
      >
        <thead>
          <tr>
            <th
              rowSpan="2"
              style={{
                ...tagStyle,
                borderRight: "1px solid #EAF3FD",
                whiteSpace: "pre",
              }}
            >
              위 치
            </th>
            <th
              colSpan="3"
              style={{ ...tagStyle, borderRight: "1px solid #EAF3FD" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "1vw",
                }}
              >
                <img
                  src={wind}
                  alt="바람"
                  style={{ width: "4vw", height: "5vh" }}
                ></img>
                <span style={{ whiteSpace: "pre" }}>풍 향·풍 속</span>
              </div>
            </th>
            <th colSpan="2" style={tagStyle}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "1vw",
                }}
              >
                <img
                  src={eye}
                  alt="눈"
                  style={{ width: "4vw", height: "5vh" }}
                ></img>
                <span style={{ whiteSpace: "pre" }}>시 정</span>
              </div>
            </th>
          </tr>
          <tr>
            <th style={{ ...tagStyle, whiteSpace: "pre" }}>풍 향</th>
            <th style={{ ...tagStyle, whiteSpace: "pre" }}>풍 속</th>
            <th style={{ ...tagStyle, borderRight: "1px solid #EAF3FD" }}>
              그래프
            </th>
            <th style={{ ...tagStyle, whiteSpace: "pre" }}>시 정</th>
            <th style={tagStyle}>그래프</th>
          </tr>
        </thead>
        <tbody>
          {arrayPoints.map((point, index) => {
            return (
              <RowInWetherTable
                key={point}
                point={point}
                source={"기상청"}
                backgroundColor={arrayRowColor[index % 2]}
                windDir={degreesToCompass(arrayKmaWindDir[index])}
                windSpd={arrayKmaWindSpd[index]}
                windData={kmaWindData[index]}
                vis={arrayKmaVis[index]}
                visData={kmaVisData[index]}
                varKma={true}
              />
            );
          })}
          <RowInWetherTable
            point={"매암부두"}
            source={"해양조사원"}
            backgroundColor={arrayRowColor[3 % 2]}
            windDir={windDirMaeam}
            windSpd={windSpdMaeam}
            windData={MaeamWindData}
            vis={visMaeam}
            visData={MaeamVisData}
            varKma={false}
          />
        </tbody>
      </table>
    );
  }
  function TextToShowWarningReport({
    warningInfo,
    warningMonth,
    warningDay,
    warningTime,
    weekDay,
    strPreOrIn,
  }) {
    const warnLvl = obj_wrn_lvl[warningInfo.warnLvl];
    if (warningInfo.warnType === "2") {
      warnLvl = obj_wrn_lvl[currentWarningReport.current.warnLvl];
    }
    return (
      <div style={{ display: "flex" }}>
        <div
          style={{ fontSize: "2.5vw", fontWeight: "bold", color: "#ee5253" }}
        >
          <span>풍랑 {warnLvl}&nbsp;</span>
          {warningInfo.warnLvl === "1" ? null : <span>{strPreOrIn}</span>}
        </div>
        {warningInfo.warnType !== "6" ? (
          <div>
            <span>[</span>
            <span>
              {warningMonth}월{warningDay}일({weekDay}) {warningTime} ~&nbsp;
            </span>
            {warningInfo.timeClear !== "" ? (
              <span>{warningInfo.timeClear}</span>
            ) : null}
            <span>]</span>
          </div>
        ) : (
          <div>
            <span>[</span>
            <span>
              {warningMonth}월{warningDay}일({weekDay}) {warningTime}&nbsp;
            </span>
            <span>풍랑{obj_wrn_lvl[warningInfo.warnLvl]} 대치</span>
            <span>]</span>
          </div>
        )}
      </div>
    );
  }
  function WarningUlsanCoast() {
    let warningMonth = "";
    let warningDay = "";
    let warningTime = "";
    let strPreOrIn = "발효 예정";
    const year = parseInt(warningInfo.timeEff.slice(0, 4), 10);
    const month = parseInt(warningInfo.timeEff.slice(4, 6), 10) - 1; // JS에서는 0=1월
    const day = parseInt(warningInfo.timeEff.slice(6, 8), 10);
    const hour = parseInt(warningInfo.timeEff.slice(8, 10), 10);
    const minute = parseInt(warningInfo.timeEff.slice(10, 12), 10);
    // Date 객체 생성
    const targetDate = new Date(year, month, day, hour, minute);
    const now = new Date();
    const weekDay = weekDays[targetDate.getDay()];
    if (Object.keys(warningInfo).length !== 0) {
      warningMonth = Number(warningInfo.timeEff.slice(4, 6));
      warningDay = Number(warningInfo.timeEff.slice(6, 8));
      if (warningInfo.warnLvl === "1") {
        warningTime =
          obj_pre_warning_report_time[
            warningInfo.timeEff.slice(8, warningInfo.timeEff.length)
          ];
      } else {
        warningTime = warningInfo.timeEff.slice(8, warningInfo.timeEff.length);
        warningTime = warningTime.slice(0, 2) + ":" + warningTime.slice(2);
        if (targetDate < now) {
          strPreOrIn = "발효 중";
        }
      }
    }
    return (
      <div
        style={{
          fontSize: "2.0vw",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TextToShowWarningReport
          warningInfo={warningInfo}
          weekDay={weekDay}
          warningMonth={warningMonth}
          warningDay={warningDay}
          warningTime={warningTime}
          strPreOrIn={strPreOrIn}
        />
      </div>
    );
  }
  function ShortForecastTable({ shortForecastData }) {
    const arrayTimes = ["03", "06", "09", "12", "15", "18", "21", "24"];
    const n = arrayTimes.indexOf(shortForecastData[0]["time"]);
    const colSpans = n === 0 ? [8, 8, 8] : [8 - n, 8, 8, n];
    const colSpansForForecast = colSpans.reduce((acc, cur, idx) => {
      if (idx === 0) {
        acc.push(cur);
      } else {
        acc.push(acc[idx - 1] + cur);
      }
      return acc;
    }, []);
    const arrayKeysForForecast = [
      "time",
      "icon",
      "wdir",
      "ws",
      "maxWs",
      "waveDir",
      "maxWaveH",
      "vis",
    ];
    const objKeysTags = {
      time: "시간",
      icon: "",
      wdir: "풍향",
      ws: "풍속",
      maxWs: "돌풍",
      waveDir: "파향",
      maxWaveH: "파고",
      vis: "시정",
    };
    if (shortForecastData.length === 0) return null;
    return (
      <div
        key="shortForecast"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          position: "relative",
        }}
      >
        <div
          style={{
            color: "#EAF3FD",
            marginTop: "0.4vw",
            marginBottom: "0.3vw",
            marginLeft: "7px",
            width: "100vw",
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: "2.7vw",
              fontWeight: "bold",
              backgroundColor: "#636e72",
              borderRadius: "10px",
              padding: "2px 5px",
              marginRight: "5px",
            }}
          >
            울산앞바다
          </span>
          {showWarningInfo ? (
            <WarningUlsanCoast />
          ) : (
            <span style={{ fontSize: "2.5vw" }}>기상특보 없음</span>
          )}
        </div>
        <table
          style={{
            width: "100vw",
            border: "2px solid #EAF3FD",
            borderCollapse: "separate",
            marginTop: "5px",
            borderRadius: "78x",
          }}
        >
          <thead>
            <tr>
              <th></th>
              {colSpans.map((span, index) => (
                <th
                  key={index}
                  colSpan={span}
                  style={{
                    color: "#EAF3FD",
                    fontWeight: "Bold",
                    padding: "3px 0",
                    borderRight: "1px solid #EAF3FD",
                    fontSize: fontSizeForecastTable,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {span === 1
                    ? null
                    : span === 2
                      ? arrayDateForecast[index].slice(
                          3,
                          arrayDateForecast[index].length,
                        )
                      : arrayDateForecast[index]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody style={{ backgroundColor: "#EAF3FD" }}>
            {arrayKeysForForecast.map((key, idxKey) => (
              <tr key={idxKey}>
                <td style={{ ...forecastTableTagBoxStyle }}>
                  {objKeysTags[key]}
                </td>
                {shortForecastData.map((data, idxData) => {
                  let content = data[key];
                  if (key === "icon") {
                    content = <WeatherIcon iconNum={data.icon} />;
                  } else if (key === "wdir") {
                    content = objDirections[data.wdir];
                  } else if (key === "waveDir") {
                    content = objDirections[data.waveDir];
                  }
                  let bgColor = "transparant";
                  if (["ws", "maxWs"].includes(key)) {
                    bgColor = getMultiGradientColorWindSpd(content);
                  } else if (key === "maxWaveH") {
                    bgColor = getMultiGradientColorWaveHeight(content);
                  } else if (key === "vis") {
                    bgColor = getColorVis(content);
                  }
                  return (
                    <td
                      key={idxData}
                      style={{
                        ...forecastTableValueBoxStyle,
                        backgroundColor: bgColor,
                        borderLeft: colSpansForForecast.includes(idxData)
                          ? "1px solid #272727"
                          : null,
                      }}
                    >
                      {content}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  // 로그인
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://uiwi.gooksu3.workers.dev/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        sessionStorage.setItem("token", data.token); // 브라우저 닫으면 초기화
        setToken(data.token);
        fetchDataWData();
        fetchDataWeatherWarning();
        fetchDataForecast();
        setInterval(fetchDataWData, 2 * 60 * 1000); // 2분마다 갱신
        setInterval(() => {
          const now = new Date();
          const hours = now.getHours();
          const minutes = now.getMinutes();
          if ([0, 4, 8, 12, 16, 20].includes(hours) && minutes === 30) {
            fetchDataForecast();
          } else if ([1, 11, 21, 31, 41, 51].includes(minutes)) {
            fetchDataWeatherWarning();
          }
        }, 1000 * 60); // 1분마다 체크해서 시간이 3시면 갱신
      } else {
        setPassword("");
        setError("비밀번호가 틀렸습니다.");
      }
    } catch (e) {
      setError("로그인 오류 발생");
    }
  };
  // styles
  // 두 색상을 보간하는 함수 (RGB 기준)
  function interpolateColor(color1, color2, factor) {
    const c1 = color1.match(/\d+/g).map(Number);
    const c2 = color2.match(/\d+/g).map(Number);
    return `rgb(${c1
      .map((c, i) => Math.round(c + factor * (c2[i] - c)))
      .join(",")})`;
  }
  // 숫자 값에 따라 다중 그라데이션 적용
  function getMultiGradientColorWindSpd(value) {
    const stops = [
      { value: 0, color: "rgb(255,255,255)" }, // 하양
      { value: 6, color: "rgb(0,255,0)" }, // 초록
      { value: 12, color: "rgb(255,165,0)" }, // 주황
      { value: 18, color: "rgb(255,0,0)" }, // 빨강
      { value: 24, color: "rgb(237, 76, 103)" }, // 빨강
      { value: 30, color: "rgb(140,62,140)" }, // 보라
    ];

    // 범위 밖이면 최소/최대 색으로 처리
    if (value <= stops[0].value) return stops[0].color;
    if (value >= stops[stops.length - 1].value)
      return stops[stops.length - 1].color;

    // 사이 구간 찾기
    for (let i = 0; i < stops.length - 1; i++) {
      const curr = stops[i];
      const next = stops[i + 1];

      if (value >= curr.value && value <= next.value) {
        const ratio = (value - curr.value) / (next.value - curr.value);
        return interpolateColor(curr.color, next.color, ratio);
      }
    }
  }
  function getMultiGradientColorWaveHeight(value) {
    const stops = [
      { value: 0, color: "rgb(255,255,255)" }, // 하양
      { value: 1, color: "rgb(0,178,255)" }, // 초록
      { value: 2, color: "rgb(0,130,186)" }, // 주황
      { value: 3, color: "rgb(0,98,140)" }, // 빨강
      { value: 4, color: "rgb(0,57,82)" }, // 보라
      { value: 5, color: "rgb(0,28,41)" }, // 보라
    ];

    // 범위 밖이면 최소/최대 색으로 처리
    if (value <= stops[0].value) return stops[0].color;
    if (value >= stops[stops.length - 1].value)
      return stops[stops.length - 1].color;

    // 사이 구간 찾기
    for (let i = 0; i < stops.length - 1; i++) {
      const curr = stops[i];
      const next = stops[i + 1];

      if (value >= curr.value && value <= next.value) {
        const ratio = (value - curr.value) / (next.value - curr.value);
        return interpolateColor(curr.color, next.color, ratio);
      }
    }
  }
  function getColorVis(value) {
    if (value <= 1) {
      return "#E01B22";
    } else {
      return "#C8BFE7";
    }
  }
  const titleStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "3.3vw",
    fontWeight: "bold",
    color: "#EAF3FD",
    margin: "10px 0",
  };
  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    border: "3px solid #EAF3FD",
    padding: "10px",
  };
  const tagStyle = {
    textAlign: "center", // 가로 중앙
    verticalAlign: "middle", // 세로 중앙
    alignItems: "center",
    fontSize: "2.3vw",
    fontWeight: "bold",
    color: "#EAF3FD",
    padding: "3px",
  };
  const valueStyle = {
    textAlign: "center", // 가로 중앙
    verticalAlign: "middle", // 세로 중앙
    alignItems: "center",
    fontSize: "2.7vw",
    fontWeight: "bold",
    border: "2px solid #272727",
    color: "#EAF3FD",
  };
  const graphBoxStyle = {
    justifyContent: "center",
    alignItems: "center",
    border: "2px solid #272727",
    padding: "5px",
  };
  const fontSizeForecastTable = "1.3vw";
  const forecastTableValueBoxStyle = {
    textAlign: "center",
    fontSize: fontSizeForecastTable,
  };
  const forecastTableTagBoxStyle = {
    color: "#EAF3FD",
    backgroundColor: "#272727",
    fontSize: fontSizeForecastTable,
  };
  // 비번input태그 focus
  useEffect(() => {
    if (inputPWRef.current) {
      inputPWRef.current.focus(); // 렌더링 후 포커스
    }
  }, []);
  // 화면 확대 축소 막기
  useEffect(() => {
    // Ctrl + 마우스 휠 확대/축소 막기
    const handleWheel = (e) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };

    // Ctrl + / Ctrl - 단축키 확대/축소 막기
    const handleKeyDown = (e) => {
      if (
        e.ctrlKey &&
        (e.key === "+" || e.key === "-" || e.key === "=" || e.key === "0")
      ) {
        e.preventDefault();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  // F5키 설정
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "F5" || (e.ctrlKey && e.key.toLowerCase() === "r")) {
        e.preventDefault();
        if (!inputPWRef.current) {
          fetchDataWData();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();

      if (hours === 0 && minutes === 30) {
        fetchDataForecast();
      }
    }, 1000 * 60); // 1분마다 체크

    return () => clearInterval(interval);
  }, []);
  if (!token) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          backgroundColor: "#272727",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1
          style={{
            fontSize: "4vw",
            fontWeight: "bold",
            marginBottom: "1vw",
            color: "#EAF3FD",
          }}
        >
          비밀번호 입력
        </h1>
        <form
          onSubmit={handleLogin}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <input
            ref={inputPWRef}
            type="password"
            value={password}
            onChange={(e) => {
              if (password.length >= 0) {
                setError("");
              }
              setPassword(e.target.value);
            }}
            style={{ fontSize: "2vw", padding: "0.5vw", marginBottom: "1vw" }}
          />
          {error && (
            <p
              style={{ fontSize: "2vw", color: "#ff7675", marginBottom: "1vw" }}
            >
              {error}
            </p>
          )}
          <button
            style={{
              fontSize: "3vw",
              padding: "0.5vw 1vw",
              cursor: "pointer",
              backgroundColor: "#2e86de",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            로그인
          </button>
        </form>
      </div>
    );
  }
  return (
    <div
      style={{
        backgroundColor: "#272727",
        width: "100vw",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "Right",
          alignItems: "center",
        }}
      >
        <span style={{ ...titleStyle, paddingRight: "3vw" }}>
          울산항 유관기관 통합기상정보시스템
        </span>
        <Clock />
      </div>
      {kmaWindData && kmaVisData ? (
        <WindAndVisTable kmaWindData={kmaWindData} kmaVisData={kmaVisData} />
      ) : kmaWindData === null || kmaVisData === null ? (
        <p></p>
      ) : (
        <p>불러오는 중...</p>
      )}
      <div style={{ position: "relative" }}>
        <div
          className={loadForecastTable ? "spinner" : ""}
          style={{ position: "absolute", left: "40%", top: "30%" }}
        ></div>
        {shortForecastData.length > 0 ? (
          <ShortForecastTable shortForecastData={shortForecastData} />
        ) : null}
      </div>
    </div>
  );
}

export default App;
