import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import colors from "colors";
import commander from "commander";
import Axios from "axios";

const command = commander;
command
  .option('-v, --version', '(1.0.0)')
  .option('-c, --city [name]', 'Add a city name')
command.parse(process.argv);

if (!command.city) {
  command.outputHelp();
}

if (process.argv.slice(2).length === 0) {
  command.outputHelp(colors.green);
  process.exit();
}

interface IWeatherResponse {
  showapi_res_error: string;
  showapi_res_id: string;
  showapi_res_body: IResponseBody;
}

interface IResponseBody {
  ret_code: number;
  area: string;
  showapi_fee_code: number;
  areaid: string;
  hourList: IHourList[];
}

interface IHourList {
  weather_code: string;
  time: string;
  area: string;
  wind_direction: string;
  wind_power: string;
  areaid: string;
  weather: string;
  temperature: string;
}

const URL = 'http://weather01.market.alicloudapi.com/hour24'

const appCode = 'APPCODE 1f46614d5cb245b7bfd7ae91a14cb2eb';

function getWeather(city: string, appCode: string) {
  const axiosConfig: AxiosRequestConfig = {
    headers: { Authorization: appCode },
    params: { area: city }
  }
  axios.get(URL, axiosConfig).then((res: AxiosResponse<IWeatherResponse>) => {
    const liveWeather = res.data.showapi_res_body.hourList[0];
    console.log(colors.yellow(liveWeather.time));
    console.log(colors.white(`${liveWeather.area}`));
    console.log(colors.green(`${liveWeather.weather} ${liveWeather.temperature}`));

  }).catch(() => {
    console.log(colors.red('error'));
  });
}

getWeather(command.city, appCode);

async function getWeatherAsync(city: string, appCode: string) {
  const axiosConfig: AxiosRequestConfig = {
    headers: { Authorization: appCode },
    params: { area: city }
  }
  try {
    const response = await axios.get(URL, axiosConfig);
    const liveWeather = response.data.showapi_res_body.hourList[0];
    console.log('run async wheather');
    console.log(colors.yellow(liveWeather.time));
    console.log(colors.white(`${liveWeather.area}`));
    console.log(colors.green(`${liveWeather.weather} ${liveWeather.temperature}`));

  } catch (error) {
    console.log(colors.red('async error'));

  }
}
getWeatherAsync(command.city, appCode);
