import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from "recharts";

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
      <LineChart width={400} height={100} data={data} margin={{ top: 20, right: 20, left: 0, bottom: 0}}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time"/>
        <YAxis domain={[0,25]} ticks={[14,25]}/>
        <Tooltip />
        <Line type="monotone" dataKey="windSpeed" stroke="#8884d8" activeDot={{ r: 8 }} label={{position:"top"}}/>
      </LineChart>
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
      <LineChart width={400} height={100} data={data} margin={{ top: 20, right: 20, left: 0, bottom: 0}}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time"/>
        <YAxis domain={domain} ticks={ticks}/>
        <Tooltip />
        <Line type="monotone" dataKey="vis" stroke="#3498db" activeDot={{ r: 8 }} label={{position:"top"}}/>
      </LineChart>
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

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-xl mb-4">비밀번호 입력</h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded mb-2"
        />
        <button
          onClick={handleLogin}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          로그인
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    );
  }

  return (
    <div>
      <h1 style={{
      display:"flex",
      justifyContent:"center",
      alignItems:"center",
      fontSize:"40px",
      }}>울산통합기상정보시스템</h1>
      {kmaWindData && kmaVisData ?(
        <table>
          <thead>
            <tr>
              <th>지점</th>
              <th>풍향</th>
              <th>풍속</th>
              <th>풍향 그래프</th>
              <th>시정</th>
              <th>시정 그래프</th>
            </tr>
          </thead>
          <tbody>
            {arrayPoints.map((point, index) => {
              return(
                <tr key={point}>
                  <td>{point}</td>
                  <td>{degreesToCompass(arrayKmaWindDir[index])}</td>
                  <td>{arrayKmaWindSpd[index]} m/s</td>
                  <td>
                    <GraphWind data={kmaWindData[index]} />
                  </td>
                  <td>{arrayKmaVis[index]} km</td>
                  <td>
                    <GraphVis data={kmaVisData[index]} varKma={true}/>
                  </td>
                </tr>
              )
              })
            }
            <tr key={"매암"}>
              <td>{"매암부두"}</td>
              <td>{windDirMaeam}</td>
              <td>{windSpdMaeam} m/s</td>
              <td>
                {MaeamWindData && <GraphWind data={MaeamWindData} />}
              </td>
              <td>{visMaeam} km</td>
              <td>
                {MaeamVisData && <GraphVis data={MaeamVisData} varKma={false}/>}
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
