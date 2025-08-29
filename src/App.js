import { useState } from "react";
import {ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,Area} from "recharts";
import Clock from "./Clock.js"
import './reset.css';
import eye from './img/eye.png';
import wind from './img/wind.png';

function App() {
  // For Login
  const [token, setToken] = useState(sessionStorage.getItem("token"));
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  // For API
  const arrayPoints=["간절곶","울기","장생포"]
  const [kmaWindData, setKmaWindData] = useState(null);
  const [kmaVisData, setKmaVisData] = useState(null);
  const [windDirGanjulgot,setWindDirGanjulgot] = useState(null);
  const [windDirUlgi,setWindDirUlgi] = useState(null);
  const [windDirJangsaengpo,setWindDirJangsaengpo] = useState(null);
  const arrayKmaWindDir=[windDirGanjulgot,windDirUlgi,windDirJangsaengpo];
  const arraySetKmaWindDir=[setWindDirGanjulgot,setWindDirUlgi,setWindDirJangsaengpo];
  const [windSpdGanjulgot,setWindSpdGanjulgot] = useState(null);
  const [windSpdUlgi,setWindSpdUlgi] = useState(null);
  const [windSpdJangsaengpo,setWindSpdJangsaengpo] = useState(null);
  const arrayKmaWindSpd=[windSpdGanjulgot,windSpdUlgi,windSpdJangsaengpo];
  const arraySetKmaWindSpd=[setWindSpdGanjulgot,setWindSpdUlgi,setWindSpdJangsaengpo];
  const [visGanjulgot,setVisGanjulgot] = useState(null);
  const [visUlgi,setVisUlgi] = useState(null);
  const [visJangsaengpo,setVisJangsaengpo] = useState(null);
  const arrayKmaVis=[visGanjulgot,visUlgi,visJangsaengpo];
  const arraySetKmaVis=[setVisGanjulgot,setVisUlgi,setVisJangsaengpo];
  const [MaeamWindData,setMeamWindData]=useState(null);
  const [MaeamVisData,setMaeamVisData]=useState(null);
  const [windDirMaeam,setWindDirMaeam]=useState(null);
  const [windSpdMaeam,setWindSpdMaeam]=useState(null);
  const [visMaeam,setVisMaeam]=useState(null);
  const arrayRowColor=["#2e86de","#0abde3"]
  const graphWidth="28vw";
  const graphHeight="13vh";

  const degreesToCompass=(degrees)=>{
    const directions = ['북', '북북동', '북동', '동북동', '동', '동남동', '남동', '남남동', '남', '남남서', '남서', '서남서', '서', '서북서', '북서', '북북서'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  };
  const formatDateToYYYYMMDDHHMM=(date)=> {
    const yyyy = date.getFullYear();
    const MM = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const HH = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    return `${yyyy}${MM}${dd}${HH}${mm}`;
  };
  const formatToHHMM=(dateString) => {
    const dd = dateString.slice(6, 8);
    const HH = dateString.slice(8, 10);
    const mm = dateString.slice(10, 12);
    if (HH==="23" && 55<=Number(mm) && Number(mm)<="59") {
      return `${dd}/${HH}:${mm}`;
    } else if (HH === "00" && 0<=Number(mm) && Number(mm)<=5) {
      return `${dd}/${HH}:${mm}`;
    } else {
      return `${HH}:${mm}`;
    };
  };
  const formatYYYYMMDDHHMMToDate = (dateString) => {
    const yyyy = parseInt(dateString.slice(0, 4));
    const MM = parseInt(dateString.slice(4, 6))-1;
    const dd = parseInt(dateString.slice(6, 8));
    const HH = parseInt(dateString.slice(8, 10));
    const mm = parseInt(dateString.slice(10, 12));
    return new Date(yyyy, MM, dd, HH, mm);
  };
  const mToKm=(m)=>{
    return (Math.round((m/1000)*10)/10).toFixed(1);
  };
  const fetchData = async () => {
    const now = new Date();
    const twoMinutesAgo = new Date(now.getTime() - 2 * 60 * 1000);
    const tm2 = formatDateToYYYYMMDDHHMM(twoMinutesAgo);
    const tm1 = formatDateToYYYYMMDDHHMM(new Date(twoMinutesAgo.getTime() - 60 * 60 * 1000));
    // Workers 프록시 URL (배포한 주소로 교체하세요)
    const WORKER_URL = `https://uiwi.gooksu3.workers.dev/api?tm1=${tm1}&tm2=${tm2}`;
    try {
      const res = await fetch(WORKER_URL,{
        method: "GET",
        headers: {'Authorization': token},
      });
      if (!res.ok) {
        throw new Error("네트워크 응답 실패");
      }
      const objInfoFromApi = await res.json();
      // 간절곶:924,울기:901,장생포:898
      // index 1:1분 평균 풍향, index 2:1분 평균 풍속, index 3:최대 순간 풍향, index 4:최대 순간 풍속
      const arrayKmaWindInfoText=objInfoFromApi.kmaWind.map(item=> item.split("\n").slice(3,-2));
      const arrayKmaWind = arrayPoints.map((point, index) => {
        const lines = arrayKmaWindInfoText[index].map((line)=>line.split(/\s+/));
        const arrayInfo=lines.map((line)=>[line[0],...line.slice(2,6)]);
        arraySetKmaWindDir[index](arrayInfo[arrayInfo.length - 1][3]);
        arraySetKmaWindSpd[index](arrayInfo[arrayInfo.length - 1][4]);
        let arrayTime=[]
        const baseDate=formatYYYYMMDDHHMMToDate(arrayInfo[arrayInfo.length - 1][0]);
        for (let diff = 0; diff <= 60; diff += 10) {
          const newDate = new Date(baseDate.getTime() - diff * 60000); // diff 분 전
          arrayTime.push(formatDateToYYYYMMDDHHMM(newDate));
        }
        return arrayInfo.filter((info)=>arrayTime.includes(info[0])).map((info)=>{
          const time=formatToHHMM(info[0]);
          return { time: time, windSpeed: info[4]};
        });
      });
      setKmaWindData(arrayKmaWind);
      // 간절곶:924,울기:901,장생포:898
      const arrayKmaVisInfoText=objInfoFromApi.kmaVis.map(item=> item.split("\n").slice(3,-2));
      const arrayKmaVis= arrayPoints.map((point, index) => {
        const lines = arrayKmaVisInfoText[index].map((line)=>line.split(/\s+/));
        const arrayInfo=lines.map((line)=>[line[0],line[5]]);
        arraySetKmaVis[index](mToKm(arrayInfo[arrayInfo.length - 1][1]));
        let arrayTime=[]
        const baseDate=formatYYYYMMDDHHMMToDate(arrayInfo[arrayInfo.length - 1][0]);
        for (let diff = 0; diff <= 60; diff += 10) {
          const newDate = new Date(baseDate.getTime() - diff * 60000); // diff 분 전
          arrayTime.push(formatDateToYYYYMMDDHHMM(newDate));
        };
        return arrayInfo.filter((info)=>arrayTime.includes(info[0])).map((info)=>{
          const time=formatToHHMM(info[0]);
          return { time: time, vis: mToKm(info[1])};
        });
      });
      setKmaVisData(arrayKmaVis);
      // 매암
      const arrayInfoMaeam=JSON.parse(objInfoFromApi.maeam).result.data;
      let latestInfoMaeam = null;
      for (let i = arrayInfoMaeam.length - 1; i >= 0; i--) {
        if (arrayInfoMaeam[i].vis != null) {
          latestInfoMaeam = arrayInfoMaeam[i];
          break;
        };
      };
      console.log(arrayInfoMaeam)
      setWindSpdMaeam(latestInfoMaeam.wind_speed);
      setWindDirMaeam(latestInfoMaeam.wind_dir);
      setVisMaeam(mToKm(latestInfoMaeam.vis));
      const baseDate=formatYYYYMMDDHHMMToDate(latestInfoMaeam.obs_time.replace(/[- :]/g, ""))
      let arrayTime=[]
      for (let diff = 0; diff <= 60; diff += 10) {
        const newDate = new Date(baseDate.getTime() - diff * 60000); // diff 분 전
        arrayTime.push(formatDateToYYYYMMDDHHMM(newDate));
      };
      const arrayMaeam=arrayInfoMaeam.filter((info)=>arrayTime.includes(info.obs_time.replace(/[- :]/g, ""))).map((info)=>{
        const time=formatToHHMM(info.obs_time.replace(/[- :]/g, ""));
        return { time: time, wd:info.wind_dir,ws: info.wind_speed, vis: mToKm(info.vis)};
      });
      setMeamWindData(arrayMaeam.map(item=>({time:item.time,windSpeed:item.ws})));
      setMaeamVisData(arrayMaeam.map(item=>({time:item.time,vis:item.vis})));
    } catch (err) {
      console.error("데이터 불러오기 오류:", err);
    }
  };
  function GraphWind({data}){
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart width={450} height={100} data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0}} style={{ backgroundColor: 'white',border:"1px solid #272727"}}>
          <XAxis dataKey="time" axisLine={{ stroke: "#272727", strokeWidth: 2 }} tick={{ fontSize: 18, fontWeight: 'bold', fill: '#272727' }} />
          <YAxis domain={[0,25]} ticks={[25]} axisLine={{ stroke: "#272727", strokeWidth: 2 }} tick={{ fontSize: 18, fontWeight: 500, fontWeight: 'bold', fill: '#272727' }}/>
          <Tooltip />
          <Line type="monotone" dataKey="windSpeed" stroke="#8884d8" activeDot={{ r: 8 }} label={{position:"top",fontSize:20,fontWeight:"bold",fill:"#272727"}} strokeWidth={3}/>
          <Area type="monotone" dataKey="value" stroke={null} fill="white" />
        </LineChart>
      </ResponsiveContainer>
    );
  };
  function GraphVis({data,varKma}){
    let domain=[0,50];
    let ticks=[25,50];
    if (varKma===false) {
      domain=[0,20];
      ticks=[10,20];
    };
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart width={450} height={100} data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0}} style={{ backgroundColor: 'white',border:"1px solid #272727"}}>
          <XAxis dataKey="time" axisLine={{ stroke: "#272727", strokeWidth: 2 }} tick={{ fontSize: 18, fontWeight: 'bold', fill: '#272727' }}/>
          <YAxis domain={domain} ticks={ticks} axisLine={{ stroke: "#272727", strokeWidth: 2 }} tick={{ fontSize: 18, fontWeight: 'bold', fill: '#272727' }}/>
          <Tooltip />
          <Line type="monotone" dataKey="vis" stroke="#3498db" activeDot={{ r: 8 }} label={{position:"top",fontSize:18,fontWeight:"bold",fill:"#272727"}} strokeWidth={3}/>
        </LineChart>
      </ResponsiveContainer>
    );
  };
  const handleLogin = async () => {
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
        fetchData();
        setInterval(fetchData, 5 * 60 * 1000); // 5분마다 갱신
      } else {
        setError("비밀번호가 틀렸습니다.");
      }
    } catch (e) {
      setError("로그인 오류 발생");
    }
  };
  // styles
  const titleStyle={
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    fontSize:"3.3vw",
    fontWeight:"bold",
    color:"#EAF3FD",
    margin:"10px 0"
  };
  const tableStyle={
    width:"100%",
    borderCollapse:"collapse",
    border: "3px solid #EAF3FD",
    padding:"10px"
  };
  const tagStyle={
    textAlign: "center",       // 가로 중앙
    verticalAlign: "middle",   // 세로 중앙
    alignItems:"center",
    fontSize:"2.3vw",
    fontWeight:"bold",
    color:"#EAF3FD",
    padding:"3px",
  };
  const valueStyle={
    textAlign: "center",       // 가로 중앙
    verticalAlign: "middle",   // 세로 중앙
    alignItems:"center",
    fontSize:"2.7vw",
    fontWeight:"bold",
    border:"2px solid #272727",
    color:"#EAF3FD",
  };
  const graphBoxStyle={
    justifyContent:"center",
    alignItems:"center",
    border:"2px solid #272727",
    padding: '5px',
  };
  if (!token) {
    return (
      <div>
        <h1>비밀번호 입력</h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>
          로그인
        </button>
        {error && <p>{error}</p>}
      </div>
    );
  }
  return (
    <div style={{
      backgroundColor:"#272727",
      width:"100vw",
      minHeight:"100vh",
      }}>
      <div style={{display:"flex",justifyContent:"Right",alignItems:"center"}}>
        <span style={{...titleStyle,paddingRight:"6vw"}}>울산통합기상정보시스템</span>
        <Clock />
      </div>
      {kmaWindData && kmaVisData ?(
        <table style={tableStyle}>
          <thead>
            <tr>
              <th rowSpan="2" style={{...tagStyle,borderRight:"1px solid #EAF3FD"}}>위치</th>
              <th colSpan="3" style={{...tagStyle,borderRight:"1px solid #EAF3FD"}}>
                <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:"1vw"}}>
                  <img 
                    src={wind} 
                    alt="바람"
                    style={{width:"4vw",height:"5vh"}}></img>
                  <span>풍향·풍속</span>
                </div>
              </th>
              <th colSpan="2" style={tagStyle}>
                <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:"1vw"}}>
                  <img 
                    src={eye} 
                    alt="눈"
                    style={{width:"4vw",height:"5vh"}}></img>
                  <span>시정</span>
                </div>
              </th>
            </tr>
            <tr>
              <th style={tagStyle}>풍향</th>
              <th style={tagStyle}>풍속</th>
              <th style={{...tagStyle,borderRight:"1px solid #EAF3FD"}}>그래프</th>
              <th style={tagStyle}>시정</th>
              <th style={tagStyle}>그래프</th>
            </tr>
          </thead>
          <tbody>
            {arrayPoints.map((point, index) => {
              return(
                <tr key={point} style={{backgroundColor:arrayRowColor[index%2]}}>
                  <td style={{...valueStyle,fontWeight:"bold"}}>{point}</td>
                  <td style={valueStyle}>{degreesToCompass(arrayKmaWindDir[index])}</td>
                  <td style={valueStyle}>
                    <span>{arrayKmaWindSpd[index]}</span>
                    <span style={{fontSize:"2.4vw"}}>m/s</span>
                  </td>
                  <td style={graphBoxStyle}>
                    <div style={{width:graphWidth,height:graphHeight}}>
                      <GraphWind data={kmaWindData[index]} />
                    </div>
                  </td>
                  <td style={valueStyle}>
                    <span>{arrayKmaVis[index]}</span>
                    <span style={{fontSize:"2.4vw"}}>km</span>
                  </td>
                  <td style={graphBoxStyle}>
                    <div style={{width:graphWidth,height:graphHeight}}>
                      <GraphVis data={kmaVisData[index]} varKma={true}/>
                    </div>
                  </td>
                </tr>
              )
              })
            }
            <tr key={"매암"} style={{backgroundColor:arrayRowColor[3%2]}}>
              <td style={{...valueStyle,fontWeight:"bold"}}>{"매암부두"}</td>
              <td style={valueStyle}>{windDirMaeam}</td>
              <td style={valueStyle}>
                <span>{windSpdMaeam}</span>
                <span style={{fontSize:"2.4vw"}}>m/s</span>
              </td>
              <td style={graphBoxStyle}>
                {MaeamWindData && (
                  <div style={{width:graphWidth,height:graphHeight}}>
                    <GraphWind data={MaeamWindData} />
                  </div>)}
              </td>
              <td style={valueStyle}>
                <span>{visMaeam}</span>
                <span style={{fontSize:"2.4vw"}}>km</span>
              </td>
              <td style={graphBoxStyle}>
                {MaeamVisData && (
                  <div style={{width:graphWidth,height:graphHeight}}>
                    <GraphVis data={MaeamVisData} varKma={false}/>
                  </div>)}
              </td>
            </tr>
          </tbody>
        </table>
      ) : kmaWindData === null || kmaVisData===null ? (
        <p>데이터가 없습니다.</p>
      ) : (
        <p>불러오는 중...</p>
      )}
    </div>
  );
}

export default App;
