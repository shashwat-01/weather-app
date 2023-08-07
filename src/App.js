import './App.css';
import TopButtons from './components/TopButtons';
import InputComp from './components/InputComp';
import TimeLocation from './components/TimeLocation';
import TemperatureDetails from './components/TemperatureDetails';
import Forecast from './components/Forecast';
import getFormattedWeatherData from './Servies/weatherService';
import { useEffect, useState } from 'react';

function App() {

  const[query,setQuery]=useState({q: 'delhi'});
  const[units,setUnits]=useState('metric');
  const[weather,setWeather]=useState(null);

  useEffect(()=>{
    const fetchWeather= async ()=>{
      await getFormattedWeatherData({...query,units}).then((data) =>{
        setWeather(data);
      });
    };
  
    fetchWeather();
  }, [query,units]);


  const formatBackground = ()=>{
    if(!weather) return 'from-cyan-700 to to-blue-700'
    const threshold= units ==='metric'? 25:77
    if(weather.temp <= threshold) return 'from-cyan-700 to to-blue-700'

    return 'from-yellow-700 to-orange-700'
  }

  return (
    
      <div className={`mx-auto max-w-screen-md mt-4 py-5 px-32 bg-gradient-to-br ${formatBackground()} h-fit shadow-xl shadow-gray-400`}>
      <TopButtons setQuery={setQuery}/>
      <InputComp setQuery={setQuery} units={units} setUnits={setUnits}/>

      {weather &&(
        <div>
        <TimeLocation weather={weather}/>
        <TemperatureDetails weather={weather}/>
        <Forecast title="hourly forecast" items={weather.hourly}/>
        <Forecast title="Daily forecast" items={weather.daily}/>
        </div>
      )}

      
    </div>
    
  );
}

export default App;
