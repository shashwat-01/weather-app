import { DateTime } from "luxon";
import slice from 'slice.js'

const API_KEY= '61af38b48ac46f2fa4497a3ea1ae418d'
const BASE_URL='https://api.openweathermap.org/data/2.5'

const getWeatherData=(infoType, searchParams) => {
    const url= new URL(BASE_URL+"/"+infoType);
    url.search=new URLSearchParams({...searchParams, appid:API_KEY}
    );

    return fetch(url)
        .then((res)=>res.json());
};

const formatCurrentWeather = (data) => {
    const {
        coord: {lat,lon},
        main: {temp,feels_like,temp_min,temp_max,humidity},
        name,
        dt,
        sys: {country,sunrise,sunset},
        weather,
        wind:{speed}
    } = data

    const {main:details,icon}=weather[0]

    return {lat,lon,temp,feels_like,temp_min,temp_max,humidity,name,dt,country,sunrise,sunset,details,icon,speed}
}


const formatForecastWeather = (data)=>{
    let {city,list}=data;
    let hourly=list.slice(0,5).map(d=>{
        return {
            title: formatToLocalTime(d.dt, city.timezone,'hh:mm a'),
            temp:d.main.temp,
            icon:d.weather[0].icon
        }
    });

    list=slice(list);
    let daily=list['0:39:8'].map(d=>{
        return {
            title: formatToLocalTime(d.dt, city.timezone,'ccc'),
            temp:d.main.temp,
            icon:d.weather[0].icon
        }
    });

    return {city, hourly,daily};
};

const getFormattedWeatherData = async (searchParams) => {
    const formattedCurrentWeather = await getWeatherData('weather',searchParams).then(formatCurrentWeather);

    const {lat,lon}=formattedCurrentWeather

    const formattedForecastWeather = await getWeatherData('forecast',{
        lat,lon,units:searchParams.units
    }).then(formatForecastWeather)

    return {...formattedCurrentWeather, ...formattedForecastWeather};
};

const formatToLocalTime= (secs,zone,format="cccc,dd LLL yyyy' | Local time: 'hh:mm a") => DateTime.fromSeconds(secs).setZone(zone).toFormat(format);

const iconUrlFromCode = (code)=> `http://openweathermap.org/img/wn/${code}@2x.png`;

export default getFormattedWeatherData
export {formatToLocalTime, iconUrlFromCode}



