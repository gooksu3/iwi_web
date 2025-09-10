import { useState,useRef,useEffect } from "react";
import {ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Area} from "recharts";
import CountUp from "react-countup";
import Clock from "./Clock.js"
import './reset.css';
import './ani.css';
import eye from './img/eye.png';
import wind from './img/wind.png';
import cloudy from './img/cloudy.png';
import fog from './img/fog.png';
import heavy_rainy from './img/heavy_rainy.png';
import mostlyCloudy from './img/mostlyCloudy.png';
import partlyCloudy from './img/partlyCloudy.png';
import partlyCloudyAfterRaining from './img/partlyCloudyAfterRaining.png';
import rainy from './img/rainy.png';
import rainyNSnowy from './img/rainyNSnowy.png';
import snowy from './img/snowy.png';
import sunny from './img/sunny.png';
import thunder from './img/thunder.png';

function App() {
  // For Login
  const [token, setToken] = useState(sessionStorage.getItem("token"));
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const inputPWRef = useRef(null);
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
  const graphHeight="11vh";
  const [arrayDateForecast,setArrayDateForecast]=useState([])
  const [shortForecastData,setShortForecastData]=useState([])
  const objDirections={0:"없음",1:"북",2:'북동',3:'동',4:'남동',5:'남',6:'남서',7:'서',8:'북서'}
  const [loadForecastTable,setLoadForecastTable]=useState(false)

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
  const fetchDataForecast=async ()=>{
    setArrayDateForecast([])
    setShortForecastData([])
    setLoadForecastTable(true)
    const WORKER_URL = "https://uiwi.gooksu3.workers.dev/api/daily";
    try {
      const res = await fetch(WORKER_URL,{
        method: "GET",
        headers: {'Authorization': token},
      });
      if (!res.ok) {
        throw new Error("네트워크 응답 실패");
      };
      const objInfoFromApi = await res.json();
      // 단기 예보
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(objInfoFromApi.UPAForecastInside,"application/xml");
      const forecast=xmlDoc.getElementsByTagName("KWEATHER")[0].getElementsByTagName("SHORT")[0].children
      // for (let i=0;i<forecast.length;i++){
      for (let i=0;i<3;i++){
        const dateNWeek=`${forecast[i].getElementsByTagName("DATE")[0].textContent}(${forecast[i].getElementsByTagName("WEEK")[0].textContent})`
        setArrayDateForecast(prev=>[...prev,dateNWeek])
        const hours=forecast[i].getElementsByTagName("HOUR")[0].children
        for (let j=0;j<hours.length;j++){
          const time=hours[j].tagName
          const icon=hours[j].getElementsByTagName("wcond")[0].textContent
          const windDir=hours[j].getElementsByTagName("wdir")[0].textContent
          const ws=hours[j].getElementsByTagName("ws")[0].textContent
          const maxWs=hours[j].getElementsByTagName("maxws")[0].textContent
          const maxWaveH=hours[j].getElementsByTagName("mpa")[0].textContent
          const waveDir=hours[j].getElementsByTagName("padir")[0].textContent
          const vis=hours[j].getElementsByTagName("ss")[0].textContent
          setShortForecastData(prev=>[...prev,{time:time,icon:icon,wdir:windDir,ws:ws,maxWs:maxWs,maxWaveH:maxWaveH,waveDir:waveDir,vis:vis}])
        };
      };
    } catch (err) {
      console.error("데이터 불러오기 오류:", err);
    }
    setLoadForecastTable(false)
  };
  const fetchDataWData = async () => {
    setLoadForecastTable(true)
    const now = new Date();
    const twoMinutesAgo = new Date(now.getTime() - 2 * 60 * 1000);
    const tm2 = formatDateToYYYYMMDDHHMM(twoMinutesAgo);
    const tm1 = formatDateToYYYYMMDDHHMM(new Date(twoMinutesAgo.getTime() - 60 * 60 * 1000));
    // Workers 프록시 URL (배포한 주소로 교체하세요)
    const WORKER_URL = `https://uiwi.gooksu3.workers.dev/api/5mins?tm1=${tm1}&tm2=${tm2}`;
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
        if (arrayKmaWindInfoText[index].length>0){
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
        };
      });
      setKmaWindData(arrayKmaWind);
      // 간절곶:924,울기:901,장생포:898
      const arrayKmaVisInfoText=objInfoFromApi.kmaVis.map(item=> item.split("\n").slice(3,-2));
      const arrayKmaVis= arrayPoints.map((point, index) => {
        if (arrayKmaVisInfoText[index].length>0){
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
        };
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
    setLoadForecastTable(false)
  };
  // component
  function GraphWind({data}){
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart width={450} height={100} data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0}} style={{ backgroundColor: 'white',border:"1px solid #272727"}}>
          <XAxis dataKey="time" axisLine={{ stroke: "#272727", strokeWidth: 2 }} tick={{ fontSize: 15, fill: '#272727' }} />
          <YAxis domain={[0,25]} ticks={[25]} axisLine={{ stroke: "#272727", strokeWidth: 2 }} tick={{ fontSize: 15, fontWeight: 500, fill: '#272727' }}/>
          <Tooltip />
          <Line type="monotone" dataKey="windSpeed" stroke="#8884d8" activeDot={{ r: 8 }} label={{position:"top",fontSize:20,fill:"#272727"}} strokeWidth={3}/>
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
          <XAxis dataKey="time" axisLine={{ stroke: "#272727", strokeWidth: 2 }} tick={{ fontSize: 15, fill: '#272727' }}/>
          <YAxis domain={domain} ticks={ticks} axisLine={{ stroke: "#272727", strokeWidth: 2 }} tick={{ fontSize: 15, fill: '#272727' }}/>
          <Tooltip />
          <Line type="monotone" dataKey="vis" stroke="#3498db" activeDot={{ r: 8 }} label={{position:"top",fontSize:20,fill:"#272727"}} strokeWidth={3}/>
        </LineChart>
      </ResponsiveContainer>
    );
  };
  function RowInWetherTable({point,source,backgroundColor,windDir,windSpd,vis,windData,visData,varKma=false}){
    return (
      <tr style={{backgroundColor:backgroundColor}}>
        <td style={{...valueStyle,fontWeight:"bold",width:"12vw"}}>
          <div style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"flex-end"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0 1vw",width:"88%"}}>
              {Array.from(point).map((ch, i) => (
                  <span key={i}>{ch}</span>
              ))}
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:"0.6em",padding:"3px 1.2vw",width:"70%"}}>
              {Array.from(source).map((ch, i) => (
                  <span key={i}>{ch}</span>
              ))}
            </div>
          </div>
        </td>
        <td style={{...valueStyle,width:"10vw"}}>{windDir}</td>
        <td style={{...valueStyle,width:"10vw"}}>
          <div style={{display:"flex",justifyContent:"right",alignItems:"flex-end",gap:"5px",paddingRight:"0.5vw"}}>
            {windSpd?
            <CountUp start={0} end={windSpd} duration={1} decimals={1} useEasing={false}formattingFn={(windSpd)=>windSpd.toFixed(1)}/>:
            <span></span>}
            <span style={{fontSize:"1.8vw"}}>m/s</span>
          </div>
        </td>
        <td style={graphBoxStyle}>
          <div style={{width:graphWidth,height:graphHeight}}>
            <GraphWind data={windData} />
          </div>
        </td>
        <td style={{...valueStyle,width:"10vw"}}>
          <div style={{display:"flex",justifyContent:"right",alignItems:"flex-end",gap:"5px",paddingRight:"0.5vw"}}>
            {vis?<CountUp start={0} end={vis} duration={1} decimals={1} useEasing={false}formattingFn={(vis)=>vis.toFixed(1)}/>:
            <span></span>}
            <span style={{fontSize:"1.8vw"}}>km</span>
          </div>
        </td>
        <td style={graphBoxStyle}>
          <div style={{width:graphWidth,height:graphHeight}}>
            <GraphVis data={visData} varKma={varKma}/>
          </div>
        </td>
      </tr>
    );
  };
  function WeatherIcon({iconNum}){
    const objNumNIcon={1:sunny,2:partlyCloudy,3:mostlyCloudy,4:cloudy,5:rainy,6:snowy,7:partlyCloudyAfterRaining,8:heavy_rainy,9:rainyNSnowy,10:rainyNSnowy,11:thunder,12:fog}
    const icon=objNumNIcon[iconNum]
    return ( 
    <img src={icon} alt="icon" style={{width:"3vw",height:"3.5vh"}}></img>)
  };
  function WindAndVisTable({kmaWindData,kmaVisData}){
    const [isFirstRender, setIsFirstRender] = useState(true);
    useEffect(() => {
      // 마운트 직후 한 번만 실행됨
      setIsFirstRender(false);
    }, []);
    if (!kmaWindData || !kmaVisData) return <p>불러오는 중...</p>;
    return (
      <table key="windNVis" style={tableStyle} className={isFirstRender?"wind-vis-fade-in":""}>
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
            return <RowInWetherTable key={point} point={point} source={"기상청"} backgroundColor={arrayRowColor[index%2]} windDir={degreesToCompass(arrayKmaWindDir[index])} windSpd={arrayKmaWindSpd[index]} windData={kmaWindData[index]} vis={arrayKmaVis[index]} visData={kmaVisData[index]} varKma={true}/>
            })
          }
          <RowInWetherTable point={"매암부두"} source={"해양조사원"} backgroundColor={arrayRowColor[3%2]} windDir={windDirMaeam} windSpd={windSpdMaeam} windData={MaeamWindData} vis={visMaeam} visData={MaeamVisData} varKma={false}/>
        </tbody>
      </table>
    );
  };
  function ShortForecastTable({shortForecastData, loadForecastTable}) {
    if (shortForecastData.length === 0) return null;
    return (
      <div key="shortForecast" className={loadForecastTable?"short-forecast-fade-out":"short-forecast-fade-in"} style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"flex-start",position:"relative"}}>
        <div style={{color:"#EAF3FD",marginTop:"15px",marginLeft:"30px"}}>
          <span style={{fontSize:"2.5vw",fontWeight:"bold"}}>단기예보</span>
          <span style={{fontSize:"1.5vw",marginLeft:"10px"}}>E1정박지(35-26-47.0N, 129-24-26.6E) 기준</span>
        </div>
        <table style={{width:"100vw",border:"2px solid #EAF3FD",borderCollapse: "separate",marginTop:"5px",borderRadius:"78x"}}>
          <thead>
            <tr>
              <th></th>              
              {arrayDateForecast.map((dateNWeek,index)=>{
                return <th key={index} colSpan="8" style={{color:"#EAF3FD",fontWeight:"Bold",padding:"3px 0", borderRight:"1px solid #EAF3FD",fontSize:fontSizeForecastTable}}>{dateNWeek}</th>
              })}
            </tr>
          </thead>
          <tbody style={{backgroundColor:"#EAF3FD"}}>
            <tr>
              <td style={{...forecastTableTagBoxStyle}}>시간</td>
              {shortForecastData.map((data,index)=>{
                if (index%8===0){
                  return <td key={index} style={{...forecastTableValueBoxStyle,borderLeft:"1px solid #272727"}}>{data.time.substring(1,3)}</td>
                }else{
                  return <td key={index} style={{...forecastTableValueBoxStyle}}>{data.time.substring(1,3)}</td>
                };
              })}
            </tr>
            <tr>
              <td style={{...forecastTableTagBoxStyle}}></td>
              {shortForecastData.map((data,index)=>{
                if (index%8===0){
                  return (
                  <td key={index} style={{...forecastTableValueBoxStyle,borderLeft:"1px solid #272727"}}>
                    <WeatherIcon iconNum={data.icon}/>
                  </td>)
                }else{
                  return (
                  <td key={index} style={{...forecastTableValueBoxStyle}}>
                    <WeatherIcon iconNum={data.icon}/>
                  </td>)
                }
              })}
            </tr>
            <tr>
              <td style={{...forecastTableTagBoxStyle}}>풍향</td>
              {shortForecastData.map((data,index)=>{
                if (index%8===0){
                  return <td key={index} style={{...forecastTableValueBoxStyle,borderLeft:"1px solid #272727"}}>{objDirections[data.wdir]}</td>
                }else{
                  return <td key={index} style={{...forecastTableValueBoxStyle}}>{objDirections[data.wdir]}</td>
                };
              })}
            </tr>
            <tr>
              <td style={{...forecastTableTagBoxStyle}}>풍속</td>
              {shortForecastData.map((data,index)=>{
                if (index%8===0){                  
                  return <td key={index} style={{...forecastTableValueBoxStyle,backgroundColor:getMultiGradientColorWindSpd(data.ws),borderLeft:"1px solid #272727"}}>{data.ws}</td>
                }else{
                  return <td key={index} style={{...forecastTableValueBoxStyle,backgroundColor:getMultiGradientColorWindSpd(data.ws)}}>{data.ws}</td>
                }
              })}
            </tr>
            <tr>
              <td style={{...forecastTableTagBoxStyle}}>돌풍</td>
              {shortForecastData.map((data,index)=>{
                if (index%8===0){
                  return <td key={index} style={{...forecastTableValueBoxStyle,backgroundColor:getMultiGradientColorWindSpd(data.maxWs),borderLeft:"1px solid #272727"}}>{data.maxWs}</td>
                }else{
                  return <td key={index} style={{...forecastTableValueBoxStyle,backgroundColor:getMultiGradientColorWindSpd(data.maxWs)}}>{data.maxWs}</td>
                };
              })}
            </tr>
            <tr>
              <td style={{...forecastTableTagBoxStyle}}>파향</td>
              {shortForecastData.map((data,index)=>{
                if (index%8===0){
                  return <td key={index} style={{...forecastTableValueBoxStyle,borderLeft:"1px solid #272727"}}>{objDirections[data.waveDir]}</td>
                }else{
                  return <td key={index} style={{...forecastTableValueBoxStyle}}>{objDirections[data.waveDir]}</td>
                }
              })}
            </tr>
            <tr>
              <td style={{...forecastTableTagBoxStyle}}>파고</td>
              {shortForecastData.map((data,index)=>{
                if (index%8===0){
                  return <td key={index} style={{...forecastTableValueBoxStyle,backgroundColor:getMultiGradientColorWaveHeight(data.maxWaveH),borderLeft:"1px solid #272727"}}>{data.maxWaveH}</td>
                }else{
                  return <td key={index} style={{...forecastTableValueBoxStyle,backgroundColor:getMultiGradientColorWaveHeight(data.maxWaveH)}}>{data.maxWaveH}</td>
                }
              })}
            </tr>
            <tr>
              <td style={{...forecastTableTagBoxStyle}}>시정</td>
              {shortForecastData.map((data,index)=>{
                if (index%8===0){
                  return <td key={index} style={{...forecastTableValueBoxStyle,backgroundColor:getColorVis(data.vis),borderLeft:"1px solid #272727"}}>{data.vis}</td>
                }else{
                  return <td key={index} style={{...forecastTableValueBoxStyle,backgroundColor:getColorVis(data.vis)}}>{data.vis}</td>
                }
              })}
            </tr>
          </tbody>
        </table>
      </div>
    );
  };
  // 로그인
  const handleLogin = async (e) => {
    e.preventDefault()
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
        fetchDataForecast()
        setInterval(fetchDataWData, 5 * 60 * 1000); // 5분마다 갱신
        setInterval(()=>{
          const now = new Date();
          const hours = now.getHours();
          const minutes = now.getMinutes();
          if ([0,4,8,12,16,20].includes(hours) && minutes === 30) {
            fetchDataForecast()
          };
        }, 1000 * 60); // 1분마다 체크해서 시간이 3시면 갱신
      } else {
        setPassword("")
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
    return `rgb(${c1.map((c, i) => Math.round(c + factor * (c2[i] - c))).join(",")})`;
  };
  // 숫자 값에 따라 다중 그라데이션 적용
  function getMultiGradientColorWindSpd(value) {
    const stops = [
      { value: 0,   color: "rgb(255,255,255)" }, // 하양
      { value: 7,  color: "rgb(0,255,0)" },     // 초록
      { value: 12,  color: "rgb(255,165,0)" },   // 주황
      { value: 30,  color: "rgb(255,0,0)" },      // 빨강
      { value: 55,  color: "rgb(140,62,140)" }      // 보라
    ];

    // 범위 밖이면 최소/최대 색으로 처리
    if (value <= stops[0].value) return stops[0].color;
    if (value >= stops[stops.length - 1].value) return stops[stops.length - 1].color;

    // 사이 구간 찾기
    for (let i = 0; i < stops.length - 1; i++) {
      const curr = stops[i];
      const next = stops[i + 1];

      if (value >= curr.value && value <= next.value) {
        const ratio = (value - curr.value) / (next.value - curr.value);
        return interpolateColor(curr.color, next.color, ratio);
      }
    }
  };
  function getMultiGradientColorWaveHeight(value) {
    const stops = [
      { value: 0,   color: "rgb(255,255,255)" }, // 하양
      { value: 1,  color: "rgb(0,178,255)" },     // 초록
      { value: 3,  color: "rgb(0,130,186)" },   // 주황
      { value: 5,  color: "rgb(0,98,140)" },      // 빨강
      { value: 7,  color: "rgb(0,57,82)" }      // 보라
    ];

    // 범위 밖이면 최소/최대 색으로 처리
    if (value <= stops[0].value) return stops[0].color;
    if (value >= stops[stops.length - 1].value) return stops[stops.length - 1].color;

    // 사이 구간 찾기
    for (let i = 0; i < stops.length - 1; i++) {
      const curr = stops[i];
      const next = stops[i + 1];

      if (value >= curr.value && value <= next.value) {
        const ratio = (value - curr.value) / (next.value - curr.value);
        return interpolateColor(curr.color, next.color, ratio);
      }
    }
  };
  function getColorVis(value) {
    if (value<=1){
      return "#E01B22"
    } else{
      return "#C8BFE7"
    }
  };
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
  const fontSizeForecastTable="1.3vw";
  const forecastTableValueBoxStyle={
    textAlign:"center",
    fontSize:fontSizeForecastTable
  };
  const forecastTableTagBoxStyle={
    color:"#EAF3FD",
    backgroundColor:"#272727",
    fontSize:fontSizeForecastTable
  };
  // 비번input태그 focus
  useEffect(() => {
    if (inputPWRef.current){
      inputPWRef.current.focus();  // 렌더링 후 포커스
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
      if (e.ctrlKey && (e.key === "+" || e.key === "-" || e.key === "=" || e.key === "0")) {
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
        if (!inputPWRef.current){
          fetchDataWData()
        }
      };
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
        fetchDataForecast()
      }
    }, 1000 * 60); // 1분마다 체크

    return () => clearInterval(interval);
  }, []);
  if (!token) {
    return (
      <div style={{
        width:"100vw",
        height:"100vh",
        backgroundColor:"#272727",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"}}>
        <h1 style={{fontSize:"4vw",fontWeight:"bold",marginBottom:"1vw",color:"#EAF3FD"}}>비밀번호 입력</h1>
        <form onSubmit={handleLogin} style={{display: "flex",flexDirection: "column",justifyContent: "center",alignItems: "center"}}>
          <input
            ref={inputPWRef}
            type="password"
            value={password}
            onChange={(e) => {
              if (password.length>=0){
                setError("")
              };
              setPassword(e.target.value)}}
            style={{fontSize:"2vw",padding:"0.5vw",marginBottom:"1vw"
            }}
          />
          {error && (
            <p style={{fontSize:"2vw",color:"#ff7675",marginBottom:"1vw"}}>{error}</p>)}
          <button style={{fontSize:"3vw",padding:"0.5vw 1vw",cursor:"pointer",backgroundColor:"#2e86de",color:"white",border:"none",borderRadius:"5px"}}>
            로그인
          </button>
        </form>
      </div>
    );
  }
  return (
    <div style={{
      backgroundColor:"#272727",
      width:"100vw",
      minHeight:"100vh",
      }}>
      <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
        <div className={loadForecastTable?"spinner":""}></div>
        <div style={{display:"flex",justifyContent:"Right",alignItems:"center"}}>
          <span style={{...titleStyle,paddingRight:"3.5vw"}}>울산항통합기상정보시스템</span>
          <Clock />
        </div>
      </div>
      {kmaWindData && kmaVisData ?(
        <WindAndVisTable kmaWindData={kmaWindData} kmaVisData={kmaVisData}/>
      ) : kmaWindData === null || kmaVisData===null ? (
        <p></p>
      ) : (
        <p>불러오는 중...</p>
      )}
      {/* <div style={{position:"relative"}}> */}
      <div>
        {/* <div className={loadForecastTable?"spinner":""} style={{position:"absolute",left:"40%",top:"30%"}}></div> */}
        {shortForecastData.length!==0?(
          <ShortForecastTable shortForecastData={shortForecastData} loadForecastTable={loadForecastTable}/>
        ):null}
      </div>
    </div>
  );
}

export default App;
